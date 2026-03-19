"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ───
export type FinanceCircle = {
  id: string;
  name: string;
  emoji: string;
  created_by: string;
  invite_code: string;
  monthly_budget: number;
  created_at: string;
};

export type CircleMember = {
  id: string;
  circle_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  email?: string;
  full_name?: string;
};

export type CircleExpense = {
  id: string;
  circle_id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
};

// ─── Helpers ───
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ─── Server Actions ───

/**
 * Create a new financial circle
 */
export async function createCircle(input: {
  name: string;
  emoji: string;
  monthlyBudget?: number;
}): Promise<{ data: FinanceCircle | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const inviteCode = generateInviteCode();

  const { data, error } = await supabase
    .from("finance_circles")
    .insert({
      name: input.name,
      emoji: input.emoji,
      created_by: user.id,
      invite_code: inviteCode,
      monthly_budget: input.monthlyBudget ?? 0,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  // Auto-add creator as owner
  await supabase.from("circle_members").insert({
    circle_id: data.id,
    user_id: user.id,
    role: "owner",
  });

  return { data: data as FinanceCircle, error: null };
}

/**
 * Join a circle via invite code
 */
export async function joinCircle(inviteCode: string): Promise<{ data: FinanceCircle | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  // Find circle by code
  const { data: circle, error: findErr } = await supabase
    .from("finance_circles")
    .select("*")
    .eq("invite_code", inviteCode.toUpperCase().trim())
    .single();

  if (findErr || !circle) return { data: null, error: "Invalid invite code" };

  // Check if already a member
  const { data: existing } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circle.id)
    .eq("user_id", user.id);

  if (existing && existing.length > 0) {
    return { data: circle as FinanceCircle, error: "Already a member" };
  }

  // Join
  const { error: joinErr } = await supabase.from("circle_members").insert({
    circle_id: circle.id,
    user_id: user.id,
    role: "member",
  });

  if (joinErr) return { data: null, error: joinErr.message };
  return { data: circle as FinanceCircle, error: null };
}

/**
 * Get user's circles with stats
 */
export async function getMyCircles(): Promise<{
  data: (FinanceCircle & {
    memberCount: number;
    totalSpend: number;
    members: { user_id: string; email: string; full_name: string }[];
  })[] | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  // Get circles user belongs to
  const { data: memberships, error: mErr } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id);

  if (mErr || !memberships) return { data: null, error: mErr?.message ?? "Error" };

  const circleIds = memberships.map((m) => m.circle_id);
  if (circleIds.length === 0) return { data: [], error: null };

  // Get circles
  const { data: circles, error: cErr } = await supabase
    .from("finance_circles")
    .select("*")
    .in("id", circleIds)
    .order("created_at", { ascending: false });

  if (cErr || !circles) return { data: null, error: cErr?.message ?? "Error" };

  // Enrich with stats
  const enriched = await Promise.all(
    circles.map(async (circle) => {
      // Members
      const { data: members } = await supabase
        .from("circle_members")
        .select("user_id")
        .eq("circle_id", circle.id);

      // Total spending
      const { data: expenses } = await supabase
        .from("circle_expenses")
        .select("amount")
        .eq("circle_id", circle.id);

      const totalSpend = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        ...circle,
        memberCount: members?.length ?? 0,
        totalSpend,
        members: (members || []).map((m) => ({
          user_id: m.user_id,
          email: "",
          full_name: "",
        })),
      } as FinanceCircle & { memberCount: number; totalSpend: number; members: any[] };
    })
  );

  return { data: enriched, error: null };
}

/**
 * Get full circle detail
 */
