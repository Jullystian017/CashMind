"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabaseAdmin = createAdminClient();
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

  // Construct global map of REAL NAMES
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  const allUsersMap = new Map<string, string>();
  if (authData?.users) {
    authData.users.forEach((u) => {
      const name = u.user_metadata?.full_name || u.user_metadata?.name || `User ${u.id.substring(0, 6)}`;
      allUsersMap.set(u.id, name);
    });
  }

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
          full_name: allUsersMap.get(m.user_id) || `User ${m.user_id.substring(0, 6)}`,
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
      essentialRatio: number;
      lifestyleRatio: number;
      categoryBreakdown: { category: string; amount: number; percent: number }[];
      memberSpending: { userId: string; name: string; amount: number; percent: number }[];
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
  const supabaseAdmin = createAdminClient();
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

  // Construct global map of REAL NAMES
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  const allUsersMap = new Map<string, string>();
  if (authData?.users) {
    authData.users.forEach((u) => {
      const name = u.user_metadata?.full_name || u.user_metadata?.name || `User ${u.id.substring(0, 6)}`;
      allUsersMap.set(u.id, name);
    });
  }

  // Update members list with real names
  const enrichedMembers = allMembers.map((m) => ({
    ...m,
    full_name: allUsersMap.get(m.user_id) || `User ${m.user_id.substring(0, 6)}`,
  }));

  // ── Compute Stats ──
  const totalSpend = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

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
      name: allUsersMap.get(userId) || `User ${userId.substring(0, 6)}`,
      amount,
      percent: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 1️⃣ Non-Essential Spending Ratio
  const essentialCategories = ["Food & Groceries", "Food & Drinks", "Transport", "Utilities", "Health", "Education", "Housing"];
  const essentialSpend = allExpenses
    .filter((e) => essentialCategories.includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const essentialRatioRaw = totalSpend > 0 ? (essentialSpend / totalSpend) : 0.5;
  const essentialRatio = Math.round(essentialRatioRaw * 100);
  
  const nonEssentialRatioRaw = 1 - essentialRatioRaw;

  // 2️⃣ Benchmark Comparison
  const AVG_LIFESTYLE = 0.28; // Rata-rata benchmark (28%)
  const lifestyleCategories = ["Entertainment", "Shopping", "Dining Out", "Others"];
  const lifestyleSpend = allExpenses
    .filter((e) => lifestyleCategories.includes(e.category))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const lifestyleRatioRaw = totalSpend > 0 ? (lifestyleSpend / totalSpend) : 0;
  
  // Benchmark gap: scale ke 0 -> 1. Capped at max 0.3 difference = 1.0 gap penalty
  const benchmarkGap = Math.max(0, Math.min(1, (lifestyleRatioRaw - AVG_LIFESTYLE) / 0.3));

  // ── 💣 FORMULA FINAL (COMBINE) ──
  // Bobot disesuaikan karena 1 metrik income dihapus
  const identityScore = (nonEssentialRatioRaw * 0.6) + (benchmarkGap * 0.4);

  // ── 🧠 Output Label ──
  let identity: { type: "efficient" | "balanced" | "high_consumption"; label: string; color: string };
  if (identityScore >= 0.55) {
    identity = { type: "high_consumption", label: "High Consumption Circle", color: "red" };
  } else if (identityScore >= 0.30) {
    identity = { type: "balanced", label: "Balanced Circle", color: "amber" };
  } else {
    identity = { type: "efficient", label: "Efficient Circle", color: "emerald" };
  }

  // Monthly trend (last 6 months) untuk Bonus Trend Behavior
  const monthlyMap = new Map<string, number>();
  allExpenses.forEach((e) => {
    const month = e.date.substring(0, 7); // YYYY-MM
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(e.amount));
  });
  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // Weekend spending ratio
  const weekendSpend = allExpenses
    .filter((e) => {
      const day = new Date(e.date).getDay();
      return day === 0 || day === 6;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const weekendSpendRatio = totalSpend > 0 ? Math.round((weekendSpend / totalSpend) * 100) : 0;

  // ── Generate Insights ──
  const insights: string[] = [];
  
  // Insight Benchmark (Kelas Naik)
  if (totalSpend > 0) {
    insights.push(
      `Circle kamu menghabiskan ${Math.round(lifestyleRatioRaw * 100)}% untuk lifestyle, ${lifestyleRatioRaw > AVG_LIFESTYLE ? 'lebih tinggi' : 'lebih rendah'} dari rata-rata ${Math.round(AVG_LIFESTYLE * 100)}%.`
    );
  }

  // Insight Bonus Trend Behavior (AI-ish)
  if (monthlyTrend.length >= 2) {
    const last = monthlyTrend[monthlyTrend.length - 1];
    const prev = monthlyTrend[monthlyTrend.length - 2];
    if (last && prev && prev.amount > 0) {
      const change = Math.round(((last.amount - prev.amount) / prev.amount) * 100);
      insights.push(`📊 **Behavior Trend**: Spending kamu ${change > 0 ? 'naik' : 'turun'} ${Math.abs(change)}% dalam bulan terakhir.`);
    }
  }

  if (insights.length === 0) {
    insights.push("Kumpulkan lebih banyak data pengeluaran agar AI kami dapat menganalisa kebiasaan Circle-mu.");
  }

  // ── Behavioral Patterns ──
  const behavioralPatterns: string[] = [];
  if (weekendSpendRatio > 40) {
    behavioralPatterns.push(`⚡ High Weekend Activity: ${weekendSpendRatio}% pengeluaran grup terfokus di akhir pekan. Awas impulsif!`);
  }
  const lifestyleRatio = Math.round(lifestyleRatioRaw * 100);
  if (lifestyleRatio > 25) {
    behavioralPatterns.push(`🍹 Lifestyle Bias: ${lifestyleRatio}% alokasi dana memprioritaskan gaya hidup di atas kebutuhan.`);
  }
  if (categoryBreakdown.length >= 3) {
    const singleCatDominance = categoryBreakdown[0]?.percent || 0;
    if (singleCatDominance > 50) {
      behavioralPatterns.push(`🎯 Konsentrasi Tinggi: Lebih dari separuh uang habis hanya untuk kategori ${categoryBreakdown[0].category}.`);
    }
  }
  if (behavioralPatterns.length === 0) {
    behavioralPatterns.push("🌱 Stabil: Grup tidak menunjukkan pola belanja ekstrem yang membahayakan finansial kolektif.");
  }

  return {
    data: {
      circle: circle as FinanceCircle,
      members: enrichedMembers,
      expenses: allExpenses as CircleExpense[],
      stats: {
        totalSpend,
        essentialRatio,
        lifestyleRatio,
        categoryBreakdown,
        memberSpending,
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
 * Add expense to circle AND personal transactions
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

  // 1. Insert into circle_expenses
  const { data: expenseData, error: expenseError } = await supabase
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

  if (expenseError) return { data: null, error: expenseError.message };

  // 2. Fetch circle name for the note (optional but nice)
  const { data: circle } = await supabase
    .from("finance_circles")
    .select("name")
    .eq("id", input.circleId)
    .single();

  const circleName = circle?.name || "a Financial Circle";

  // 3. Mirror the expense to the standard `transactions` table
  const { error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      description: `[Circle] ${input.description}`, // Prefix to show it came from a circle
      amount: input.amount,
      category: input.category,
      date: input.date,
      type: "expense",
      status: "success",
      payment_method: "cash",
      note: `Auto-synced from ${circleName}`
    });
    
  // We log the error but don't strictly fail the circle expense creation if it fails
  if (txError) {
    console.error("Failed to sync circle expense to personal transactions:", txError.message);
  }

  return { data: expenseData as CircleExpense, error: null };
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

/**
 * Delete an expense
 */
export async function deleteCircleExpense(expenseId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Only allow deletion if the user is the creator
  const { error } = await supabase
    .from("circle_expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}
