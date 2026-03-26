"use server"

import { createClient } from "@/lib/supabase/server"
import { calculateScoreForUser } from "./financial-score"

export interface FinancialContext {
    totalBalance: number
    monthlyIncome: number
    monthlyExpense: number
    savingsRate: number
    topCategories: { name: string; amount: number; percentage: number }[]
    prevMonthIncome: number
    prevMonthExpense: number
    prevMonthTopCategories: { name: string; amount: number; percentage: number }[]
    incomeTrend: string
    expenseTrend: string
    financialScore: number
    financialStatus: string
    scoreBreakdown: { savings: number; budget: number; goals: number; activity: number } | null
    budgetAlerts: string[]
    goalProgress: { name: string; progress: number }[]
    activeChallenges: number
    completedChallenges: number
    recentTransactions: { description: string; amount: number; type: string; category: string; date: string }[]
    // New Fields
    subscriptions: { name: string; price: number; billing: string; nextDate: string }[]
    splitBills: { title: string; totalAmount: number; status: string; participantCount: number; paidCount: number }[]
    badges: { name: string; description: string }[]
    activeChallengeDetails: { title: string; category: string; limit: number; spent: number; daysLeft: number }[]
    // Circles
    circles: { name: string; memberCount: number; totalSpend: number; identity: string }[]
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
        const lastDayPrev = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

        // Fetch all data in parallel
        const [
            txsRes, 
            prevTxsRes, 
            allTxsRes, 
            budgetsRes, 
            goalsRes, 
            challengesRes, 
            recentRes,
            subsRes,
            splitRes,
            badgesRes,
            circlesRes,
            scoreData
        ] = await Promise.all([
            supabase.from("transactions").select("amount, type, category").eq("user_id", user.id).gte("date", firstDayCurrent),
            supabase.from("transactions").select("amount, type, category").eq("user_id", user.id).gte("date", firstDayPrev).lte("date", lastDayPrev),
            supabase.from("transactions").select("amount, type").eq("user_id", user.id),
            supabase.from("budgets").select("*").eq("user_id", user.id).eq("month_year", monthKey),
            supabase.from("goals").select("title, current_amount, target_amount").eq("user_id", user.id),
            supabase.from("user_challenges").select("*, challenge_templates(*)").eq("user_id", user.id),
            supabase.from("transactions").select("description, amount, type, category, date").eq("user_id", user.id).order("date", { ascending: false }).limit(15),
            supabase.from("subscriptions").select("name, price, billing, next_date").eq("user_id", user.id),
            supabase.from("split_bills").select("id, title, total_amount, status").eq("user_id", user.id),
            supabase.from("user_badges").select("name, description").eq("user_id", user.id),
            supabase.from("circle_members").select("circle_id, finance_circles(name, monthly_budget)").eq("user_id", user.id),
            calculateScoreForUser(user.id)
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

        // Previous month (full month)
        let prevIncome = 0, prevExpense = 0
        const prevCategoryMap: Record<string, number> = {}
        prevTxs.forEach(t => {
            const amt = Number(t.amount)
            if (t.type === "income") prevIncome += amt
            else {
                prevExpense += amt
                prevCategoryMap[t.category] = (prevCategoryMap[t.category] || 0) + amt
            }
        })

        const prevMonthTopCategories = Object.entries(prevCategoryMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: prevExpense > 0 ? Math.round((amount / prevExpense) * 100) : 0
            }))

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
        const challengesRaw = challengesRes.data || []
        const activeChallenges = challengesRaw.filter(c => c.status === "active").length
        const completedChallenges = challengesRaw.filter(c => c.status === "completed").length
        const totalXp = challengesRaw.filter(c => c.status === "completed").reduce((s, c) => s + (c.xp_earned || 0), 0)

        const activeChallengeDetails = challengesRaw
            .filter(c => c.status === "active")
            .map(c => {
                const template = c.challenge_templates
                const endsAt = new Date(c.ends_at)
                const daysLeft = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                return {
                    title: template.title,
                    category: template.category,
                    limit: Number(template.limit_amount),
                    spent: Number(c.spent),
                    daysLeft
                }
            })

        // Financial score logic uses the centralized calculateScoreForUser
        const score = scoreData?.score || 0
        const status = scoreData?.status || "Beginner"
        const scoreBreakdown = scoreData?.breakdown || null

        // Subscriptions
        const subscriptions = (subsRes.data || []).map(s => ({
            name: s.name,
            price: Number(s.price),
            billing: s.billing,
            nextDate: s.next_date
        }))

        // Split Bills
        const splitBillsData = splitRes.data || []
        const billIds = splitBillsData.map(b => b.id)
        const { data: participants } = await supabase
            .from("split_participants")
            .select("split_bill_id, is_paid")
            .in("split_bill_id", billIds)

        const splitBills = splitBillsData.map(bill => {
            const billParticipants = (participants || []).filter(p => p.split_bill_id === bill.id)
            return {
                title: bill.title,
                totalAmount: Number(bill.total_amount),
                status: bill.status,
                participantCount: billParticipants.length,
                paidCount: billParticipants.filter(p => p.is_paid).length
            }
        })

