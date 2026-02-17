"use client"

import { motion } from "framer-motion"
import { TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"

export default function DashboardOverview() {
    return (
        <div className="space-y-8" suppressHydrationWarning={true}>
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                    Welcome back, Rizky! 👋
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    Here's what's happening with your pocket money today.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Remaining Balance", amount: "$3,543", trend: "+12%", up: true, icon: "💰" },
                    { label: "Total Income", amount: "$5,200", trend: "+5%", up: true, icon: "📈" },
                    { label: "Total Expense", amount: "$1,657", trend: "-8%", up: false, icon: "📉" },
                    { label: "Savings Progress", amount: "85%", trend: "On track", up: true, icon: "🎯" },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                {card.icon}
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                card.up ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                            )}>
                                {card.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                {card.trend}
                            </div>
                        </div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{card.label}</p>
                        <h3 className="text-2xl font-black text-gray-900">{card.amount}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Smart Insight Panel (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                            <Zap className="w-3 h-3" /> Smart Prediction
                        </div>
                        <h2 className="text-2xl font-black">You can save <span className="text-blue-300">$450</span> more this month!</h2>
                        <p className="text-blue-100 text-sm max-w-md">Based on your spending patterns, you can reach your "Gaming Laptop" target 2 weeks faster by reducing snacks. 🍱</p>
                    </div>
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl shadow-black/10">
                        View Analysis
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </motion.div>

            {/* Empty State / Call to Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl">✅</div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Mulai catat transaksi!</h3>
                        <p className="text-sm text-gray-500">Belum ada transaksi hari ini. Catat jajanmu sekarang.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                            + Tambah Pengeluaran
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Financial Health Score</h3>
                    <div className="relative flex items-center justify-center py-4">
                        <div className="text-center">
                            <span className="text-6xl font-black text-blue-600">75</span>
                            <p className="text-xs font-bold text-green-500 mt-2 uppercase tracking-widest">Good Condition</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Rasio pengeluaranmu aman. Pertahankan gaya menabungmu!</p>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
