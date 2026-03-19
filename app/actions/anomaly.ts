"use server";

import { createClient } from "@/lib/supabase/server";
import { createNotification } from "./notifications";

/**
 * Anomaly Detection Engine
 *
 * Analyzes a newly created expense transaction against the user's
 * historical spending patterns and creates alert notifications
 * when anomalies are detected.
 *
 * This should be called in a fire-and-forget manner after creating
 * a transaction to avoid blocking the user.
 */
export async function checkTransactionAnomaly(
  userId: string,
  transaction: {
    amount: number;
    category: string;
    date: string;
  }
) {
  try {
    const supabase = await createClient();

    // Fetch last 90 days of expense transactions for analysis
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: historicalTxs } = await supabase
      .from("transactions")
      .select("amount, category, date")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("date", ninetyDaysAgo.toISOString())
      .order("date", { ascending: false });

    if (!historicalTxs || historicalTxs.length < 5) {
      // Not enough data to detect anomalies
      return;
    }

    const alerts: { title: string; message: string }[] = [];

    // ──────────────────────────────────────────────
    // Check 1: Single transaction vs daily average
    // ──────────────────────────────────────────────
    const totalExpense = historicalTxs.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );
    const uniqueDays = new Set(
      historicalTxs.map((tx) => tx.date?.split("T")[0])
    ).size;
    const dailyAvg = uniqueDays > 0 ? totalExpense / uniqueDays : 0;

    if (dailyAvg > 0 && transaction.amount > dailyAvg * 3) {
      const ratio = (transaction.amount / dailyAvg).toFixed(1);
      alerts.push({
        title: "⚠️ Unusually High Transaction",
        message: `Your latest expense of Rp ${transaction.amount.toLocaleString("id-ID")} is ${ratio}× higher than your daily average of Rp ${Math.round(dailyAvg).toLocaleString("id-ID")}. Keep an eye on your spending!`,
      });
    }

    // ──────────────────────────────────────────────
    // Check 2: Category-specific anomaly
    // ──────────────────────────────────────────────
    const categoryTxs = historicalTxs.filter(
      (tx) => tx.category === transaction.category
    );
    if (categoryTxs.length >= 3) {
      const categoryMax = Math.max(
        ...categoryTxs.map((tx) => Number(tx.amount))
      );
      if (transaction.amount > categoryMax * 2) {
        alerts.push({
          title: `🚨 Unusual Spending in ${transaction.category}`,
          message: `This transaction of Rp ${transaction.amount.toLocaleString("id-ID")} is significantly higher than your previous max of Rp ${categoryMax.toLocaleString("id-ID")} in "${transaction.category}". Was this expected?`,
        });
      }
    }

    // ──────────────────────────────────────────────
    // Check 3: Weekly spending trend
    // ──────────────────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeekTxs = historicalTxs.filter(
      (tx) => new Date(tx.date) >= sevenDaysAgo
    );
    const thisWeekTotal =
      thisWeekTxs.reduce((sum, tx) => sum + Number(tx.amount), 0) +
      transaction.amount;

    // Calculate average weekly spending from historical data
    const weeksOfData = Math.max(1, Math.ceil(uniqueDays / 7));
    const weeklyAvg = totalExpense / weeksOfData;

    if (weeklyAvg > 0 && thisWeekTotal > weeklyAvg * 1.5) {
      const pctOver = (
        ((thisWeekTotal - weeklyAvg) / weeklyAvg) *
        100
      ).toFixed(0);
      alerts.push({
        title: "📊 Weekly Spending Alert",
        message: `Your spending this week (Rp ${thisWeekTotal.toLocaleString("id-ID")}) is ${pctOver}% above your weekly average of Rp ${Math.round(weeklyAvg).toLocaleString("id-ID")}. Consider reviewing your expenses.`,
      });
    }

    // Send notifications for detected anomalies (max 1 most important)
    if (alerts.length > 0) {
      const alert = alerts[0]; // Send the most critical one
      await createNotification({
        userId,
        type: "alert",
        title: alert.title,
        message: alert.message,
      });
      return { alert };
    }

    return null;
  } catch (error) {
    // Silently fail — anomaly detection should never break the main flow
    console.error("Anomaly detection error:", error);
    return null;
  }
}