        // Circles Summary
        const circlesRaw = (circlesRes.data || []) as any[]
        const circles = await Promise.all(circlesRaw.map(async (c) => {
            const circle = c.finance_circles
            const { data: expenses } = await supabase.from("circle_expenses").select("amount").eq("circle_id", c.circle_id)
            const { count: memberCount } = await supabase.from("circle_members").select("id", { count: 'exact' }).eq("circle_id", c.circle_id)
            const totalSpend = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0)
            
            return {
                name: circle.name,
                memberCount: memberCount || 0,
                totalSpend,
                identity: totalSpend > (circle.monthly_budget || 0) ? "High Spend" : "Balanced"
            }
        }))

        return {
            data: {
                totalBalance,
                monthlyIncome: income,
                monthlyExpense: expense,
                savingsRate: Math.round(savingsRate),
                topCategories,
                prevMonthIncome: prevIncome,
                prevMonthExpense: prevExpense,
                prevMonthTopCategories,
                incomeTrend: calcTrend(income, prevIncome),
                expenseTrend: calcTrend(expense, prevExpense),
                financialScore: score,
                financialStatus: status,
                scoreBreakdown,
                budgetAlerts,
                goalProgress: goals,
                activeChallenges,
                completedChallenges,
                recentTransactions: (recentRes.data || []).map(t => ({
                    description: t.description,
                    amount: Number(t.amount),
                    type: t.type,
                    category: t.category,
                    date: t.date
                })),
                subscriptions,
                splitBills,
                badges: badgesRes.data || [],
                activeChallengeDetails,
                circles
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

    if (ctx.scoreBreakdown) {
        prompt += `\nFinancial Score Breakdown:\n`
        prompt += `- Savings: ${ctx.scoreBreakdown.savings}/40 (Based on income-to-expense ratio. Target is 20%+)\n`
        prompt += `- Budget: ${ctx.scoreBreakdown.budget}/20 (Measures how well they stay within monthly budget limits)\n`
        prompt += `- Goals: ${ctx.scoreBreakdown.goals}/20 (Progress towards funding active savings goals)\n`
        prompt += `- Activity: ${ctx.scoreBreakdown.activity}/20 (Points earned from challenges and regular app usage)\n`
        prompt += `Note for AI: If the user asks how to improve their score, look at the breakdown above and suggest actionable steps based on which metrics are lacking (e.g. create a budget if budget score is 0, add saving goals, join challenges, or reduce expenses to increase savings).`
    }

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

    if (ctx.subscriptions.length > 0) {
        prompt += `\nSubscriptions:\n`
        ctx.subscriptions.forEach(s => {
            prompt += `- ${s.name}: ${formatRp(s.price)} (${s.billing}) | Next: ${s.nextDate}\n`
        })
    }

    if (ctx.splitBills.length > 0) {
        prompt += `\nSplit Bills:\n`
        ctx.splitBills.forEach(b => {
            prompt += `- ${b.title}: ${formatRp(b.totalAmount)} | Status: ${b.status} (${b.paidCount}/${b.participantCount} paid)\n`
        })
    }

    if (ctx.goalProgress.length > 0) {
        prompt += `\nGoal Progress:\n`
        ctx.goalProgress.forEach(g => prompt += `- ${g.name}: ${g.progress}%\n`)
    }

    prompt += `\nChallenges: ${ctx.activeChallenges} active, ${ctx.completedChallenges} completed\n`
    if (ctx.activeChallengeDetails.length > 0) {
        ctx.activeChallengeDetails.forEach(c => {
            prompt += `- [ACTIVE] ${c.title}: Spent ${formatRp(c.spent)}/${formatRp(c.limit)} | ${c.daysLeft} days left\n`
        })
    }

    if (ctx.badges.length > 0) {
        prompt += `\nBadges/Achievements:\n`
        ctx.badges.forEach(b => prompt += `- ${b.name}: ${b.description}\n`)
    }

    if (ctx.circles.length > 0) {
        prompt += `\nFinancial Circles (Group spending):\n`
        ctx.circles.forEach(c => {
            prompt += `- ${c.name}: ${c.memberCount} members | Total shared spend: ${formatRp(c.totalSpend)} | Identity: ${c.identity}\n`
        })
    }

    if (ctx.prevMonthTopCategories.length > 0) {
        prompt += `\nLast Month Summary:\n`
        prompt += `- Income: ${formatRp(ctx.prevMonthIncome)}\n`
        prompt += `- Expense: ${formatRp(ctx.prevMonthExpense)}\n`
        prompt += `- Top Categories:\n`
        ctx.prevMonthTopCategories.forEach(c => {
            prompt += `  - ${c.name}: ${formatRp(c.amount)} (${c.percentage}%)\n`
        })
    }

    if (ctx.recentTransactions.length > 0) {
        prompt += `\nRecent Transactions (latest 15):\n`
        ctx.recentTransactions.forEach(t => {
            prompt += `- [${t.date}] ${t.type === 'income' ? '+' : '-'}${formatRp(t.amount)} | ${t.category} | ${t.description}\n`
        })
    }

    prompt += `=== END DATA ===\n`
    prompt += `\nUse ONLY the data above for any financial analysis. Never invent numbers.\n`

    return prompt
}

