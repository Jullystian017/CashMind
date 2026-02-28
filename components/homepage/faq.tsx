"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

const faqs = [
    {
        question: "How secure is CashMind?",
        answer: "CashMind uses bank-grade 256-bit encryption to protect your data. We never sell your personal information, and your bank credentials are never stored on our servers.",
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time with a single click in your settings. Your data will remain accessible until the end of your billing period.",
    },
    {
        question: "Is there a free version available?",
        answer: "Absolutely! Our Starter plan is free forever and includes all the essential features you need to start tracking your finances.",
    },
    {
        question: "How does the AI insights feature work?",
        answer: "Our AI analyzes your spending patterns and compares them against market benchmarks to provide personalized tips on how to save and invest smarter.",
    },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-white px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <SectionBadge label="FAQ" className="mb-6" />
                    <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-center mt-6 text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Find answers to common questions about CashMind's features, security, and how to get the most out of your financial intelligence.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`group border transition-all duration-300 rounded-[2rem] overflow-hidden ${isOpen
                                    ? "bg-white border-blue-200 shadow-xl shadow-blue-500/5 ring-1 ring-blue-50"
                                    : "bg-gray-50/50 border-gray-100 hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-black/5"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-all"
                                >
                                    <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${isOpen ? "text-blue-600" : "text-gray-900"
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isOpen
                                        ? "bg-blue-600 border-blue-600 rotate-180"
                                        : "bg-white border-gray-200"
                                        }`}>
                                        <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? "text-white" : "text-gray-400"
                                            }`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 text-gray-500 leading-relaxed font-medium text-base md:text-lg border-t border-gray-50 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
