"use server";

import { createClient } from "@/lib/supabase/server";

export type SearchResult = {
    id: string;
    type: "transaction" | "goal" | "challenge";
    title: string;
    subtitle?: string;
    amount?: number;
    status?: string;
    link: string;
    category?: string;
};

/**
 * Searches across transactions, goals, and challenges.
 */
export async function globalSearch(query: string): Promise<{ data: SearchResult[] | null; error: string | null }> {
    if (!query || query.length < 2) return { data: [], error: null };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    try {
        // 1. Search Transactions
        const { data: txs } = await supabase
            .from("transactions")
            .select("id, description, amount, category, type")
            .eq("user_id", user.id)
            .ilike("description", `%${query}%`)
            .limit(5);

        // 2. Search Goals
        const { data: goals } = await supabase
            .from("goals")
            .select("id, title, current_amount, target_amount")
            .eq("user_id", user.id)
            .ilike("title", `%${query}%`)
            .limit(5);

        // 3. Search Challenges (via templates)
        const { data: challenges } = await supabase
            .from("user_challenges")
            .select("id, status, challenge_templates(title, category)")
            .eq("user_id", user.id)
            .filter("challenge_templates.title", "ilike", `%${query}%`)
            .limit(5);

        const results: SearchResult[] = [];

        // Map Transactions
        (txs || []).forEach((t) => {
            results.push({
                id: t.id,
                type: "transaction",
                title: t.description,
                subtitle: t.category,
                amount: Number(t.amount),
                link: `/dashboard/transactions?q=${encodeURIComponent(t.description)}`,
                category: t.category
            });
        });

        // Map Goals
        (goals || []).forEach((g) => {
            results.push({
                id: g.id,
                type: "goal",
                title: g.title,
                subtitle: `Target: Rp ${new Intl.NumberFormat("id-ID").format(g.target_amount)}`,
                amount: Number(g.current_amount),
                link: "/dashboard", // Currently goals are in dashboard
            });
        });

        // Map Challenges
        (challenges || []).forEach((c: any) => {
            if (c.challenge_templates) {
                results.push({
                    id: c.id,
                    type: "challenge",
                    title: c.challenge_templates.title,
                    subtitle: c.status.charAt(0).toUpperCase() + c.status.slice(1),
                    status: c.status,
                    link: "/dashboard/challenges",
                    category: c.challenge_templates.category
                });
            }
        });

        return { data: results, error: null };
    } catch (err: any) {
        return { data: null, error: err.message };
    }
}
