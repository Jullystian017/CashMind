"use server";

import { createClient } from "@/lib/supabase/server";

export type FinancialScoreData = {
    score: number;
    status: "Beginner" | "Good" | "Excellent" | "Master";
    trend: string;
    isUp: boolean;
    breakdown: {
        savings: number;
        budget: number;
        goals: number;
        activity: number;
    };
};

/**
 * Calculates the user's financial score (0-100)
 */
export async function getFinancialScore(): Promise<{ data: FinancialScoreData | null; error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // 1. Fetch Stats (Transactions)
        const { data: txs } = await supabase
            .from("transactions")
            .select("amount, type, category")
            .eq("user_id", user.id)
            .gte("date", firstDay);

        let income = 0;
        let expense = 0;
        (txs || []).forEach(t => {
            if (t.type === "income") income += Number(t.amount);
            else expense += Number(t.amount);
        });

        // 2. Fetch Budgets
        const { data: budgets } = await supabase
            .from("budgets")
            .select("*")
            .eq("user_id", user.id)
            .eq("month_year", monthKey);

        // 3. Fetch Goals
        const { data: goals } = await supabase
            .from("goals")
            .select("current_amount, target_amount")
            .eq("user_id", user.id);

        // 4. Fetch Challenges (XP)
        const { data: challenges } = await supabase
            .from("user_challenges")
            .select("xp_earned")
            .eq("user_id", user.id)
            .eq("status", "completed");

        const totalXp = (challenges || []).reduce((sum, c) => sum + (c.xp_earned || 0), 0);

        // --- SCORING LOGIC ---

        // If user has no data at all, return 0
        const hasNoData = (!txs || txs.length === 0) && (!budgets || budgets.length === 0) && (!goals || goals.length === 0) && totalXp === 0;
        if (hasNoData) {
            return {
                data: {
                    score: 0,
                    status: "Beginner",
                    trend: "+0.0%",
                    isUp: true,
                    breakdown: { savings: 0, budget: 0, goals: 0, activity: 0 }
                },
                error: null
            };
        }

        // A. Savings Score (Max 40)
        // Target 20% savings rate
        let savingsScore = 0;
        if (income > 0) {
            const savingsRate = (income - expense) / income;
            savingsScore = Math.max(0, Math.min(40, (savingsRate / 0.2) * 40));
        }

        // B. Budget Score (Max 20)
        let budgetScore = 0;
        if (budgets && budgets.length > 0) {
            let overBudgetCount = 0;
            for (const b of budgets) {
                const catSpent = (txs || [])
                    .filter(t => t.type === "expense" && t.category === b.category)
                    .reduce((sum, t) => sum + Number(t.amount), 0);
                if (catSpent > b.limit) overBudgetCount++;
            }
            budgetScore = Math.max(0, 20 - (overBudgetCount * 5));
        }

        // C. Goal Score (Max 20)
        let goalScore = 0;
        if (goals && goals.length > 0) {
            const totalRatio = goals.reduce((sum, g) => sum + (g.current_amount / g.target_amount), 0);
            goalScore = Math.min(20, (totalRatio / goals.length) * 20);
        }

        // D. Activity Score (Max 20)
        let activityScore = 0;
        if (totalXp >= 2000) activityScore = 20;
        else if (totalXp >= 1000) activityScore = 16;
        else if (totalXp >= 500) activityScore = 12;
        else if (totalXp >= 200) activityScore = 8;
        else if (totalXp > 0) activityScore = 4;

        const totalScore = Math.round(savingsScore + budgetScore + goalScore + activityScore);

        let status: FinancialScoreData["status"] = "Beginner";
        if (totalScore >= 80) status = "Master";
        else if (totalScore >= 60) status = "Excellent";
        else if (totalScore >= 40) status = "Good";

        return {
            data: {
                score: totalScore,
                status,
                trend: "+5.2%", // Mock trend for now
                isUp: true,
                breakdown: {
                    savings: Math.round(savingsScore),
                    budget: Math.round(budgetScore),
                    goals: Math.round(goalScore),
                    activity: Math.round(activityScore)
                }
            },
            error: null
        };
    } catch (err: any) {
        return { data: null, error: err.message };
    }
}
