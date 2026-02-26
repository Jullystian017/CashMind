import { NextRequest, NextResponse } from "next/server"
import { chatWithMindy } from "@/lib/gemini"
import { getFinancialContext, buildContextPrompt } from "@/app/actions/ai-context"

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Messages array is required" },
                { status: 400 }
            )
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
                { status: 500 }
            )
        }

        // Hybrid approach: fetch real financial data first
        let financialContext = ""
        try {
            const { data } = await getFinancialContext()
            if (data) {
                financialContext = await buildContextPrompt(data)
            }
        } catch {
            // If context fetch fails, continue without it
        }

        // Try with one retry on rate limit
        try {
            const reply = await chatWithMindy(messages, financialContext)
            return NextResponse.json({ reply })
        } catch (firstError: any) {
            if (firstError.message?.includes("429") || firstError.message?.includes("Too Many Requests")) {
                console.log("Rate limited, retrying in 5s...")
                await delay(5000)
                try {
                    const reply = await chatWithMindy(messages, financialContext)
                    return NextResponse.json({ reply })
                } catch {
                    return NextResponse.json(
                        { error: "Mindy is a bit busy right now. Please wait a few seconds and try again! 🙏" },
                        { status: 429 }
                    )
                }
            }
            throw firstError
        }
    } catch (error: any) {
        console.error("Mindy AI Error:", error)

        if (error.message?.includes("429") || error.message?.includes("quota")) {
            return NextResponse.json(
                { error: "Mindy is a bit busy right now. Please wait a few seconds and try again! 🙏" },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        )
    }
}
