"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import {
    TrendingUp,
    TrendingDown,
    Target,
    Sparkles,
    AlertTriangle,
    Coffee,
    Gamepad2,
    Car,
    BarChart3,
    Play,
    ChevronRight,
    Loader2,
    Info,
    ShieldAlert,
    Zap,
    DollarSign,
    Wallet,
    GraduationCap,
    Home,
    Bike,
    PiggyBank,
    Film,
    ShoppingBag,
    ArrowRight,
    CheckCircle2,
    Clock,
    Lock,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { getSimulationData, type SimulationData } from "@/app/actions/simulation"

// ─── TYPES ────────────────────────────────────────────────────────

type Tab = "future-me" | "trade-off" | "timeline"

type LifestyleItem = {
    id: string
    label: string
    icon: any
    emoji: string
    costPerMonth: number
    description: string
    concept: string
    enabled: boolean
}

type Milestone = {
    id: string
    label: string
    emoji: string
    amount: number
    year: number | null
    reached: boolean
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const goalPresets = [
    { label: "Emergency Fund", icon: ShieldAlert, value: "emergency", amount: 15000000 },
    { label: "Motorcycle DP", icon: Bike, value: "motor", amount: 8000000 },
    { label: "House DP", icon: Home, value: "house", amount: 50000000 },
    { label: "Routine Investment", icon: TrendingUp, value: "invest", amount: 20000000 },
    { label: "Education", icon: GraduationCap, value: "education", amount: 30000000 },
]

const defaultLifestyleItems: LifestyleItem[] = [
    { id: "coffee", label: "Daily Coffee", icon: Coffee, emoji: "☕", costPerMonth: 750000, description: "Rp 25.000/day × 30 days", concept: "Opportunity Cost", enabled: false },
    { id: "gadget", label: "Gadget Upgrade", icon: Gamepad2, emoji: "🎮", costPerMonth: 416667, description: "Rp 5.000.000/year", concept: "Depreciation Cost", enabled: false },
    { id: "motor", label: "Motorcycle Credit", icon: Car, emoji: "🚗", costPerMonth: 800000, description: "Rp 800.000/mo installment", concept: "Debt Liability", enabled: false },
    { id: "invest", label: "Invest 500k/mo", icon: TrendingUp, emoji: "📈", costPerMonth: -500000, description: "Return ~8%/year", concept: "Compound Growth", enabled: false },
    { id: "eating", label: "Eat Out 3x/week", icon: ShoppingBag, emoji: "🍔", costPerMonth: 480000, description: "Rp 40.000 × 12x/mo", concept: "Lifestyle Inflation", enabled: false },
    { id: "streaming", label: "Streaming Subs", icon: Film, emoji: "🎬", costPerMonth: 150000, description: "Netflix + Spotify + etc", concept: "Recurring Cost", enabled: false },
]

const formatRp = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 })
        .format(Math.round(val))
        .replace("Rp", "Rp ")

