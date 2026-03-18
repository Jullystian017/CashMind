"use server";

import { createClient } from "@/lib/supabase/server";

export type SimulationData = {
    monthlyIncome: number;
    monthlyExpense: number;
    savingsRate: number;
    totalBalance: number;
    goals: {
        id: string;
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: string;
    }[];
};

/**
 * Fetches the user's real financial data for the simulation engine.
 * Aggregates current month income/expenses and all goals.
 */
export async function getSimulationData(): Promise<{ data: SimulationData | null; error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // 1. Current month transactions
        const { data: txs } = await supabase
            .from("transactions")
            .select("amount, type")
            .eq("user_id", user.id)
            .gte("date", firstDay);

        let monthlyIncome = 0;
        let monthlyExpense = 0;
        (txs || []).forEach(t => {
            if (t.type === "income") monthlyIncome += Number(t.amount);
            else monthlyExpense += Number(t.amount);
        });

        // 2. All-time balance
        const { data: allTxs } = await supabase
            .from("transactions")
            .select("amount, type")
            .eq("user_id", user.id);

        let totalBalance = 0;
        (allTxs || []).forEach(t => {
            if (t.type === "income") totalBalance += Number(t.amount);
            else totalBalance -= Number(t.amount);
        });

        // 3. Goals
        const { data: goals } = await supabase
            .from("goals")
            .select("id, title, target_amount, current_amount, deadline")
            .eq("user_id", user.id);

        const savingsRate = monthlyIncome > 0
            ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
            : 0;

        return {
            data: {
                monthlyIncome,
                monthlyExpense,
                savingsRate: Math.round(savingsRate * 10) / 10,
                totalBalance,
                goals: (goals || []).map(g => ({
                    id: g.id,
                    title: g.title,
                    targetAmount: Number(g.target_amount),
                    currentAmount: Number(g.current_amount),
                    deadline: g.deadline || "",
                })),
            },
            error: null,
        };
    } catch (err: any) {
        return { data: null, error: err.message };
    }
}

export type AILifestyleSuggestion = {
    id: string;
    label: string;
    emoji: string;
    costPerMonth: number;
    description: string;
    concept: string;
    impact5Years: number;
    investmentAlternative: string;
};

export async function getAILifestyleSuggestions(locale: string = "id"): Promise<{ data: AILifestyleSuggestion[] | null; error: string | null }> {
    const { data: simData, error: simError } = await getSimulationData();
    if (simError || !simData) return { data: null, error: simError || "Failed to get simulation data" };

    const { chatWithMindy } = await import("@/lib/ai");

    const languageName = locale === "id" ? "Indonesian" : "English";

    const prompt = `Based on a user with monthly income of ${simData.monthlyIncome} and expenses of ${simData.monthlyExpense}, suggest 4 realistic lifestyle choices (some positive like investing, some negative like daily expensive coffee/hobbies).
    
    Return the result STRAIGHT as a JSON array of objects with this schema:
    [
      {
        "id": "string",
        "label": "string",
        "emoji": "string",
        "costPerMonth": number (negative for savings/investments, positive for spending),
        "description": "string (max 10 words)",
        "concept": "Opportunity Cost" | "Compound Interest" | "Depreciation" | "Lifestyle Inflation",
        "impact5Years": number (total impact including 6% inflation/growth),
        "investmentAlternative": "string (what if this was invested?)"
      }
    ]
    
    CRITICAL: YOU MUST RESPOND IN ${languageName.toUpperCase()}. Translate all text (label, description, concept, investmentAlternative) to ${languageName}. No extra text, just JSON.`;

    try {
        const response = await chatWithMindy([{ role: "user", text: prompt }], `User Monthly Income: ${simData.monthlyIncome}, Expense: ${simData.monthlyExpense}`);
        
        // Basic JSON extraction
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("Invalid AI response format");
        
        const data = JSON.parse(jsonMatch[0]);
        return { data, error: null };
    } catch (err: any) {
        console.error("AI Lifestyle Error:", err);
        return { data: null, error: "Failed to get AI suggestions" };
    }
}
