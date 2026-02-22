"use server";

import { createClient } from "@/lib/supabase/server";

export type TransactionStatus = "success" | "pending" | "failed";
export type TransactionType = "income" | "expense";

export type TransactionRow = {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  plan: string;
  payment_method: string;
  note: string | null;
};

function generateInvoiceId() {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${random}`;
}

function rowToTransaction(r: TransactionRow) {
  return {
    id: r.id,
    invoiceId: r.invoice_id,
    description: r.description,
    amount: Number(r.amount),
    category: r.category,
    date: r.date,
    type: r.type,
    status: r.status,
    plan: r.plan,
    paymentMethod: r.payment_method,
    note: r.note ?? undefined,
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
  invoiceId?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  plan: string;
  paymentMethod: string;
  note?: string;
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
      invoice_id: input.invoiceId || generateInvoiceId(),
      description: input.description ?? "",
      amount: input.amount,
      category: input.category ?? "",
      date: input.date,
      type: input.type,
      status: input.status,
      plan: input.plan ?? "",
      payment_method: input.paymentMethod ?? "",
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToTransaction(data as TransactionRow), error: null };
}

export async function updateTransaction(
  id: string,
  input: Partial<{
    invoiceId: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
    status: TransactionStatus;
    plan: string;
    paymentMethod: string;
    note: string;
  }>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};
  if (input?.invoiceId !== undefined) updates.invoice_id = input.invoiceId;
  if (input?.description !== undefined) updates.description = input.description;
  if (input?.amount !== undefined) updates.amount = input.amount;
  if (input?.category !== undefined) updates.category = input.category;
  if (input?.date !== undefined) updates.date = input.date;
  if (input?.type !== undefined) updates.type = input.type;
  if (input?.status !== undefined) updates.status = input.status;
  if (input?.plan !== undefined) updates.plan = input.plan;
  if (input?.paymentMethod !== undefined) updates.payment_method = input.paymentMethod;
  if (input?.note !== undefined) updates.note = input.note;

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

export async function backfillInvoiceIds(): Promise<{ count: number; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { count: 0, error: "Not authenticated" };

  // Get all transactions without invoice_id or empty
  const { data: txs, error } = await supabase
    .from("transactions")
    .select("id, invoice_id")
    .eq("user_id", user.id)
    .or("invoice_id.eq.,invoice_id.is.null");

  if (error) return { count: 0, error: error.message };
  if (!txs || txs.length === 0) return { count: 0, error: null };

  let updatedCount = 0;
  for (const tx of txs) {
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ invoice_id: generateInvoiceId() })
      .eq("id", tx.id);

    if (!updateError) updatedCount++;
  }

  return { count: updatedCount, error: null };
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: txs, error } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id)
    .gte("date", firstDay);

  if (error) return { data: null, error: error.message };

  let totalIncome = 0;
  let totalExpense = 0;

  txs?.forEach((tx) => {
    if (tx.type === "income") totalIncome += tx.amount;
    else totalExpense += tx.amount;
  });

  // Also get total balance (all time)
  const { data: allTxs, error: allErr } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id);

  let totalBalance = 0;
  allTxs?.forEach((tx) => {
    if (tx.type === "income") totalBalance += tx.amount;
    else totalBalance -= tx.amount;
  });

  return {
    data: {
      totalBalance,
      totalIncome,
      totalExpense,
    },
    error: allErr?.message ?? null,
  };
}

export async function getCategorySpending(monthYear: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const [year, month] = monthYear.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).toISOString();
  const lastDay = new Date(year, month, 0).toISOString();

  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", firstDay)
    .lte("date", lastDay);

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

