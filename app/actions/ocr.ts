"use server"

import { parseReceiptImage } from "@/lib/ai"
import { createClient } from "@/lib/supabase/server"

export type ParsedReceiptResult = {
    amount: number
    description: string
    category: string
}

export async function parseReceipt(base64Image: string, mimeType: string): Promise<{ data?: ParsedReceiptResult; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: "Unauthorized" }
        }

        if (!base64Image || !mimeType) {
            return { error: "Image data is required" }
        }

        const result = await parseReceiptImage(base64Image, mimeType)
        
        return { data: result as ParsedReceiptResult }
    } catch (error: any) {
        console.error("OCR Server Action Error:", error)
        return { error: error.message || "Failed to analyze receipt" }
    }
}
