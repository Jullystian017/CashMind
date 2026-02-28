"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionBadge } from "@/components/ui/section-badge";

const steps = [
    {
        number: "01",
        title: "Securely connect accounts",
        description: "Link your bank accounts, credit cards, and e-wallets to CashMind in seconds with bank-level security.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800&h=1000",
    },
    {
        number: "02",
        title: "Smart categorization",
        description: "Our AI automatically categorizes your transactions with 99% accuracy, so you always know where your money goes.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=1000",
    },
    {
        number: "03",
        title: "Set automated budgets",
        description: "Create realistic budgets based on your past spending habits, and get alerted before you overspend.",
        image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=800&h=1000",
    },
    {
        number: "04",
        title: "Grow your wealth!",
        description: "Receive personalized insights and actionable tips to optimize your savings and reach your financial goals faster.",
        image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=800&h=1000",
    },
];

export const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 5000); // 5 seconds per step
        return () => clearTimeout(timer);
    }, [activeStep]);

    return (
        <section id="how-it-works" className="py-24 bg-gray-50/50 px-4 overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center mb-16 px-4">
                    <SectionBadge label="Process" className="mb-6" />
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight mb-4">
                        How CashMind Works
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Take control of your money and reach your financial goals in four secure, simple, and automated steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Text & Accordion */}
                    <div className="flex flex-col justify-center pt-8">

                        <div className="flex flex-col">
                            {steps.map((step, idx) => {
                                const isActive = activeStep === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="relative cursor-pointer group transition-colors duration-300"
                                        onClick={() => setActiveStep(idx)}
                                    >
                                        {/* Animated Bottom Border */}
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200">
                                            {isActive && (
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 5, ease: "linear" }}
                                                    className="absolute top-0 left-0 h-full bg-blue-600"
                                                />
                                            )}
                                        </div>
                                        <div className="py-6 pb-8 flex gap-8 items-start">
                                            <span className={`text-lg font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                {step.number}
                                            </span>
                                            <div className="flex-1">
                                                <h3 className={`text-2xl md:text-3xl font-medium transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                    {step.title}
                                                </h3>

                                                <AnimatePresence initial={false}>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-gray-500 leading-relaxed max-w-md">
                                                                {step.description}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Dynamic Image */}
                    <div className="relative aspect-[4/5] lg:aspect-square lg:max-h-[500px] w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl my-auto">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeStep}
                                src={steps[activeStep].image}
                                alt={steps[activeStep].title}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </AnimatePresence>

                        {/* Subtle inner shadow for premium feel */}
                        <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
};
