"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Calendar as CalendarIcon,
    ChevronDown,
    Pencil,
    Trash2,
    UtensilsCrossed,
    Car,
    Gamepad2,
    ShoppingBag,
    GraduationCap,
    HeartPulse,
    MoreHorizontal as OthersIcon,
    Wallet,
    DollarSign,
    TrendingUp,
    TrendingDown,
    X,
    FilterX,
    Check,
    ReceiptText,
    Home,
    Smartphone,
    Plane,
    Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

// Types
type TransactionStatus = 'success' | 'pending' | 'failed'
type TransactionType = 'income' | 'expense'

interface Transaction {
    id: string
    invoiceId: string
    description: string
    amount: number
    category: string
    date: string // ISO format YYYY-MM-DD
    type: TransactionType
    status: TransactionStatus
    plan: string
    paymentMethod: string
    note?: string
}

// Core Application Theme
const ThemeColors = {
    background: "bg-slate-50/50",
    card: "bg-white",
    primary: "text-blue-600",
    primaryBg: "bg-blue-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-500",
    border: "border-gray-100"
}

// Categories Configuration (Synced with Budget Page)
const categoryConfig: Record<string, { icon: any, color: string }> = {
    "Food & Drinks": { icon: UtensilsCrossed, color: "#3b82f6" },
    "Transport": { icon: Car, color: "#f97316" },
    "Shopping": { icon: ShoppingBag, color: "#ec4899" },
    "Entertainment": { icon: Gamepad2, color: "#a855f7" },
    "Education": { icon: GraduationCap, color: "#0ea5e9" },
    "Health": { icon: HeartPulse, color: "#10b981" },
    "Home & Bills": { icon: Home, color: "#6366f1" },
    "Gadgets": { icon: Smartphone, color: "#14b8a6" },
    "Travel": { icon: Plane, color: "#f59e0b" },
    "Utilities": { icon: Zap, color: "#ef4444" },
    "Others": { icon: OthersIcon, color: "#94a3b8" },
    // Income Categories
    "Salary": { icon: TrendingUp, color: "#10b981" },
    "Bonus": { icon: DollarSign, color: "#10b981" },
    "Part-time Job": { icon: Wallet, color: "#10b981" },
    "Investment": { icon: TrendingUp, color: "#10b981" },
    "Gift": { icon: HeartPulse, color: "#10b981" }
}

