"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

const faqs = [
    {
        question: "What is CashMind?",
        answer: "CashMind is an AI-powered financial intelligence platform that helps you track spending, set smart budgets, and achieve your financial goals through personalized guidance and gamified experiences.",
    },
    {
        question: "Who is Mindy and how does she help me?",
        answer: "Mindy is your personal AI assistant. She analyzes your spending patterns to provide actionable insights, alerts you when you're nearing budget limits, and suggests personalized challenges to help you save more.",
    },
    {
        question: "How do Financial Circles work?",
        answer: "Financial Circles are designed for shared expenses with friends, family, or roommates. You can track group spending, see who spent what, and manage collective budgets in one synchronized place.",
    },
    {
        question: "What are Financial Challenges?",
        answer: "Challenges are gamified tasks designed to build better money habits. From 'No Spend Weekends' to 'Subscription Cleanups,' completing these tasks earns you points for the global Leaderboard.",
    },
    {
        question: "What can I do with the Financial Simulator?",
        answer: "The Simulator allows you to project your financial future. You can test scenarios like buying a home, starting a business, or retiring early to see how today's decisions impact your long-term wealth.",
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use industry-standard encryption and leverage Supabase's secure infrastructure for authentication and data storage. Your privacy and data integrity are our top priorities.",
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
                                    <span className={`text-lg md:text-xl font-semibold tracking-tight transition-colors ${isOpen ? "text-blue-600" : "text-gray-900"
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
