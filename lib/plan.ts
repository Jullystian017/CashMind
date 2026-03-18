import { createClient } from "@/lib/supabase/server";

export const AI_QUERY_LIMIT = 50;

export function isPro(plan: string | null | undefined): boolean {
  return plan === "pro";
}

export async function getUserPlanServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { plan: "starter", userId: null };

  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  return { plan: data?.plan || "starter", userId: user.id };
}

export async function getMonthlyAIQueryCount(userId: string) {
  const supabase = await createClient();

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count user messages in chat_messages this month
  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", firstOfMonth.toISOString());

  if (error) {
    console.error("Error counting AI queries:", error);
    return 0;
  }

  return count || 0;
}