const expenseCategories = ["Food & Drinks", "Transport", "Shopping", "Entertainment", "Education", "Health", "Home & Bills", "Gadgets", "Travel", "Utilities", "Others"]
const incomeCategories = ["Salary", "Bonus", "Part-time Job", "Investment", "Gift", "Others"]
const initialTransactions: Transaction[] = [
    { id: "1", invoiceId: "INV-2026-001", description: "Spotify Premium", amount: 54990, category: "Entertainment", date: "2026-02-18", type: "expense", status: "success", plan: "Premium Monthly", paymentMethod: "Credit Card" },
    { id: "2", invoiceId: "INV-2026-002", description: "Freelance Payment", amount: 2500000, category: "Part-time Job", date: "2026-02-17", type: "income", status: "success", plan: "Web Project", paymentMethod: "Bank Transfer" },
    { id: "3", invoiceId: "INV-2026-003", description: "Netflix Duo", amount: 186000, category: "Entertainment", date: "2026-02-17", type: "expense", status: "pending", plan: "Standard Plan", paymentMethod: "E-Wallet" },
    { id: "4", invoiceId: "INV-2026-004", description: "Adobe CC", amount: 350000, category: "Education", date: "2026-02-16", type: "expense", status: "failed", plan: "Creative Cloud", paymentMethod: "Credit Card" },
    { id: "5", invoiceId: "INV-2026-005", description: "Shell V-Power", amount: 150000, category: "Transport", date: "2026-02-15", type: "expense", status: "success", plan: "Fuel", paymentMethod: "Cash" },
    { id: "6", invoiceId: "INV-2026-006", description: "Starbucks Coffee", amount: 55000, category: "Food & Drinks", date: "2026-02-14", type: "expense", status: "success", plan: "Cafe", paymentMethod: "Credit Card" },
    { id: "7", invoiceId: "INV-2026-007", description: "Monthly Bonus", amount: 1000000, category: "Bonus", date: "2026-02-14", type: "income", status: "success", plan: "Incentive", paymentMethod: "Bank Transfer" },
    { id: "8", invoiceId: "INV-2026-008", description: "GrabFood Order", amount: 85000, category: "Food & Drinks", date: "2026-02-13", type: "expense", status: "success", plan: "Dinner", paymentMethod: "E-Wallet" },
    { id: "9", invoiceId: "INV-2026-009", description: "Gojek Ride", amount: 25000, category: "Transport", date: "2026-02-13", type: "expense", status: "success", plan: "Transport", paymentMethod: "Cash" },
    { id: "10", invoiceId: "INV-2026-010", description: "Indomaret Grocery", amount: 120000, category: "Shopping", date: "2026-02-12", type: "expense", status: "success", plan: "Daily Needs", paymentMethod: "Credit Card" },
    { id: "11", invoiceId: "INV-2026-011", description: "Gym Membership", amount: 300000, category: "Health", date: "2026-02-11", type: "expense", status: "success", plan: "Monthly Pass", paymentMethod: "Bank Transfer" },
    { id: "12", invoiceId: "INV-2026-012", description: "Cloud Hosting", amount: 450000, category: "Others", date: "2026-02-10", type: "expense", status: "success", plan: "SaaS", paymentMethod: "Credit Card" },
    { id: "13", invoiceId: "INV-2026-013", description: "Dividend Payment", amount: 500000, category: "Investment", date: "2026-02-10", type: "income", status: "success", plan: "Stocks", paymentMethod: "Bank Transfer" },
    { id: "14", invoiceId: "INV-2026-014", description: "Steam Sale", amount: 250000, category: "Entertainment", date: "2026-02-09", type: "expense", status: "success", plan: "Gaming", paymentMethod: "E-Wallet" },
    { id: "15", invoiceId: "INV-2026-015", description: "Electricity Bill", amount: 1200000, category: "Utilities", date: "2026-02-08", type: "expense", status: "success", plan: "Postpaid", paymentMethod: "Bank Transfer" },
    { id: "16", invoiceId: "INV-2026-016", description: "Tiktok Shop", amount: 150000, category: "Shopping", date: "2026-02-07", type: "expense", status: "success", plan: "Lifestyle", paymentMethod: "E-Wallet" },
    { id: "17", invoiceId: "INV-2026-017", description: "Kopi Kenangan", amount: 32000, category: "Food & Drinks", date: "2026-02-06", type: "expense", status: "success", plan: "Coffee", paymentMethod: "Cash" },
    { id: "18", invoiceId: "INV-2026-018", description: "Consultation Fee", amount: 3000000, category: "Salary", date: "2026-02-05", type: "income", status: "success", plan: "Professional", paymentMethod: "Bank Transfer" },
    { id: "19", invoiceId: "INV-2026-019", description: "Pertamax Turbo", amount: 200000, category: "Transport", date: "2026-02-04", type: "expense", status: "success", plan: "Fuel", paymentMethod: "Credit Card" },
    { id: "20", invoiceId: "INV-2026-020", description: "Disney+ Hotstar", amount: 39000, category: "Entertainment", date: "2026-02-03", type: "expense", status: "success", plan: "Annual Plan", paymentMethod: "E-Wallet" },
]

