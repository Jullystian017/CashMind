"use server";

import { createClient } from "@/lib/supabase/server";

export type SubscriptionIcon = "music" | "tv" | "gym" | "adobe";

export type SubscriptionRow = {
  id: string;
  name: string;
  price: number;
  billing: string;
  next_date: string;
  bg_color: string;
  icon: string;
  payment_method: string | null;
};

function rowToSubscription(r: SubscriptionRow) {
  return {
    id: r.id,
    name: r.name,
    price: Number(r.price),
    billing: r.billing,
    nextDate: r.next_date,
    bgColor: r.bg_color,
    icon: r.icon as SubscriptionIcon,
    paymentMethod: r.payment_method ?? undefined,
  };
}

export async function getSubscriptions(): Promise<{
  data: ReturnType<typeof rowToSubscription>[];
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("next_date", { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(rowToSubscription), error: null };
}

export async function createSubscription(input: {
  name: string;
  price: number;
  billing: string;
  nextDate: string;
  bgColor: string;
  icon: string;
  paymentMethod?: string;
}): Promise<{
  data: ReturnType<typeof rowToSubscription> | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      name: input.name,
      price: input.price,
      billing: input.billing,
      next_date: input.nextDate,
      bg_color: input.bgColor,
      icon: input.icon,
      payment_method: input.paymentMethod ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToSubscription(data as SubscriptionRow), error: null };
}

export async function updateSubscription(
  id: string,
  input: Partial<{
    name: string;
    price: number;
    billing: string;
    nextDate: string;
    bgColor: string;
    icon: string;
    paymentMethod: string;
  }>
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};
  if (input?.name !== undefined) updates.name = input.name;
  if (input?.price !== undefined) updates.price = input.price;
  if (input?.billing !== undefined) updates.billing = input.billing;
  if (input?.nextDate !== undefined) updates.next_date = input.nextDate;
  if (input?.bgColor !== undefined) updates.bg_color = input.bgColor;
  if (input?.icon !== undefined) updates.icon = input.icon;
  if (input?.paymentMethod !== undefined) updates.payment_method = input.paymentMethod;

  const { error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}

export async function deleteSubscription(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("subscriptions").delete().eq("id", id).eq("user_id", user.id);
  return { error: error?.message ?? null };
}