const formatRpCompact = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}B`
    if (Math.abs(val) >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}M`
    if (Math.abs(val) >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}K`
    return `Rp ${val}`
}

// ─── CURRENCY INPUT ───────────────────────────────────────────────

const formatNumberDots = (val: number) => val.toLocaleString("id-ID")
const parseNumberDots = (str: string) => Number(str.replace(/\./g, "").replace(/[^0-9]/g, "")) || 0

function CurrencyInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    const [displayVal, setDisplayVal] = useState(formatNumberDots(value))

    useEffect(() => {
        setDisplayVal(formatNumberDots(value))
    }, [value])

    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{label}</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={displayVal}
                    onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, "")
                        const num = Number(raw) || 0
                        setDisplayVal(formatNumberDots(num))
                        onChange(num)
                    }}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>
        </div>
    )
}

// ─── ECONOMIC CONCEPT BADGE ───────────────────────────────────────

function ConceptBadge({ label }: { label: string }) {
    const colors: Record<string, string> = {
        "Opportunity Cost": "bg-amber-50 text-amber-700 border-amber-200",
        "Compound Growth": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Risk Exposure": "bg-red-50 text-red-700 border-red-200",
        "Savings Ratio": "bg-blue-50 text-blue-700 border-blue-200",
        "Depreciation Cost": "bg-orange-50 text-orange-700 border-orange-200",
        "Debt Liability": "bg-rose-50 text-rose-700 border-rose-200",
        "Lifestyle Inflation": "bg-purple-50 text-purple-700 border-purple-200",
        "Recurring Cost": "bg-slate-100 text-slate-600 border-slate-200",
        "Net Worth Projection": "bg-indigo-50 text-indigo-700 border-indigo-200",
    }
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[label] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
            <GraduationCap className="w-3 h-3" />
            {label}
        </span>
    )
}

// ─── REALITY CHECK BANNER ─────────────────────────────────────────

function RealityCheck({ messages }: { messages: string[] }) {
    if (messages.length === 0) return null
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
        >
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Reality Check</p>
                {messages.map((msg, i) => (
                    <p key={i} className="text-[11px] text-amber-700 leading-relaxed">{msg}</p>
                ))}
            </div>
        </motion.div>
    )
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
        const duration = 1200
        const steps = 40
        const increment = value / steps
        let current = 0
        let step = 0
        const timer = setInterval(() => {
            step++
            current += increment
            if (step >= steps) {
                setDisplay(value)
                clearInterval(timer)
            } else {
                setDisplay(Math.round(current))
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [value])
    return <span>{prefix}{formatRp(display)}</span>
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xl">
            <p className="text-xs font-semibold text-slate-800 mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} className="text-xs text-slate-600">
                    <span className="font-semibold" style={{ color: p.color }}>{p.name}:</span> {formatRp(p.value)}
                </p>
            ))}
        </div>
    )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────

export default function SimulationPage() {
    const [tab, setTab] = useState<Tab>("future-me")
    const [loading, setLoading] = useState(true)
    const [simData, setSimData] = useState<SimulationData | null>(null)

    // Future Me state
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [targetIncome, setTargetIncome] = useState(0)
    const [selectedGoal, setSelectedGoal] = useState("emergency")
    const [projectionYears, setProjectionYears] = useState(5)
    const [showProjection, setShowProjection] = useState(false)

    // Trade-off state
    const [lifestyleItems, setLifestyleItems] = useState<LifestyleItem[]>(defaultLifestyleItems)

    useEffect(() => {
        async function load() {
            const { data } = await getSimulationData()
            if (data) {
                setSimData(data)
                setIncome(data.monthlyIncome || 3000000)
                setExpense(data.monthlyExpense || 2000000)
                setTargetIncome(Math.round((data.monthlyIncome || 3000000) * 1.5))
            }
            setLoading(false)
        }
        load()
    }, [])

    // ─── FUTURE ME CALCULATIONS ─────────────────────────────────

    const futureProjection = useMemo(() => {
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0
        const annualGrowthRate = 0.06 // 6% annual return on savings
        const currentBalance = simData?.totalBalance || 0

        // Progressive income growth: from current income → target income over projection period
        const incomeGrowthPerYear = projectionYears > 0 ? (targetIncome - income) / projectionYears : 0
        const useProgressiveIncome = targetIncome > income

        const yearlyData = []
        let netWorth = currentBalance
        const currentYear = new Date().getFullYear()

        for (let y = 0; y <= projectionYears; y++) {
            // Income grows progressively each year toward target
            const yearlyIncome = useProgressiveIncome
                ? Math.round(income + incomeGrowthPerYear * y)
                : income
            const yearlySavings = yearlyIncome - expense

            yearlyData.push({
                year: `${currentYear + y}`,
                netWorth: Math.round(netWorth),
                income: yearlyIncome,
                savings: Math.round(yearlySavings),
            })

            if (y < projectionYears) {
                netWorth = (netWorth + yearlySavings * 12) * (1 + annualGrowthRate)
            }
        }

        const finalNetWorth = yearlyData[yearlyData.length - 1]?.netWorth || 0
        const finalIncome = yearlyData[yearlyData.length - 1]?.income || income
        const finalSavingsRate = finalIncome > 0 ? ((finalIncome - expense) / finalIncome) * 100 : 0
        const goalAmount = goalPresets.find(g => g.value === selectedGoal)?.amount || 15000000
        const goalReachable = finalNetWorth >= goalAmount

        // Status determination — based on current savings rate
        let status: "stable" | "moderate" | "risk" = "stable"
        let statusLabel = "Financially Stable"
        let statusColor = "text-emerald-600"
        let statusBg = "bg-emerald-50 border-emerald-200"
        let statusEmoji = "🟢"

        if (savingsRate < 10) {
            status = "risk"
            statusLabel = "High Risk Spender"
            statusColor = "text-red-600"
            statusBg = "bg-red-50 border-red-200"
            statusEmoji = "🔴"
        } else if (savingsRate < 20) {
            status = "moderate"
            statusLabel = "Moderate Growth"
            statusColor = "text-amber-600"
            statusBg = "bg-amber-50 border-amber-200"
            statusEmoji = "🟡"
        }

        // Reality check messages
        const realityChecks: string[] = []
        if (savingsRate > 50) realityChecks.push("Projection assumes very high savings rate. Ensure expenses are realistic and account for unexpected costs.")
        if (income > 0 && targetIncome > income * 3) realityChecks.push("Target income is 3x+ current income. This requires significant career growth or side income.")
        if (useProgressiveIncome) realityChecks.push(`Projection assumes income grows gradually from ${formatRp(income)} to ${formatRp(targetIncome)} over ${projectionYears} years. Actual career growth may vary.`)
        realityChecks.push("Real-world uncertainty, inflation, and emergencies are not included in this projection.")

        // One-line insight — now includes income growth info
        const insight = useProgressiveIncome
            ? `With income growing from ${formatRp(income)} → ${formatRp(targetIncome)}/mo, you will accumulate ${formatRp(finalNetWorth)} in ${projectionYears} years. Savings rate improves from ${savingsRate.toFixed(0)}% to ${finalSavingsRate.toFixed(0)}%.`
            : `At current behavior, you will accumulate ${formatRp(finalNetWorth)} in ${projectionYears} years with a ${savingsRate.toFixed(0)}% savings rate.`

        return { yearlyData, finalNetWorth, savingsRate, monthlySavings: income - expense, status, statusLabel, statusColor, statusBg, statusEmoji, goalReachable, goalAmount, realityChecks, insight }
    }, [income, expense, targetIncome, selectedGoal, projectionYears, simData])

    // ─── TRADE-OFF CALCULATIONS ─────────────────────────────────

    const tradeOffResult = useMemo(() => {
        const baseMonthlySavings = income - expense
        let adjustedSavings = baseMonthlySavings

        lifestyleItems.forEach(item => {
            if (item.enabled) {
                adjustedSavings -= item.costPerMonth // negative cost = savings (invest)
            }
        })

        const years = 5
        const growthRate = 0.06
        const currentBalance = simData?.totalBalance || 0

        // Without lifestyle changes
        let withoutNW = currentBalance
        for (let y = 0; y < years; y++) {
            withoutNW = (withoutNW + baseMonthlySavings * 12) * (1 + growthRate)
        }

        // With lifestyle changes
        let withNW = currentBalance
        for (let y = 0; y < years; y++) {
            withNW = (withNW + adjustedSavings * 12) * (1 + growthRate)
        }

        const difference = withNW - withoutNW
        const totalEnabledCost = lifestyleItems
            .filter(i => i.enabled)
            .reduce((sum, i) => sum + i.costPerMonth, 0)

        const comparisonData = [
            { name: "Without Lifestyle", netWorth: Math.round(withoutNW), fill: "#3b82f6" },
            { name: "With Lifestyle", netWorth: Math.round(withNW), fill: difference >= 0 ? "#10b981" : "#ef4444" },
        ]

        const realityChecks: string[] = []
        if (adjustedSavings < 0) realityChecks.push("Warning: Your expenses exceed income with these lifestyle choices. This is unsustainable long-term.")
        if (totalEnabledCost > baseMonthlySavings * 0.5) realityChecks.push("More than 50% of your savings are consumed by lifestyle choices. Consider prioritizing needs over wants.")

        return { withoutNW, withNW, difference, adjustedSavings, comparisonData, totalEnabledCost, realityChecks }
    }, [income, expense, lifestyleItems, simData])

    // ─── TIMELINE MILESTONES ────────────────────────────────────

    const timelineMilestones = useMemo(() => {
        const monthlySavings = income - expense
        const adjustedSavings = monthlySavings - lifestyleItems.filter(i => i.enabled).reduce((sum, i) => sum + i.costPerMonth, 0)
        const effectiveSavings = Math.max(0, adjustedSavings)
        const currentBalance = simData?.totalBalance || 0
        const currentYear = new Date().getFullYear()

        const milestones: Milestone[] = [
            { id: "emergency", label: "Emergency Fund Reached", emoji: "🛡️", amount: 15000000, year: null, reached: false },
            { id: "dp-motor", label: "Can Afford Motorcycle DP", emoji: "🏍️", amount: 8000000, year: null, reached: false },
            { id: "invest", label: "Stable Routine Investment", emoji: "💰", amount: 20000000, year: null, reached: false },
            { id: "dp-rumah", label: "House DP", emoji: "🏠", amount: 50000000, year: null, reached: false },
        ]

        milestones.forEach(m => {
            if (currentBalance >= m.amount) {
                m.year = currentYear
                m.reached = true
            } else if (effectiveSavings > 0) {
                const monthsNeeded = Math.ceil((m.amount - currentBalance) / effectiveSavings)
                const yearsNeeded = monthsNeeded / 12
                if (yearsNeeded <= 10) {
                    m.year = currentYear + Math.ceil(yearsNeeded)
                    m.reached = false
                }
            }
        })

        return milestones
    }, [income, expense, lifestyleItems, simData])

    // ─── TOGGLE LIFESTYLE ───────────────────────────────────────

    const toggleLifestyle = (id: string) => {
        setLifestyleItems(prev => prev.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        ))
    }

    // ─── LOADING STATE ──────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    // ─── RENDER ─────────────────────────────────────────────────

    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col @md/main:flex-row @md/main:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md/main:text-3xl font-semibold text-gray-900 tracking-tight">Future Growth Simulation</h2>
                    <p className="text-gray-500 text-xs @md/main:text-sm mt-1 font-medium italic">Simulate your financial future based on real data.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <ConceptBadge label="Compound Growth" />
                    <ConceptBadge label="Opportunity Cost" />
                    <ConceptBadge label="Risk Exposure" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 @sm/main:grid-cols-2 @lg/main:grid-cols-4 gap-4">
                {[
                    { label: "Income/mo", value: formatRp(income), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Expense/mo", value: formatRp(expense), icon: Wallet, color: "text-red-500", bg: "bg-red-50" },
                    { label: "Savings Rate", value: `${futureProjection.savingsRate.toFixed(1)}%`, icon: PiggyBank, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Balance", value: formatRp(simData?.totalBalance || 0), icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-medium">{card.label}</p>
                                <p className={`text-lg font-semibold ${card.color}`}>{card.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 @sm/main:gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
                {([
                    { key: "future-me" as Tab, label: "Future Me", icon: Sparkles },
                    { key: "trade-off" as Tab, label: "Trade-Off", icon: Zap },
                    { key: "timeline" as Tab, label: "Timeline", icon: Clock },
                ]).map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap px-1 ${tab === t.key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ━━━ TAB 1: FUTURE ME ━━━ */}
            <AnimatePresence mode="wait">
                {tab === "future-me" && (
                    <motion.div
                        key="future-me"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-6"
                    >
                        {/* Input Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Future Me {new Date().getFullYear() + projectionYears}</h3>
                                    <p className="text-xs text-slate-400">Fill in your data to see your future projection</p>
                                </div>
                                <div className="ml-auto">
                                    <ConceptBadge label="Net Worth Projection" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-4 mb-6">
                                <CurrencyInput label="Monthly Income" value={income} onChange={setIncome} />
                                <CurrencyInput label="Target Income" value={targetIncome} onChange={setTargetIncome} />
                                <CurrencyInput label="Average Expense" value={expense} onChange={setExpense} />
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Projection Period</label>
                                    <select
                                        value={projectionYears}
                                        onChange={e => setProjectionYears(Number(e.target.value))}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value={3}>3 Years</option>
                                        <option value={5}>5 Years</option>
                                        <option value={10}>10 Years</option>
                                    </select>
                                </div>
                            </div>

                            {/* Goal Selection */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-slate-500 mb-3 block">Financial Target</label>
                                <div className="grid grid-cols-2 @md/main:grid-cols-5 gap-2">
                                    {goalPresets.map(goal => (
                                        <button
                                            key={goal.value}
                                            onClick={() => setSelectedGoal(goal.value)}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${selectedGoal === goal.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-100 hover:border-slate-200 text-slate-600"
                                                }`}
                                        >
                                            <goal.icon className="w-5 h-5 mx-auto mb-1" />
                                            <p className="text-[10px] font-semibold">{goal.label}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">{formatRpCompact(goal.amount)}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowProjection(true)}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                            >
                                <Play className="w-4 h-4" />
                                Generate Projection
                            </button>
                        </div>

                        {/* Projection Results */}
                        <AnimatePresence>
                            {showProjection && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Status Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className={`p-6 rounded-2xl border ${futureProjection.statusBg}`}
                                    >
                                        <div className="flex flex-col @sm/main:flex-row items-start @sm/main:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{futureProjection.statusEmoji}</div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500">Future You:</p>
                                                    <h3 className={`text-xl font-semibold ${futureProjection.statusColor}`}>{futureProjection.statusLabel}</h3>
                                                    <ConceptBadge label="Savings Ratio" />
                                                </div>
                                            </div>
                                            <div className="text-left @sm/main:text-right">
                                                <p className="text-xs text-slate-500">Projected Net Worth</p>
                                                <p className={`text-2xl font-semibold ${futureProjection.statusColor}`}>
                                                    <AnimatedNumber value={futureProjection.finalNetWorth} />
                                                </p>
                                            </div>
                                        </div>

                                        {/* One-Line Insight */}
                                        <div className="mt-4 pt-4 border-t border-slate-200/50">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    {futureProjection.insight}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Goal Reachability */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className={`p-4 rounded-xl border flex items-center gap-3 ${futureProjection.goalReachable
                                            ? "bg-emerald-50 border-emerald-200"
                                            : "bg-red-50 border-red-200"
                                            }`}
                                    >
                                        {futureProjection.goalReachable
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            : <AlertTriangle className="w-5 h-5 text-red-600" />
                                        }
                                        <p className="text-xs font-medium">
                                            {futureProjection.goalReachable
                                                ? `✅ Target "${goalPresets.find(g => g.value === selectedGoal)?.label}" (${formatRp(futureProjection.goalAmount)}) reached in ${projectionYears} years!`
                                                : `❌ Target "${goalPresets.find(g => g.value === selectedGoal)?.label}" (${formatRp(futureProjection.goalAmount)}) not reached. Consider increasing your savings rate.`
                                            }
                                        </p>
                                    </motion.div>

                                    {/* Growth Chart */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">📈 Growth Path</h4>
                                                <p className="text-[11px] text-slate-400">Net worth growth projection</p>
                                            </div>
                                            <ConceptBadge label="Compound Growth" />
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={futureProjection.yearlyData}>
                                                    <defs>
                                                        <linearGradient id="colorNW" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => formatRpCompact(v)} width={70} />
                                                    <Tooltip content={<ChartTooltip />} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="netWorth"
                                                        name="Net Worth"
                                                        stroke="#3b82f6"
                                                        strokeWidth={2.5}
                                                        fill="url(#colorNW)"
                                                        animationDuration={1500}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>

                                    {/* Reality Check */}
                                    <RealityCheck messages={futureProjection.realityChecks} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ━━━ TAB 2: TRADE-OFF SIMULATOR ━━━ */}
                {tab === "trade-off" && (
                    <motion.div
                        key="trade-off"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Lifestyle Trade-Off Simulator</h3>
                                    <p className="text-xs text-slate-400">Toggle habits and see their impact on your future</p>
                                </div>
                                <div className="ml-auto">
                                    <ConceptBadge label="Opportunity Cost" />
                                </div>
                            </div>
                        </div>

                        {/* Toggle Cards */}
                        <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-3">
                            {lifestyleItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    onClick={() => toggleLifestyle(item.id)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98] ${item.enabled
                                        ? item.costPerMonth < 0
                                            ? "border-emerald-400 bg-emerald-50/50 shadow-md shadow-emerald-100"
                                            : "border-red-300 bg-red-50/50 shadow-md shadow-red-100"
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`text-2xl`}>{item.emoji}</div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="font-semibold text-slate-800 text-sm">{item.label}</h4>
                                                    <ConceptBadge label={item.concept} />
                                                </div>
                                                <p className="text-[11px] text-slate-400">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-semibold ${item.costPerMonth < 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                {item.costPerMonth < 0 ? "+" : "-"}{formatRpCompact(Math.abs(item.costPerMonth))}/mo
                                            </span>
                                            <div className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${item.enabled
                                                ? item.costPerMonth < 0 ? "bg-emerald-500" : "bg-red-500"
                                                : "bg-slate-200"
                                                }`}>
                                                <motion.div
                                                    animate={{ x: item.enabled ? 20 : 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Impact Summary */}
                        <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                            >
                                <h4 className="font-semibold text-slate-800 text-sm mb-4">📊 5-Year Net Worth Comparison</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={tradeOffResult.comparisonData} barGap={12}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => formatRpCompact(v)} width={70} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="netWorth" name="Net Worth" radius={[8, 8, 0, 0]} barSize={60}>
                                                {tradeOffResult.comparisonData.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
                            >
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm mb-4">💡 Impact Analysis</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">Monthly Lifestyle Cost</span>
                                            <span className={`text-sm font-semibold ${tradeOffResult.totalEnabledCost > 0 ? "text-red-500" : tradeOffResult.totalEnabledCost < 0 ? "text-emerald-600" : "text-slate-400"}`}>
                                                {tradeOffResult.totalEnabledCost > 0 ? "-" : tradeOffResult.totalEnabledCost < 0 ? "+" : ""}{formatRp(Math.abs(tradeOffResult.totalEnabledCost))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">Remaining Savings/mo</span>
                                            <span className={`text-sm font-semibold ${tradeOffResult.adjustedSavings >= 0 ? "text-blue-600" : "text-red-500"}`}>
                                                {formatRp(tradeOffResult.adjustedSavings)}
                                            </span>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500 font-semibold">5-Year Impact</span>
                                            <span className={`text-lg font-semibold ${tradeOffResult.difference >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                {tradeOffResult.difference >= 0 ? "+" : ""}{formatRp(tradeOffResult.difference)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            {tradeOffResult.difference >= 0
                                                ? `This lifestyle choice adds ${formatRp(tradeOffResult.difference)} to your net worth in 5 years. Smart choice!`
                                                : `This lifestyle choice reduces your potential net worth by ${formatRp(Math.abs(tradeOffResult.difference))}. Consider the trade-off.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Reality Check */}
                        <RealityCheck messages={tradeOffResult.realityChecks} />
                    </motion.div>
                )}

                {/* ━━━ TAB 3: WEALTH TIMELINE ━━━ */}
                {tab === "timeline" && (
                    <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Wealth Timeline</h3>
                                    <p className="text-xs text-slate-400">When will your financial milestones be reached?</p>
                                </div>
                                <div className="ml-auto">
                                    <ConceptBadge label="Compound Growth" />
                                </div>
                            </div>
                        </div>

                        {/* Timeline Visual */}
                        <div className="bg-white p-6 @md/main:p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Horizontal Year Bar */}
                            <div className="relative mb-10">
                                <div className="flex items-center justify-between relative">
                                    {/* Track Line */}
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 rounded-full -translate-y-1/2" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -translate-y-1/2"
                                    />

                                    {/* Year Dots */}
                                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map((year, index) => (
                                        <motion.div
                                            key={year}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
                                            className="relative z-10 flex flex-col items-center"
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 ${index === 0
                                                ? "bg-blue-600 border-blue-600"
                                                : "bg-white border-slate-300"
                                                }`} />
                                            <span className={`text-[10px] font-semibold mt-2 ${index === 0 ? "text-blue-600" : "text-slate-400"}`}>
                                                {year}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Milestone Cards */}
                            <div className="grid grid-cols-1 @sm/main:grid-cols-2 gap-4">
                                {timelineMilestones.map((milestone, index) => {
                                    const isReached = milestone.reached
                                    const hasYear = milestone.year !== null
                                    const currentYear = new Date().getFullYear()
                                    const yearsAway = hasYear ? milestone.year! - currentYear : null

                                    return (
                                        <motion.div
                                            key={milestone.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.15 }}
                                            className={`p-5 rounded-2xl border-2 transition-all ${isReached
                                                ? "border-emerald-300 bg-emerald-50/50"
                                                : hasYear
                                                    ? "border-blue-200 bg-blue-50/30"
                                                    : "border-slate-100 bg-slate-50/50"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{milestone.emoji}</span>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800 text-sm">{milestone.label}</h4>
                                                        <p className="text-xs text-slate-400 font-medium">{formatRp(milestone.amount)}</p>
                                                    </div>
                                                </div>
                                                {isReached ? (
                                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">REACHED ✅</span>
                                                ) : hasYear ? (
                                                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">{milestone.year}</span>
                                                ) : (
                                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1">
                                                        <Lock className="w-3 h-3" /> 10+ YEARS
                                                    </span>
                                                )}
                                            </div>

                                            {/* Progress indicator */}
                                            {hasYear && !isReached && (
                                                <div>
                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, Math.max(5, (1 / (yearsAway || 1)) * 100))}%` }}
                                                            transition={{ delay: 0.6 + index * 0.15, duration: 0.8 }}
                                                            className="bg-blue-500 h-1.5 rounded-full"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1">
                                                        ~{yearsAway} years left with current savings rate
                                                    </p>
                                                </div>
                                            )}
                                            {isReached && (
                                                <p className="text-[10px] text-emerald-600 font-medium">
                                                    🎉 This milestone has been reached based on current balance!
                                                </p>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Timeline Insight */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
                            >
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                                        {timelineMilestones.filter(m => m.year !== null).length === 0
                                            ? "Increase your savings rate to start reaching your financial milestones. Use the Trade-Off Simulator to see the impact of changing habits."
                                            : `With your current savings rate, ${timelineMilestones.filter(m => m.reached).length} milestone(s) are already reached and ${timelineMilestones.filter(m => m.year !== null && !m.reached).length} milestone(s) can be reached in ${Math.max(...timelineMilestones.filter(m => m.year !== null).map(m => m.year!)) - new Date().getFullYear()} years.`
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Reality Check */}
                        <RealityCheck messages={[
                            "Timeline milestones are calculated based on a constant savings rate. Changes in income or expenses will shift the timeline.",
                            "Does not account for inflation (~3-5%/year) which reduces purchasing power.",
                        ]} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