export default function TransactionsPage() {
    const searchParams = useSearchParams()
    const urlQuery = searchParams.get('q') || ""

    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [selectedDetail, setSelectedDetail] = useState<Transaction | null>(null)
    const [filterCategory, setFilterCategory] = useState("All Categories")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    // Sync searchQuery with URL
    const searchQuery = useMemo(() => urlQuery, [urlQuery])

    // Reset Page on Filter/Search
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory])

    // Form State
    const [type, setType] = useState<TransactionType>('expense')
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState(expenseCategories[0])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [note, setNote] = useState("")

    // Reset Form
    const resetForm = () => {
        setEditingTransaction(null)
        setType('expense')
        setDescription("")
        setAmount("")
        setCategory(expenseCategories[0])
        setDate(new Date().toISOString().split('T')[0])
        setNote("")
    }

    // Effect to switch default category when type changes
    useEffect(() => {
        if (!editingTransaction) {
            setCategory(type === 'expense' ? expenseCategories[0] : incomeCategories[0])
        }
    }, [type, editingTransaction])

    // Load editing data
    useEffect(() => {
        if (editingTransaction) {
            setType(editingTransaction.type)
            setDescription(editingTransaction.description)
            setAmount(editingTransaction.amount.toString())
            setCategory(editingTransaction.category)
            setDate(editingTransaction.date)
            setNote(editingTransaction.note || "")
            setIsModalOpen(true)
        }
    }, [editingTransaction])

    // Derived Data
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const query = searchQuery.toLowerCase()
            const matchesSearch =
                t.description.toLowerCase().includes(query) ||
                t.invoiceId.toLowerCase().includes(query) ||
                t.plan.toLowerCase().includes(query)

            const matchesCategory = filterCategory === "All Categories" || t.category === filterCategory

            return matchesSearch && matchesCategory
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [transactions, searchQuery, filterCategory])

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredTransactions, currentPage])

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
    const balance = totalIncome - totalExpense

    const formatRp = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val).replace('Rp', 'Rp ')
    }

    const formatThousands = (raw: string) => {
        const digits = raw.replace(/\D/g, "")
        if (!digits) return ""
        return parseInt(digits, 10).toLocaleString("id-ID")
    }

    const handleSave = () => {
        if (!description || !amount || !category || !date) return

        const transactionData: Transaction = {
            id: editingTransaction ? editingTransaction.id : Date.now().toString(),
            invoiceId: editingTransaction ? editingTransaction.invoiceId : `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            description,
            amount: parseInt(amount.replace(/\D/g, ""), 10),
            category,
            date,
            type,
            status: editingTransaction ? editingTransaction.status : 'success',
            plan: editingTransaction ? editingTransaction.plan : 'Personal Plan',
            paymentMethod: editingTransaction ? editingTransaction.paymentMethod : 'Balance',
            note
        }

        if (editingTransaction) {
            setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transactionData : t))
        } else {
            setTransactions(prev => [transactionData, ...prev])
        }

        setIsModalOpen(false)
        resetForm()
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            setTransactions(prev => prev.filter(t => t.id !== id))
            const newSelection = new Set(selectedIds)
            newSelection.delete(id)
            setSelectedIds(newSelection)
        }
    }

    const handleToggleSelect = (id: string) => {
        const newSelection = new Set(selectedIds)
        if (newSelection.has(id)) newSelection.delete(id)
        else newSelection.add(id)
        setSelectedIds(newSelection)
    }

    const handleSelectAll = () => {
        if (selectedIds.size === paginatedTransactions.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(paginatedTransactions.map(t => t.id)))
        }
    }

    const handleDeleteSelected = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.size} transactions?`)) {
            setTransactions(prev => prev.filter(t => !selectedIds.has(t.id)))
            setSelectedIds(new Set())
        }
    }

    return (
        <div className="space-y-10 pb-32" suppressHydrationWarning>
            {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions</h2>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Track your payments and subscription history</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-3 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 outline-none hover:border-blue-100 transition-all shadow-sm relative group"
                        >
                            <Filter className={cn("w-4 h-4 transition-colors", isFilterOpen ? "text-blue-600" : "text-gray-400")} />
                            <span>{filterCategory === "All Categories" ? "All Categories" : filterCategory}</span>
                            <ChevronDown className={cn("absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200", isFilterOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute top-full left-0 mt-3 w-64 bg-white rounded-3xl border border-gray-100 shadow-2xl z-50 overflow-hidden p-2"
                                    >
                                        <div className="max-h-[360px] overflow-y-auto custom-scrollbar space-y-1">
                                            <button
                                                onClick={() => { setFilterCategory("All Categories"); setIsFilterOpen(false); }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all",
                                                    filterCategory === "All Categories" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                )}
                                            >
                                                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", filterCategory === "All Categories" ? "bg-white/20" : "bg-gray-100")}>
                                                    <FilterX className="w-4 h-4" />
                                                </div>
                                                <span>All Categories</span>
                                            </button>

                                            <div className="h-px bg-gray-50 my-2 mx-2" />

                                            {[...expenseCategories, ...incomeCategories].filter(c => c !== "Others").map((c) => {
                                                const config = categoryConfig[c] || categoryConfig["Others"]
                                                const Icon = config.icon
                                                const isSelected = filterCategory === c
                                                return (
                                                    <button
                                                        key={c}
                                                        onClick={() => { setFilterCategory(c); setIsFilterOpen(false); }}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all group/item",
                                                            isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                                                isSelected ? "bg-white/20" : "bg-gray-100"
                                                            )}
                                                            style={!isSelected ? { color: config.color, backgroundColor: `${config.color}10` } : {}}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="truncate">{c}</span>
                                                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto" />}
                                                    </button>
                                                )
                                            })}

                                            {/* Miscellaneous/Others at the bottom */}
                                            <button
                                                onClick={() => { setFilterCategory("Others"); setIsFilterOpen(false); }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all",
                                                    filterCategory === "Others" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                )}
                                            >
                                                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", filterCategory === "Others" ? "bg-white/20" : "bg-gray-100")}>
                                                    <OthersIcon className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span>Others</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {/* Transaction Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Income", value: formatRp(totalIncome), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Expenses", value: formatRp(totalExpense), icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Current Balance", value: formatRp(balance), icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* SaaS Hybrid Table / List */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                <th className="px-8 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">Invoice</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">Transaction</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">Category</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">Date</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">Amount</th>
                                <th className="px-8 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {paginatedTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-[#F9FAFB] transition-all group">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-normal text-[#1F2937] tracking-tight">{t.invoiceId}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-normal text-[#1F2937] tracking-tight">{t.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-start">
                                            {(() => {
                                                const config = categoryConfig[t.category] || categoryConfig["Others"]
                                                const Icon = config.icon
                                                const color = config.color
                                                return (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg uppercase tracking-widest border border-current/10"
                                                        style={{
                                                            backgroundColor: `${color}15`,
                                                            color: color
                                                        }}
                                                    >
                                                        <Icon className="w-3 h-3" />
                                                        {t.category}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-normal text-[#6B7280]">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-normal text-[#1F2937]">{formatRp(t.amount)}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => setSelectedDetail(t)}
                                            className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-medium text-gray-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-[#E5E7EB]">
                    {paginatedTransactions.map((t) => (
                        <div key={t.id} className="p-6 space-y-4 hover:bg-[#F9FAFB] transition-all" onClick={() => setSelectedDetail(t)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-normal text-[#6B7280] uppercase tracking-widest mb-1">{t.invoiceId}</p>
                                    <p className="text-lg font-normal text-[#1F2937] tracking-tight leading-none">{t.description}</p>
                                </div>
                                <div className="flex justify-start">
                                    {(() => {
                                        const config = categoryConfig[t.category] || categoryConfig["Others"]
                                        const Icon = config.icon
                                        const color = config.color
                                        return (
                                            <span
                                                className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-lg uppercase tracking-widest border border-current/10"
                                                style={{
                                                    backgroundColor: `${color}15`,
                                                    color: color
                                                }}
                                            >
                                                <Icon className="w-2.5 h-2.5" />
                                                {t.category}
                                            </span>
                                        )
                                    })()}
                                </div>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <p className="text-xs text-[#6B7280] font-normal mb-0.5">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                    <p className="text-base font-normal text-[#1F2937]">{formatRp(t.amount)}</p>
                                </div>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-xl text-[#23486A]">
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls - Integrated */}
                {
                    totalPages > 1 && (
                        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Showing <span className="text-gray-900">{Math.min(filteredTransactions.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(filteredTransactions.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="text-gray-900">{filteredTransactions.length}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-8 h-8 rounded-xl text-[10px] font-black transition-all",
                                                currentPage === i + 1
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                    : "text-gray-400 hover:bg-gray-100"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Detail Modal Layer - Mirrors Add Transaction fields + meta info */}
            <AnimatePresence>
                {selectedDetail && (() => {
                    const config = categoryConfig[selectedDetail.category] || categoryConfig["Others"]
                    const CatIcon = config.icon
                    const catColor = config.color
                    const isIncome = selectedDetail.type === 'income'
                    const statusColors = { success: "bg-emerald-500/15 text-emerald-600 border-emerald-200", pending: "bg-amber-500/15 text-amber-600 border-amber-200", failed: "bg-rose-500/15 text-rose-600 border-rose-200" }
                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedDetail(null)}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                                transition={{ type: "spring", damping: 24, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
                            >
                                {/* Header with gradient accent */}
                                <div
                                    className="relative px-6 pt-6 pb-8"
                                    style={{ background: `linear-gradient(135deg, ${catColor}08 0%, ${catColor}03 100%)` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                                style={{ backgroundColor: `${catColor}18`, color: catColor }}
                                            >
                                                <CatIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{selectedDetail.invoiceId}</p>
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{selectedDetail.description}</h3>
                                                <span
                                                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider"
                                                    style={{ backgroundColor: `${catColor}18`, color: catColor }}
                                                >
                                                    {selectedDetail.category}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedDetail(null)}
                                            className="p-2.5 hover:bg-white/80 rounded-xl transition-all"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                    {/* Amount hero */}
                                    <div className="mt-6 flex items-baseline gap-2">
                                        <span className={cn(
                                            "text-2xl font-black tracking-tight",
                                            isIncome ? "text-emerald-600" : "text-rose-600"
                                        )}>
                                            {isIncome ? "+" : "-"} {formatRp(selectedDetail.amount)}
                                        </span>
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                                            isIncome ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"
                                        )}>
                                            {selectedDetail.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Details grid - fields from Add Transaction */}
                                <div className="px-6 py-5 space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Details</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: "Date", value: new Date(selectedDetail.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }), icon: CalendarIcon },
                                            { label: "Payment Method", value: selectedDetail.paymentMethod, icon: Wallet },
                                            { label: "Plan", value: selectedDetail.plan, icon: DollarSign },
                                            { label: "Status", value: selectedDetail.status.charAt(0).toUpperCase() + selectedDetail.status.slice(1), statusKey: selectedDetail.status, icon: Check }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                                <item.icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                                    <p className={cn(
                                                        "text-sm font-bold truncate",
                                                        item.statusKey
                                                            ? `capitalize px-2 py-0.5 rounded-md inline-block border ${statusColors[item.statusKey as TransactionStatus]}`
                                                            : "text-gray-900"
                                                    )}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedDetail.note && (
                                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                                            <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider mb-1">Note</p>
                                            <p className="text-sm font-medium text-gray-700">{selectedDetail.note}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setEditingTransaction(selectedDetail); setSelectedDetail(null); }}
                                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => { handleDelete(selectedDetail.id); setSelectedDetail(null); }}
                                            className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                    
                                </div>
                            </motion.div>
                        </div>
                    )
                })()}
            </AnimatePresence>


            {/* Transaction Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[20px] shadow-2xl w-full max-w-lg p-6 @md:p-8 relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{editingTransaction ? "Edit Transaction" : "New Transaction"}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Fill in the details below</p>
                                </div>
                                <button
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="p-2.5 rounded-2xl hover:bg-gray-100 text-gray-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Type Toggle */}
                            <div className="bg-gray-50 p-1 rounded-2xl flex gap-1 mb-8">
                                <button
                                    onClick={() => setType('expense')}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                                        type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Expense
                                </button>
                                <button
                                    onClick={() => setType('income')}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                                        type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Income
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Description */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Lunch with friends"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>

                                {/* Amount & Date Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Amount (Rp)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 italic">Rp</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={formatThousands(amount)}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-black text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3 px-1">Select Category</label>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {(type === 'expense' ? expenseCategories : incomeCategories).map((c: string) => {
                                            const config = categoryConfig[c] || categoryConfig["Others"]
                                            const CatIcon = config.icon
                                            const color = config.color
                                            const isSelected = category === c
                                            return (
                                                <button
                                                    key={c}
                                                    onClick={() => setCategory(c)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                                        isSelected
                                                            ? "text-white shadow-lg scale-105"
                                                            : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                                                    )}
                                                    style={isSelected ? { backgroundColor: color, borderColor: color, boxShadow: `0 10px 15px -3px ${color}33` } : {}}
                                                >
                                                    <CatIcon className="w-5 h-5" />
                                                    <span className={cn("text-[8px] font-bold truncate w-full text-center", isSelected ? "text-white" : "text-gray-500")}>
                                                        {c.split(' ')[0]}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2 px-1">Note (Optional)</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Add a small detail..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={!description || !amount}
                                className={cn(
                                    "w-full mt-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl",
                                    (!description || !amount)
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10 hover:-translate-y-0.5"
                                )}
                            >
                                {editingTransaction ? "Update Transaction" : "Save Transaction"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    )
}
