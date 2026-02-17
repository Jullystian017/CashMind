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
    Filter
} from "lucide-react"

export default function DashboardOverview() {
    const stats = [
        {
            label: "Monthly Budget",
            amount: "$2,500",
            subLabel: "For November",
            trend: "-1.78%",
            up: false,
            icon: Target,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Total Spent",
            amount: "$330",
            subLabel: "of budget",
            trend: "+13%",
            up: true,
            icon: Wallet,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Remaining",
            amount: "$2,170",
            subLabel: "Still available",
            trend: "+4.68%",
            up: true,
            icon: Timer,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Income",
            amount: "$2,700",
            subLabel: "Total earned",
            trend: "+14%",
            up: true,
            icon: CircleDollarSign,
            color: "text-blue-600 bg-blue-50"
        },
    ]

    const transactions = [
        { date: "Jan 15, 2026", desc: "Client Payment - Project Alpha", cat: "Sales", amount: "+$5,000", status: "Completed", isPositive: true },
        { date: "Jan 14, 2026", desc: "Office Rent - January", cat: "Operating", amount: "-$2,500", status: "Completed", isPositive: false },
        { date: "Jan 14, 2026", desc: "Software Subscription", cat: "Technology", amount: "-$150", status: "Completed", isPositive: false },
        { date: "Jan 13, 2026", desc: "Marketing Campaign - Social", cat: "Services", amount: "+$3,200", status: "Pending", isPositive: true },
        { date: "Jan 12, 2026", desc: "Product Sales", cat: "Marketing", amount: "+$800", status: "Pending", isPositive: true },
    ]

    return (
        <div className="space-y-8" suppressHydrationWarning={true}>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">CashMind Report</h2>
                <p className="text-gray-500 text-sm mt-1 font-medium">Monitor your financial health and transaction history at a glance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-800 text-sm font-bold tracking-tight">{stat.label}</p>
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-800">{stat.amount}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-gray-400">{stat.subLabel}</span>
                            {stat.trend && (
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors",
                                    stat.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                )}>
                                    {stat.trend}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Chart Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Category Breakdown</h3>
                        <p className="text-xs text-gray-500 font-medium">Financial summary by category</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                            <span className="text-gray-400 uppercase tracking-wider">Income <span className="text-gray-900">$2400</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                            <span className="text-gray-400 uppercase tracking-wider">Expense <span className="text-gray-900">$1400</span></span>
                        </div>
                    </div>
                </div>

                {/* Mock Chart - Bar visual */}
                <div className="h-48 flex items-end justify-between gap-4 px-2 border-b border-gray-100 pb-2">
                    {["Sales", "Services", "Payroll", "Operating", "Training", "Marketing", "Maintenance", "Tech"].map((cat, i) => {
                        const heights = [60, 40, 55, 85, 45, 75, 50, 40]
                        return (
                            <div key={cat} className="flex-1 flex flex-col items-center group relative">
                                <div className="w-full max-w-[40px] flex flex-col items-center">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heights[i]}%` }}
                                        transition={{ delay: 0.5 + (i * 0.05) }}
                                        className="w-full bg-indigo-600 rounded-t-lg relative"
                                    >
                                        <div className="absolute inset-0 bg-indigo-200 opacity-40 rounded-t-lg -translate-y-1/2"></div>
                                    </motion.div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 mt-4 uppercase tracking-tighter truncate w-full text-center">
                                    {cat}
                                </span>

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 font-bold">
                                    ${heights[i] * 10} (+15%)
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Transaction Records */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-gray-800">Transaction Records</h3>
                        <p className="text-xs text-gray-500 font-semibold">Complete list of all financial transactions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-2xl text-xs font-semibold outline-none focus:bg-white focus:border-blue-100 transition-all w-48"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-semibold uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4">Description</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4">Amount</th>
                                <th className="px-8 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((tx, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.05) }}
                                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                >
                                    <td className="px-8 py-5 text-xs font-semibold text-gray-900">{tx.date}</td>
                                    <td className="px-8 py-5 text-xs font-semibold text-gray-500 group-hover:text-blue-600">{tx.desc}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                            {tx.cat}
                                        </span>
                                    </td>
                                    <td className={cn(
                                        "px-8 py-5 text-xs font-semibold",
                                        tx.isPositive ? "text-emerald-600" : "text-rose-500"
                                    )}>
                                        {tx.amount}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-wider",
                                            tx.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", tx.status === "Completed" ? "bg-emerald-600" : "bg-orange-600")}></div>
                                            {tx.status}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

