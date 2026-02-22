"use client"

import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    Wallet, UtensilsCrossed, Car, Gamepad2, ShoppingBag,
    GraduationCap, HeartPulse, Zap, Home, Smartphone, Plane,
    Plus, Pencil, ChevronRight, AlertTriangle, CheckCircle2,
    X, ReceiptText, ChevronDown, Calendar as CalendarIcon, Loader2
} from "lucide-react"
import { getBudgets, upsertBudget, deleteBudget } from "@/app/actions/budgets"
import { getCategorySpending } from "@/app/actions/transactions"

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

/* ─── Sample Data ─── */
const initialBudgets: BudgetCategory[] = [
    {
        id: "1", name: "Food & Drinks", icon: UtensilsCrossed, color: "#3b82f6",
        limit: 2000000, spent: 1600000,
        transactions: [
            { desc: "Grabfood – Nasi Padang", amount: 45000, date: "20 Feb" },
            { desc: "Kopi Kenangan", amount: 32000, date: "19 Feb" },
            { desc: "Warteg Lunch", amount: 25000, date: "18 Feb" },
            { desc: "Indomaret Snack", amount: 18000, date: "17 Feb" },
        ]
    },
    {
        id: "2", name: "Transport", icon: Car, color: "#f97316",
        limit: 800000, spent: 920000,
        transactions: [
            { desc: "Gojek to Campus", amount: 24000, date: "20 Feb" },
            { desc: "Pertamina Full Tank", amount: 80000, date: "18 Feb" },
            { desc: "Tol Cipularang", amount: 45000, date: "16 Feb" },
        ]
    },
    {
        id: "3", name: "Entertainment", icon: Gamepad2, color: "#a855f7",
        limit: 500000, spent: 350000,
        transactions: [
            { desc: "Netflix Premium", amount: 186000, date: "1 Feb" },
            { desc: "Steam – New Game", amount: 120000, date: "14 Feb" },
        ]
    },
    {
        id: "4", name: "Shopping", icon: ShoppingBag, color: "#ec4899",
        limit: 1000000, spent: 450000,
        transactions: [
            { desc: "Shopee – Shirt", amount: 250000, date: "12 Feb" },
            { desc: "Tokopedia – Accessories", amount: 150000, date: "8 Feb" },
        ]
    },
    {
        id: "5", name: "Education", icon: GraduationCap, color: "#0ea5e9",
        limit: 1500000, spent: 1200000,
        transactions: [
            { desc: "Textbooks", amount: 120000, date: "5 Feb" },
            { desc: "English Course", amount: 500000, date: "1 Feb" },
            { desc: "Print Resources", amount: 35000, date: "15 Feb" },
        ]
    },
    {
        id: "6", name: "Health", icon: HeartPulse, color: "#10b981",
        limit: 600000, spent: 180000,
        transactions: [
            { desc: "Pharmacy – Vitamins", amount: 85000, date: "10 Feb" },
            { desc: "Gym Membership", amount: 95000, date: "1 Feb" },
        ]
    },
]

/* ─── Helpers ─── */
const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID")

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

const getPercent = (spent: number, limit: number) =>
    Math.round((spent / limit) * 100)

const getBarColor = (pct: number) => {
    return "bg-blue-600"
}

const getStatusBadge = (pct: number) => {
    if (pct >= 100) return { label: "Over Limit", color: "text-rose-600 bg-rose-50 border-rose-100", icon: AlertTriangle }
    if (pct >= 90) return { label: "Hampir Habis", color: "text-amber-600 bg-amber-50 border-amber-100", icon: AlertTriangle }
    if (pct >= 70) return { label: "Perhatian", color: "text-amber-500 bg-amber-50/60 border-amber-100", icon: Zap }
    return { label: "Aman", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 }
}

