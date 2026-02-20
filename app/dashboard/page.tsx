"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
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
    Eye,
    Clock,
    MoreHorizontal,
    Lightbulb,
    Bell,
    Calendar,
    UtensilsCrossed,
    Car,
    Gamepad2,
    ShoppingBag
} from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Cell, PieChart, Pie
} from 'recharts'
import { GoalsManagementModal } from "@/components/goals-management-modal"
import { FinancialCalendarModal } from "@/components/financial-calendar-modal"

export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    color: string;
}

const weeklyData = [
    { name: 'Mon', income: 850, expense: 550 },
    { name: 'Tue', income: 720, expense: 420 },
    { name: 'Wed', income: 980, expense: 780 },
    { name: 'Thu', income: 620, expense: 320 },
    { name: 'Fri', income: 810, expense: 610 },
    { name: 'Sat', income: 790, expense: 490 },
    { name: 'Sun', income: 950, expense: 850 },
]

const monthlyData = [
    { name: 'Jan', income: 6500, expense: 4500 },
    { name: 'Feb', income: 7200, expense: 5200 },
    { name: 'Mar', income: 5800, expense: 3800 },
    { name: 'Apr', income: 8100, expense: 6100 },
    { name: 'May', income: 6900, expense: 4900 },
    { name: 'Jun', income: 7500, expense: 5500 },
    { name: 'Jul', income: 6200, expense: 4200 },
    { name: 'Aug', income: 7800, expense: 5800 },
    { name: 'Sep', income: 6600, expense: 4600 },
    { name: 'Oct', income: 7300, expense: 5300 },
    { name: 'Nov', income: 8400, expense: 6400 },
    { name: 'Dec', income: 9200, expense: 7200 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        const income = data.income || 0
        const expense = data.expense || 0
        const diff = income - expense
        const isPositive = diff >= 0

        return (
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-2xl min-w-[180px] backdrop-blur-md bg-opacity-95">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{label}</p>

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-gray-400">Income</span>
                        </div>
                        <span className="text-xs font-bold text-white">Rp {income.toLocaleString('id-ID')},000</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-[10px] font-bold text-gray-400">Expense</span>
                        </div>
                        <span className="text-xs font-bold text-white">Rp {expense.toLocaleString('id-ID')},000</span>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-800 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Savings Gap</span>
                        <span className={cn(
                            "text-xs font-black",
                            isPositive ? "text-emerald-400" : "text-rose-400"
                        )}>
                            {isPositive ? "+" : ""}
                            Rp {diff.toLocaleString('id-ID')},000
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardOverview() {
    const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly')
    const chartData = chartView === 'weekly' ? weeklyData : monthlyData
    const targetLimit = chartView === 'weekly' ? 700 : 5000

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [goals, setGoals] = useState<Goal[]>([
        { id: '1', title: "Trip to Bali", targetAmount: 5000000, currentAmount: 3500000, deadline: "2026-06-15", color: "bg-blue-600" },
        { id: '2', title: "New MacBook Pro", targetAmount: 25000000, currentAmount: 8500000, deadline: "2026-12-25", color: "bg-blue-600" }
    ])

    const formatIndoDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    const calculateTimeLeft = (deadlineStr: string) => {
        try {
            const now = new Date()
            const deadline = new Date(deadlineStr)
            const diffTime = deadline.getTime() - now.getTime()

            if (diffTime < 0) return "Terminated"

            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays < 30) return `${diffDays} days left`

            const diffMonths = Math.ceil(diffDays / 30)
            return `${diffMonths} months left`
        } catch {
            return "No deadline"
        }
    }

    const stats = [
        {
            label: "Financial Score",
            amount: "85/100",
            subLabel: "Status: Excellent",
            trend: "+2.4%",
            up: true,
            icon: Zap,
            color: "text-blue-600 bg-blue-50"
        },
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
            label: "Income",
            amount: "Rp 8,200,000",
            subLabel: "Total earned",
            trend: "+8.2%",
            up: true,
            icon: TrendingUp,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Expenses",
            amount: "Rp 3,450,000",
            subLabel: "This month",
            trend: "-2.4%",
            up: false,
            icon: TrendingDown,
            color: "text-blue-600 bg-blue-50"
        },
    ]

    const transactions = [
        { date: "Feb 18, 2026", desc: "Starbucks Coffee", cat: "Food & Drinks", amount: "-Rp 55.000", isPositive: false, type: 'food' },
        { date: "Feb 17, 2026", desc: "Freelance Payment", cat: "Income", amount: "+Rp 2.500.000", isPositive: true, type: 'income' },
        { date: "Feb 17, 2026", desc: "Indomaret Plus", cat: "Shopping", amount: "-Rp 120.000", isPositive: false, type: 'shopping' },
        { date: "Feb 16, 2026", desc: "Spotify Premium", cat: "Entertainment", amount: "-Rp 54.990", isPositive: false, type: 'entertainment' },
        { date: "Feb 15, 2026", desc: "ATM Withdrawal", cat: "Cash", amount: "-Rp 500.000", isPositive: false, type: 'transfer' },
        { date: "Feb 14, 2026", desc: "Shell V-Power", cat: "Transport", amount: "-Rp 150.000", isPositive: false, type: 'transport' },
    ]

    const categoriesData = [
        { name: "Food & Drinks", value: 1530000, percent: 45, color: "#3b82f6", icon: UtensilsCrossed },
        { name: "Entertainment", value: 850000, percent: 25, color: "#a855f7", icon: Gamepad2 },
        { name: "Transport", value: 680000, percent: 20, color: "#f97316", icon: Car },
        { name: "Shopping", value: 300000, percent: 8, color: "#ec4899", icon: ShoppingBag },
        { name: "Others", value: 70000, percent: 2, color: "#94a3b8", icon: MoreHorizontal },
    ]


    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Financial Calendar Modal */}
            <FinancialCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />

            {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h2>
                    <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Welcome back! Here's what's happening with your money today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        suppressHydrationWarning={true}
                        onClick={() => setIsCalendarOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 group"
                    >
                        <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Financial Calendar</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const isSpecial = stat.label === "Financial Score"
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "rounded-3xl border shadow-sm transition-all group relative overflow-hidden flex flex-col justify-start gap-5 min-h-[110px]",
                                isSpecial
                                    ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-400/20 p-4 @md:p-5 shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1"
                                    : "bg-white p-4 @md:p-5 border-gray-100 hover:shadow-xl hover:shadow-blue-500/5"
                            )}
                        >
                            {/* Decorative Background Elements */}
                            {isSpecial ? (
                                <>
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
                                </>
                            ) : (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform"></div>
                            )}

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-3 @md:gap-4">
                                    <div className={cn(
                                        "w-10 h-10 @md:w-12 @md:h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                                        isSpecial ? "bg-white/20 text-white backdrop-blur-md" : stat.color
                                    )}>
                                        <stat.icon className="w-5 h-5 @md:w-5 @md:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn("text-[9px] @md:text-[10px] font-bold uppercase tracking-widest truncate", isSpecial ? "text-blue-100/80" : "text-gray-500")}>
                                            {stat.label}
                                        </p>
                                        <h3 className={cn("text-lg @md:text-xl font-bold tracking-tight mt-0.5 whitespace-nowrap", isSpecial ? "text-white" : "text-gray-900")}>
                                            {stat.amount}
                                        </h3>
                                    </div>
                                </div>

                            </div>

                            <div className="relative z-10 mt-1">
                                <div className="flex items-center justify-between">
                                    <span className={cn("text-[9px] @md:text-[11px] font-bold truncate", isSpecial ? "text-blue-100/70" : "text-gray-400")}>
                                        {stat.subLabel}
                                    </span>
                                    {isSpecial ? (
                                        <div className="flex items-center gap-1 text-[9px] @md:text-[10px] font-bold cursor-pointer transition-all hover:translate-x-0.5 text-white/80 hover:text-white" suppressHydrationWarning={true}>
                                            View Details <ChevronRight className="w-2.5 h-2.5" />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors w-fit shrink-0",
                                            stat.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                        )}>
                                            {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
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
                        <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-none">Spending Analytics</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1.5">
                                    {chartView === 'weekly' ? 'Weekly expenses trend' : 'Monthly expenses trend'}
                                </p>
                            </div>
                            <div className="flex bg-gray-50 p-1 rounded-xl w-full @md:w-auto">
                                <button
                                    onClick={() => setChartView('weekly')}
                                    suppressHydrationWarning={true}
                                    className={cn(
                                        "flex-1 @md:flex-none px-4 py-2 text-[10px] font-bold rounded-lg transition-all",
                                        chartView === 'weekly' ? "text-blue-600 bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setChartView('monthly')}
                                    suppressHydrationWarning={true}
                                    className={cn(
                                        "flex-1 @md:flex-none px-4 py-2 text-[10px] font-bold rounded-lg transition-all",
                                        chartView === 'monthly' ? "text-blue-600 bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>

                        <div className="h-[280px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.3} />
                                        </linearGradient>
                                        <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        content={<CustomTooltip />}
                                    />
                                    <ReferenceLine
                                        y={targetLimit}
                                        stroke="#10b981"
                                        strokeDasharray="4 4"
                                        label={{
                                            position: 'right',
                                            value: 'Budget Limit',
                                            fill: '#10b981',
                                            fontSize: 9,
                                            fontWeight: 700,
                                            dx: -35
                                        }}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        radius={[6, 6, 0, 0]}
                                        barSize={chartView === 'weekly' ? 32 : 24}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.expense > targetLimit ? "url(#warningGradient)" : "url(#barGradient)"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* AI Insight Text */}
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-blue-900 leading-tight">Mindy's Logic Insight</p>
                                    <p className="text-[10px] font-medium text-blue-700/80 mt-1 leading-relaxed">
                                        {chartView === 'weekly'
                                            ? "Your spending increased by 18% compared to last week. Try to reduce your 'Entertainment' expenses to stay within your budget limit."
                                            : "You've exceeded your budget cap in 4 out of 12 months this year. However, your Income-to-Savings ratio remains healthy at 24%."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transaction List */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-6">
                        <div className="@md:p-8 p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-gray-900">Recent Transactions</h3>
                                <p className="text-xs text-gray-500 font-semibold tracking-wide">Last activities this week</p>
                            </div>
                            <button
                                suppressHydrationWarning={true}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1 group"
                            >
                                <span className="hidden @sm:inline">View All</span> <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">
                                {/* Table Header */}
                                <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr] px-8 py-4 bg-gray-50/50 border-b border-gray-50">
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Transaction</span>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Category</span>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Date</span>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-right">Amount</span>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {transactions.map((tx, i) => {
                                        // Find matching category style
                                        const catStyle = categoriesData.find(c => c.name === tx.cat) ||
                                            (tx.isPositive ? { color: "#10b981", icon: Wallet } : { color: "#94a3b8", icon: MoreHorizontal });

                                        const Icon = catStyle.icon;

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + (i * 0.05) }}
                                                className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr] items-center px-8 py-5 hover:bg-gray-50/80 transition-all group cursor-pointer active:scale-[0.99]"
                                                onClick={() => {/* Open Detail Modal logic will go here */ }}
                                            >
                                                {/* Column 1: Transaction */}
                                                <div className="flex items-center gap-4">
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 ">{tx.desc}</h4>
                                                    </div>
                                                </div>

                                                {/* Column 2: Category */}
                                                <div className="flex justify-start">
                                                    <span
                                                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest border border-current/10"
                                                        style={{ backgroundColor: `${catStyle.color}15`, color: catStyle.color }}
                                                    >
                                                        {tx.cat}
                                                    </span>
                                                </div>

                                                {/* Column 3: Date */}
                                                <div className="flex justify-start">
                                                    <span className="text-[11px] font-bold text-gray-400 tracking-tight">{tx.date}</span>
                                                </div>

                                                {/* Column 4: Amount */}
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "text-sm font-bold tracking-tight",
                                                        tx.isPositive ? "text-emerald-600" : "text-rose-600"
                                                    )}>
                                                        {tx.amount}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Analytics & Planning */}
                <div className="space-y-8">
                    {/* Top Categories Breakdown */}
                    <div className="bg-white @md:p-8 p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-none">Top Categories</h3>
                                <p className="text-xs font-semibold text-gray-500 tracking-wide mt-1  w-fit">Monthly spending</p>
                            </div>
                            <button
                                suppressHydrationWarning={true}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-1 group"
                            >
                                Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="relative flex justify-center py-2">
                            <div className="w-32 h-32 @md:w-48 @md:h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoriesData}
                                            innerRadius={"68%"}
                                            outerRadius="100%"
                                            paddingAngle={4}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={450}
                                        >
                                            {categoriesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[8px] @md:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Total Spent</span>
                                <span className="text-lg @md:text-2xl font-black text-gray-900 tracking-tight">Rp 3.4M</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {categoriesData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform")} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[11px] font-black text-gray-800 block truncate">{item.name}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Rp {(item.value / 1000).toLocaleString('id-ID')}k</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-black text-gray-900">{item.percent}%</span>
                                        <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Goal Spotlight */}
                    <div className="bg-white @md:p-8 p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all min-h-[395px]">
                        <div className="flex items-center justify-between mb-9">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Goal Spotlight</h3>
                                <p className="text-xs font-semibold text-gray-500 tracking-wide mt-1  w-fit">Fueling your future</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsGoalModalOpen(true)}
                                    suppressHydrationWarning={true}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">View All</span>
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {goals.slice(0, 2).map((goal) => {
                                const progress = (goal.currentAmount / goal.targetAmount) * 100
                                const remaining = goal.targetAmount - goal.currentAmount

                                const formatJt = (val: number) => {
                                    return (val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'
                                }

                                return (
                                    <motion.div
                                        key={goal.id}
                                        whileHover={{ y: -1, scale: 1.002 }}
                                        className="relative group p-4 rounded-[20px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer overflow-hidden"
                                        onClick={() => setIsGoalModalOpen(true)}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-1.5">
                                                    <h4 className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase leading-none">{goal.title}</h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-100 rounded shadow-sm">
                                                            <Calendar className="w-2 h-2 text-gray-400" />
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider" suppressHydrationWarning={true}>{formatIndoDate(goal.deadline)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100/50">
                                                            <Clock className="w-2 h-2 text-blue-500" />
                                                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-wider" suppressHydrationWarning={true}>{calculateTimeLeft(goal.deadline)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 mt-1">

                                                    <p className="text-[11px] font-bold text-gray-900 whitespace-nowrap leading-none">
                                                        Rp {formatJt(goal.currentAmount)}
                                                        <span className="text-gray-300 mx-0.5">/</span>
                                                        <span className="text-gray-400">{formatJt(goal.targetAmount)}</span>
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden p-[1px] mb-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className={cn("h-full rounded-full shadow relative", goal.color)}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                                </motion.div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn("w-1 h-1 rounded-full shadow-sm", goal.color)}></div>
                                                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{Math.round(progress)}% SAVED</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-black">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Need {formatJt(remaining)} more</span>
                                                    <ChevronRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {goals.length === 0 && (
                            <div className="py-14 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Target className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No goals set</p>
                                <button
                                    onClick={() => setIsGoalModalOpen(true)}
                                    className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                >
                                    Create one now
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {/* Goals Management Modal */}
            <GoalsManagementModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                goals={goals}
                onUpdateGoals={setGoals}
            />
        </div>
    )
}
