"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Update the current user's password.
 */
export async function updateUserPassword(password: string): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) return { error: error.message };
    return { error: null };
}
