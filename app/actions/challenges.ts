"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ───
export type ChallengeTemplate = {
    id: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    xp_reward: number;
    category: string;
    limit_amount: number;
    duration_days: number;
    description: string;
    is_recommended: boolean;
};

export type UserChallenge = {
    id: string;
    user_id: string;
    template_id: string;
    status: "active" | "completed" | "failed" | "cancelled";
    failure_reason: string | null;
    xp_earned: number;
    started_at: string;
    ends_at: string;
    spent: number;
};

export type UserBadge = {
    id: string;
    badge_key: string;
    name: string;
    description: string;
    icon: string;
    earned_at: string;
};

// ─── Helpers ───
function computeLevel(totalXp: number): { level: number; title: string; xpForNext: number } {
    const levels = [
        { level: 1, title: "Beginner Saver", threshold: 0 },
        { level: 2, title: "Smart Spender", threshold: 200 },
        { level: 3, title: "Disciplined Saver", threshold: 500 },
        { level: 4, title: "Budget Master", threshold: 1000 },
        { level: 5, title: "Finance Guru", threshold: 2000 },
        { level: 6, title: "Money Legend", threshold: 5000 },
    ];

    let current = levels[0];
    let next = levels[1];

    for (let i = levels.length - 1; i >= 0; i--) {
        if (totalXp >= levels[i].threshold) {
            current = levels[i];
            next = levels[i + 1] || { ...current, threshold: current.threshold + 1000 };
            break;
        }
    }

    return { level: current.level, title: current.title, xpForNext: next.threshold };
}

// ─── Badge Definitions ───
const BADGE_RULES = [
    {
        key: "first_challenge",
        name: "First Challenge",
        description: "Completed your first challenge",
        icon: "🏆",
        check: (completed: number, _totalXp: number, _latestDifficulty: string) => completed >= 1,
    },
    {
        key: "five_completed",
        name: "Challenge Veteran",
        description: "Completed 5 challenges",
        icon: "⚡",
        check: (completed: number) => completed >= 5,
    },
    {
        key: "ten_completed",
        name: "Challenge Master",
        description: "Completed 10 challenges",
        icon: "🌟",
        check: (completed: number) => completed >= 10,
    },
    {
        key: "hard_finisher",
        name: "Hard Mode Hero",
        description: "Completed a HARD challenge",
        icon: "🔥",
        check: (_completed: number, _totalXp: number, latestDifficulty: string) => latestDifficulty === "HARD",
    },
    {
        key: "xp_500",
        name: "XP Hunter",
        description: "Reached 500 total XP",
        icon: "💎",
        check: (_completed: number, totalXp: number) => totalXp >= 500,
    },
    {
        key: "xp_1000",
        name: "XP Legend",
        description: "Reached 1000 total XP",
        icon: "👑",
        check: (_completed: number, totalXp: number) => totalXp >= 1000,
    },
];

// ─── Server Actions ───

/**
 * Fetch all challenge templates
 */
export async function getChallengeTemplates(): Promise<{ data: ChallengeTemplate[] | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("challenge_templates")
        .select("*")
        .order("difficulty", { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as ChallengeTemplate[], error: null };
}

/**
 * Get user's challenges with computed progress
 */
export async function getUserChallenges(): Promise<{
    data: {
        active: (UserChallenge & { template: ChallengeTemplate; daysLeft: number; consumedPercent: number; remaining: number })[];
        completed: (UserChallenge & { template: ChallengeTemplate })[];
        failed: (UserChallenge & { template: ChallengeTemplate })[];
    } | null;
    error: string | null;
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("user_challenges")
        .select("*, challenge_templates(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };

    const now = new Date();

    // For active challenges, compute real spending from transactions
    const active: any[] = [];
    const completed: any[] = [];
    const failed: any[] = [];

    for (const uc of (data || [])) {
        const template = (uc as any).challenge_templates as ChallengeTemplate;
        const base = { ...uc, template, challenge_templates: undefined };

        if (uc.status === "active") {
            // Compute real spending from transactions in the challenge date range
            const { data: txData } = await supabase
                .from("transactions")
                .select("amount")
                .eq("user_id", user.id)
                .eq("type", "expense")
                .eq("category", template.category)
                .gte("date", uc.started_at)
                .lte("date", uc.ends_at);

            const realSpent = (txData || []).reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

            // Update spent in DB if changed
            if (realSpent !== uc.spent) {
                await supabase.from("user_challenges").update({ spent: realSpent }).eq("id", uc.id);
            }

            const endsAt = new Date(uc.ends_at);
            const daysLeft = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            const consumedPercent = template.limit_amount > 0
                ? Math.min(100, Math.round((realSpent / template.limit_amount) * 100))
                : (realSpent > 0 ? 100 : 0);
            const remaining = Math.max(0, template.limit_amount - realSpent);

            // Check if time expired
            if (daysLeft === 0 && endsAt < now) {
                // Auto-check: did they pass?
                if (realSpent <= template.limit_amount) {
                    // They passed! Could auto-complete, but let user decide
                } else if (realSpent > template.limit_amount) {
                    // Failed due to over spending
                    await supabase.from("user_challenges").update({
                        status: "failed",
                        failure_reason: "over_spending",
                        spent: realSpent,
                    }).eq("id", uc.id);
                    failed.push({ ...base, spent: realSpent });
                    continue;
                }
            }

            active.push({ ...base, spent: realSpent, daysLeft, consumedPercent, remaining });
        } else if (uc.status === "completed") {
            completed.push(base);
        } else {
            failed.push(base);
        }
    }

    return { data: { active, completed, failed }, error: null };
}

/**
 * Accept a challenge (with anti-duplicate validation)
 */
export async function acceptChallenge(templateId: string): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // 1. Get template info
    const { data: template, error: tErr } = await supabase
        .from("challenge_templates")
        .select("*")
        .eq("id", templateId)
        .single();
    if (tErr || !template) return { error: "Template not found" };

    // 2. Check anti-duplicate: no active challenge with same template
    const { data: existing } = await supabase
        .from("user_challenges")
        .select("id")
        .eq("user_id", user.id)
        .eq("template_id", templateId)
        .eq("status", "active");

    if (existing && existing.length > 0) {
        return { error: "You already have this challenge active!" };
    }

    // 3. Check anti-duplicate: no active challenge with same category
    const { data: sameCategory } = await supabase
        .from("user_challenges")
        .select("id, challenge_templates(category)")
        .eq("user_id", user.id)
        .eq("status", "active");

    const catConflict = (sameCategory || []).some((uc: any) =>
        uc.challenge_templates?.category === (template as ChallengeTemplate).category
    );
    if (catConflict) {
        return { error: "You already have an active challenge in this category!" };
    }

    // 4. Create user_challenge
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + (template as ChallengeTemplate).duration_days);

    const { error } = await supabase.from("user_challenges").insert({
        user_id: user.id,
        template_id: templateId,
        status: "active",
        ends_at: endsAt.toISOString(),
    });

    return { error: error?.message ?? null };
}

