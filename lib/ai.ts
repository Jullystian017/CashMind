const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

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
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured")

    const formattedMessages: { role: string; content: string }[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg, i) => {
            const role = msg.role === "model" ? "assistant" : "user"
            let content = msg.text
            if (i === messages.length - 1 && msg.role === "user" && financialContext) {
                content = `${financialContext}\n\nUser question: ${msg.text}`
            }
            return { role, content }
        })
    ]

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: formattedMessages,
            max_tokens: 500,
            temperature: 0.7,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("Groq Chat Error:", response.status, errorText)
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
}

export async function parseReceiptImage(base64Data: string, mimeType: string) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured")

    const prompt = `Analyze this receipt image and extract the following information.
Return the result strictly as a JSON object with no markdown formatting or extra text.
The JSON must have this exact structure:
{
  "amount": number, // total amount paid, integer
  "description": string, // merchant name or concise summary of the items
  "category": string // map to one of these exact strings: "Food & Drinks", "Transport", "Shopping", "Entertainment", "Health", "Home & Bills", "Utilities", "Travel", "Others"
}`

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-4-scout-17b-16e-instruct',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Data}`
                            }
                        },
                    ],
                },
            ],
            max_tokens: 500,
            temperature: 0.1,
            response_format: { type: "json_object" },
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("Groq OCR Error:", response.status, errorText)
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const textResponse = data.choices[0].message.content

    try {
        const jsonStr = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        return JSON.parse(jsonStr)
    } catch (e) {
        console.error("Failed to parse OCR response:", textResponse)
        throw new Error("Failed to parse receipt data")
    }
}
