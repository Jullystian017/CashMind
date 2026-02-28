"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionBadge } from "@/components/ui/section-badge";
import { Shield, Sparkles, PieChart, TrendingUp, ShoppingBag, Car, Coffee, Home, Lock, Check } from "lucide-react";

// --- Step Visual Components ---

const Step1Visual = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        {/* Animated Rings */}
        {[1, 2, 3].map((i) => (
            <motion.div
                key={i}
                className="absolute border border-blue-100 rounded-full"
                style={{ width: i * 150, height: i * 150 }}
                animate={{
                    rotate: i % 2 === 0 ? 360 : -360,
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
            />
        ))}

        <div className="relative">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10"
            >
                <Shield className="w-16 h-16 text-blue-600 fill-blue-50" strokeWidth={1.5} />
                <motion.div
                    className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg border-4 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <Lock className="w-4 h-4 text-white" />
                </motion.div>
            </motion.div>

            {/* Glowing dots around the shield */}
            {[0, 90, 180, 270].map((angle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-400 rounded-full blur-[2px]"
                    animate={{
                        x: Math.cos(angle * Math.PI / 180) * 80,
                        y: Math.sin(angle * Math.PI / 180) * 80,
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
            ))}
        </div>
    </div>
);

const Step2Visual = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
        <div className="grid grid-cols-2 gap-4 relative z-10">
            {[
                { icon: ShoppingBag, label: "Groceries", color: "text-orange-500", bg: "bg-orange-50" },
                { icon: Car, label: "Transport", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Coffee, label: "Lifestyle", color: "text-brown-500", bg: "bg-stone-50" },
                { icon: Home, label: "Rent", color: "text-emerald-500", bg: "bg-emerald-50" }
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className={`p-6 rounded-[2rem] bg-white shadow-xl border border-gray-100 flex flex-col items-center gap-2 group`}
                >
                    <div className={`p-3 rounded-2xl ${item.bg}`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <motion.div
                        className="w-full h-1 bg-gray-50 rounded-full overflow-hidden mt-2"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1 + i * 0.2 }}
                    >
                        <motion.div
                            className={`h-full bg-current ${item.color}`}
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        />
                    </motion.div>
                </motion.div>
            ))}
        </div>

        {/* Central "AI Engine" core */}
        <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <div className="w-[400px] h-[400px] border border-dashed border-indigo-200/50 rounded-full" />
        </motion.div>
    </div>
);

const Step3Visual = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="relative">
            {/* Main Gauge */}
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="url(#budgetGradient)" strokeWidth="8"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * 0.75) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black text-gray-900"
                >
                    75%
                </motion.p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Budget used</p>
            </div>

            {/* Floating indicator bubbles */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-white rounded-full shadow-lg border border-blue-100 flex items-center justify-center"
                    animate={{
                        y: [0, -40, 0],
                        x: [0, (i - 2) * 30, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                >
                    <Check className="w-2 h-2 text-emerald-500" />
                </motion.div>
            ))}
        </div>
    </div>
);

const Step4Visual = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white relative overflow-hidden p-12">
        <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50 relative p-8 flex flex-col justify-end overflow-hidden">
            {/* Grid Helper */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Growth Chart Area */}
            <div className="relative flex-1">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M0,180 C50,170 100,100 150,120 C200,140 250,40 300,60 C350,80 400,20 400,20"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        d="M0,180 C50,170 100,100 150,120 C200,140 250,40 300,60 C350,80 400,20 V200 H0 Z"
                        fill="url(#wealthGrad)"
                    />
                </svg>

                {/* Pulsing Target Node */}
                <motion.div
                    className="absolute top-[10%] right-[0%] w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-xl shadow-emerald-200 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </div>

            <div className="mt-6 flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Wealth</p>
                    <h4 className="text-3xl font-black text-gray-900">$240,500.00</h4>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-600">+12.5%</span>
                </div>
            </div>
        </div>

        {/* Floating sparkles */}
        {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
                key={i}
                className="absolute text-yellow-400 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                    y: [0, -100],
                    x: [0, (i - 3) * 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
                <Sparkles className="w-5 h-5 fill-current" />
            </motion.div>
        ))}
    </div>
);

// --- End Step Visual Components ---

const steps = [
    {
        number: "01",
        title: "Securely connect accounts",
        description: "Link your bank accounts, credit cards, and e-wallets to CashMind in seconds with bank-level security.",
        visual: <Step1Visual />,
    },
    {
        number: "02",
        title: "Smart categorization",
        description: "Our AI automatically categorizes your transactions with 99% accuracy, so you always know where your money goes.",
        visual: <Step2Visual />,
    },
    {
        number: "03",
        title: "Set automated budgets",
        description: "Create realistic budgets based on your past spending habits, and get alerted before you overspend.",
        visual: <Step3Visual />,
    },
    {
        number: "04",
        title: "Grow your wealth!",
        description: "Receive personalized insights and actionable tips to optimize your savings and reach your financial goals faster.",
        visual: <Step4Visual />,
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
        <section id="how-it-works" className="py-24 bg-white px-4 overflow-hidden relative">
            {/* Background Shader Effect (Matching Hero) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center text-center mb-20 px-4">
                    <SectionBadge label="Process" className="mb-6" />
                    <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight mb-6">
                        Seamless Financial Mastery
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        Four powerful steps to completely transform how you manage, save, and grow your money—authenticated and automated.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Column: Vertical Steps */}
                    <div className="relative pl-0 md:pl-0">
                        {/* Connecting Line */}
                        <div className="absolute left-[39px] top-6 bottom-6 w-px border-l-2 border-dashed border-gray-100 hidden md:block" />

                        <div className="flex flex-col gap-4">
                            {steps.map((step, idx) => {
                                const isActive = activeStep === idx;
                                return (
                                    <div
                                        key={idx}
                                        className={`relative cursor-pointer group p-6 rounded-[2rem] transition-all duration-500 ${isActive
                                                ? 'bg-white shadow-xl shadow-blue-500/5 border border-blue-50'
                                                : 'hover:bg-gray-50/50'
                                            }`}
                                        onClick={() => setActiveStep(idx)}
                                    >
                                        <div className="flex gap-6 items-start relative z-10">
                                            {/* Number Circle */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-500 ${isActive
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'bg-white border-gray-100 text-gray-300 group-hover:border-gray-200 group-hover:text-gray-400'
                                                }`}>
                                                {step.number}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                    {step.title}
                                                </h3>

                                                <AnimatePresence initial={false}>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-gray-500 leading-relaxed mt-3 max-w-md font-medium">
                                                                {step.description}
                                                            </p>
                                                            {/* Progress bar inside active step */}
                                                            <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "100%" }}
                                                                    transition={{ duration: 5, ease: "linear" }}
                                                                    className="h-full bg-blue-600"
                                                                />
                                                            </div>
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

                    {/* Right Column: Premium Interactive Visual */}
                    <div className="relative group/image">
                        {/* Backdrop Glow behind Visual */}
                        <div className="absolute -inset-4 bg-blue-100/30 rounded-[3rem] blur-3xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000" />

                        <div className="relative aspect-square md:aspect-[1.1/1] rounded-[3rem] overflow-hidden border-[8px] border-white shadow-2xl bg-white">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    {steps[activeStep].visual}
                                </motion.div>
                            </AnimatePresence>

                            {/* Glass overlay hint */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />

                            {/* Step Badge (Floating on Visual) */}
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl">
                                <p className="text-gray-900 font-bold text-lg mb-0.5 tracking-tight">{steps[activeStep].title}</p>
                                <p className="text-blue-600/80 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Step {steps[activeStep].number} — CashMind</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
