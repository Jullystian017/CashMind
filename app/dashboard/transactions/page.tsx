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
    Check
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

// Types
type TransactionType = 'income' | 'expense'

interface Transaction {
    id: string
    description: string
    amount: number
    category: string
    date: string // ISO format YYYY-MM-DD
    type: TransactionType
    note?: string
}

// Category Icons Mapping
const categoryIcons: Record<string, any> = {
    "Food & Drinks": UtensilsCrossed,
    "Transport": Car,
    "Entertainment": Gamepad2,
    "Shopping": ShoppingBag,
    "Education": GraduationCap,
    "Health": HeartPulse,
    "Others": OthersIcon,
    "Pocket Money": Wallet,
    "Part-time Job": DollarSign,
    "Bonus": TrendingUp,
    "Gift": HeartPulse, // Using HeartPulse as placeholder for Gift
}

const expenseCategories = [
    "Food & Drinks",
    "Transport",
    "Entertainment",
    "Education",
    "Health",
    "Shopping",
    "Others"
]

const incomeCategories = [
    "Pocket Money",
    "Part-time Job",
    "Bonus",
    "Gift"
]

const categoryColors: Record<string, string> = {
    "Food & Drinks": "#3b82f6",
    "Transport": "#f97316",
    "Entertainment": "#a855f7",
    "Education": "#6366f1",
    "Health": "#ef4444",
    "Shopping": "#ec4899",
    "Others": "#94a3b8",
    "Pocket Money": "#10b981",
    "Part-time Job": "#0ea5e9",
    "Bonus": "#f59e0b",
    "Gift": "#8b5cf6",
}

const initialTransactions: Transaction[] = [
    { id: "1", description: "Starbucks Coffee", amount: 55000, category: "Food & Drinks", date: "2026-02-18", type: "expense" },
    { id: "2", description: "Freelance Payment", amount: 2500000, category: "Part-time Job", date: "2026-02-17", type: "income" },
    { id: "3", description: "Indomaret Plus", amount: 120000, category: "Shopping", date: "2026-02-17", type: "expense" },
    { id: "4", description: "Spotify Premium", amount: 54990, category: "Entertainment", date: "2026-02-16", type: "expense" },
    { id: "5", description: "Shell V-Power", amount: 150000, category: "Transport", date: "2026-02-15", type: "expense" },
    { id: "6", description: "Ayam Penyet", amount: 25000, category: "Food & Drinks", date: "2026-02-14", type: "expense" },
    { id: "7", description: "Monthly Bonus", amount: 1000000, category: "Bonus", date: "2026-02-14", type: "income" },
    { id: "8", description: "Cinema Ticket", amount: 50000, category: "Entertainment", date: "2026-02-13", type: "expense" },
    { id: "9", description: "Grab Ride", amount: 35000, category: "Transport", date: "2026-02-13", type: "expense" },
    { id: "10", description: "School Supplies", amount: 200000, category: "Education", date: "2026-02-12", type: "expense" },
    { id: "11", description: "GoFood Order", amount: 85000, category: "Food & Drinks", date: "2026-02-11", type: "expense" },
    { id: "12", description: "Birthday Gift", amount: 500000, category: "Gift", date: "2026-02-10", type: "income" },
    { id: "13", description: "Pharmacy", amount: 45000, category: "Health", date: "2026-02-09", type: "expense" },
    { id: "14", description: "E-wallet Top-up", amount: 500000, category: "Others", date: "2026-02-08", type: "expense" },
    { id: "15", description: "Monthly Pocket Money", amount: 3000000, category: "Pocket Money", date: "2026-02-01", type: "income" },
    { id: "16", description: "Gym Membership", amount: 350000, category: "Health", date: "2026-02-01", type: "expense" },
    { id: "17", description: "Steam Wallet", amount: 150000, category: "Entertainment", date: "2026-01-30", type: "expense" },
    { id: "18", description: "Laundry", amount: 30000, category: "Others", date: "2026-01-29", type: "expense" },
    { id: "19", description: "Bus Fare", amount: 10000, category: "Transport", date: "2026-01-28", type: "expense" },
    { id: "20", description: "Side Hustle Project", amount: 750000, category: "Part-time Job", date: "2026-01-27", type: "income" },
]

