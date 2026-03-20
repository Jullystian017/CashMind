"use client"

import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatRp } from "@/lib/utils"
import {
    Wallet, UtensilsCrossed, Car, Gamepad2, ShoppingBag,
    GraduationCap, HeartPulse, Zap, Home, Smartphone, Plane,
    Plus, Pencil, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2,
    X, ReceiptText, ChevronDown, Calendar as CalendarIcon, Loader2
} from "lucide-react"
import { getBudgets, upsertBudget } from "@/app/actions/budgets"
import { getCategorySpending, getTransactionsByCategory } from "@/app/actions/transactions"
import { useTranslation } from "@/lib/i18n/useTranslation"

/* ─── Types ─── */
interface BudgetCategory {
    id: string
    name: string
    icon: React.ElementType
    color: string
    limit: number
    spent: number
    transactions: { desc: string; amount: number; date: string }[]
}

/* ─── Helpers ─── */
/** Format raw digits string to "1.000.000" display style */
const formatThousands = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return ""
    return parseInt(digits, 10).toLocaleString("id-ID")
}

/** Parse display value back to raw number */
const parseFormatted = (display: string) => {
    const digits = display.replace(/\D/g, "")
    return digits ? parseInt(digits, 10) : 0
}

const getPercent = (spent: number, limit: number) => {
    if (limit === 0) return 0
    return Math.round((spent / limit) * 100)
}

const getBarColor = (pct: number) => {
    return "bg-blue-600"
}

