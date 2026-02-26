"use server"

import { createClient } from "@/lib/supabase/server"

export interface FinancialContext {
    totalBalance: number
    monthlyIncome: number
    monthlyExpense: number
    savingsRate: number
    topCategories: { name: string; amount: number; percentage: number }[]
    incomeTrend: string
    expenseTrend: string
    financialScore: number
    financialStatus: string
    budgetAlerts: string[]
    goalProgress: { name: string; progress: number }[]
    activeChallenges: number
    completedChallenges: number
}

export async function getFinancialContext(): Promise<{
    data: FinancialContext | null
    error: string | null
}> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: "Not authenticated" }

    try {
        const now = new Date()
        const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
        const sameDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString()
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

        // Fetch all data in parallel
        const [txsRes, prevTxsRes, allTxsRes, budgetsRes, goalsRes, challengesRes] = await Promise.all([
            supabase.from("transactions").select("amount, type, category").eq("user_id", user.id).gte("date", firstDayCurrent),
            supabase.from("transactions").select("amount, type").eq("user_id", user.id).gte("date", firstDayPrev).lte("date", sameDayPrev),
            supabase.from("transactions").select("amount, type").eq("user_id", user.id),
            supabase.from("budgets").select("*").eq("user_id", user.id).eq("month_year", monthKey),
            supabase.from("goals").select("title, current_amount, target_amount").eq("user_id", user.id),
            supabase.from("user_challenges").select("status, xp_earned").eq("user_id", user.id)
        ])

        const txs = txsRes.data || []
        const prevTxs = prevTxsRes.data || []
        const allTxs = allTxsRes.data || []

        // Current month
        let income = 0, expense = 0
        const categoryMap: Record<string, number> = {}
        txs.forEach(t => {
            const amt = Number(t.amount)
            if (t.type === "income") income += amt
            else {
                expense += amt
                categoryMap[t.category] = (categoryMap[t.category] || 0) + amt
            }
        })

        // Previous month
        let prevIncome = 0, prevExpense = 0
        prevTxs.forEach(t => {
            if (t.type === "income") prevIncome += Number(t.amount)
            else prevExpense += Number(t.amount)
        })

        // Balance
        let totalBalance = 0
        allTxs.forEach(t => {
            if (t.type === "income") totalBalance += Number(t.amount)
            else totalBalance -= Number(t.amount)
        })

        // Savings rate
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0

        // Top categories
        const topCategories = Object.entries(categoryMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0
            }))

        // Trends
        const calcTrend = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? "+new" : "0%"
            const diff = ((curr - prev) / prev) * 100
            return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%"
        }

        // Budget alerts
        const budgetAlerts: string[] = []
        const budgets = budgetsRes.data || []
        for (const b of budgets) {
            const spent = txs.filter(t => t.type === "expense" && t.category === b.category)
                .reduce((s, t) => s + Number(t.amount), 0)
            if (spent > b.limit) {
                budgetAlerts.push(`${b.category} is ${Math.round(((spent - b.limit) / b.limit) * 100)}% over budget`)
            } else if (spent > b.limit * 0.8) {
                budgetAlerts.push(`${b.category} is at ${Math.round((spent / b.limit) * 100)}% of budget`)
            }
        }

        // Goals
        const goals = (goalsRes.data || []).map(g => ({
            name: g.title,
            progress: Math.round((g.current_amount / g.target_amount) * 100)
        }))

        // Challenges
        const challenges = challengesRes.data || []
        const activeChallenges = challenges.filter(c => c.status === "active").length
        const completedChallenges = challenges.filter(c => c.status === "completed").length
        const totalXp = challenges.filter(c => c.status === "completed").reduce((s, c) => s + (c.xp_earned || 0), 0)

        // Financial score
        let savingsScore = income > 0 ? Math.min(40, (((income - expense) / income) / 0.2) * 40) : 0
        let budgetScore = 20 - (budgetAlerts.filter(a => a.includes("over")).length * 5)
        let goalScore = goals.length > 0 ? Math.min(20, (goals.reduce((s, g) => s + g.progress, 0) / goals.length / 100) * 20) : 10
        let activityScore = totalXp >= 2000 ? 20 : totalXp >= 1000 ? 16 : totalXp >= 500 ? 12 : totalXp >= 200 ? 8 : 4
        const score = Math.max(0, Math.round(savingsScore + budgetScore + goalScore + activityScore))

        let status = "Beginner"
        if (score >= 80) status = "Master"
        else if (score >= 60) status = "Excellent"
        else if (score >= 40) status = "Good"

        return {
            data: {
                totalBalance,
                monthlyIncome: income,
                monthlyExpense: expense,
                savingsRate: Math.round(savingsRate),
                topCategories,
                incomeTrend: calcTrend(income, prevIncome),
                expenseTrend: calcTrend(expense, prevExpense),
                financialScore: score,
                financialStatus: status,
                budgetAlerts,
                goalProgress: goals,
                activeChallenges,
                completedChallenges
            },
            error: null
        }
    } catch (err: any) {
        return { data: null, error: err.message }
    }
}

/** Build a structured prompt context string from financial data */
export async function buildContextPrompt(ctx: FinancialContext): Promise<string> {
    const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

    let prompt = `=== USER FINANCIAL DATA (pre-calculated, verified) ===\n`
    prompt += `Balance: ${formatRp(ctx.totalBalance)}\n`
    prompt += `Monthly Income: ${formatRp(ctx.monthlyIncome)} (${ctx.incomeTrend} vs last month)\n`
    prompt += `Monthly Expense: ${formatRp(ctx.monthlyExpense)} (${ctx.expenseTrend} vs last month)\n`
    prompt += `Savings Rate: ${ctx.savingsRate}%\n`
    prompt += `Financial Score: ${ctx.financialScore}/100 (${ctx.financialStatus})\n`

    if (ctx.topCategories.length > 0) {
        prompt += `\nTop Spending Categories:\n`
        ctx.topCategories.forEach(c => {
            prompt += `- ${c.name}: ${formatRp(c.amount)} (${c.percentage}%)\n`
        })
    }

    if (ctx.budgetAlerts.length > 0) {
        prompt += `\nBudget Alerts:\n`
        ctx.budgetAlerts.forEach(a => prompt += `- ⚠️ ${a}\n`)
    }

    if (ctx.goalProgress.length > 0) {
        prompt += `\nGoal Progress:\n`
        ctx.goalProgress.forEach(g => prompt += `- ${g.name}: ${g.progress}%\n`)
    }

    prompt += `\nChallenges: ${ctx.activeChallenges} active, ${ctx.completedChallenges} completed\n`
    prompt += `=== END DATA ===\n`
    prompt += `\nUse ONLY the data above for any financial analysis. Never invent numbers.\n`

    return prompt
}
