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
    CheckCircle2,
    Clock,
    Lock,
    BrainCircuit,
    AlertCircle,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { getSimulationData, type SimulationData } from "@/app/actions/simulation"
import { useTranslation } from "@/lib/i18n/useTranslation"
import { formatRp, cn } from "@/lib/utils"

// ─── TYPES ────────────────────────────────────────────────────────

type Tab = "future-me" | "trade-off"

type AILifestyleSuggestion = {
    id: string
    label: string
    emoji: string
    costPerMonth: number
    description: string
    concept: string
    impact5Years: number
    investmentAlternative: string
    enabled?: boolean
}

// ─── UTILS ────────────────────────────────────────────────────────

const formatRpCompact = (val: number) => {
    const absVal = Math.abs(val)
    if (absVal >= 1_000_000_000) {
        const num = val / 1_000_000_000
        return `Rp ${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)} Miliar`
    }
    if (absVal >= 1_000_000) {
        const num = val / 1_000_000
        return `Rp ${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)} Juta`
    }
    if (absVal >= 1_000) {
        const num = val / 1_000
        return `Rp ${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)} rb`
    }
    return `Rp ${val.toLocaleString("id-ID")}`
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
            <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">{label}</label>
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
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                />
            </div>
        </div>
    )
}



// ─── REALITY CHECK PILL ──────────────────────────────────────────

function RealityCheck({ text }: { text: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-200 leading-tight">{text}</span>
        </div>
    )
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 pb-2 border-b border-slate-800">{label}</div>
            {payload.map((p: any, i: number) => (
                <div key={i} className="text-xs font-semibold text-slate-100 flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {formatRp(p.value)}
                </div>
            ))}
        </div>
    )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────

