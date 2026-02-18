"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    Plus,
    CreditCard,
    DollarSign,
    BarChart3,
    Target,
    Wallet,
    Timer,
    CircleDollarSign,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Zap,
    ChevronRight,
    MoreHorizontal,
    Lightbulb
} from "lucide-react"

export default function DashboardOverview() {
    const stats = [
        {
            label: "Total Balance",
            amount: "Rp 24,500,000",
            subLabel: "Updated just now",
            trend: "+12.5%",
            up: true,
            icon: Wallet,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Total Income",
            amount: "Rp 8,200,000",
            subLabel: "This month",
            trend: "+8.2%",
            up: true,
            icon: TrendingUp,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Total Expenses",
            amount: "Rp 3,450,000",
            subLabel: "this month",
            trend: "-2.4%",
            up: false,
            icon: TrendingDown,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Savings Progress",
            amount: "75%",
            subLabel: "Goal: Rp 5M",
            trend: "+5.1%",
            up: true,
            icon: Target,
            color: "text-blue-600 bg-blue-50"
        },
    ]

    const transactions = [
        { date: "Feb 18, 2026", desc: "Starbucks Coffee", cat: "Food & Drinks", amount: "-Rp 55,000", status: "Completed", isPositive: false },
        { date: "Feb 17, 2026", desc: "Freelance Payment", cat: "Income", amount: "+Rp 2,500,000", status: "Completed", isPositive: true },
        { date: "Feb 17, 2026", desc: "Indomaret", cat: "Shopping", amount: "-Rp 120,000", status: "Completed", isPositive: false },
        { date: "Feb 16, 2026", desc: "Spotify Premium", cat: "Entertainment", amount: "-Rp 54,990", status: "Completed", isPositive: false },
        { date: "Feb 15, 2026", desc: "Withdrawal", cat: "Transfer", amount: "-Rp 500,000", status: "Completed", isPositive: false },
    ]

    const budgetStatus = [
        { name: "Food", spent: 1200000, limit: 2000000, color: "bg-blue-500" },
        { name: "Transport", spent: 450000, limit: 600000, color: "bg-emerald-500" },
        { name: "Entertainment", spent: 300000, limit: 500000, color: "bg-amber-500" },
    ]

    return (
        <div className="space-y-8 pb-10" suppressHydrationWarning={true}>
            {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h2>
                    <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Welcome back! Here's what's happening with your money today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-3.5 h-3.5" />
                        <span>This Month</span>
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white @md:p-6 p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform"></div>

                        <div className="flex items-center gap-3 @md:gap-4 mb-4 @md:mb-6 relative z-10">
                            <div className={cn("w-10 h-10 @md:w-12 @md:h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm", stat.color)}>
                                <stat.icon className="w-5 h-5 @md:w-5 @md:h-5" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[9px] @md:text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-lg @md:text-xl font-bold tracking-tight text-gray-900 mt-0.5">{stat.amount}</h3>
                            </div>
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-1.5">
                                <div className={cn(
                                    "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors flex-shrink-0",
                                    stat.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                )}>
                                    {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                    {stat.trend}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">vs last month</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 @xl:grid-cols-3 gap-8">
                {/* Left Side: Charts & Transactions */}
                <div className="@xl:col-span-2 space-y-8">
                    {/* Expense Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white @md:p-8 p-6 rounded-[32px] border border-gray-100 shadow-sm"
                    >
                        <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-none">Spending Analytics</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1.5">Monthly weekly expenses trend</p>
                            </div>
                            <div className="flex bg-gray-50 p-1 rounded-xl w-full @md:w-auto">
                                <button className="flex-1 @md:flex-none px-4 py-2 text-[10px] font-bold text-blue-600 bg-white shadow-sm rounded-lg transition-all">Weekly</button>
                                <button className="flex-1 @md:flex-none px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors">Monthly</button>
                            </div>
                        </div>

                        {/* SVG Bar Chart Placeholder */}
                        <div className="h-64 flex items-end justify-between gap-2 @md:gap-4 px-1 @md:px-2 border-b border-gray-100 pb-2 relative">
                            {/* Target/Budget Line */}
                            <div className="absolute left-0 right-0 top-1/4 h-[1px] bg-emerald-400/20 border-dashed border-t flex items-center justify-end">
                                <span className="text-[8px] font-bold text-emerald-500 -mt-3 transform translate-x-2">Target Limit</span>
                            </div>

                            {[550, 420, 780, 320, 610, 490, 850].map((val, i) => {
                                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                                const height = (val / 900) * 100
                                return (
                                    <div key={days[i]} className="flex-1 flex flex-col items-center group relative">
                                        <div className="w-full max-w-[48px] flex flex-col items-center">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ delay: 0.6 + (i * 0.05), type: "spring", damping: 15 }}
                                                className={cn(
                                                    "w-full rounded-t-xl group-hover:scale-x-105 transition-all shadow-sm",
                                                    val > 700 ? "bg-rose-500" : "bg-blue-600"
                                                )}
                                            >
                                                <div className="absolute inset-x-0 bottom-0 bg-white/20 h-1/2 rounded-t-xl"></div>
                                            </motion.div>
                                        </div>
                                        <span className="text-[9px] @md:text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-wider">{days[i]}</span>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 font-bold shadow-xl">
                                            Rp {val.toLocaleString('id-ID')},000
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Transaction List */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="@md:p-8 p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-gray-900">Recent Transactions</h3>
                                <p className="text-xs text-gray-500 font-semibold tracking-wide">Last activities this week</p>
                            </div>
                            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1 group">
                                <span className="hidden @sm:inline">View All</span> <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {transactions.map((tx, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + (i * 0.05) }}
                                    className="p-6 hover:bg-gray-50 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm border border-white group-hover:scale-110 transition-transform",
                                            tx.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {tx.isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">{tx.desc}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.cat}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                <span className="text-[10px] font-bold text-gray-400">{tx.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-sm font-bold tracking-tight",
                                            tx.isPositive ? "text-emerald-600" : "text-gray-900"
                                        )}>
                                            {tx.amount}
                                        </p>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Completed</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Analytics & Planning */}
                <div className="space-y-8">
                    {/* Category Breakdown Donut (Mock SVG) */}
                    <div className="bg-white @md:p-8 p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="relative flex justify-center py-4">
                            <svg viewBox="0 0 100 100" className="w-32 h-32 @md:w-48 @md:h-48 transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188.4" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="226" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[8px] @md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Spent</span>
                                <span className="text-lg @md:text-xl font-bold text-gray-900 tracking-tight mt-1">Rp 3.4M</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {[
                                { name: "Food & Drinks", percent: 45, color: "bg-blue-600" },
                                { name: "Entertainment", percent: 25, color: "bg-emerald-500" },
                                { name: "Others", percent: 10, color: "bg-amber-500" },
                            ].map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 @md:w-2.5 @md:h-2.5 rounded-full", item.color)}></div>
                                        <span className="text-[11px] @md:text-xs font-bold text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="text-[11px] @md:text-xs font-bold text-gray-900">{item.percent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Trackers */}
                    <div className="bg-white @md:p-8 p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all">
                        <h3 className="text-lg font-bold text-gray-900 mb-8">Budget Progress</h3>
                        <div className="space-y-8">
                            {budgetStatus.map((budget) => {
                                const progress = (budget.spent / budget.limit) * 100
                                return (
                                    <div key={budget.name}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-gray-900 tracking-tight">{budget.name}</span>
                                            <span className="text-[11px] font-bold text-gray-500">
                                                Rp {(budget.spent / 1000).toLocaleString('id-ID')}k <span className="text-gray-300 mx-1">/</span> Rp {(budget.limit / 1000).toLocaleString('id-ID')}k
                                            </span>
                                        </div>
                                        <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-[1px]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ delay: 0.8, duration: 1 }}
                                                className={cn("h-full rounded-full shadow-sm", budget.color)}
                                            ></motion.div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-10 p-5 rounded-[24px] bg-blue-50 border border-blue-100/50">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="w-4 h-4 text-blue-600" />
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Savings Goal</h4>
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 mb-4">You're Rp 1.5M away from your Trip to Bali goal!</p>
                            <div className="h-1.5 bg-white rounded-full overflow-hidden p-[1px]">
                                <div className="h-full w-4/5 bg-blue-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
