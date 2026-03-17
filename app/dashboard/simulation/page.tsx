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
import { useTranslation } from "@/lib/i18n/useTranslation"
import { formatRp } from "@/lib/utils"

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

// ─── UTILS ────────────────────────────────────────────────────────

const formatRpCompact = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}B`
    if (Math.abs(val) >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}M`
    if (Math.abs(val) >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}K`
    return `Rp ${val}`
}

// ─── CURRENCY INPUT ───────────────────────────────────────────────

const formatNumberDots = (val: number) => val.toLocaleString("id-ID")

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
    const { t } = useTranslation()
    const colors: Record<string, string> = {
        [t("concepts.opportunity")]: "bg-amber-50 text-amber-700 border-amber-200",
        [t("concepts.compound")]: "bg-emerald-50 text-emerald-700 border-emerald-200",
        [t("concepts.risk")]: "bg-red-50 text-red-700 border-red-200",
        [t("concepts.savings")]: "bg-blue-50 text-blue-700 border-blue-200",
        [t("concepts.depreciation")]: "bg-orange-50 text-orange-700 border-orange-200",
        [t("concepts.debt")]: "bg-rose-50 text-rose-700 border-rose-200",
        [t("concepts.lifestyle")]: "bg-purple-50 text-purple-700 border-purple-200",
        [t("concepts.recurring")]: "bg-slate-100 text-slate-600 border-slate-200",
        [t("concepts.networth")]: "bg-indigo-50 text-indigo-700 border-indigo-200",
        [t("concepts.compoundGrowth")]: "bg-cyan-50 text-cyan-700 border-cyan-200",
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
    const { t } = useTranslation()
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
                <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ {t("simulation.realityCheck")}</p>
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
    const { t, locale } = useTranslation()
    const [tab, setTab] = useState<Tab>("future-me")
    const [loading, setLoading] = useState(true)
    const [simData, setSimData] = useState<SimulationData | null>(null)

    const goalPresets = useMemo(() => [
        { label: t("simulation.goalPresets.emergency"), icon: ShieldAlert, value: "emergency", amount: 15000000 },
        { label: t("simulation.goalPresets.motor"), icon: Bike, value: "motor", amount: 8000000 },
        { label: t("simulation.goalPresets.house"), icon: Home, value: "house", amount: 50000000 },
        { label: t("simulation.goalPresets.invest"), icon: TrendingUp, value: "invest", amount: 20000000 },
        { label: t("simulation.goalPresets.education"), icon: GraduationCap, value: "education", amount: 30000000 },
    ], [t])

    const defaultLifestyleItems: LifestyleItem[] = useMemo(() => [
        { id: "coffee", label: t("simulation.lifestyles.coffee"), icon: Coffee, emoji: "☕", costPerMonth: 750000, description: t("simulation.lifestyles.coffee_desc"), concept: t("concepts.opportunity"), enabled: false },
        { id: "gadget", label: t("simulation.lifestyles.gadget"), icon: Gamepad2, emoji: "🎮", costPerMonth: 416667, description: t("simulation.lifestyles.gadget_desc"), concept: t("concepts.depreciation"), enabled: false },
        { id: "motor", label: t("simulation.lifestyles.motor"), icon: Car, emoji: "🚗", costPerMonth: 800000, description: t("simulation.lifestyles.motor_desc"), concept: t("concepts.debt"), enabled: false },
        { id: "invest", label: t("simulation.lifestyles.invest"), icon: TrendingUp, emoji: "📈", costPerMonth: -500000, description: t("simulation.lifestyles.invest_desc"), concept: t("concepts.compound"), enabled: false },
        { id: "eating", label: t("simulation.lifestyles.eating"), icon: ShoppingBag, emoji: "🍔", costPerMonth: 480000, description: t("simulation.lifestyles.eating_desc"), concept: t("concepts.lifestyle"), enabled: false },
        { id: "streaming", label: t("simulation.lifestyles.streaming"), icon: Film, emoji: "🎬", costPerMonth: 150000, description: t("simulation.lifestyles.streaming_desc"), concept: t("concepts.recurring"), enabled: false },
    ], [t])

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

        const incomeGrowthPerYear = projectionYears > 0 ? (targetIncome - income) / projectionYears : 0
        const useProgressiveIncome = targetIncome > income

        const yearlyData = []
        let netWorth = currentBalance
        const currentYear = new Date().getFullYear()

        for (let y = 0; y <= projectionYears; y++) {
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

        let status: "stable" | "moderate" | "risk" = "stable"
        let statusLabel = t("simulation.status.stable")
        let statusColor = "text-emerald-600"
        let statusBg = "bg-emerald-50 border-emerald-200"
        let statusEmoji = "🟢"

        if (savingsRate < 10) {
            status = "risk"
            statusLabel = t("simulation.status.risk")
            statusColor = "text-red-600"
            statusBg = "bg-red-50 border-red-200"
            statusEmoji = "🔴"
        } else if (savingsRate < 20) {
            status = "moderate"
            statusLabel = t("simulation.status.moderate")
            statusColor = "text-amber-600"
            statusBg = "bg-amber-50 border-amber-200"
            statusEmoji = "🟡"
        }

        const realityChecks: string[] = []
        if (savingsRate > 50) realityChecks.push(t("simulation.realityCheckHighSavings"))
        if (income > 0 && targetIncome > income * 3) realityChecks.push(t("simulation.realityCheckHighTarget"))
        realityChecks.push(t("simulation.realityCheckDisclaimer"))

        const insight = useProgressiveIncome
            ? t("simulation.insights.progressive", { from: formatRp(income), to: formatRp(targetIncome), years: projectionYears.toString(), netWorth: formatRp(finalNetWorth), fromRate: savingsRate.toFixed(0), toRate: finalSavingsRate.toFixed(0) })
            : t("simulation.insights.stable", { netWorth: formatRp(finalNetWorth), years: projectionYears.toString(), rate: savingsRate.toFixed(0) })

        return { yearlyData, finalNetWorth, savingsRate, monthlySavings: income - expense, status, statusLabel, statusColor, statusBg, statusEmoji, goalReachable, goalAmount, realityChecks, insight }
    }, [income, expense, targetIncome, selectedGoal, projectionYears, simData, t, goalPresets])

    // ─── TRADE-OFF CALCULATIONS ─────────────────────────────────

    const tradeOffResult = useMemo(() => {
        const baseMonthlySavings = income - expense
        let adjustedSavings = baseMonthlySavings

        lifestyleItems.forEach(item => {
            if (item.enabled) {
                adjustedSavings -= item.costPerMonth
            }
        })

        const years = 5
        const growthRate = 0.06
        const currentBalance = simData?.totalBalance || 0

        let withoutNW = currentBalance
        for (let y = 0; y < years; y++) {
            withoutNW = (withoutNW + baseMonthlySavings * 12) * (1 + growthRate)
        }

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
        if (adjustedSavings < 0) realityChecks.push("Warning: Your expenses exceed income with these lifestyle choices.")
        if (totalEnabledCost > baseMonthlySavings * 0.5) realityChecks.push("More than 50% of your savings are consumed by lifestyle choices.")

        return { withoutNW, withNW, difference, adjustedSavings, comparisonData, totalEnabledCost, realityChecks }
    }, [income, expense, lifestyleItems, simData])

    // ─── TIMELINE MILESTONES ────────────────────────────────────

    const timelineMilestones = useMemo(() => {
        const monthlySavings = income - expense
        const lifestyleCost = lifestyleItems.filter(i => i.enabled).reduce((sum, i) => sum + i.costPerMonth, 0)
        const adjustedSavings = monthlySavings - lifestyleCost
        const effectiveSavings = Math.max(0, adjustedSavings)
        const currentBalance = simData?.totalBalance || 0
        const currentYear = new Date().getFullYear()

        const milestones: Milestone[] = [
            { id: "emergency", label: t("simulation.goalPresets.emergency"), emoji: "🛡️", amount: 15000000, year: null, reached: false },
            { id: "dp-motor", label: t("simulation.goalPresets.motor"), emoji: "🏍️", amount: 8000000, year: null, reached: false },
            { id: "invest", label: t("simulation.goalPresets.invest"), emoji: "💰", amount: 20000000, year: null, reached: false },
            { id: "dp-rumah", label: t("simulation.goalPresets.house"), emoji: "🏠", amount: 50000000, year: null, reached: false },
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
    }, [income, expense, lifestyleItems, simData, t])

    const toggleLifestyle = (id: string) => {
        setLifestyleItems(prev => prev.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        ))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col @md/main:flex-row @md/main:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md/main:text-3xl font-semibold text-gray-900 tracking-tight">{t("simulation.title")}</h2>
                    <p className="text-gray-500 text-xs @md/main:text-sm mt-1 font-medium italic">{t("simulation.subtitle")}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <ConceptBadge label={t("concepts.compound")} />
                    <ConceptBadge label={t("concepts.opportunity")} />
                    <ConceptBadge label={t("concepts.risk")} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 @sm/main:grid-cols-2 @lg/main:grid-cols-4 gap-4">
                {[
                    { label: t("simulation.monthlyIncome"), value: formatRp(income), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: t("simulation.monthlyExpense"), value: formatRp(expense), icon: Wallet, color: "text-red-500", bg: "bg-red-50" },
                    { label: t("simulation.savingsRate"), value: `${futureProjection.savingsRate.toFixed(1)}%`, icon: PiggyBank, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: t("dashboard.details") || "Balance", value: formatRp(simData?.totalBalance || 0), icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
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
                    { key: "future-me" as Tab, label: t("simulation.futureMe"), icon: Sparkles },
                    { key: "trade-off" as Tab, label: t("simulation.tradeOff"), icon: Zap },
                    { key: "timeline" as Tab, label: t("simulation.timeline"), icon: Clock },
                ]).map((t_tab) => (
                    <button
                        key={t_tab.key}
                        onClick={() => setTab(t_tab.key)}
                        className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap px-1 ${tab === t_tab.key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <t_tab.icon className="w-4 h-4" />
                        {t_tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === "future-me" && (
                    <motion.div
                        key="future-me"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{t("simulation.futureMe")} {new Date().getFullYear() + projectionYears}</h3>
                                    <p className="text-xs text-slate-400">{t("simulation.netWorthGrowthProjection")}</p>
                                </div>
                                <ConceptBadge label={t("concepts.networth")} />
                            </div>

                            <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-4 mb-6">
                                <CurrencyInput label={t("simulation.monthlyIncome")} value={income} onChange={setIncome} />
                                <CurrencyInput label={t("simulation.targetIncome")} value={targetIncome} onChange={setTargetIncome} />
                                <CurrencyInput label={t("simulation.monthlyExpense")} value={expense} onChange={setExpense} />
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{t("simulation.projectionYears")}</label>
                                    <select
                                        value={projectionYears}
                                        onChange={e => setProjectionYears(Number(e.target.value))}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value={3}>{t("simulation.years", { count: "3" })}</option>
                                        <option value={5}>{t("simulation.years", { count: "5" })}</option>
                                        <option value={10}>{t("simulation.years", { count: "10" })}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-semibold text-slate-500 mb-3 block">{t("simulation.goal")}</label>
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
                                {t("simulation.calculation")}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showProjection && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
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
                                                    <p className="text-xs font-medium text-slate-500">{t("simulation.futureMe")}:</p>
                                                    <h3 className={`text-xl font-semibold ${futureProjection.statusColor}`}>{futureProjection.statusLabel}</h3>
                                                    <ConceptBadge label={t("concepts.savings")} />
                                                </div>
                                            </div>
                                            <div className="text-left @sm/main:text-right">
                                                <p className="text-xs text-slate-500">{t("concepts.networth")}</p>
                                                <p className={`text-2xl font-semibold ${futureProjection.statusColor}`}>
                                                    <AnimatedNumber value={futureProjection.finalNetWorth} />
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-200/50">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    {futureProjection.insight}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

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
                                                ? t("simulation.goalReached", {
                                                    goal: goalPresets.find(g => g.value === selectedGoal)?.label || "",
                                                    amount: formatRp(futureProjection.goalAmount),
                                                    years: projectionYears.toString()
                                                })
                                                : t("simulation.goalNotReached", {
                                                    goal: goalPresets.find(g => g.value === selectedGoal)?.label || "",
                                                    amount: formatRp(futureProjection.goalAmount)
                                                })
                                            }
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">📈 {t("simulation.growthPath")}</h4>
                                                <p className="text-[11px] text-slate-400">{t("simulation.netWorthGrowthProjection")}</p>
                                            </div>
                                            <ConceptBadge label={t("concepts.compoundGrowth")} />
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={futureProjection.yearlyData}>
                                                    <defs>
                                                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => formatRpCompact(v)} width={70} />
                                                    <Tooltip content={<ChartTooltip />} />
                                                    <Area
                                                        name={t("concepts.networth")}
                                                        type="monotone"
                                                        dataKey="netWorth"
                                                        stroke="#3b82f6"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorNetWorth)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>

                                    <RealityCheck messages={futureProjection.realityChecks} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {tab === "trade-off" && (
                    <motion.div
                        key="trade-off"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 @lg/main:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-slate-800">{t("simulation.lifestyleChoices")}</h3>
                                </div>
                                <div className="space-y-3">
                                    {lifestyleItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleLifestyle(item.id)}
                                            className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${item.enabled ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:bg-slate-50"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl">{item.emoji}</div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-slate-800">{item.label}</h4>
                                                    <p className="text-[11px] text-slate-500 mb-1">{item.description}</p>
                                                    <ConceptBadge label={item.concept} />
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className={`text-xs font-bold ${item.costPerMonth > 0 ? "text-red-500" : "text-emerald-600"}`}>
                                                    {item.costPerMonth > 0 ? "-" : "+"}{formatRpCompact(Math.abs(item.costPerMonth))}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-slate-800">{t("simulation.impactOnFuture")}</h3>
                                </div>

                                <div className="flex-1 min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={tradeOffResult.comparisonData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                tickFormatter={(val) => val === "With Lifestyle" ? t("simulation.withLifestyle") : t("simulation.withoutLifestyle")}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                tickFormatter={formatRpCompact}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="netWorth" radius={[8, 8, 0, 0]}>
                                                {tradeOffResult.comparisonData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{t("simulation.impactOnFuture")}</p>
                                        <p className={`text-lg font-bold ${tradeOffResult.difference >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                            {tradeOffResult.difference >= 0 ? "+" : ""}{formatRpCompact(tradeOffResult.difference)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{t("simulation.monthlySavings")}</p>
                                        <p className="text-lg font-bold text-slate-800">{formatRpCompact(tradeOffResult.adjustedSavings)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <RealityCheck messages={tradeOffResult.realityChecks} />
                    </motion.div>
                )}

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
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{t("simulation.timeline")}</h3>
                                    <p className="text-xs text-slate-400">{t("simulation.timelineMilestoneDesc")}</p>
                                </div>
                                <ConceptBadge label={t("concepts.compoundGrowth")} />
                            </div>
                        </div>

                        <div className="bg-white p-6 @md/main:p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="relative mb-10">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 rounded-full -translate-y-1/2" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full -translate-y-1/2"
                                    />

                                    {timelineMilestones.map((m, i) => (
                                        <div key={m.id} className="relative z-10 flex flex-col items-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.2 + 0.5 }}
                                                className={`w-10 h-10 @md/main:w-12 @md/main:h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center text-lg @md/main:text-xl ${m.reached ? "bg-emerald-500" : m.year ? "bg-blue-500" : "bg-slate-200"}`}
                                            >
                                                {m.reached ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span>{m.emoji}</span>}
                                            </motion.div>
                                            <div className="absolute top-full mt-3 text-center w-24 @md/main:w-32">
                                                <p className={`text-[10px] @md/main:text-xs font-bold ${m.reached ? "text-emerald-600" : m.year ? "text-blue-600" : "text-slate-400"}`}>
                                                    {m.reached ? t("splitBill.settled") : m.year || t("common.at")}
                                                </p>
                                                <p className="text-[9px] @md/main:text-[10px] font-semibold text-slate-800 truncate">{m.label}</p>
                                                <p className="text-[8px] @md/main:text-[9px] font-medium text-slate-400">{formatRpCompact(m.amount)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-16 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                    {t("simulation.timelineDisclaimer")}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
