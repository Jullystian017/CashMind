"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionBadge } from "@/components/ui/section-badge";

const steps = [
    {
        number: "01",
        title: "Connect Your Accounts",
        description: "Securely link your bank accounts and credit cards to CashMind in seconds.",
    },
    {
        number: "02",
        title: "Categorize Automatically",
        description: "Our AI automatically categorizes your transactions with 99% accuracy.",
    },
    {
        number: "03",
        title: "Get Smart Insights",
        description: "Receive personalized tips and strategies to grow your savings automatically.",
    },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-gray-50/50 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionBadge label="Process" />
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-8">
                            Take control of your money <br /> in three simple steps.
                        </h3>

                        <div className="space-y-12">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex gap-6"
                                >
                                    <div className="text-4xl font-black text-blue-100 mt-1">{step.number}</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl"
                        >
                            <div className="aspect-[4/5] bg-blue-600 flex items-center justify-center p-12">
                                <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 flex flex-col justify-end">
                                    <div className="h-2 w-24 bg-white/40 rounded-full mb-4" />
                                    <div className="h-2 w-48 bg-white/20 rounded-full mb-8" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-20 bg-white/10 rounded-2xl border border-white/10" />
                                        <div className="h-20 bg-white/10 rounded-2xl border border-white/10" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
};
