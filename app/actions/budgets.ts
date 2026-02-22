"use server";

import { createClient } from "@/lib/supabase/server";

export type Budget = {
    id: string;
    category: string;
    limit: number;
    month_year: string;
};

export async function getBudgets(monthYear: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month_year", monthYear);

    return { data, error: error?.message ?? null };
}

export async function upsertBudget(input: {
    category: string;
    limit: number;
    monthYear: string;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("budgets")
        .upsert(
            {
                user_id: user.id,
                category: input.category,
                limit: input.limit,
                month_year: input.monthYear,
            },
            { onConflict: "user_id, category, month_year" }
        )
        .select()
        .single();

    return { data, error: error?.message ?? null };
}

export async function deleteBudget(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    return { error: error?.message ?? null };
}
