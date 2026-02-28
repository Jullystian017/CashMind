"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/section-badge";
import { Sparkles, ArrowUpRight, ArrowDownRight, Users, Activity, BarChart3, Globe, Command, Home, Wallet, UtensilsCrossed, Car, TrendingUp, Calendar } from "lucide-react";

const BentoCard = ({
    children,
    className = "",
    title,
    description
}: {
    children: React.ReactNode;
    className?: string;
    title: string;
    description: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            viewport={{ once: true }}
            className={`bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full group ${className}`}
        >
            <div className="flex-1 mb-6 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center relative">
                {children}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export const Features = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <SectionBadge label="Features" variant="dark" className="mb-4" />
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        Master Your Money with CashMind
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Powerful tools designed to help you save smarter, spend wiser, and take full control of your financial future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {/* Growth Analytics */}
                    <BentoCard
                        title="Growth Analytics"
                        description="Visualize your financial trajectory with advanced growth metrics and organic performance tracking for all your assets."
                    >
                        <div className="w-full h-full p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Growth Index</p>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-3xl font-black text-gray-900 tracking-tight">+24.5%</h4>
                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black border border-emerald-100">Annual</span>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>

                            {/* Organic Multi-Layered Chart */}
                            <div className="relative h-32 w-full mt-6">
                                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="growthGradientLayer1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="growthGradientLayer2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Layer 2 (Background) */}
                                    <motion.path
                                        d="M0,90 C40,85 60,60 100,70 C140,80 160,40 200,50 V100 H0 Z"
                                        fill="url(#growthGradientLayer2)"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 2, delay: 0.2 }}
                                    />

                                    {/* Layer 1 (Main Area) */}
                                    <motion.path
                                        d="M0,80 C30,85 50,40 100,55 C150,70 170,20 200,35 V100 H0 Z"
                                        fill="url(#growthGradientLayer1)"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 1.5 }}
                                    />

                                    {/* Main Organic Line */}
                                    <motion.path
                                        d="M0,80 C30,85 50,40 100,55 C150,70 170,20 200,35"
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.8, ease: "easeInOut" }}
                                    />

                                    {/* Pulsing Data Points */}
                                    <motion.g
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 1.6 }}
                                    >
                                        <circle cx="100" cy="55" r="4" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
                                        <motion.circle
                                            cx="100" cy="55" r="8" fill="#3B82F6" opacity="0.2"
                                            animate={{ scale: [1, 1.8, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />

                                        <circle cx="200" cy="35" r="4" fill="white" stroke="#3B82F6" strokeWidth="2.5" />
                                        <motion.circle
                                            cx="200" cy="35" r="8" fill="#3B82F6" opacity="0.2"
                                            animate={{ scale: [1, 1.8, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        />
                                    </motion.g>
                                </svg>

                                <div className="absolute -top-6 right-0 bg-white/90 backdrop-blur-md border border-gray-100 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-500">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Peak Value</span>
                                        <span className="text-xs font-black text-blue-600 font-sans">$102,450.00</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Monthly Yield</p>
                                    <p className="text-base font-black text-gray-900 tracking-tight">$3,120 <span className="text-[10px] text-emerald-500 font-sans">↑</span></p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Portfolio Risk</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-black text-gray-900 tracking-tight italic">Low</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`w-1.5 h-3 rounded-full ${i === 1 ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* AI Financial Advisor */}
                    <BentoCard
                        title="AI Financial Advisor"
                        description="Experience a new way to manage wealth with our conversational AI that provides personalized financial advice through a smart chat interface."
                    >
                        <div className="relative w-full h-full p-4 overflow-hidden flex flex-col justify-end bg-transparent">
                            {/* Chat Header Overlay */}
                            <div className="absolute top-0 left-0 right-0 p-3 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-900 tracking-tight leading-none mb-0.5">CashMind AI</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <Activity className="w-3.5 h-3.5 text-gray-300" />
                            </div>

                            {/* Chat Bubbles Container */}
                            <div className="space-y-3 pt-10 pb-4">
                                {/* User Message */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col items-end"
                                >
                                    <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-[22px] rounded-tr-none shadow-sm max-w-[85%]">
                                        <p className="text-[10px] font-bold text-gray-700 leading-relaxed">
                                            Berapa yang bisa saya hemat kalau kurangi makan luar 15%?
                                        </p>
                                    </div>
                                </motion.div>

                                {/* AI Message */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1 }}
                                    className="flex flex-col items-start"
                                >
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-3 rounded-[22px] rounded-tl-none shadow-xl max-w-[90%] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                                        <p className="text-[10px] font-black text-white leading-relaxed relative z-10">
                                            Berdasarkan bulan lalu, kamu bisa hemat sekitar <span className="text-emerald-300">Rp 750.000</span>. Mau saya pindahkan ke Dana Darurat?
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Typing Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                    className="flex items-center gap-2 mt-2 ml-1"
                                >
                                    <div className="flex gap-1 bg-white/80 backdrop-blur-sm border border-gray-100 px-2 py-1.5 rounded-full shadow-sm">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1 h-1 rounded-full bg-blue-600" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1 h-1 rounded-full bg-blue-600" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1 h-1 rounded-full bg-blue-600" />
                                    </div>
                                    <span className="text-[9px] font-black text-blue-600/60 lowercase tracking-tight">ai sedang mengetik...</span>
                                </motion.div>
                            </div>

                            {/* Chat Input Field Preview */}
                            <div className="mt-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 flex items-center justify-between shadow-lg">
                                <span className="text-[9px] font-bold text-gray-300 ml-2">Tanya CashMind AI...</span>
                                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Financial Health Score */}
                    <BentoCard
                        title="Financial Health Score"
                        description="Monitor your overall financial performance with a real-time score synthesized from your savings, budget, and goals."
                    >
                        <div className="w-full h-full p-4 flex flex-col items-center justify-center space-y-6">
                            {/* Premium Circular Gauge */}
                            <div className="relative w-32 h-32 flex items-center justify-center group">
                                {/* External Glow */}
                                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />

                                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 144 144">
                                    <defs>
                                        <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#3B82F6" />
                                            <stop offset="100%" stopColor="#818CF8" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-50" />
                                    <motion.circle
                                        cx="72" cy="72" r="64" stroke="url(#gaugeGradient)" strokeWidth="10" fill="transparent"
                                        strokeDasharray={402}
                                        initial={{ strokeDashoffset: 402 }}
                                        whileInView={{ strokeDashoffset: 402 - (402 * 85) / 100 }}
                                        transition={{ duration: 1.8, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span
                                        className="text-4xl font-black text-gray-900"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        85
                                    </motion.span>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">Advanced</span>
                                </div>
                            </div>

                            {/* Enhanced Breakdown */}
                            <div className="w-full grid grid-cols-3 gap-3">
                                {[
                                    { label: "Savings", score: "38/40", color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50" },
                                    { label: "Budget", score: "18/20", color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
                                    { label: "Goals", score: "15/20", color: "from-indigo-400 to-indigo-600", bg: "bg-indigo-50" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center p-2.5 rounded-[20px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default group/item">
                                        <div className={cn("w-2 h-2 rounded-full mb-2 bg-gradient-to-br transition-transform group-hover/item:scale-125", item.color)} />
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight mb-1">{item.label}</span>
                                        <span className="text-[11px] font-black text-gray-800">{item.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* Smart Budget Planner */}
                    <BentoCard
                        title="Smart Budget Planner"
                        description="Effortlessly plan your monthly spending and stay on track with automated budget alerts and intelligent categorization."
                    >
                        <div className="w-full h-full p-5 relative flex flex-col justify-center">
                            {/* Budget Header Preview */}
                            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 p-4 shadow-sm mb-4 group/header">
                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Budget</p>
                                        <p className="text-base font-black text-gray-900 tracking-tight">Rp 5.000.000</p>
                                    </div>
                                    <div className="text-[9px] font-black text-blue-600 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-blue-100/50 shadow-sm flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        72% Used
                                    </div>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "72%" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 relative z-10"
                                    />
                                    {/* Glass shine effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/20 z-20"
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </div>

                            {/* Category Items Preview */}
                            <div className="space-y-3">
                                {[
                                    { name: "Food & Drinks", icon: <UtensilsCrossed className="w-3.5 h-3.5" />, color: "from-blue-500 to-blue-700", shadow: "shadow-blue-200", pct: 80, status: "Aman", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                    { name: "Transport", icon: <Car className="w-3.5 h-3.5" />, color: "from-orange-500 to-orange-700", shadow: "shadow-orange-200", pct: 100, status: "Over Limit", statusColor: "text-rose-600 bg-rose-50 border-rose-100" },
                                ].map((cat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm hover:translate-x-1 transition-transform">
                                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg", cat.color, cat.shadow)}>
                                            {cat.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[11px] font-black text-gray-700 tracking-tight">{cat.name}</span>
                                                <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-black border uppercase tracking-wider", cat.statusColor)}>
                                                    {cat.status}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${Math.min(cat.pct, 100)}%` }}
                                                    transition={{ duration: 1.2, delay: 0.8 + (i * 0.2) }}
                                                    className={cn("h-full bg-gradient-to-r", cat.color)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* Cashflow Calendar - Full Width in a 3-col grid */}
                    <BentoCard
                        title="Cashflow Calendar"
                        description="Visualize your financial rhythm with a smart calendar that tracks every transaction and upcoming bill."
                        className="lg:col-span-2"
                    >
                        <div className="w-full h-full p-5 flex flex-col md:flex-row gap-6 items-center justify-between">
                            {/* Calendar Grid Visual */}
                            <div className="flex-1 grid grid-cols-7 gap-2 max-w-sm w-full">
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const day = i + 1;
                                    const hasInflow = [5, 12, 25].includes(day);
                                    const hasOutflow = [2, 10, 18, 28].includes(day);

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="aspect-square rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center relative group/day hover:border-blue-200 hover:shadow-md transition-all cursor-default"
                                        >
                                            <span className="text-[9px] font-bold text-gray-400 group-hover/day:text-blue-600 font-sans">{day}</span>
                                            <div className="flex gap-0.5 mt-1">
                                                {hasInflow && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-1 rounded-full bg-emerald-500" />}
                                                {hasOutflow && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-1 h-1 rounded-full bg-rose-500" />}
                                            </div>
                                            {day === 15 && (
                                                <div className="absolute inset-0 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Info & Stats */}
                            <div className="flex-1 flex flex-col items-start gap-4">
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl w-full relative overflow-hidden group/info">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/info:opacity-20 transition-opacity">
                                        <Calendar className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Upcoming Highlights</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                <span className="text-xs font-bold text-gray-700">PLN Electricity Bill</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-900 font-sans">Rp 450.000</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-gray-700">Monthly Salary</span>
                                            </div>
                                            <span className="text-xs font-black text-blue-600 font-sans">Rp 12.000.000</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <div className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                                        <p className="text-[8px] font-black text-emerald-600 mb-0.5">EST. INFLOW</p>
                                        <p className="text-sm font-black text-gray-900 tracking-tight font-sans">Rp 15.2M</p>
                                    </div>
                                    <div className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                                        <p className="text-[8px] font-black text-rose-500 mb-0.5">EST. OUTFLOW</p>
                                        <p className="text-sm font-black text-gray-900 tracking-tight font-sans">Rp 8.4M</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>

            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-50" />
            </div>
        </section>
    );
};
