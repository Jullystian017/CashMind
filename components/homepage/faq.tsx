"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
        <section id="faq" className="py-24 bg-white px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">FAQ</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Common Questions
                    </h3>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-100 rounded-[1.5rem] overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                                {openIndex === idx ? (
                                    <Minus className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-gray-500 font-medium leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
