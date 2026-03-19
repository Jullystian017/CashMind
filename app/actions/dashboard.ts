"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateScoreForUser } from "./financial-score";
import { TransactionType, TransactionStatus } from "./transactions";

export type TransactionRow = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  payment_method: string;
  note: string | null;
  goal_id: string | null;
};

function rowToTransaction(r: TransactionRow) {
  return {
    id: r.id,
    description: r.description,
    amount: Number(r.amount),
    category: r.category,
    date: r.date,
    type: r.type,
    status: r.status,
    paymentMethod: r.payment_method,
    note: r.note ?? undefined,
    goalId: r.goal_id ?? undefined,
  };
}

export async function getAggregatedDashboardData(monthKey: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    const now = new Date();
    const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Previous Month Same period (MTD comparison)
    const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const sameDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // For category spending
    const [year, month] = monthKey.split("-").map(Number);
    const firstDayCat = new Date(year, month - 1, 1);
    const lastDayCat = new Date(year, month, 0, 23, 59, 59, 999);

    // Parallelize all the independent database queries using the same connection context
    const [
      { data: currentTxs },
      { data: prevTxs },
      { data: allTxs },
      { data: catTxs },
      { data: recentTxs },
      scoreData
    ] = await Promise.all([
      // 1. Current Month Transactions
      supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("user_id", user.id)
        .gte("date", firstDayCurrent.toISOString()),

      // 2. Previous Month Transactions (for same period)
      supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("user_id", user.id)
        .gte("date", firstDayPrev.toISOString())
        .lte("date", sameDayPrev.toISOString()),

      // 3. All Transactions for Total Balance
      supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("user_id", user.id),

      // 4. Category Spending Transactions
      supabase
        .from("transactions")
        .select("category, amount")
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("date", firstDayCat.toISOString())
        .lte("date", lastDayCat.toISOString()),

      // 5. Recent Transactions
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(7),

      // 6. Financial Score (we just pass the id and let it run. It has its own Auth bypass using Admin)
      calculateScoreForUser(user.id)
    ]);

    // --- PROCESS STATS ---
    let totalIncome = 0;
    let totalExpense = 0;
    currentTxs?.forEach((tx) => {
      if (tx.type === "income") totalIncome += Number(tx.amount);
      else totalExpense += Number(tx.amount);
    });

    let prevIncome = 0;
    let prevExpense = 0;
    prevTxs?.forEach((tx) => {
      if (tx.type === "income") prevIncome += Number(tx.amount);
      else prevExpense += Number(tx.amount);
    });

    let totalBalance = 0;
    let prevBalance = 0;
    allTxs?.forEach((tx) => {
      const txDate = new Date(tx.date);
      const amt = Number(tx.amount);
      const isIncome = tx.type === "income";

      if (isIncome) totalBalance += amt;
      else totalBalance -= amt;

      if (txDate <= sameDayPrev) {
        if (isIncome) prevBalance += amt;
        else prevBalance -= amt;
      }
    });

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return {
        value: curr > 0 ? "New" : "0.0%",
        isPositive: curr > 0,
        isNew: curr > 0
      };
      const diff = ((curr - prev) / prev) * 100;
      return {
        value: Math.abs(diff).toFixed(1) + "%",
        isPositive: diff >= 0,
        isNew: false
      };
    };

    const statsData = {
      totalBalance,
      totalIncome,
      totalExpense,
      trends: {
        income: calcTrend(totalIncome, prevIncome),
        expense: calcTrend(totalExpense, prevExpense),
        balance: calcTrend(totalBalance, prevBalance)
      }
    };

    // --- PROCESS CATEGORY SPENDING ---
    const spending: Record<string, number> = {};
    catTxs?.forEach((tx) => {
      spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
    });

    return {
      data: {
        statsData,
        spendingData: spending,
        recentTransactions: recentTxs?.map(rowToTransaction) ?? [],
        financialScore: scoreData
      },
      error: null
    };

  } catch (error: any) {
    console.error("Failed to aggregate dashboard data:", error);
    return { data: null, error: error.message };
  }
}
