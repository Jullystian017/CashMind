"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  feature?: string;
  className?: string;
}

export function UpgradePrompt({
  title = "Pro Feature",
  description = "Upgrade to CashMind Pro to unlock this premium feature.",
  feature,
  className = "",
}: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-8 sm:p-10 text-center ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.15em]">
            {title}
          </span>
        </div>

        {feature && (
          <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            {feature}
          </h3>
        )}

        <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          Upgrade to Pro
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[11px] text-slate-400 font-medium mt-4">
          Starting from Rp 15k/month
        </p>
      </div>
    </motion.div>
  );
}