/**
 * Complete a challenge — snapshot XP, auto-award badges
 */
export async function completeChallenge(challengeId: string): Promise<{ error: string | null; badgesEarned?: string[] }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Get the challenge + template
    const { data: uc, error: ucErr } = await supabase
        .from("user_challenges")
        .select("*, challenge_templates(*)")
        .eq("id", challengeId)
        .eq("user_id", user.id)
        .single();

    if (ucErr || !uc) return { error: "Challenge not found" };
    if (uc.status !== "active") return { error: "Challenge is not active" };

    const template = (uc as any).challenge_templates as ChallengeTemplate;

    // Check if spending is within limit
    if (uc.spent > template.limit_amount) {
        return { error: "You exceeded the spending limit! Challenge cannot be completed." };
    }

    // Snapshot XP and mark complete
    const { error } = await supabase.from("user_challenges").update({
        status: "completed",
        xp_earned: template.xp_reward,
    }).eq("id", challengeId);

    if (error) return { error: error.message };

    // Auto-award badges
    const badgesEarned = await checkAndAwardBadges(user.id, template.difficulty);

    return { error: null, badgesEarned };
}

/**
 * Cancel a challenge — no XP, sets failure_reason
 */
export async function cancelChallenge(challengeId: string): Promise<{ error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("user_challenges").update({
        status: "cancelled",
        failure_reason: "user_cancelled",
        xp_earned: 0,
    }).eq("id", challengeId).eq("user_id", user.id).eq("status", "active");

    return { error: error?.message ?? null };
}

/**
 * Get user badges
 */
export async function getUserBadges(): Promise<{ data: UserBadge[] | null; error: string | null }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as UserBadge[], error: null };
}

/**
 * Compute total XP and level from completed challenges
 */
export async function getUserXpAndLevel(): Promise<{
    data: { totalXp: number; level: number; title: string; xpForNext: number } | null;
    error: string | null;
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
        .from("user_challenges")
        .select("xp_earned")
        .eq("user_id", user.id)
        .eq("status", "completed");

    if (error) return { data: null, error: error.message };

    const totalXp = (data || []).reduce((sum, uc) => sum + (uc.xp_earned || 0), 0);
    const { level, title, xpForNext } = computeLevel(totalXp);

    return { data: { totalXp, level, title, xpForNext }, error: null };
}

/**
 * Auto-award badges based on milestones
 */
async function checkAndAwardBadges(userId: string, latestDifficulty: string): Promise<string[]> {
    const supabase = await createClient();

    // Get stats
    const { data: completedData } = await supabase
        .from("user_challenges")
        .select("xp_earned")
        .eq("user_id", userId)
        .eq("status", "completed");

    const totalCompleted = completedData?.length || 0;
    const totalXp = (completedData || []).reduce((sum, uc) => sum + (uc.xp_earned || 0), 0);

    // Get existing badges
    const { data: existingBadges } = await supabase
        .from("user_badges")
        .select("badge_key")
        .eq("user_id", userId);

    const existingKeys = new Set((existingBadges || []).map((b) => b.badge_key));
    const newBadges: string[] = [];

    for (const rule of BADGE_RULES) {
        if (existingKeys.has(rule.key)) continue;
        if (rule.check(totalCompleted, totalXp, latestDifficulty)) {
            const { error } = await supabase.from("user_badges").insert({
                user_id: userId,
                badge_key: rule.key,
                name: rule.name,
                description: rule.description,
                icon: rule.icon,
            });
            if (!error) newBadges.push(rule.name);
        }
    }

    return newBadges;
}