/* ─── Page ─── */
export default function BudgetsPage() {
    const { t, locale } = useTranslation()

    const getStatusBadge = (pct: number) => {
        if (pct >= 100) return { label: t("budgets.overLimit"), color: "text-rose-600 bg-rose-50 border-rose-100", icon: AlertTriangle }
        if (pct >= 90) return { label: t("budgets.status.warning"), color: "text-amber-600 bg-amber-50 border-amber-100", icon: AlertTriangle }
        if (pct >= 70) return { label: t("common.at"), color: "text-amber-500 bg-amber-50/60 border-amber-100", icon: Zap }
        return { label: t("budgets.status.safe"), color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 }
    }

    const availableCategories = useMemo(() => [
        { name: "Food & Drinks", icon: UtensilsCrossed, color: "#3b82f6" },
        { name: "Transport", icon: Car, color: "#f97316" },
        { name: "Entertainment", icon: Gamepad2, color: "#a855f7" },
        { name: "Shopping", icon: ShoppingBag, color: "#ec4899" },
        { name: "Education", icon: GraduationCap, color: "#0ea5e9" },
        { name: "Health", icon: HeartPulse, color: "#10b981" },
        { name: "Home & Bills", icon: Home, color: "#6366f1" },
        { name: "Gadgets", icon: Smartphone, color: "#14b8a6" },
        { name: "Travel", icon: Plane, color: "#f59e0b" },
        { name: "Utilities", icon: Zap, color: "#ef4444" },
    ], [])

    const getCategoryLabel = (cat: string) => {
        const keyMap: Record<string, string> = {
            "Food & Drinks": "foodDrinks",
            "Transport": "transport",
            "Shopping": "shopping",
            "Entertainment": "entertainment",
            "Education": "education",
            "Health": "health",
            "Home & Bills": "homeBills",
            "Gadgets": "gadgets",
            "Travel": "travel",
            "Utilities": "utilities",
            "Others": "other"
        }
        const key = keyMap[cat]
        return key ? t(`transactions.categories.${key}`) : cat
    }

    const [budgets, setBudgets] = useState<BudgetCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)
    const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null)
    const [editDisplayValue, setEditDisplayValue] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [txLoading, setTxLoading] = useState(false)

    // Sync with Transactions style states
    const now = new Date()
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
    const [selectedYear, setSelectedYear] = useState(now.getFullYear())
    const [pickerYear, setPickerYear] = useState(now.getFullYear())

    const currentMonthKey = useMemo(() => {
        return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`
    }, [selectedMonth, selectedYear])

    const displayMonth = useMemo(() => {
        const date = new Date(selectedYear, selectedMonth, 1)
        return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' })
    }, [selectedMonth, selectedYear, locale])

    // Grid-style months for the picker
    const pickerMonths = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => {
            const d = new Date(pickerYear, i, 1)
            return {
                month: i,
                label: d.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'short' })
            }
        })
    }, [pickerYear, locale])


    const fetchData = async () => {
        setLoading(true)
        const [budgetsRes, spendingRes] = await Promise.all([
            getBudgets(currentMonthKey),
            getCategorySpending(currentMonthKey)
        ])

        if (budgetsRes.data) {
            const spending = spendingRes.data || {}

            const mapped: BudgetCategory[] = budgetsRes.data.map((b: any) => {
                const config = availableCategories.find(c => c.name === b.category) || { name: b.category, icon: Wallet, color: "#94a3b8" }
                return {
                    id: b.id,
                    name: b.category,
                    icon: config.icon,
                    color: config.color,
                    limit: b.limit,
                    spent: spending[b.category] || 0,
                    transactions: []
                }
            })
            setBudgets(mapped)
        }
        setLoading(false)
    }

    useEffect(() => {
        setMounted(true)
        fetchData()
    }, [currentMonthKey])

    useEffect(() => {
        if (selectedCategory) {
            const fetchTx = async () => {
                setTxLoading(true)
                const res = await getTransactionsByCategory(selectedCategory.name, currentMonthKey)
                if (res.data) {
                    const txs = res.data.map(tx => ({
                        desc: tx.description,
                        amount: tx.amount,
                        date: new Date(tx.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' })
                    }))
                    setBudgets(prev => prev.map(b => b.id === selectedCategory.id ? { ...b, transactions: txs } : b))
                    setSelectedCategory(prev => prev ? { ...prev, transactions: txs } : null)
                }
                setTxLoading(false)
            }
            fetchTx()
        }
    }, [selectedCategory?.id, currentMonthKey, locale])

    const totalBudget = budgets.reduce((a, b) => a + b.limit, 0)
    const totalSpent = budgets.reduce((a, b) => a + b.spent, 0)
    const totalRemaining = totalBudget - totalSpent
    const globalPct = totalBudget > 0 ? getPercent(totalSpent, totalBudget) : 0

    const handleSaveEdit = async () => {
        if (!editingBudget) return
        const val = parseFormatted(editDisplayValue)
        if (!val || val <= 0) return

        const { error } = await upsertBudget({
            category: editingBudget.name,
            limit: val,
            monthYear: currentMonthKey
        })

        if (!error) {
            fetchData()
            setEditingBudget(null)
            setEditDisplayValue("")
        } else {
            alert(error)
        }
    }

    return (
        <div className="space-y-8 pb-10" suppressHydrationWarning>
            <div>
                <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl @md:text-3xl font-semibold text-gray-900 tracking-tight">{t("budgets.title")}</h2>
                            <div className="relative">
                                <button
                                    onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] @md:text-xs font-semibold text-gray-500 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                                >
                                    <CalendarIcon className="w-3 h-3 text-gray-400" />
                                    <span className="capitalize leading-none">{displayMonth}</span>
                                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-gray-400", isMonthPickerOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isMonthPickerOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsMonthPickerOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                                            >
                                                {/* Year Selector Header */}
                                                <div className="flex items-center justify-between px-3 py-2 bg-gray-50/50 border-b border-gray-100">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPickerYear(y => y - 1); }}
                                                        className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-blue-600 transition-all"
                                                    >
                                                        <ChevronLeft className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-700 tracking-tight">{pickerYear}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPickerYear(y => y + 1); }}
                                                        className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-blue-600 transition-all"
                                                    >
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Months Grid */}
                                                <div className="p-2 grid grid-cols-3 gap-1">
                                                    {pickerMonths.map((m) => {
                                                        const isSelected = selectedMonth === m.month && selectedYear === pickerYear
                                                        const isCurrentMonth = now.getMonth() === m.month && now.getFullYear() === pickerYear
                                                        
                                                        return (
                                                            <button
                                                                key={m.month}
                                                                onClick={() => {
                                                                    setSelectedMonth(m.month)
                                                                    setSelectedYear(pickerYear)
                                                                    setIsMonthPickerOpen(false)
                                                                }}
                                                                className={cn(
                                                                    "px-2 py-3 rounded-xl text-[10px] font-semibold transition-all text-center border capitalize",
                                                                    isSelected 
                                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                                                                        : isCurrentMonth
                                                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                                                            : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900"
                                                                )}
                                                            >
                                                                {m.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                {/* Quick Jumps */}
                                                <div className="px-2 pb-2 mt-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const d = new Date()
                                                            setSelectedMonth(d.getMonth())
                                                            setSelectedYear(d.getFullYear())
                                                            setPickerYear(d.getFullYear())
                                                            setIsMonthPickerOpen(false)
                                                        }}
                                                        className="w-full py-2 rounded-xl text-[9px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-colors uppercase tracking-widest"
                                                    >
                                                        {t("common.today") || "Today"}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs @md:text-sm mt-1.5 font-medium italic">
                            {t("budgets.manageSubtitle")}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-fit"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t("budgets.addBudget")}</span>
                    </button>
                </div>

                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 @md:p-8">
                    <div className="flex flex-col @md:flex-row @md:items-end gap-6">
                        <div className="flex-1 grid grid-cols-3 gap-3 @md:gap-8">
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{t("budgets.totalBudget")}</p>
                                <p className="text-sm @md:text-2xl font-semibold text-gray-900 tracking-tight">{formatRp(totalBudget)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{t("budgets.spent")}</p>
                                <p className="text-sm @md:text-2xl font-semibold text-gray-900 tracking-tight">{formatRp(totalSpent)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{t("budgets.remaining")}</p>
                                <p className="text-sm @md:text-2xl font-semibold tracking-tight text-gray-900">
                                    {totalRemaining >= 0 ? formatRp(totalRemaining) : `-${formatRp(Math.abs(totalRemaining))}`}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-sm font-semibold shrink-0",
                            globalPct >= 100 ? "text-rose-600 bg-rose-50 border-rose-100"
                                : globalPct >= 70 ? "text-amber-600 bg-amber-50 border-amber-100"
                                    : "text-blue-600 bg-blue-50 border-blue-100"
                        )}>
                            {globalPct >= 100 ? <AlertTriangle className="w-4 h-4" /> : globalPct >= 70 ? <Zap className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                            {globalPct}% {t("budgets.spent")}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(globalPct, 100)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={cn("h-full rounded-full", getBarColor(globalPct))}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] font-semibold text-gray-400">Rp 0</span>
                            <span className="text-[10px] font-semibold text-gray-400">{formatRp(totalBudget)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">{t("budgets.listTitle")}</h3>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-4",
                        budgets.length > 0 ? "grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3" : "grid-cols-1"
                    )}>
                        {budgets.length > 0 ? (
                            budgets.map((cat, i) => {
                                const pct = getPercent(cat.spent, cat.limit)
                                const status = getStatusBadge(pct)
                                const isOver = pct >= 100
                                const remaining = cat.limit - cat.spent
                                const StatusIcon = status.icon

                                return (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className={cn(
                                            "bg-white rounded-3xl border shadow-sm p-5 transition-all cursor-pointer group hover:shadow-md",
                                            isOver ? "border-rose-100 hover:border-rose-200" : "border-gray-100 hover:border-gray-200"
                                        )}
                                        onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                                                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                                >
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">{getCategoryLabel(cat.name)}</h4>
                                                    <p className="text-[10px] font-semibold text-gray-400">
                                                        {formatRp(cat.spent)} <span className="text-gray-300">/</span> {formatRp(cat.limit)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-semibold", status.color)}>
                                                <StatusIcon className="w-2.5 h-2.5" />
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(pct, 100)}%` }}
                                                transition={{ duration: 0.6, delay: i * 0.06 + 0.2 }}
                                                className={cn("h-full rounded-full", getBarColor(pct))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-gray-900">
                                                {isOver
                                                    ? <span>{t("budgets.overLimit")} {formatRp(Math.abs(remaining))}</span>
                                                    : <span>{t("budgets.remaining")} {formatRp(remaining)}</span>
                                                }
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingBudget(cat)
                                                        setEditDisplayValue(formatThousands(cat.limit.toString()))
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title={t("budgets.editBudget")}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="p-1.5 rounded-lg text-gray-300 group-hover:text-gray-500 transition-colors">
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-[32px] border border-dashed border-gray-200 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                                    <Wallet className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">{t("budgets.noBudgets")}</h3>
                                <p className="text-xs text-gray-500 font-medium max-w-xs mb-8 leading-relaxed">
                                    {t("budgets.noBudgetsDesc")}
                                </p>
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group"
                                >
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                    <span>{t("budgets.addBudget")}</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="px-6 @md:px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${selectedCategory.color}15`, color: selectedCategory.color }}
                                >
                                    <selectedCategory.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{getCategoryLabel(selectedCategory.name)} {t("transactions.title")}</h3>
                                    <p className="text-[10px] font-semibold text-gray-400">{t("dashboard.thisMonth")}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto no-scrollbar">
                            {txLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{t("common.loading")}</p>
                                </div>
                            ) : selectedCategory.transactions.length === 0 ? (
                                <p className="px-8 py-12 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">{t("transactions.noTransactions")}</p>
                            ) : selectedCategory.transactions.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between px-6 @md:px-8 py-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                            <ReceiptText className="w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{tx.desc}</p>
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-rose-600">-{formatRp(tx.amount)}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {mounted && editingBudget && createPortal(
                <AnimatePresence>
                    {editingBudget && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setEditingBudget(null)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-[210] flex items-center justify-center p-4"
                            >
                                {editingBudget && (
                                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                                style={{ backgroundColor: `${editingBudget.color}15`, color: editingBudget.color }}
                                            >
                                                <editingBudget.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{t("budgets.editBudget")}</h3>
                                                <p className="text-[10px] font-semibold text-gray-400">{getCategoryLabel(editingBudget.name)}</p>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2">{t("budgets.setLimit")} (Rp)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Rp</span>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={editDisplayValue}
                                                    onChange={(e) => {
                                                        setEditDisplayValue(formatThousands(e.target.value))
                                                    }}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-semibold text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="2.000.000"
                                                />
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-400 mt-2">
                                                {t("budgets.spent")}: <span className="font-semibold text-gray-600">{formatRp(editingBudget.spent)}</span>
                                            </p>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={() => setEditingBudget(null)}
                                                className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                            >
                                                {t("common.cancel")}
                                            </button>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex-1 px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                {t("common.save")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {mounted && createPortal(
                <AnimatePresence>
                    {isAddOpen && (
                        <AddCategoryModal
                            onClose={() => setIsAddOpen(false)}
                            currentMonth={currentMonthKey}
                            onAdd={() => {
                                fetchData()
                                setIsAddOpen(false)
                            }}
                            getCategoryLabel={getCategoryLabel}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}

/* ─── Add Category Modal Component ─── */
const availableCategories = [
    { name: "Food & Drinks", icon: UtensilsCrossed, color: "#3b82f6" },
    { name: "Transport", icon: Car, color: "#f97316" },
    { name: "Entertainment", icon: Gamepad2, color: "#a855f7" },
    { name: "Shopping", icon: ShoppingBag, color: "#ec4899" },
    { name: "Education", icon: GraduationCap, color: "#0ea5e9" },
    { name: "Health", icon: HeartPulse, color: "#10b981" },
    { name: "Home & Bills", icon: Home, color: "#6366f1" },
    { name: "Gadgets", icon: Smartphone, color: "#14b8a6" },
    { name: "Travel", icon: Plane, color: "#f59e0b" },
    { name: "Utilities", icon: Zap, color: "#ef4444" },
]

const formatThousandsLocal = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return ""
    return parseInt(digits, 10).toLocaleString("id-ID")
}

function AddCategoryModal({
    onClose,
    onAdd,
    currentMonth,
    getCategoryLabel
}: {
    onClose: () => void
    onAdd: () => void
    currentMonth: string,
    getCategoryLabel: (cat: string) => string
}) {
    const { t } = useTranslation()
    const [selectedCat, setSelectedCat] = useState<typeof availableCategories[0] | null>(null)
    const [displayValue, setDisplayValue] = useState("")

    const handleSave = async () => {
        if (!selectedCat || !displayValue) return
        const val = parseInt(displayValue.replace(/\D/g, ""), 10)
        if (isNaN(val) || val <= 0) return

        const { error } = await upsertBudget({
            category: selectedCat.name,
            limit: val,
            monthYear: currentMonth
        })

        if (!error) {
            onAdd()
        } else {
            alert(error)
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">{t("budgets.addBudget")}</h3>
                            <p className="text-[10px] font-semibold text-gray-400">{t("budgets.setLimit")}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-3">{t("dashboard.topCategories")}</label>
                        <div className="grid grid-cols-5 gap-2">
                            {availableCategories.map((cat) => {
                                const CatIcon = cat.icon
                                const isSelected = selectedCat?.name === cat.name
                                return (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCat(cat)}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all",
                                            isSelected
                                                ? "border-blue-400 bg-blue-50 shadow-sm"
                                                : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                        >
                                            <CatIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[8px] font-semibold text-gray-600 truncate w-full text-center">{getCategoryLabel(cat.name)}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2">{t("budgets.setLimit")} (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={displayValue}
                                onChange={(e) => setDisplayValue(formatThousandsLocal(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-semibold text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="1.000.000"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedCat || !displayValue}
                            className={cn(
                                "flex-1 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg",
                                selectedCat && displayValue
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            {t("budgets.saveBudget")}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
