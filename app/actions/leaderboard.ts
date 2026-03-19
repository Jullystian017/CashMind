"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ───
export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  level: number;
  title: string;
  healthScore: number;
  savingsRate: number;
  challengesCompleted: number;
  badgesCount: number;
  trend: "up" | "down" | "stable";
  isCurrentUser: boolean;
};

// ─── Helpers ───
function computeLevel(totalXp: number): { level: number; title: string } {
  const levels = [
    { level: 1, title: "Beginner Saver", threshold: 0 },
    { level: 2, title: "Smart Spender", threshold: 200 },
    { level: 3, title: "Disciplined Saver", threshold: 500 },
    { level: 4, title: "Budget Master", threshold: 1000 },
    { level: 5, title: "Finance Guru", threshold: 2000 },
    { level: 6, title: "Money Legend", threshold: 5000 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i].threshold) {
      return { level: levels[i].level, title: levels[i].title };
    }
  }
  return { level: 1, title: "Beginner Saver" };
}

/**
 * Get leaderboard rankings
 * Financial Health Score = savings rate (40%) + consistency (30%) + goal achievement (30%)
 */
export async function getLeaderboard(
  scope: "global" | "circle",
  timeRange: "week" | "month" | "all",
  circleId?: string
): Promise<{ data: LeaderboardEntry[] | null; myRank: number; error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, myRank: 0, error: "Not authenticated" };

  // Determine which users to rank
  let userIds: string[] = [];

  if (scope === "circle" && circleId) {
    const { data: members } = await supabase
      .from("circle_members")
      .select("user_id")
      .eq("circle_id", circleId);
    userIds = (members || []).map((m) => m.user_id);
  } else {
    // Global: get all users who have transactions
    const { data: txUsers } = await supabase
      .from("transactions")
      .select("user_id")
      .limit(200);
    
    const uniqueIds = new Set<string>();
    (txUsers || []).forEach((t) => uniqueIds.add(t.user_id));
    // Always include current user
    uniqueIds.add(user.id);
    userIds = Array.from(uniqueIds);
  }

  if (userIds.length === 0) {
    userIds = [user.id];
  }

  // Date filter
  let dateFilter: string | null = null;
  const now = new Date();
  if (timeRange === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = weekAgo.toISOString().split("T")[0];
  } else if (timeRange === "month") {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = monthAgo.toISOString().split("T")[0];
  }

  // Compute scores for each user
  const entries: LeaderboardEntry[] = [];

  for (const uid of userIds) {
    // Get transactions
    let txQuery = supabase
      .from("transactions")
      .select("amount, type, date")
      .eq("user_id", uid);
    
    if (dateFilter) {
      txQuery = txQuery.gte("date", dateFilter);
    }

    const { data: txs } = await txQuery;
    const transactions = txs || [];

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Savings rate (0-100)
    const savingsRate = totalIncome > 0
      ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
      : 50;

    // Challenges completed
    const { data: challenges } = await supabase
      .from("user_challenges")
      .select("xp_earned, status")
      .eq("user_id", uid);

    const completed = (challenges || []).filter((c) => c.status === "completed");
    const challengesCompleted = completed.length;
    const totalXp = completed.reduce((sum, c) => sum + (c.xp_earned || 0), 0);

    // Badges
    const { data: badges } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", uid);

    const badgesCount = badges?.length || 0;

    // Consistency score (based on days with transactions)
    const uniqueDays = new Set(transactions.map((t) => t.date?.split("T")[0])).size;
    const daysInRange = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
    const consistency = Math.min(100, Math.round((uniqueDays / Math.max(1, daysInRange)) * 100));

    // Goal achievement (challenges completion rate)
    const totalChallenges = (challenges || []).length;
    const goalAchievement = totalChallenges > 0
      ? Math.round((challengesCompleted / totalChallenges) * 100)
      : 50;

    // Financial Health Score = savings (40%) + consistency (30%) + goals (30%)
    const healthScore = Math.round(
      savingsRate * 0.4 + consistency * 0.3 + goalAchievement * 0.3
    );

    const { level, title } = computeLevel(totalXp);

    // Simple trend detection
    const trend: "up" | "down" | "stable" = savingsRate > 50 ? "up" : savingsRate < 30 ? "down" : "stable";

    entries.push({
      rank: 0,
      userId: uid,
      displayName: uid === user.id ? "You" : `User ${uid.substring(0, 6)}`,
      level,
      title,
      healthScore,
      savingsRate,
      challengesCompleted,
      badgesCount,
      trend,
      isCurrentUser: uid === user.id,
    });
  }

  // Sort by health score
  entries.sort((a, b) => b.healthScore - a.healthScore);
  entries.forEach((e, i) => (e.rank = i + 1));

  const myRank = entries.find((e) => e.isCurrentUser)?.rank ?? 0;

  return { data: entries.slice(0, 50), myRank, error: null };
}
