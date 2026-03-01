"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Activity, PieChart, Calculator, Bot, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";
import { CTA } from "@/components/homepage/cta";
import { useState, useEffect } from "react";

// --- Custom Visual Components for Features ---

const ScoreVisual = () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden rounded-[2.5rem] border border-blue-100 shadow-xl">
        <div className="relative flex flex-col items-center">
            {/* Outer glowing rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 rounded-full border border-dashed border-blue-300/50"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80 rounded-full border border-blue-100"
            />

            {/* The Score Circle */}
            <div className="relative w-56 h-56 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-8 border-blue-50 z-10">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Health Score</p>
                <div className="flex items-start">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-7xl font-black text-blue-600 tracking-tighter"
                    >
                        85
                    </motion.span>
                </div>
                <div className="mt-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Excellent
                </div>

                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#EFF6FF" strokeWidth="8" />
                    <motion.circle
                        cx="50" cy="50" r="46" fill="none" stroke="#2563EB" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="289"
                        initial={{ strokeDashoffset: 289 }}
                        whileInView={{ strokeDashoffset: 289 - (289 * 0.85) }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                </svg>
            </div>

            {/* Floating indicator */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-10 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
            >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">Status</p>
                    <p className="text-sm font-bold text-gray-900">Protected</p>
                </div>
            </motion.div>
        </div>
    </div>
);

const AnalyticsVisual = () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden rounded-[2.5rem] border border-indigo-100 shadow-xl p-8">
        <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-gray-50 flex flex-col justify-end relative overflow-hidden p-6 z-10">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="flex justify-between items-center mb-auto relative z-10">
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Spending Overview</h4>
                    <p className="text-xs text-gray-400">Past 6 months</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                    <PieChart className="w-5 h-5" />
                </div>
            </div>

            {/* Animated Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-2 relative z-10 mt-6 pt-4 border-t border-dashed border-gray-200">
                {[40, 70, 45, 90, 65, 100].map((height, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2">
                        <motion.div
                            className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg"
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                        />
                        <span className="text-[10px] font-bold text-gray-400">M{i + 1}</span>
                    </div>
                ))}
            </div>

            {/* Floating Highlight */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2"
            >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                +24% Savings
            </motion.div>
        </div>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />
    </div>
);

const BudgetVisual = () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-cyan-50 to-white relative overflow-hidden rounded-[2.5rem] border border-cyan-100 shadow-xl p-8">
        <div className="w-full max-w-sm flex flex-col gap-4 relative z-10">
            {/* Category Cards */}
            {[
                { name: "Food & Dining", used: 350, limit: 500, color: "bg-orange-500", lightText: "text-orange-600", lightBg: "bg-orange-50", progress: 70 },
                { name: "Transportation", used: 120, limit: 150, color: "bg-emerald-500", lightText: "text-emerald-600", lightBg: "bg-emerald-50", progress: 80 },
                { name: "Entertainment", used: 90, limit: 200, color: "bg-purple-500", lightText: "text-purple-600", lightBg: "bg-purple-50", progress: 45 },
            ].map((cat, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.lightBg} ${cat.lightText}`}>
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-900">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-500">${cat.used} <span className="text-gray-300">/ ${cat.limit}</span></span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${cat.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${cat.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            ))}

            {/* Alert floating card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-red-50 border border-red-100 p-4 rounded-xl shadow-xl flex items-center gap-3"
            >
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
                    <div className="w-2 h-2 rounded-full bg-red-500 relative" />
                </div>
                <p className="text-xs font-bold text-red-900">Food budget nearing limit!</p>
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
    </div>
);

const AICoachVisual = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "How can I reduce my expenses this month?", sender: "user" }
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: 2,
                text: "Based on your history, dining out makes up 40% of your budget. I suggest setting a $150 limit on restaurants. I can set this up for you.",
                sender: "ai"
            }]);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-white relative overflow-hidden rounded-[2.5rem] border border-purple-100 shadow-xl p-6">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col overflow-hidden relative z-10 h-80">
                {/* Chat Header */}
                <div className="bg-purple-600 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Mindy (AI Coach)</h4>
                        <p className="text-purple-200 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                        </p>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-gray-50/50">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-gray-900 text-white rounded-tr-sm'
                                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {messages.length === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Background glowing atoms */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-purple-400/20 rounded-full blur-[40px]" />
                <div className="absolute bottom-[20%] right-[20%] w-40 h-40 bg-pink-400/20 rounded-full blur-[50px]" />
            </motion.div>
        </div>
    );
};

// --- Features Data with Deep Dive Content ---

const detailedFeatures = [
    {
        title: "Financial Health Score",
        tagline: "Your financial vitals at a glance.",
        description: "Stop guessing how you're doing. Our intelligent algorithm analyzes your income, spending habits, debts, and savings to assign you a real-time, objective health score from 0 to 100.",
        benefits: [
            "Real-time tracking of financial stability",
            "Objective metrics replacing emotional guessing",
            "Personalized tips to improve your score weekly"
        ],
        badge: "Core Metric",
        visual: <ScoreVisual />,
    },
    {
        title: "Smart Analytics",
        tagline: "Visualize every single rupiah.",
        description: "Transform complex transaction data into beautiful, easy-to-understand interactive charts. Spot trends, identify leaks in your budget, and understand exactly where your money flows each month.",
        benefits: [
            "Auto-categorization of all transactions with 99% accuracy",
            "Interactive Pie, Bar, and Line charts",
            "Month-over-month growth and spending comparisons"
        ],
        badge: "Insights",
        visual: <AnalyticsVisual />,
        reverse: true,
    },
    {
        title: "Automated Budget Planner",
        tagline: "Set limits, and let the app do the enforcing.",
        description: "Creating a budget is easy; sticking to it is hard. CashMind automatically tracks your spending against customizable categories and sends proactive alerts before you swipe your card and overspend.",
        benefits: [
            "Customizable envelopes for different spending types",
            "Real-time progress bars and remaining balances",
            "Proactive push notifications to prevent overspending"
        ],
        badge: "Control",
        visual: <BudgetVisual />,
    },
    {
        title: "AI Financial Coach (Mindy)",
        tagline: "Your personal CFO, available 24/7.",
        description: "Meet Mindy, your dedicated AI companion. Ask specific questions about your spending, request custom reports, or ask for personalized strategies to reach your next savings goal faster.",
        benefits: [
            "Conversational interface via chat",
            "Context-aware answers based on your unique data",
            "Actionable recommendations, not generic advice"
        ],
        badge: "Innovation",
        visual: <AICoachVisual />,
        reverse: true,
    }
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-blue-100/80 via-blue-50/50 to-white">
                {/* Background Shader Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
                            backgroundSize: '90px 90px'
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <SectionBadge label="Platform Features" className="mb-6 mx-auto" variant="light" />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        One Unified App. <br className="hidden md:block" />
                        <span className="text-blue-600">Infinite Control.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium mb-12"
                    >
                        Explore the powerful suite of tools designed exclusively to simplify, clarify, and amplify your financial life as a student.
                    </motion.p>
                </div>
            </section>

            {/* Alternating Deep-Dive Layout */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col gap-32">
                        {detailedFeatures.map((feature, idx) => (
                            <div key={idx} className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}>

                                {/* Text Content */}
                                <motion.div
                                    className="flex-1 space-y-8"
                                    initial={{ opacity: 0, x: feature.reverse ? 40 : -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-bold mb-6 uppercase tracking-widest">
                                            <Sparkles className="w-3.5 h-3.5" /> {feature.badge}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                                            {feature.title}
                                        </h2>
                                        <p className="text-xl text-blue-600 font-semibold mb-6">
                                            {feature.tagline}
                                        </p>
                                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-4">
                                        {feature.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Visual Content */}
                                <motion.div
                                    className="flex-1 w-full"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                                >
                                    {feature.visual}
                                </motion.div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <CTA />

            <Footer />
        </main>
    );
}