export async function getCircleDetail(circleId: string): Promise<{
  data: {
    circle: FinanceCircle;
    members: CircleMember[];
    expenses: CircleExpense[];
    stats: {
      totalSpend: number;
      budgetUsed: number;
      savingsRate: number;
      categoryBreakdown: { category: string; amount: number; percent: number }[];
      memberSpending: { userId: string; name: string; amount: number; percent: number }[];
      essentialRatio: number;
      weekendSpendRatio: number;
      monthlyTrend: { month: string; amount: number }[];
    };
    identity: { type: "efficient" | "balanced" | "high_consumption"; label: string; color: string };
    insights: string[];
    behavioralPatterns: string[];
  } | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  // Get circle
  const { data: circle, error: cErr } = await supabase
    .from("finance_circles")
    .select("*")
    .eq("id", circleId)
    .single();

  if (cErr || !circle) return { data: null, error: "Circle not found" };

  // Get members
  const { data: members } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circleId)
    .order("joined_at", { ascending: true });

  // Get expenses (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: expenses } = await supabase
    .from("circle_expenses")
    .select("*")
    .eq("circle_id", circleId)
    .gte("date", ninetyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false });

  const allExpenses = expenses || [];
  const allMembers = members || [];

  // ── Compute Stats ──
  const totalSpend = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budget = Number(circle.monthly_budget) || 0;
  const budgetUsed = budget > 0 ? Math.round((totalSpend / budget) * 100) : 0;
  const savingsRate = budget > 0 ? Math.max(0, Math.round(((budget - totalSpend) / budget) * 100)) : 50;

  // Category breakdown
  const catMap = new Map<string, number>();
  allExpenses.forEach((e) => {
    catMap.set(e.category, (catMap.get(e.category) || 0) + Number(e.amount));
  });
  const categoryBreakdown = Array.from(catMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percent: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Member spending
  const memberMap = new Map<string, number>();
  allExpenses.forEach((e) => {
    memberMap.set(e.user_id, (memberMap.get(e.user_id) || 0) + Number(e.amount));
  });
  const memberSpending = Array.from(memberMap.entries())
    .map(([userId, amount]) => ({
      userId,
      name: userId.substring(0, 8),
      amount,
      percent: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Essential vs Non-essential
  const essentialCategories = ["Food & Drinks", "Transport", "Utilities", "Health", "Education", "Housing"];
  const essentialSpend = allExpenses
    .filter((e) => essentialCategories.includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const essentialRatio = totalSpend > 0 ? Math.round((essentialSpend / totalSpend) * 100) : 50;

  // Weekend spending ratio
  const weekendSpend = allExpenses
    .filter((e) => {
      const day = new Date(e.date).getDay();
      return day === 0 || day === 6;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const weekendSpendRatio = totalSpend > 0 ? Math.round((weekendSpend / totalSpend) * 100) : 0;

  // Monthly trend (last 6 months)
  const monthlyMap = new Map<string, number>();
  allExpenses.forEach((e) => {
    const month = e.date.substring(0, 7); // YYYY-MM
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(e.amount));
  });
  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // ── Financial Identity ──
  let identity: { type: "efficient" | "balanced" | "high_consumption"; label: string; color: string };
  if (savingsRate >= 40) {
    identity = { type: "efficient", label: "Efficient Circle", color: "emerald" };
  } else if (savingsRate >= 20) {
    identity = { type: "balanced", label: "Balanced Circle", color: "amber" };
  } else {
    identity = { type: "high_consumption", label: "High Consumption Circle", color: "red" };
  }

  // ── Generate Insights ──
  const insights: string[] = [];
  const topCategory = categoryBreakdown[0];
  if (topCategory) {
    insights.push(
      `Your circle spends ${topCategory.percent}% on ${topCategory.category}, ${topCategory.percent > 30 ? "higher" : "within"} the average range.`
    );
  }
  if (essentialRatio < 50) {
    insights.push(
      `Non-essential spending makes up ${100 - essentialRatio}% of total. Consider reallocating to essential needs.`
    );
  }
  if (budget > 0 && budgetUsed > 80) {
    insights.push(
      `Budget is ${budgetUsed}% consumed. At this pace, you'll exceed the limit before month end.`
    );
  }
  if (monthlyTrend.length >= 2) {
    const last = monthlyTrend[monthlyTrend.length - 1];
    const prev = monthlyTrend[monthlyTrend.length - 2];
    if (last && prev) {
      const change = Math.round(((last.amount - prev.amount) / prev.amount) * 100);
      if (change > 10) {
        insights.push(`Spending increased ${change}% compared to last month. Review discretionary costs.`);
      } else if (change < -10) {
        insights.push(`Great progress! Spending decreased ${Math.abs(change)}% compared to last month.`);
      }
    }
  }
  if (insights.length === 0) {
    insights.push("Add more expenses to generate personalized insights for your circle.");
  }

  // ── Behavioral Patterns ──
  const behavioralPatterns: string[] = [];
  if (weekendSpendRatio > 40) {
    behavioralPatterns.push(`⚠️ Weekend spending spike detected: ${weekendSpendRatio}% of all spending occurs on weekends.`);
  }
  const lifestyleCategories = ["Entertainment", "Shopping"];
  const lifestyleSpend = allExpenses
    .filter((e) => lifestyleCategories.includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const lifestyleRatio = totalSpend > 0 ? Math.round((lifestyleSpend / totalSpend) * 100) : 0;
  if (lifestyleRatio > 25) {
    behavioralPatterns.push(`🛍️ Lifestyle spending is ${lifestyleRatio}% of total — higher than the recommended 20%.`);
  }
  if (categoryBreakdown.length >= 3) {
    const singleCatDominance = categoryBreakdown[0]?.percent || 0;
    if (singleCatDominance > 50) {
      behavioralPatterns.push(`📊 Over-concentration: ${categoryBreakdown[0].category} accounts for ${singleCatDominance}% of all spending.`);
    }
  }
  if (behavioralPatterns.length === 0) {
    behavioralPatterns.push("✅ No concerning behavioral patterns detected. Keep up the good habits!");
  }

  return {
    data: {
      circle: circle as FinanceCircle,
      members: allMembers as CircleMember[],
      expenses: allExpenses as CircleExpense[],
      stats: {
        totalSpend,
        budgetUsed,
        savingsRate,
        categoryBreakdown,
        memberSpending,
        essentialRatio,
        weekendSpendRatio,
        monthlyTrend,
      },
      identity,
      insights,
      behavioralPatterns,
    },
    error: null,
  };
}

/**
 * Add expense to circle
 */
export async function addCircleExpense(input: {
  circleId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}): Promise<{ data: CircleExpense | null; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("circle_expenses")
    .insert({
      circle_id: input.circleId,
      user_id: user.id,
      description: input.description,
      amount: input.amount,
      category: input.category,
      date: input.date,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CircleExpense, error: null };
}

/**
 * Leave a circle
 */
export async function leaveCircle(circleId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("circle_members")
    .delete()
    .eq("circle_id", circleId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}