export default function SimulationPage() {
    const { t, locale } = useTranslation()
    const [mounted, setMounted] = useState(false)
    const [tab, setTab] = useState<Tab>("future-me")
    const [loading, setLoading] = useState(true)
    const [simData, setSimData] = useState<SimulationData | null>(null)
    const [aiLifestyles, setAiLifestyles] = useState<AILifestyleSuggestion[]>([])
    const [aiLoading, setAiLoading] = useState(false)

    const goalPresets = useMemo(() => [
        { label: t("simulation.goalPresets.emergency"), icon: ShieldAlert, value: "emergency", amount: 15000000 },
        { label: t("simulation.goalPresets.motor"), icon: Bike, value: "motor", amount: 8000000 },
        { label: t("simulation.goalPresets.house"), icon: Home, value: "house", amount: 50000000 },
        { label: t("simulation.goalPresets.invest"), icon: TrendingUp, value: "invest", amount: 20000000 },
        { label: t("simulation.goalPresets.education"), icon: GraduationCap, value: "education", amount: 30000000 },
    ], [t])

    // Future Me state
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [targetIncome, setTargetIncome] = useState(0)
    const [selectedGoal, setSelectedGoal] = useState("emergency")
    const [projectionYears, setProjectionYears] = useState(5)
    const [showProjection, setShowProjection] = useState(false)

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
            setMounted(true)
        }
        load()
    }, [])

    const fetchAISuggestions = async () => {
        setAiLoading(true)
        const { getAILifestyleSuggestions } = await import("@/app/actions/simulation")
        const { data, error } = await getAILifestyleSuggestions(locale)
        if (data) {
            setAiLifestyles(data.map(item => ({ ...item, enabled: false })))
        } else if (error) {
            alert(error)
        }
        setAiLoading(false)
    }

    const toggleAILifestyle = (id: string) => {
        setAiLifestyles(prev => prev.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        ))
    }

    const futureProjection = useMemo(() => {
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0
        const annualGrowthRate = 0.06
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

    const tradeOffResult = useMemo(() => {
        const baseMonthlySavings = income - expense
        let adjustedSavings = baseMonthlySavings

        aiLifestyles.forEach(item => {
            if (item.enabled) adjustedSavings -= item.costPerMonth
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
        const enabledItems = aiLifestyles.filter(i => i.enabled)
        const totalPlus = enabledItems.filter(i => i.costPerMonth < 0).reduce((sum, i) => sum + Math.abs(i.costPerMonth), 0)
        const totalMinus = enabledItems.filter(i => i.costPerMonth > 0).reduce((sum, i) => sum + i.costPerMonth, 0)
        const totalEnabledCost = totalMinus - totalPlus
        const isMixed = totalPlus > 0 && totalMinus > 0

        const realityChecks: string[] = []
        if (adjustedSavings < 0) realityChecks.push(t("simulation.realityCheckNegativeSavings") || "Gaya hidup ini melebihi tabunganmu!")

        return { 
            withoutNW, withNW, difference, adjustedSavings, 
            totalEnabledCost, totalPlus, totalMinus, 
            realityChecks, isMixed 
        }
    }, [income, expense, aiLifestyles, simData, t])

    if (loading || !mounted) {
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
                    <h2 className="text-2xl @md/main:text-3xl font-semibold text-slate-900 tracking-tight">{t("simulation.title")}</h2>
                    <p className="text-slate-500 text-xs @md/main:text-sm mt-1 font-semibold italic tracking-tight">{t("simulation.subtitle")}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                </div>
            </div>

            <div className="w-full">
                <div className="space-y-8 transition-all duration-500 ease-in-out">
                    {/* Tabs */}
                    <div className="flex gap-2 @sm/main:gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar">
                        {([
                            { key: "future-me" as Tab, label: t("simulation.futureMe"), icon: Sparkles },
                            { key: "trade-off" as Tab, label: t("simulation.tradeOff"), icon: Zap },
                        ]).map((t_tab) => (
                            <button
                                key={t_tab.key}
                                onClick={() => setTab(t_tab.key)}
                                className={`flex items-center gap-2.5 text-xs font-semibold pb-4 border-b-2 transition-all whitespace-nowrap px-1 uppercase tracking-widest ${tab === t_tab.key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
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
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-5 @sm/main:p-8 rounded-3xl @sm/main:rounded-[2rem] shadow-sm border border-slate-100">
                                    <div className="flex flex-col @md/main:flex-row @md/main:items-center justify-between gap-6 mb-8 group/header">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover/header:scale-110 group-hover/header:rotate-3 transition-all duration-500">
                                                <Sparkles className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-800 tracking-tight text-xl @sm/main:text-1xl truncate">{t("simulation.futureMe")} {new Date().getFullYear() + projectionYears}</h3>
                                                <p className="text-[10px] @sm/main:text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mt-0.5">{t("simulation.netWorthGrowthProjection")}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-full text-[10px] @sm/main:text-[11px] font-bold uppercase tracking-[0.1em] border shadow-sm w-fit flex items-center gap-2.5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap",
                                            futureProjection.statusBg,
                                            futureProjection.statusColor
                                        )}>
                                            <span className="text-sm scale-110">{futureProjection.statusEmoji}</span>
                                            {futureProjection.statusLabel}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-6 mb-8">
                                        <CurrencyInput label={t("simulation.monthlyIncome")} value={income} onChange={setIncome} />
                                        <CurrencyInput label={t("simulation.targetIncome")} value={targetIncome} onChange={setTargetIncome} />
                                        <CurrencyInput label={t("simulation.monthlyExpense")} value={expense} onChange={setExpense} />
                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">{t("simulation.projectionYears")}</label>
                                            <select
                                                value={projectionYears}
                                                onChange={e => setProjectionYears(Number(e.target.value))}
                                                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                            >
                                                <option value={3}>{t("simulation.years", { count: "3" })}</option>
                                                <option value={5}>{t("simulation.years", { count: "5" })}</option>
                                                <option value={10}>{t("simulation.years", { count: "10" })}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <label className="text-[11px] font-semibold text-slate-500 mb-4 block uppercase tracking-wider">{t("simulation.targetGoal")}</label>
                                        <div className="grid grid-cols-2 @md/main:grid-cols-5 gap-3">
                                            {goalPresets.map(goal => (
                                                <button
                                                    key={goal.value}
                                                    onClick={() => setSelectedGoal(goal.value)}
                                                    className={`p-4 rounded-2xl border-2 transition-all text-center group ${selectedGoal === goal.value
                                                        ? "border-blue-600 bg-blue-50/50 text-blue-800 shadow-sm"
                                                        : "border-slate-50 hover:border-slate-100 bg-slate-50/30 text-slate-500"
                                                        }`}
                                                >
                                                    <goal.icon className={`w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110 ${selectedGoal === goal.value ? "text-blue-600" : "text-slate-300"}`} />
                                                    <p className="text-[11px] font-semibold tracking-tighter uppercase">{goal.label}</p>
                                                    <p className="text-[10px] font-semibold opacity-40 mt-1">{formatRpCompact(goal.amount)}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowProjection(true)}
                                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 group uppercase tracking-[0.1em] text-sm"
                                    >
                                        <Play className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform" />
                                        {t("simulation.calculation")}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showProjection && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 @md/main:grid-cols-12 gap-8">
                                                <div className="col-span-1 @md/main:col-span-8 bg-white p-5 @sm/main:p-8 rounded-3xl @sm/main:rounded-[2rem] shadow-sm border border-slate-100 min-h-[450px]">
                                                    <div className="flex flex-col @sm/main:flex-row @sm/main:items-center justify-between mb-8 gap-4">
                                                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-3 uppercase tracking-wider">
                                                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shrink-0" />
                                                            {t("simulation.netWorthGrowth")}
                                                        </h4>
                                                        <div className="flex items-center gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200" /> {t("simulation.netWorth")}</span>
                                                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-200" /> {t("simulation.target")}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-[320px] w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={futureProjection.yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                                <defs>
                                                                    <linearGradient id="colorNW" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                                                                    </linearGradient>
                                                                </defs>
                                                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f8fafc" />
                                                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#cbd5e1" }} dy={15} />
                                                                <YAxis hide domain={[0, (dataMax: number) => Math.max(dataMax, futureProjection.goalAmount) * 1.2]} />
                                                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" }} />
                                                                <ReferenceLine y={futureProjection.goalAmount} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="10 10" label={{ value: "TARGET", position: "right", fontSize: 10, fontWeight: 600, fill: "#cbd5e1", letterSpacing: "1px" }} />
                                                                <Area type="monotone" dataKey="netWorth" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorNW)" animationDuration={2500} />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>

                                                <div className="col-span-1 @md/main:col-span-4 space-y-6">
                                                    <div className={`p-6 @sm/main:p-8 rounded-3xl @sm/main:rounded-[2rem] border-4 ${futureProjection.statusBg} transition-all shadow-sm flex flex-col justify-center min-h-[140px] shadow-white`}>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="text-2xl">{futureProjection.statusEmoji}</span>
                                                            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${futureProjection.statusColor}`}>{futureProjection.statusLabel}</p>
                                                        </div>
                                                        <p className="text-2xl @sm/main:text-3xl font-semibold text-slate-800 tracking-tighter mb-2">{formatRpCompact(futureProjection.finalNetWorth)}</p>
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{t("simulation.estNetWorth", { year: (new Date().getFullYear() + projectionYears).toString() })}</p>
                                                    </div>

                                                    <div className={`p-6 @sm/main:p-8 rounded-3xl @sm/main:rounded-[2rem] border-4 ${futureProjection.goalReachable ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50/50 border-slate-100"} shadow-sm`}>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${futureProjection.goalReachable ? "bg-emerald-100" : "bg-slate-100"}`}>
                                                                <Target className={`w-5 h-5 ${futureProjection.goalReachable ? "text-emerald-600" : "text-slate-400"}`} />
                                                            </div>
                                                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">{t("simulation.goalStatus")}</p>
                                                        </div>
                                                        <p className={`text-sm font-semibold leading-relaxed ${futureProjection.goalReachable ? "text-emerald-800" : "text-slate-600"}`}>
                                                            {futureProjection.goalReachable
                                                                ? t("simulation.goalReached", { goal: t(`simulation.goalPresets.${selectedGoal}`), amount: formatRpCompact(futureProjection.goalAmount), years: projectionYears.toString() })
                                                                : t("simulation.goalNotReached", { goal: t(`simulation.goalPresets.${selectedGoal}`), amount: formatRpCompact(futureProjection.goalAmount) })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-900 p-6 @sm/main:p-12 rounded-[40px] @sm/main:rounded-[3.5rem] text-white overflow-hidden relative group shadow-2xl shadow-slate-300/50 border border-slate-800">
                                                {/* Ambient Glow */}
                                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                                                
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 group-hover:scale-125 transition-transform duration-1000 rotate-12 pointer-events-none">
                                                    <BrainCircuit className="w-64 h-64" />
                                                </div>
                                                
                                                <div className="max-w-3xl relative z-10">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="w-2 h-7 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                                        <h5 className="text-blue-400 text-[10px] @sm/main:text-[11px] font-bold uppercase tracking-[0.4em]">{t("simulation.mindyRealityCheck")}</h5>
                                                    </div>
                                                    
                                                    <div className="relative mb-12">
                                                        <span className="absolute -left-6 -top-4 text-6xl text-blue-500/20 font-serif opacity-50">"</span>
                                                        <p className="text-2xl @sm/main:text-3xl font-bold leading-tight @sm/main:leading-tight text-slate-50 tracking-tight">
                                                            {futureProjection.insight}
                                                        </p>
                                                        <span className="absolute -right-2 -bottom-8 text-6xl text-blue-500/20 font-serif opacity-50 rotate-180">"</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3 mt-4">
                                                        {futureProjection.realityChecks.map((check, i) => (
                                                            <RealityCheck key={i} text={check} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {tab === "trade-off" && (
                            <motion.div
                                key="trade-off"
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 @lg/main:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 @sm/main:p-8 rounded-3xl @sm/main:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                                        <div className="flex flex-col @sm/main:flex-row @sm/main:items-center justify-between mb-8 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                                                    <BrainCircuit className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 text-lg tracking-tight">{t("ai.title")}</h3>
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{t("simulation.dynamicLifeImpact")}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={fetchAISuggestions}
                                                disabled={aiLoading}
                                                className="h-10 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-slate-200 active:scale-95"
                                            >
                                                <Sparkles className={`w-4 h-4 ${aiLoading ? "animate-spin" : ""}`} />
                                                {aiLoading ? t("simulation.analysing") : t("simulation.generateIdeas")}
                                            </button>
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            {aiLifestyles.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center py-20 text-center border-4 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/20">
                                                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm">
                                                        <Zap className="w-8 h-8 text-slate-200" />
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
                                                        {t("simulation.clickSuggestions")}
                                                    </p>
                                                </div>
                                            ) : (
                                                aiLifestyles.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => toggleAILifestyle(item.id)}
                                                        className={`w-full p-5 rounded-2xl border-4 transition-all text-left flex items-start gap-5 group relative overflow-hidden ${
                                                            item.enabled
                                                                ? "border-blue-600 bg-blue-50/30 shadow-sm"
                                                                : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {item.enabled && <div className="absolute top-0 right-0 w-12 h-12 bg-blue-600 rounded-bl-[2rem] flex items-center justify-center pl-3 pb-3">
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </div>}
                                                        <div className="text-3xl pt-1 group-hover:scale-110 transition-transform duration-500">{item.emoji}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`flex items-center justify-between mb-1 ${item.enabled ? "pr-8" : ""}`}>
                                                                <p className="font-semibold text-slate-800 text-sm uppercase tracking-tight truncate">{item.label}</p>
                                                                <p className={`text-sm font-semibold ${item.costPerMonth > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                                                                    {item.costPerMonth > 0 ? "+" : ""}{formatRpCompact(Math.abs(item.costPerMonth))}/bln
                                                                </p>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                                                            <div className="flex gap-2">
                                                                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest ${
                                                                    item.costPerMonth > 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                                                                }`}>
                                                                    {item.concept}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white p-5 @sm/main:p-8 rounded-3xl @sm/main:rounded-[3rem] shadow-sm border border-slate-100">
                                            {/* Dynamic Narrative Summary - Primary Visual Focus now */}
                                            <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 via-blue-500/10 to-emerald-500/10">
                                                <div className="bg-white/80 backdrop-blur-xl p-5 @sm/main:p-8 rounded-[2.4rem] border border-white/50 relative overflow-hidden">
                                                    <div className="flex items-center gap-3 mb-6 relative z-10">
                                                        <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                                        <h4 className="text-[11px] font-semibold text-slate-800 uppercase tracking-[0.3em]">{t("simulation.tradeOffSummary.title")}</h4>
                                                    </div>
                                                    
                                                    <div className="space-y-6 relative z-10">
                                                        <p className="text-lg @sm/main:text-xl font-semibold text-slate-800 leading-[1.3] tracking-tight mb-2">
                                                            {tradeOffResult.isMixed
                                                                ? tradeOffResult.difference > 0 
                                                                    ? t("simulation.tradeOffSummary.mixed", { amount: formatRpCompact(Math.abs(tradeOffResult.difference)) })
                                                                    : t("simulation.tradeOffSummary.negative", { amount: formatRpCompact(Math.abs(tradeOffResult.difference)) })
                                                                : tradeOffResult.difference > 0 
                                                                    ? t("simulation.tradeOffSummary.positive", { 
                                                                        amount: formatRpCompact(tradeOffResult.difference),
                                                                        percentage: ((tradeOffResult.difference / tradeOffResult.withoutNW) * 100).toFixed(1)
                                                                      })
                                                                    : tradeOffResult.difference < 0
                                                                        ? t("simulation.tradeOffSummary.negative", { amount: formatRpCompact(Math.abs(tradeOffResult.difference)) })
                                                                        : t("simulation.tradeOffSummary.neutral", { amount: formatRpCompact(tradeOffResult.totalEnabledCost) })
                                                            }
                                                        </p>
                                                        <div className="group/insight p-4 @md/main:p-6 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 flex flex-col @md/main:flex-row items-center @md/main:items-start gap-4 @md/main:gap-6 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5">
                                                            <div className="w-14 h-14 @md/main:w-16 @md/main:h-16 rounded-2xl bg-amber-100/50 flex items-center justify-center shrink-0 shadow-sm shadow-amber-200/20 group-hover/insight:scale-110 group-hover/insight:rotate-6 transition-all duration-500">
                                                                <Coffee className="w-7 h-7 @md/main:w-8 @md/main:h-8 text-amber-600/80 drop-shadow-sm" />
                                                            </div>
                                                            <div className="flex-1 text-center @md/main:text-left min-w-0">
                                                                <p className="text-xs @md/main:text-sm text-slate-600 font-bold italic leading-relaxed tracking-tight group-hover/insight:text-slate-800 transition-colors">
                                                                    {t("simulation.tradeOffSummary.coffeeExample")}
                                                                </p>
                                                                <div className="mt-2.5 flex items-center justify-center @md/main:justify-start gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                                                                    <span className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest">{t("simulation.realityCheck")}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Subtle background decoration */}
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                                                </div>
                                            </div>

                                            <div className="mt-8 grid grid-cols-1 @md/main:grid-cols-2 gap-6">
                                                {/* Card 1: Breakdown */}
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">{t("simulation.breakdown")}</p>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t("simulation.totalInvestment")}</span>
                                                            <span className="text-sm font-semibold text-emerald-600">+{formatRpCompact(tradeOffResult.totalPlus)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t("simulation.totalSpending")}</span>
                                                            <span className="text-sm font-semibold text-rose-500">-{formatRpCompact(tradeOffResult.totalMinus)}</span>
                                                        </div>
                                                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">{t("simulation.netBalance")}</span>
                                                            <span className={`text-sm font-semibold ${tradeOffResult.totalPlus - tradeOffResult.totalMinus >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                                                {tradeOffResult.totalPlus - tradeOffResult.totalMinus >= 0 ? "+" : "-"}{formatRpCompact(Math.abs(tradeOffResult.totalPlus - tradeOffResult.totalMinus))}/bln
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 2: Net Impact */}
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{t("simulation.netFinancialImpact")}</p>
                                                        <p className={`text-2xl font-semibold tracking-tighter ${tradeOffResult.difference >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                                            {tradeOffResult.difference >= 0 ? "+" : ""}{formatRpCompact(tradeOffResult.difference)}
                                                        </p>
                                                    </div>
                                                    <div className={`w-14 h-14 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center ${tradeOffResult.difference >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}>
                                                        {tradeOffResult.difference >= 0 ? <TrendingUp className="w-7 h-7 text-white" /> : <TrendingDown className="w-7 h-7 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {tradeOffResult.realityChecks.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-rose-50 border-2 border-rose-100 p-6 rounded-[2rem] shadow-sm shadow-rose-100"
                                            >
                                                <div className="flex items-center gap-3 mb-4 text-rose-600">
                                                    <AlertCircle className="w-5 h-5" />
                                                    <p className="text-[11px] font-semibold uppercase tracking-widest">{t("simulation.safetyAnalysis")}</p>
                                                </div>
                                                <ul className="space-y-3">
                                                    {tradeOffResult.realityChecks.map((check, i) => (
                                                        <li key={i} className="text-xs font-semibold text-rose-800 leading-relaxed flex items-start gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                                            {check}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
