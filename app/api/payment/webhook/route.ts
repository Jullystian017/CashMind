import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabaseAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const payload = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(payload).digest("hex");
  return hash === signatureKey;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
      payment_type,
      fraud_status,
    } = body;

    // Verify signature
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      process.env.MIDTRANS_SERVER_KEY!,
      signature_key
    );

    if (!isValid) {
      console.error("Invalid Midtrans signature for order:", order_id);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    // Determine new status
    let newStatus: "paid" | "failed" | "expired" | "pending" = "pending";

    if (transaction_status === "capture") {
      newStatus = fraud_status === "accept" ? "paid" : "failed";
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel"
    ) {
      newStatus = "failed";
    } else if (transaction_status === "expire") {
      newStatus = "expired";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    }

    const supabase = getSupabaseAdmin();

    // Update the payment order
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .update({
        status: newStatus,
        midtrans_transaction_id: transaction_id,
        payment_type: payment_type,
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
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", order.user_id);

      if (profileError) {
        console.error("Failed to upgrade user plan:", profileError);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