export default function TransactionsPage() {
    const searchParams = useSearchParams()
    const urlQuery = searchParams.get('q') || ""

    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

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
            const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || t.category === selectedCategory
            return matchesSearch && matchesCategory
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [transactions, searchQuery, selectedCategory])

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
            description,
            amount: parseInt(amount.replace(/\D/g, ""), 10),
            category,
            date,
            type,
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
        <div className="space-y-8 pb-24" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Transactions</h2>
                    <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium">Keep track of every penny coming in and out.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative min-w-[160px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            suppressHydrationWarning={true}
                            className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-100 rounded-2xl text-[10px] @md:text-xs font-bold text-gray-500 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm appearance-none cursor-pointer outline-none"
                        >
                            <option value="All">All Categories</option>
                            <optgroup label="Expenses">
                                {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </optgroup>
                            <optgroup label="Income">
                                {incomeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </optgroup>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        suppressHydrationWarning
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-fit"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Balance", value: balance, icon: Wallet, color: "text-gray-900", bg: "bg-white" },
                    { label: "Income", value: totalIncome, icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-white" },
                    { label: "Expenses", value: totalExpense, icon: ArrowDownRight, color: "text-rose-600", bg: "bg-white" }
                ].map((stat, i) => (
                    <div key={i} className={cn("p-6 rounded-[28px] border border-gray-100 shadow-sm", stat.bg)}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50", stat.color)}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
                        </div>
                        <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>{formatRp(stat.value)}</p>
                    </div>
                ))}
            </div>



            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-gray-800 backdrop-blur-xl bg-opacity-90"
                    >
                        <div className="flex items-center gap-3 pr-6 border-r border-gray-800">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs">
                                {selectedIds.size}
                            </div>
                            <span className="text-xs font-bold tracking-wide uppercase">Selected</span>
                        </div>
                        <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-xs font-black uppercase tracking-widest"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete All</span>
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="text-gray-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transactions Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-6">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-[48px_2fr_1.2fr_1.2fr_1.2fr_100px] px-8 py-4 bg-gray-50 border-b border-gray-100 items-center">
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleSelectAll}
                                    className={cn(
                                        "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center",
                                        selectedIds.size === paginatedTransactions.length && paginatedTransactions.length > 0
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "border-gray-200 bg-white hover:border-blue-400"
                                    )}
                                >
                                    {selectedIds.size === paginatedTransactions.length && paginatedTransactions.length > 0 && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                </button>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Transaction</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-left pl-6 leading-none">Category</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-left pl-3 leading-none">Date</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none text-right pr-22 whitespace-nowrap">Amount</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none text-right">Actions</span>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {paginatedTransactions.length > 0 ? paginatedTransactions.map((t, i) => {
                                const catColor = categoryColors[t.category] || "#94a3b8"
                                const isSelected = selectedIds.has(t.id)
                                return (
                                    <motion.div
                                        key={t.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={cn(
                                            "grid grid-cols-[48px_2fr_1.2fr_1.2fr_1.2fr_100px] items-center px-8 py-5 hover:bg-gray-50/80 transition-all group",
                                            isSelected && "bg-blue-50/30 hover:bg-blue-50/50"
                                        )}
                                    >
                                        {/* Row Selection */}
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleToggleSelect(t.id)}
                                                className={cn(
                                                    "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center",
                                                    isSelected
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "border-gray-200 bg-white group-hover:border-blue-300"
                                                )}
                                            >
                                                {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                            </button>
                                        </div>
                                        {/* Column 1: Transaction */}
                                        <div className="min-w-0 pr-4">
                                            <p className="text-sm font-bold text-gray-900 leading-none mb-1.5">{t.description}</p>
                                            {t.note && <p className="text-[10px] text-gray-400 font-medium truncate">{t.note}</p>}
                                        </div>

                                        {/* Column 2: Category */}
                                        <div className="flex justify-start">
                                            <span
                                                className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest border border-current/10"
                                                style={{ backgroundColor: `${catColor}15`, color: catColor }}
                                            >
                                                {t.category}
                                            </span>
                                        </div>

                                        {/* Column 3: Date */}
                                        <div className="flex justify-start">
                                            <span
                                                className="text-[11px] font-bold text-gray-400 tracking-tight"
                                                suppressHydrationWarning={true}
                                            >
                                                {new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Column 4: Amount */}
                                        <div className="text-right pr-20">
                                            <p className={cn(
                                                "text-sm font-extrabold tracking-tight whitespace-nowrap",
                                                t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{formatRp(t.amount)}
                                            </p>
                                        </div>

                                        {/* Column 5: Actions */}
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => setEditingTransaction(t)}
                                                suppressHydrationWarning={true}
                                                className="p-2 rounded-xl text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                suppressHydrationWarning={true}
                                                className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            }) : (
                                <div className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">No transactions found</p>
                                            <p className="text-xs text-gray-400">Try adjusting your filters or search query.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
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
                )}
            </div>

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
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-6 @md:p-8 relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
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
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
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
                                                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-black text-gray-900 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
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
                                                className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3 px-1">Select Category</label>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {(type === 'expense' ? expenseCategories : incomeCategories).map((c) => {
                                            const CatIcon = categoryIcons[c] || OthersIcon
                                            const isSelected = category === c
                                            return (
                                                <button
                                                    key={c}
                                                    onClick={() => setCategory(c)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                                        isSelected
                                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                                                            : "bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-200 hover:bg-blue-50/30"
                                                    )}
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
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
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
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 hover:-translate-y-0.5"
                                )}
                            >
                                {editingTransaction ? "Update Transaction" : "Save Transaction"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
