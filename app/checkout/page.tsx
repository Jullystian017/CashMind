"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Shield,
  Zap,
  Crown,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserPlan } from "@/app/actions/payment";

declare global {
  interface Window {
    snap: any;
  }
}

const proFeatures = [
  "Unlimited AI Queries",
  "Advanced AI Investment Insights",
  "Priority Server Processing",
  "Export to PDF/CSV",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPlan, setCurrentPlan] = useState("starter");

  useEffect(() => {
    // Load Midtrans Snap.js
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const existingScript = document.querySelector(
      `script[src="${snapUrl}"]`
    );
    if (!existingScript && clientKey) {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.head.appendChild(script);
    }

    // Check current plan
    getUserPlan().then(({ data }) => {
      if (data?.plan) setCurrentPlan(data.plan);
      setPageLoading(false);
    });
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setStatus("processing");
    setErrorMsg("");

    try {
      const res = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }

      // Open Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: async (result: any) => {
            try {
              setStatus("processing");
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: result.order_id || data.order_id }),
              });
              
              if (verifyRes.ok) {
                setStatus("success");
              } else {
                throw new Error("Verification failed");
              }
            } catch (err) {
              setStatus("error");
              setErrorMsg("Payment verified but failed to update status. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          onPending: () => {
            setStatus("processing");
            setLoading(false);
          },
          onError: () => {
            setStatus("error");
            setErrorMsg("Payment failed. Please try again.");
            setLoading(false);
          },
          onClose: () => {
            if (status === "processing") {
              setStatus("idle");
              setLoading(false);
            }
          },
        });
      } else {
        // Fallback: redirect to Midtrans payment page
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          throw new Error("Payment system is not ready. Please refresh and try again.");
        }
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (currentPlan === "pro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Crown className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
            You're Already Pro! 🎉
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            You already have access to all premium features.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-semibold text-slate-900 mb-3 tracking-tight">
            Welcome to Pro! 🚀
          </h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Your payment was successful. All Pro features are now
            unlocked. Enjoy your enhanced financial journey!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-lg mx-auto px-4 py-12 relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-semibold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Badge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-5 py-1.5 rounded-b-xl uppercase tracking-[0.15em] shadow-lg shadow-blue-200 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Upgrade
          </div>

          <div className="mt-6 mb-8 relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  CashMind Pro
                </h2>
                <p className="text-slate-400 text-sm font-medium">
                  Monthly Plan
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8 relative z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-semibold text-slate-900 tracking-tighter">
                Rp 15k
              </span>
              <span className="text-slate-400 font-medium">/month</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-10 relative z-10 border-t border-slate-100 pt-8">
            {proFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
                </div>
                <span className="text-slate-700 text-sm font-semibold">{f}</span>
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Shield className="w-4 h-4 text-slate-300" />
            <span className="text-[11px] text-slate-400 font-semibold">
              Secure payment powered by Midtrans
            </span>
          </div>

          {/* Error message */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
            </motion.div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Pay with Midtrans
              </>
            )}
          </button>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-400 font-medium mt-6 leading-relaxed">
          By proceeding, you agree to our Terms of Service.
          <br />
          Payments are processed securely by Midtrans.
        </p>
      </div>
    </div>
  );
}
