"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for students and individuals just starting.",
        features: ["Standard Tracking", "1 Connected Account", "Weekly Reports", "Email Support"],
        buttonText: "Get Started Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$12",
        description: "Best for professionals who want detailed insights.",
        features: ["Advanced AI Analytics", "Unlimited Accounts", "Custom Categories", "24/7 Priority Support", "Export to PDF/CSV"],
        buttonText: "Try Pro Free",
        popular: true,
    },
    {
        name: "Elite",
        price: "$29",
        description: "For users who need white-glove financial management.",
        features: ["Personal Financial Coach", "Family Accounts", "Investment Tracking", "Early Access to Features", "Custom Branding"],
        buttonText: "Contact Sales",
        popular: false,
    },
];

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <SectionBadge label="Pricing" className="mb-6" />
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Transparent pricing for <br className="hidden md:block" /> everyone at every stage.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-10 rounded-[2.5rem] border ${plan.popular
                                ? "border-blue-600 bg-blue-50/10 shadow-xl shadow-blue-500/5 relative"
                                : "border-gray-100 bg-white"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 font-medium">/month</span>
                                </div>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, fidx) => (
                                    <div key={fidx} className="flex gap-3 items-center">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-blue-600" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-full font-bold transition-all ${plan.popular
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                                : "bg-gray-50 text-gray-900 hover:bg-gray-100"
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
