"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for students managing their daily allowances and tracking basic expenses.",
        features: ["Standard Expense Tracking", "1 Connected Account", "Basic Health Score", "Community Support"],
        buttonText: "Get Started Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "Rp 19k",
        description: "Unlock the full power of AI-driven insights and automated budget planning.",
        features: ["Advanced AI Analytics & Chatbot", "Unlimited Accounts", "Automated Budget Planner", "Priority 24/7 Support", "Export to PDF/CSV"],
        buttonText: "Upgrade to Pro",
        popular: true,
    }
];

export const Pricing = ({ showHeader = true }: { showHeader?: boolean }) => {
    return (
        <section id="pricing" className={`${showHeader ? "py-24" : "py-12"} relative px-4 z-10`}>
            <div className="max-w-5xl mx-auto">
                {showHeader && (
                    <div className="text-center mb-16">
                        <SectionBadge label="Pricing" className="mb-6 mx-auto" />
                        <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                            Transparent pricing for <br className="hidden md:block" /> everyone at every stage.
                        </h3>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            Whether you need basic tracking or advanced AI features, we have a plan that fits your financial goals.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-10 rounded-[2.5rem] border ${plan.popular
                                ? "border-blue-400 bg-white/60 backdrop-blur-xl shadow-2xl shadow-blue-500/10 relative overflow-hidden"
                                : "border-gray-100 bg-white shadow-sm"
                                }`}
                        >
                            {/* Decorative glow for Pro plan */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
                            )}

                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <div className="mb-8 mt-4 relative z-10">
                                <h4 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className={`text-5xl font-black tracking-tighter ${plan.popular ? "text-blue-600" : "text-gray-900"}`}>{plan.price}</span>
                                    {plan.price !== "Free" && <span className="text-gray-500 font-medium">/month</span>}
                                </div>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[280px]">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 relative z-10 border-t border-gray-100 pt-8">
                                {plan.features.map((feature, fidx) => (
                                    <div key={fidx} className="flex gap-3 items-center">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-700 text-sm font-semibold">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${plan.popular
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-600/40 active:translate-y-0"
                                : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                                }`}>
                                {plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
