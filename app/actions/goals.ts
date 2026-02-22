"use server";

import { createClient } from "@/lib/supabase/server";

export type GoalRow = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
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
