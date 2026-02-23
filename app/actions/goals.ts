"use server";

import { createClient } from "@/lib/supabase/server";

export type GoalRow = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
  user_id: string;
};

function rowToGoal(r: GoalRow) {
  return {
    id: r.id,
    title: r.title,
    targetAmount: Number(r.target_amount),
    currentAmount: Number(r.current_amount),
    deadline: r.deadline ?? "",
    color: r.color,
  };
}

export async function getGoals(): Promise<{
  data: ReturnType<typeof rowToGoal>[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(rowToGoal), error: null };
}

export async function upsertGoal(input: {
  id?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}): Promise<{ data: ReturnType<typeof rowToGoal> | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const row = {
    user_id: user.id,
    title: input.title,
    target_amount: input.targetAmount,
    current_amount: input.currentAmount,
    deadline: input.deadline || null,
    color: input.color ?? "bg-blue-600",
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("goals")
      .update(row)
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: rowToGoal(data as GoalRow), error: null };
  }

  const { data, error } = await supabase.from("goals").insert(row).select().single();
  if (error) return { data: null, error: error.message };
  return { data: rowToGoal(data as GoalRow), error: null };
}

export async function deleteGoal(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  return { error: error?.message ?? null };
}

export async function allocateToGoal(input: {
  goalId: string;
  amount: number;
  title: string; // Title of the goal for transaction description
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // 1. Get current balance to check if sufficient
  // We'll calculate balance here for safety
  const { data: txs, error: txErr } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", user.id);

  if (txErr) return { error: txErr.message };

  let totalBalance = 0;
  txs?.forEach((tx) => {
    if (tx.type === "income") totalBalance += tx.amount;
    else totalBalance -= tx.amount;
  });

  if (totalBalance < input.amount) {
    return { error: "Uang Tidak Mencukupi" };
  }

  // 2. Create the allocation transaction (Type: expense, Category: Savings Allocation)
  const { error: insErr } = await supabase.from("transactions").insert({
    user_id: user.id,
    description: `Save for: ${input.title}`,
    amount: input.amount,
    category: "Savings Allocation",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    status: "success",
    goal_id: input.goalId,
    payment_method: "CashMind Wallet",
  });

  if (insErr) return { error: insErr.message };

  // 3. Update the goal's current_amount
  // We use increment logic here
  const { error: updErr } = await supabase.rpc("increment_goal_current_amount", {
    goal_id: input.goalId,
    inc_amount: input.amount,
  });

  // If RPC fails (e.g. not created yet), fallback to manual update
  if (updErr) {
    const { data: currentGoal } = await supabase
      .from("goals")
      .select("current_amount")
      .eq("id", input.goalId)
      .single();

    if (currentGoal) {
      await supabase
        .from("goals")
        .update({ current_amount: Number(currentGoal.current_amount) + input.amount })
        .eq("id", input.goalId);
    }
  }

  return { error: null };
}
