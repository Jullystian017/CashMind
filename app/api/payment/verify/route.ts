import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import midtransClient from "midtrans-client";

// Use service role key since this is an admin action
function getSupabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    // Fetch transaction status directly from Midtrans API
    const transactionStatusObject = await coreApi.transaction.status(order_id);
    const transactionStatus = transactionStatusObject.transaction_status;
    const fraudStatus = transactionStatusObject.fraud_status;

    let newStatus: "paid" | "failed" | "expired" | "pending" = "pending";

    if (transactionStatus === "capture") {
      newStatus = fraudStatus === "accept" ? "paid" : "failed";
    } else if (transactionStatus === "settlement") {
      newStatus = "paid";
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel"
    ) {
      newStatus = "failed";
    } else if (transactionStatus === "expire") {
      newStatus = "expired";
    } else if (transactionStatus === "pending") {
      newStatus = "pending";
    }

    const supabase = getSupabaseAdmin();

    // Update the payment order
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .update({
        status: newStatus,
        midtrans_transaction_id: transactionStatusObject.transaction_id,
        payment_type: transactionStatusObject.payment_type,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id)
      .select("user_id")
      .single();

    if (orderError) {
      console.error("Failed to update payment order:", orderError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // If payment is successful, upgrade user to Pro
    if (newStatus === "paid" && order?.user_id) {
      await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", order.user_id);
    }

    return NextResponse.json({ status: newStatus });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
