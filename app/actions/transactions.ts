"use server";

import { createClient } from "@/lib/supabase/server";

export type TransactionStatus = "success" | "pending" | "failed";
export type TransactionType = "income" | "expense";

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

export async function getTransactions(): Promise<{
  data: ReturnType<typeof rowToTransaction>[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(rowToTransaction), error: null };
}

export async function createTransaction(input: {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: string;
  note?: string;
  goalId?: string;
}): Promise<{ data: ReturnType<typeof rowToTransaction> | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      description: input.description ?? "",
      amount: input.amount,
      category: input.category ?? "",
      date: input.date,
      type: input.type,
      status: input.status,
      payment_method: input.paymentMethod ?? "",
      note: input.note ?? null,
      goal_id: input.goalId ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToTransaction(data as TransactionRow), error: null };
}

export async function updateTransaction(
  id: string,
  input: Partial<{
    description: string;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
    status: TransactionStatus;
    paymentMethod: string;
    note: string;
    goalId: string;
  }>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};
  if (input?.description !== undefined) updates.description = input.description;
  if (input?.amount !== undefined) updates.amount = input.amount;
  if (input?.category !== undefined) updates.category = input.category;
  if (input?.date !== undefined) updates.date = input.date;
  if (input?.type !== undefined) updates.type = input.type;
  if (input?.status !== undefined) updates.status = input.status;
  if (input?.paymentMethod !== undefined) updates.payment_method = input.paymentMethod;
  if (input?.note !== undefined) updates.note = input.note;
  if (input?.goalId !== undefined) updates.goal_id = input.goalId;

  const { error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}

export async function deleteTransaction(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  return { error: error?.message ?? null };
}


export async function getDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const now = new Date();
  const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1);

  // Previous Month Same period (MTD comparison)
  const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const sameDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // 1. Current Month Transactions
  const { data: currentTxs } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", firstDayCurrent.toISOString());

  // 2. Previous Month Transactions (for same period)
  const { data: prevTxs } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", firstDayPrev.toISOString())
    .lte("date", sameDayPrev.toISOString());

  // 3. All Transactions for Total Balance
  const { data: allTxs } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id);

  // --- CURRENT PERIOD CALCS ---
  let totalIncome = 0;
  let totalExpense = 0;
  currentTxs?.forEach((tx) => {
    if (tx.type === "income") totalIncome += Number(tx.amount);
    else totalExpense += Number(tx.amount);
  });

  // --- PREVIOUS PERIOD CALCS ---
  let prevIncome = 0;
  let prevExpense = 0;
  prevTxs?.forEach((tx) => {
    if (tx.type === "income") prevIncome += Number(tx.amount);
    else prevExpense += Number(tx.amount);
  });

  // --- BALANCE CALCS ---
  let totalBalance = 0;
  let prevBalance = 0; // Balance as of same day last month

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

  // --- TREND CALCS ---
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

  const incomeTrend = calcTrend(totalIncome, prevIncome);
  const expenseTrend = calcTrend(totalExpense, prevExpense);
  const balanceTrend = calcTrend(totalBalance, prevBalance);

  return {
    data: {
      totalBalance,
      totalIncome,
      totalExpense,
      trends: {
        income: incomeTrend,
        expense: expenseTrend,
        balance: balanceTrend
      }
    },
    error: null,
  };
}

export async function getCategorySpending(monthYear: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const [year, month] = monthYear.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", firstDay.toISOString())
    .lte("date", lastDay.toISOString());

  if (error) return { data: null, error: error.message };

  const spending: Record<string, number> = {};
  data.forEach((tx) => {
    spending[tx.category] = (spending[tx.category] || 0) + tx.amount;
  });

  return { data: spending, error: null };
}

export async function getChartData(period: "weekly" | "monthly") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const now = new Date();
  let startDate: string;

  if (period === "weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    startDate = d.toISOString();
  } else {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - 1);
    startDate = d.toISOString();
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("user_id", user.id)
    .gte("date", startDate);

  if (error) return { data: null, error: error.message };

  // Aggregate data by date/month
  // For simplicity in this action, we'll return raw data and let the frontend aggregate
  // or we could do it here. Let's do a basic aggregation here.

  return { data, error: null };
}

export async function getRecentTransactions(limit = 7) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data?.map(rowToTransaction) ?? [], error: error?.message ?? null };
}


export async function getCalendarData(month: number, year: number): Promise<{
  data: Record<number, { expense: number; income: number; transactions: any[] }> | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  // Adjust month (JS 0-indexed vs SQL/logic)
  // Input month is 0-11
  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) return { data: null, error: error.message };

  const calendarData: Record<number, { expense: number; income: number; transactions: any[] }> = {};

  data.forEach((r: TransactionRow) => {
    const day = new Date(r.date).getDate();
    if (!calendarData[day]) {
      calendarData[day] = { expense: 0, income: 0, transactions: [] };
    }

    const tx = rowToTransaction(r);
    const amount = Number(tx.amount);

    if (tx.type === "expense") {
      calendarData[day].expense += amount;
    } else {
      calendarData[day].income += amount;
    }

    calendarData[day].transactions.push({
      id: tx.id,
      name: tx.description,
      category: tx.category,
      amount: amount,
      isExpense: tx.type === "expense",
      time: new Date(r.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
  });

  return { data: calendarData, error: null };
}

export async function getTransactionsByCategory(
  category: string,
  monthYear: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const [year, month] = monthYear.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("category", category)
    .gte("date", firstDay.toISOString())
    .lte("date", lastDay.toISOString())
    .order("date", { ascending: false });

  if (error) return { data: null, error: error.message };

  return { data: (data as TransactionRow[]).map(rowToTransaction), error: null };
}