/* ─── Page ─── */
export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<BudgetCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)
    const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null)
    // display-formatted strings (e.g. "2.000.000")
    const [editDisplayValue, setEditDisplayValue] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState("February 2026")
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // month format: "YYYY-MM"
    const [currentMonthKey, setCurrentMonthKey] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })

    const displayMonth = useMemo(() => {
        const [year, month] = currentMonthKey.split("-").map(Number)
        const date = new Date(year, month - 1, 1)
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }, [currentMonthKey])

    const months = useMemo(() => {
        const options = []
        const now = new Date()
        for (let i = -6; i <= 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
            options.push({
                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
                label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            })
        }
        return options
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const [budgetsRes, spendingRes] = await Promise.all([
            getBudgets(currentMonthKey),
            getCategorySpending(currentMonthKey)
        ])

        if (budgetsRes.data) {
            const spending = spendingRes.data || {}

            // Map Budget Row to BudgetCategory type
            const mapped: BudgetCategory[] = budgetsRes.data.map((b: any) => {
                const config = availableCategories.find(c => c.name === b.category) || availableCategories[availableCategories.length - 1]
                return {
                    id: b.id,
                    name: b.category,
                    icon: config.icon,
                    color: config.color,
                    limit: b.limit,
                    spent: spending[b.category] || 0,
                    transactions: [] // We'll fetch these when selected
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
            // Optionally fetch transactions for the selected category
            // For now we'll just show the category detail
        }
    }, [selectedCategory])

    // Global stats
    const totalBudget = budgets.reduce((a, b) => a + b.limit, 0)
    const totalSpent = budgets.reduce((a, b) => a + b.spent, 0)
    const totalRemaining = totalBudget - totalSpent
    const globalPct = getPercent(totalSpent, totalBudget)

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

            {/* ════════════════════════════════════════════════════
                1️⃣  HEADER — Budget Overview
               ════════════════════════════════════════════════════ */}
            <div>
                <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Budgets</h2>
                            <div className="relative">
                                <button
                                    onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                                    suppressHydrationWarning={true}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] @md:text-xs font-bold text-gray-500 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                                >
                                    <CalendarIcon className="w-3 h-3" />
                                    {displayMonth}
                                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isMonthPickerOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isMonthPickerOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsMonthPickerOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden py-1"
                                            >
                                                {months.map((m) => (
                                                    <button
                                                        key={m.key}
                                                        onClick={() => {
                                                            setCurrentMonthKey(m.key)
                                                            setIsMonthPickerOpen(false)
                                                        }}
                                                        suppressHydrationWarning={true}
                                                        className={cn(
                                                            "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between",
                                                            currentMonthKey === m.key ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"
                                                        )}
                                                    >
                                                        {m.label}
                                                        {currentMonthKey === m.key && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs @md:text-sm mt-1.5 font-medium italic">
                            Set limits and monitor your spending across categories to stay in control.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        suppressHydrationWarning={true}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-fit"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Global Overview Card */}
                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 @md:p-8">
                    <div className="flex flex-col @md:flex-row @md:items-end gap-6">
                        <div className="flex-1 grid grid-cols-3 gap-3 @md:gap-8">
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Budget</p>
                                <p className="text-sm @md:text-2xl font-bold text-gray-900 tracking-tight">{formatRp(totalBudget)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Used</p>
                                <p className="text-sm @md:text-2xl font-bold text-gray-900 tracking-tight">{formatRp(totalSpent)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] @md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Remaining</p>
                                <p className="text-sm @md:text-2xl font-bold tracking-tight text-gray-900">
                                    {totalRemaining >= 0 ? formatRp(totalRemaining) : `-${formatRp(Math.abs(totalRemaining))}`}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-sm font-black shrink-0",
                            globalPct >= 100 ? "text-rose-600 bg-rose-50 border-rose-100"
                                : globalPct >= 70 ? "text-amber-600 bg-amber-50 border-amber-100"
                                    : "text-blue-600 bg-blue-50 border-blue-100"
                        )}>
                            {globalPct >= 100 ? <AlertTriangle className="w-4 h-4" /> : globalPct >= 70 ? <Zap className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                            {globalPct}% used
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
                            <span className="text-[10px] font-bold text-gray-400">Rp 0</span>
                            <span className="text-[10px] font-bold text-gray-400">{formatRp(totalBudget)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════
                2️⃣  CATEGORY BUDGET CARDS
               ════════════════════════════════════════════════════ */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Category Budgets</h3>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4">
                        {budgets.map((cat, i) => {
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
                                                <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                                                <p className="text-[10px] font-semibold text-gray-400">
                                                    {formatRp(cat.spent)} <span className="text-gray-300">/</span> {formatRp(cat.limit)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold", status.color)}>
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
                                        <span className="text-[11px] font-bold text-gray-900">
                                            {isOver
                                                ? <span>Over {formatRp(Math.abs(remaining))}</span>
                                                : <span>Sisa {formatRp(remaining)}</span>
                                            }
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingBudget(cat)
                                                    setEditDisplayValue(formatThousands(cat.limit.toString()))
                                                }}
                                                suppressHydrationWarning={true}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="Edit limit"
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
                        })}
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════
                3️⃣  TRANSACTION DETAIL SLIDE-UP
               ════════════════════════════════════════════════════ */}
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
                                    <h3 className="text-base font-bold text-gray-900">{selectedCategory.name} Transactions</h3>
                                    <p className="text-[10px] font-semibold text-gray-400">This month</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                suppressHydrationWarning={true}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {selectedCategory.transactions.length === 0 ? (
                                <p className="px-8 py-8 text-center text-sm text-gray-400 font-medium">No transactions this month.</p>
                            ) : selectedCategory.transactions.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between px-6 @md:px-8 py-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                            <ReceiptText className="w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{tx.desc}</p>
                                            <p className="text-[10px] font-medium text-gray-400">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-rose-600">-{formatRp(tx.amount)}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ════════════════════════════════════════════════════
                4️⃣  EDIT LIMIT MODAL — via portal
               ════════════════════════════════════════════════════ */}
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
                                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: `${editingBudget.color}15`, color: editingBudget.color }}
                                        >
                                            <editingBudget.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">Edit Limit</h3>
                                            <p className="text-[10px] font-semibold text-gray-400">{editingBudget.name}</p>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Monthly Limit (Rp)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={editDisplayValue}
                                                onChange={(e) => {
                                                    setEditDisplayValue(formatThousands(e.target.value))
                                                }}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="2.000.000"
                                            />
                                        </div>
                                        <p className="text-[10px] font-medium text-gray-400 mt-2">
                                            Current spending: <span className="font-bold text-gray-600">{formatRp(editingBudget.spent)}</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setEditingBudget(null)}
                                            suppressHydrationWarning={true}
                                            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            suppressHydrationWarning={true}
                                            className="flex-1 px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* ════════════════════════════════════════════════════
                5️⃣  ADD CATEGORY MODAL — via portal
               ════════════════════════════════════════════════════ */}
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
    currentMonth
}: {
    onClose: () => void
    onAdd: () => void
    currentMonth: string
}) {
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
                            <h3 className="text-base font-bold text-gray-900">Add Budget Category</h3>
                            <p className="text-[10px] font-semibold text-gray-400">Choose category and set limit</p>
                        </div>
                        <button
                            onClick={onClose}
                            suppressHydrationWarning={true}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Category picker */}
                    <div className="mb-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Select Category</label>
                        <div className="grid grid-cols-5 gap-2">
                            {availableCategories.map((cat) => {
                                const CatIcon = cat.icon
                                const isSelected = selectedCat?.name === cat.name
                                return (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCat(cat)}
                                        suppressHydrationWarning={true}
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
                                        <span className="text-[8px] font-bold text-gray-600 truncate w-full text-center">{cat.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Limit input */}
                    <div className="mb-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Monthly Limit (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={displayValue}
                                onChange={(e) => setDisplayValue(formatThousandsLocal(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold text-gray-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="1.000.000"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            suppressHydrationWarning={true}
                            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedCat || !displayValue}
                            suppressHydrationWarning={true}
                            className={cn(
                                "flex-1 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-lg",
                                selectedCat && displayValue
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            Add Budget
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
