"use server";

import { createClient } from "@/lib/supabase/server";

export type NotificationType = "alert" | "success" | "info";

export type Notification = {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

/**
 * Fetch the latest notifications for the current user.
 */
export async function getNotifications(): Promise<{ data: Notification[] | null; error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) return { data: null, error: error.message };
    return { data: data as Notification[], error: null };
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(id: string): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

    return { error: error?.message ?? null };
}

/**
 * Mark all user notifications as read.
 */
export async function markAllAsRead(): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

    return { error: error?.message ?? null };
}

/**
 * Internal helper to create a notification (to be used by other server actions)
 */
export async function createNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
}): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("notifications")
        .insert({
            user_id: params.userId,
            type: params.type,
            title: params.title,
            message: params.message
        });

    return { error: error?.message ?? null };
}
