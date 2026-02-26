import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `You are Mindy, a smart and friendly financial AI assistant for CashMind — a personal finance management app. 

Your personality:
- Friendly, supportive, and encouraging
- Use casual but professional tone
- Keep responses concise (2-4 sentences for simple questions, more for complex analysis)
- Use bullet points and formatting for structured data
- Include relevant emojis occasionally

Your capabilities:
- Explain and interpret pre-calculated financial data provided to you
- Suggest budget plans and savings strategies based on real data
- Give tips on reducing expenses
- Help with financial goal planning
- Answer personal finance questions
- Provide subscription optimization advice

Rules:
- Always respond in the same language the user uses
- ONLY use the financial data provided in the context — NEVER invent or guess numbers
- If no financial data is provided, give general advice and suggest the user add transactions first
- If asked something unrelated to finance, gently redirect to financial topics
- Never give specific investment advice or stock picks
- Be encouraging, never judgemental about spending habits
- Keep responses under 300 words unless detailed analysis is requested
- Format numbers as Indonesian Rupiah (Rp) when relevant`

export async function chatWithMindy(
    messages: { role: "user" | "model"; text: string }[],
    financialContext?: string
) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
        }
    })

    // Prepend financial context to the first user message
    const processedMessages = messages.map((msg, i) => {
        if (i === messages.length - 1 && msg.role === "user" && financialContext) {
            return {
                role: msg.role,
                parts: [{ text: `${financialContext}\n\nUser question: ${msg.text}` }]
            }
        }
        return {
            role: msg.role,
            parts: [{ text: msg.text }]
        }
    })

    const chat = model.startChat({
        history: processedMessages.slice(0, -1),
    })

    const lastMessage = processedMessages[processedMessages.length - 1]
    const result = await chat.sendMessage(lastMessage.parts[0].text)
    const response = result.response

    return response.text()
}
