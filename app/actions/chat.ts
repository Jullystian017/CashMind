"use server"

import { createClient } from "@/lib/supabase/server"

export async function getChatSessions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], error: "Not authenticated" }

    const { data, error } = await supabase
        .from("chat_sessions")
        .select("id, title, created_at, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

    return { data: data || [], error: error?.message || null }
}

export async function createChatSession(title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: "Not authenticated" }

    const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title })
        .select()
        .single()

    return { data, error: error?.message || null }
}

export async function getSessionMessages(sessionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], error: "Not authenticated" }

    const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, text, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

    return { data: data || [], error: error?.message || null }
}

export async function addMessageToSession(sessionId: string, role: "user" | "model", text: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error: msgError } = await supabase
        .from("chat_messages")
        .insert({ session_id: sessionId, role, text })

    if (msgError) return { error: msgError.message }

    // Update session timestamp
    await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId)

    return { error: null }
}

export async function deleteChatSession(sessionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", user.id)

    return { error: error?.message || null }
}
