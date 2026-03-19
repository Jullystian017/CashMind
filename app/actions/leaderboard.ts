"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateScoreForUser } from "./financial-score";

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

export type CircleLeaderboardEntry = {
  rank: number;
  circleId: string;
  name: string;
  emoji: string;
  memberCount: number;
  averageHealthScore: number;
  trend: "up" | "down" | "stable";
  isYourCircle: boolean;
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
 * Get individual leaderboard rankings
 */
export async function getIndividualLeaderboard(
  scope: "global" | "circle",
  circleId?: string
): Promise<{ data: LeaderboardEntry[] | null; myRank: number; error: string | null }> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, myRank: 0, error: "Not authenticated" };

  // Get all users from Auth Admin to ensure we detect EVERY recorded user
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  const allUsersMap = new Map<string, string>();
  
  if (authData?.users) {
    authData.users.forEach((u) => {
      const name = u.user_metadata?.full_name || u.user_metadata?.name || `User ${u.id.substring(0, 6)}`;
      allUsersMap.set(u.id, name);
    });
  }

  // Determine which users to rank
  let userIds: string[] = [];

  if (scope === "circle" && circleId) {
    const { data: members } = await supabase
      .from("circle_members")
      .select("user_id")
      .eq("circle_id", circleId);
    userIds = (members || []).map((m) => m.user_id);
  } else {
    // Global: Use the complete list from Auth Admin
    if (allUsersMap.size > 0) {
      userIds = Array.from(allUsersMap.keys());
    } else {
      userIds = [user.id]; // fallback
    }
  }

  const entries: LeaderboardEntry[] = [];

  // Compute exact financial score for each user
  for (const uid of userIds) {
    const scoreData = await calculateScoreForUser(uid);
    if (!scoreData) continue;

    // Fetch challenges/badges just for displaying on leaderboard card
    const { data: challenges } = await supabaseAdmin
      .from("user_challenges")
      .select("xp_earned, status")
      .eq("user_id", uid);
    
    const completed = (challenges || []).filter((c) => c.status === "completed");
    const challengesCompleted = completed.length;
    const totalXp = completed.reduce((sum, c) => sum + (c.xp_earned || 0), 0);

    const { data: badges } = await supabaseAdmin
      .from("user_badges")
      .select("id")
      .eq("user_id", uid);

    const { level, title } = computeLevel(totalXp);
    
    // Using trend logic
    const trend: "up" | "down" | "stable" = scoreData.isUp ? "up" : "stable";

    const displayName = uid === user.id ? "You" : (allUsersMap.get(uid) || `User ${uid.substring(0, 6)}`);

    entries.push({
      rank: 0,
      userId: uid,
      displayName,
      level,
      title,
      healthScore: scoreData.score,
      savingsRate: scoreData.breakdown.savings * 2.5, // 40 max score = 100% rate
      challengesCompleted,
      badgesCount: badges?.length || 0,
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

/**
 * Get Circle vs Circle rankings
 */
export async function getCircleLeaderboard(): Promise<{ data: CircleLeaderboardEntry[] | null; myCircleRanks: number[]; error: string | null }> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, myCircleRanks: [], error: "Not authenticated" };

  // 1. Get all circles
  const { data: circles } = await supabaseAdmin
    .from("finance_circles")
    .select("id, name, emoji");

  if (!circles || circles.length === 0) {
    return { data: [], myCircleRanks: [], error: null };
  }

  // 2. Get my circles to highlight them
  const { data: myMemberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id);
  const myCircleIds = new Set((myMemberships || []).map(m => m.circle_id));

  const entries: CircleLeaderboardEntry[] = [];

  for (const circle of circles) {
    // get members
    const { data: members } = await supabaseAdmin
      .from("circle_members")
      .select("user_id")
      .eq("circle_id", circle.id);

    if (!members || members.length === 0) continue;

    let totalScore = 0;
    let validMembers = 0;

    for (const m of members) {
      const scoreData = await calculateScoreForUser(m.user_id);
      if (scoreData) {
        totalScore += scoreData.score;
        validMembers++;
      }
    }

    const averageHealthScore = validMembers > 0 ? Math.round(totalScore / validMembers) : 0;

    entries.push({
      rank: 0,
      circleId: circle.id,
      name: circle.name,
      emoji: circle.emoji,
      memberCount: members.length,
      averageHealthScore,
      trend: averageHealthScore >= 60 ? "up" : averageHealthScore < 40 ? "down" : "stable",
      isYourCircle: myCircleIds.has(circle.id)
    });
  }

  // Sort
  entries.sort((a, b) => b.averageHealthScore - a.averageHealthScore);
  
  const myCircleRanks: number[] = [];
  entries.forEach((e, i) => {
    e.rank = i + 1;
    if (e.isYourCircle) myCircleRanks.push(e.rank);
  });

  return { data: entries, myCircleRanks, error: null };
}
