import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a pro plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, display_name, email")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "pro") {
      return NextResponse.json(
        { error: "You are already on the Pro plan" },
        { status: 400 }
      );
    }

    const orderId = `CASHMIND-PRO-${user.id.slice(0, 8)}-${Date.now()}`;
    const amount = 15000; // Rp 15,000

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: profile?.display_name || "CashMind User",
        email: profile?.email || user.email,
      },
      item_details: [
        {
          id: "pro-plan",
          price: amount,
          quantity: 1,
          name: "CashMind Pro Plan (Monthly)",
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Save order to database
    await supabase.from("payment_orders").insert({
      user_id: user.id,
      order_id: orderId,
      plan: "pro",
      amount,
      status: "pending",
      snap_token: transaction.token,
    });

    return NextResponse.json({
      token: transaction.token,
      order_id: orderId,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error("Midtrans create transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
