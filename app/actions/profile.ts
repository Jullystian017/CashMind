"use server";

import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
};

export async function getProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, avatar_url, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error) return { data: null, error: error.message };
  return {
    data: data as Profile,
    error: null,
  };
}

export async function updateProfile(updates: {
  display_name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return { error: error?.message ?? null };
}
