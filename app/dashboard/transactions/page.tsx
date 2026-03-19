"use client"

import { useState, useMemo, useEffect, useRef } from "react"
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
    Zap,
    Camera,
    UploadCloud,
    Loader2,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatRp } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/app/actions/transactions"
import { parseReceipt } from "@/app/actions/ocr"
import { useTranslation } from "@/lib/i18n/useTranslation"
import { suggestCategory } from "@/lib/smart-categorize"

// Types
type TransactionStatus = 'success' | 'pending' | 'failed'
type TransactionType = 'income' | 'expense'

interface Transaction {
    id: string
    description: string
    amount: number
    category: string
    date: string // ISO format YYYY-MM-DD
    type: TransactionType
    status: TransactionStatus
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
    "Pocket Money": { icon: Wallet, color: "#10b981" },
    "Investment": { icon: TrendingUp, color: "#10b981" },
    "Gift": { icon: HeartPulse, color: "#10b981" }
}

const expenseCategories = ["Food & Drinks", "Transport", "Shopping", "Entertainment", "Education", "Health", "Home & Bills", "Gadgets", "Travel", "Utilities", "Others"]
const incomeCategories = ["Salary", "Bonus", "Part-time Job", "Pocket Money", "Investment", "Gift", "Others"]

export default function TransactionsPage() {
    const { t, locale } = useTranslation()
    const searchParams = useSearchParams()
    const urlQuery = searchParams.get('q') || ""

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [transactionsLoading, setTransactionsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const now = new Date()
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
    const [selectedYear, setSelectedYear] = useState(now.getFullYear())
    const [pickerYear, setPickerYear] = useState(now.getFullYear())
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
    const [isLifetime, setIsLifetime] = useState(false)
    const mounted = useRef(true)

    const months = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => {
            const d = new Date(pickerYear, i, 1)
            return {
                month: i,
                label: d.toLocaleDateString('id-ID', { month: 'short' })
            }
        })
    }, [pickerYear])

    const fetchTransactions = async () => {
        const { data, error } = await getTransactions()
        if (mounted.current) {
            if (!error && data) setTransactions(data)
            setTransactionsLoading(false)
        }
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterCategory, setFilterCategory] = useState("All")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isScanModalOpen, setIsScanModalOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [selectedDetail, setSelectedDetail] = useState<Transaction | null>(null)

    // Handle Category from URL
    useEffect(() => {
        const catParam = searchParams.get('category')
        if (catParam && (categoryConfig[catParam] || catParam === "Others")) {
            setFilterCategory(catParam)
        }
    }, [searchParams])

    useEffect(() => {
        mounted.current = true
        fetchTransactions()
        return () => { mounted.current = false }
    }, [])

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
    const [isAutoDetected, setIsAutoDetected] = useState(false)

    // Reset Form
    const resetForm = () => {
        setEditingTransaction(null)
        setType('expense')
        setDescription("")
        setAmount("")
        setCategory(expenseCategories[0])
        setDate(new Date().toISOString().split('T')[0])
        setNote("")
        setIsAutoDetected(false)
    }

    // Effect to switch default category when type changes
    useEffect(() => {
        if (!editingTransaction) {
            setCategory(type === 'expense' ? expenseCategories[0] : incomeCategories[0])
        }
    }, [type, editingTransaction])

    // Smart Auto-Categorization: suggest category from description
    useEffect(() => {
        if (editingTransaction || type !== 'expense') return
        const suggested = suggestCategory(description)
        if (suggested && expenseCategories.includes(suggested)) {
            setCategory(suggested)
            setIsAutoDetected(true)
        }
    }, [description, type, editingTransaction])

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
        return transactions.filter(entry => {
            const query = searchQuery.toLowerCase()
            const matchesSearch =
                entry.description.toLowerCase().includes(query)

            const matchesCategory = filterCategory === "All" || entry.category === filterCategory

            const txDate = new Date(entry.date)
            const matchesMonth = txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear

            return matchesSearch && matchesCategory && matchesMonth
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [transactions, searchQuery, filterCategory, selectedMonth, selectedYear])

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredTransactions, currentPage])

    const totalIncome = filteredTransactions.filter(entry => entry.type === 'income').reduce((acc, entry) => acc + entry.amount, 0)
    const totalExpense = filteredTransactions.filter(entry => entry.type === 'expense').reduce((acc, entry) => acc + entry.amount, 0)
    const monthlyBalance = totalIncome - totalExpense

    const lifetimeIncome = transactions.filter(entry => entry.type === 'income').reduce((acc, entry) => acc + entry.amount, 0)
    const lifetimeExpense = transactions.filter(entry => entry.type === 'expense').reduce((acc, entry) => acc + entry.amount, 0)
    const lifetimeBalance = lifetimeIncome - lifetimeExpense

    const displayStats = isLifetime ? {
        income: lifetimeIncome,
        expense: lifetimeExpense,
        balance: lifetimeBalance
    } : {
        income: totalIncome,
        expense: totalExpense,
        balance: monthlyBalance
    }

    const monthLabel = new Date(selectedYear, selectedMonth).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' })

    const formatAmountCompact = (val: number) => {
        if (Math.abs(val) >= 1000000) {
            return (val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt'
        }
        if (Math.abs(val) >= 1000) {
            return (val / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + 'k'
        }
        return val.toLocaleString('id-ID')
    }

    const formatThousands = (raw: string) => {
        const digits = raw.replace(/\D/g, "")
        if (!digits) return ""
        return parseInt(digits, 10).toLocaleString("id-ID")
    }

    const handleSave = async () => {
        if (!description || !amount || !category || !date) return
        const amountNum = parseInt(amount.replace(/\D/g, ""), 10)
        if (editingTransaction) {
            const { error: err } = await updateTransaction(editingTransaction.id, {
                description,
                amount: amountNum,
                category,
                date,
                type,
                status: editingTransaction.status,
                paymentMethod: editingTransaction.paymentMethod,
                note: note || undefined,
            })
            if (!err) {
                await fetchTransactions()
                setIsModalOpen(false)
                resetForm()
            }
        } else {
            const { data: newT, error: err } = await createTransaction({
                description,
                amount: amountNum,
                category,
                date,
                type,
                status: "success",
                paymentMethod: "Balance",
                note: note || undefined,
            })
            if (!err && newT) {
                setTransactions(prev => [newT, ...prev])
                setIsModalOpen(false)
                resetForm()
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t("transactions.deleteConfirm"))) return
        const { error } = await deleteTransaction(id)
        if (!error) {
            await fetchTransactions()
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

    const handleDeleteSelected = async () => {
        if (!confirm(`${t("common.delete")} ${selectedIds.size} ${t("transactions.title").toLowerCase()}?`)) return
        for (const id of selectedIds) {
            await deleteTransaction(id)
        }
        await fetchTransactions()
        setSelectedIds(new Set())
    }

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
            "Others": "other",
            "Salary": "salary",
            "Bonus": "bonus",
            "Part-time Job": "partTime",
            "Pocket Money": "pocketMoney",
            "Investment": "investment",
            "Gift": "gift"
        }
        const key = keyMap[cat]
        return key ? t(`transactions.categories.${key}`) : cat
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.")
            return
        }

        setIsScanning(true)
        try {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64Data = reader.result?.toString().split(',')[1]
                if (base64Data) {
                    const result = await parseReceipt(base64Data, file.type)
                    if (result.data) {
                        resetForm()
                        setType('expense')
                        setDescription(result.data.description || "")
                        setAmount(result.data.amount?.toString() || "")
                        
                        if (expenseCategories.includes(result.data.category)) {
                            setCategory(result.data.category)
                            setIsAutoDetected(true)
                        } else {
                            setCategory("Others")
                        }
                        
                        setIsScanModalOpen(false)
                        setIsModalOpen(true)
                    } else {
                        alert(t("transactions.receiptScanFailed") || "Failed to scan receipt")
                    }
                }
                setIsScanning(false)
            }
        } catch (error) {
            console.error("Scan error:", error)
            alert(t("transactions.receiptScanFailed") || "Error scanning receipt")
            setIsScanning(false)
        }
    }

    return (
        <div className="space-y-10 pb-32" suppressHydrationWarning>
            {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">{t("transactions.title")}</h2>
                        
                        {/* Premium Month Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] @md:text-xs font-semibold transition-all shadow-sm whitespace-nowrap",
                                    isLifetime 
                                        ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 active:scale-95" 
                                        : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-blue-200 hover:text-blue-600 active:scale-95"
                                )}
                            >
                                <CalendarIcon className={cn("w-3 h-3 transition-colors", isLifetime ? "text-white/80" : "text-gray-400")} />
                                <span className="capitalize leading-none">{isLifetime ? t("transactions.lifetime") : monthLabel}</span>
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
                                            {/* Filter Type Toggle */}
                                            <div className="p-2 bg-gray-50/50 border-b border-gray-100">
                                                <div className="flex bg-gray-200/50 p-1 rounded-xl">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setIsLifetime(false); }}
                                                        className={cn(
                                                            "flex-1 px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                                                            !isLifetime ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-500"
                                                        )}
                                                    >
                                                        {t("transactions.monthly")}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setIsLifetime(true); }}
                                                        className={cn(
                                                            "flex-1 px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                                                            isLifetime ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-500"
                                                        )}
                                                    >
                                                        {t("transactions.lifetime")}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Year Selector Header */}
                                            <div className={cn("flex items-center justify-between px-3 py-2 bg-gray-50/50 border-b border-gray-100 transition-opacity", isLifetime && "opacity-50 pointer-events-none")}>
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
                                            <div className={cn("p-2 grid grid-cols-3 gap-1 transition-opacity", isLifetime && "opacity-50 pointer-events-none")}>
                                                {months.map((m) => {
                                                    const isSelected = selectedMonth === m.month && selectedYear === pickerYear
                                                    const isCurrentMonth = now.getMonth() === m.month && now.getFullYear() === pickerYear
                                                    
                                                    return (
                                                        <button
                                                            key={m.month}
                                                            onClick={() => {
                                                                setSelectedMonth(m.month)
                                                                setSelectedYear(pickerYear)
                                                                setIsMonthPickerOpen(false)
                                                                setCurrentPage(1)
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
                                            <div className={cn("px-2 pb-2 mt-1 transition-opacity", isLifetime && "opacity-50 pointer-events-none")}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        const d = new Date()
                                                        setSelectedMonth(d.getMonth())
                                                        setSelectedYear(d.getFullYear())
                                                        setPickerYear(d.getFullYear())
                                                        setIsMonthPickerOpen(false)
                                                        setCurrentPage(1)
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
                    <p className="text-gray-500 text-sm mt-2 font-medium whitespace-nowrap"> {t("transactions.manageSubtitle")}</p>
                </div>

                <div className="flex items-center justify-end w-full">
                    {/* Right side: Actions & Filters */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-3 pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-semibold text-gray-600 outline-none hover:border-blue-100 transition-all shadow-sm relative group"
                            >
                                <Filter className={cn("w-4 h-4 transition-colors", isFilterOpen ? "text-blue-600" : "text-gray-400")} />
                                <span>{filterCategory === "All" ? t("transactions.allCategories") : getCategoryLabel(filterCategory)}</span>
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
                                            className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl border border-gray-100 shadow-2xl z-50 overflow-hidden p-2"
                                        >
                                            <div className="max-h-[360px] overflow-y-auto custom-scrollbar space-y-1">
                                                <button
                                                    onClick={() => { setFilterCategory("All"); setIsFilterOpen(false); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-semibold transition-all",
                                                        filterCategory === "All" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                    )}
                                                >
                                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", filterCategory === "All" ? "bg-white/20" : "bg-gray-100")}>
                                                        <FilterX className="w-4 h-4" />
                                                    </div>
                                                    <span>{t("transactions.allCategories")}</span>
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
                                                                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-semibold transition-all group/item",
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
                                                            <span className="truncate">{getCategoryLabel(c)}</span>
                                                            {isSelected && <Check className="w-3.5 h-3.5 ml-auto" />}
                                                        </button>
                                                    )
                                                })}

                                                <button
                                                    onClick={() => { setFilterCategory("Others"); setIsFilterOpen(false); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-semibold transition-all",
                                                        filterCategory === "Others" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                    )}
                                                >
                                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", filterCategory === "Others" ? "bg-white/20" : "bg-gray-100")}>
                                                        <OthersIcon className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <span>{t("transactions.categories.other")}</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setIsScanModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-2xl text-xs font-semibold hover:bg-blue-100 transition-all shadow-sm border border-blue-100/50 group"
                            title={t("transactions.scanTooltip")}
                        >
                            <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="hidden leading-none @sm:inline">{t("transactions.scanReceipt")}</span>
                        </button>
                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 group"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            <span className="hidden leading-none @sm:inline">{t("transactions.addTransaction")}</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Transaction Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t("transactions.income"), value: formatRp(displayStats.income), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: t("transactions.expense"), value: formatRp(displayStats.expense), icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: t("dashboard.totalBalance"), value: formatRp(displayStats.balance), icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
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
                                <th className="px-8 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">{t("common.description")}</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">{t("common.category")}</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">{t("common.date")}</th>
                                <th className="px-6 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-left">{t("common.amount")}</th>
                                <th className="px-8 py-4 text-[11px] font-medium text-[#6B7280] uppercase tracking-widest text-right">{t("common.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {paginatedTransactions.map((entry) => (
                                <tr key={entry.id} className="hover:bg-[#F9FAFB] transition-all group">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-normal text-[#1F2937] tracking-tight">{entry.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-start">
                                            {(() => {
                                                const config = categoryConfig[entry.category] || categoryConfig["Others"]
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
                                                        {getCategoryLabel(entry.category)}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-normal text-[#6B7280]">{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-normal text-[#1F2937]">{formatRp(entry.amount)}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => setSelectedDetail(entry)}
                                            className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-medium text-gray-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            {t("dashboard.viewDetails")}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-[#E5E7EB]">
                    {paginatedTransactions.map((entry) => (
                        <div key={entry.id} className="p-6 space-y-4 hover:bg-[#F9FAFB] transition-all" onClick={() => setSelectedDetail(entry)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-lg font-normal text-[#1F2937] tracking-tight leading-none">{entry.description}</p>
                                </div>
                                <div className="flex justify-start">
                                    {(() => {
                                        const config = categoryConfig[entry.category] || categoryConfig["Others"]
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
                                                {getCategoryLabel(entry.category)}
                                            </span>
                                        )
                                    })()}
                                </div>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <p className="text-xs text-[#6B7280] font-normal mb-0.5">{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                    <p className="text-base font-normal text-[#1F2937]">{formatRp(entry.amount)}</p>
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
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                                {t("common.showing")} <span className="text-gray-900">{Math.min(filteredTransactions.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(filteredTransactions.length, currentPage * ITEMS_PER_PAGE)}</span> {t("common.of")} <span className="text-gray-900">{filteredTransactions.length}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {t("common.back")}
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={cn(
                                                "w-8 h-8 rounded-xl text-[10px] font-semibold transition-all",
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
                                    className="px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {t("common.next")}
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Scan Receipt Modal */}
            <AnimatePresence>
                {isScanModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isScanning && setIsScanModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden p-8 text-center"
                        >
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{t("transactions.scanReceipt")}</h3>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                    {t("transactions.scanReceiptSubtitle")}
                                </p>
                            </div>

                            <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isScanning}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                                <div className="flex flex-col items-center gap-4">
                                    {isScanning ? (
                                        <>
                                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                            <p className="text-sm font-semibold text-blue-600">{t("transactions.analyzingReceipt")}</p>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                            <p className="text-sm font-medium text-gray-600 px-4">{t("transactions.dragDropReceipt")}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setIsScanModalOpen(false)}
                                disabled={isScanning}
                                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {t("challenges.cancel")}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight">{selectedDetail.description}</h3>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1.5">{t("dashboard.viewDetails")}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedDetail(null)}
                                            className="p-2.5 hover:bg-white/80 rounded-xl transition-all"
                                        >
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Amount hero */}
                                    <div className="mt-8 flex items-baseline gap-2">
                                        <span className={cn(
                                            "text-3xl font-semibold tracking-tight",
                                            isIncome ? "text-emerald-600" : "text-rose-600"
                                        )}>
                                            {isIncome ? "+" : "-"} {formatRp(selectedDetail.amount)}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg",
                                            isIncome ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"
                                        )}>
                                            {getCategoryLabel(selectedDetail.category)}
                                        </span>
                                    </div>
                                </div>

                                {/* Details grid - fields from Add Transaction */}
                                <div className="px-6 py-5 space-y-6">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{t("dashboard.details")}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: t("common.date"), value: new Date(selectedDetail.date).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }), icon: CalendarIcon },
                                            { label: t("subscriptions.billingCycle"), value: selectedDetail.paymentMethod, icon: Wallet },
                                            { label: t("common.status"), value: selectedDetail.status.charAt(0).toUpperCase() + selectedDetail.status.slice(1), statusKey: selectedDetail.status, icon: Check }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                                <item.icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                                    <p className={cn(
                                                        "text-sm font-semibold truncate",
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
                                            <p className="text-[10px] font-semibold text-amber-700/80 uppercase tracking-wider mb-1">{t("transactions.note")}</p>
                                            <p className="text-sm font-medium text-gray-700">{selectedDetail.note}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setEditingTransaction(selectedDetail); setSelectedDetail(null); }}
                                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            {t("common.edit")}
                                        </button>
                                        <button
                                            onClick={() => { handleDelete(selectedDetail.id); setSelectedDetail(null); }}
                                            className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {t("common.delete")}
                                        </button>
                                    </div>

                                </div>
                            </motion.div>
                        </div>
                    )
                })()}
            </AnimatePresence >


            {/* Transaction Modal */}
            <AnimatePresence>
                {
                    isModalOpen && (
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
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 tracking-tight leading-none">
                                            {editingTransaction ? t("common.edit") + " " + t("transactions.title") : t("transactions.addTransaction")}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => { setIsModalOpen(false); resetForm(); }}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                {/* Tab Switcher - Simple & Clean */}
                                <div className="px-6 pt-6">
                                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                        <button
                                            onClick={() => setType('expense')}
                                            className={cn(
                                                "flex-1 py-3 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all",
                                                type === 'expense' ? "bg-white text-rose-600 shadow-sm border border-rose-100/50" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            {t("transactions.expense")}
                                        </button>
                                        <button
                                            onClick={() => setType('income')}
                                            className={cn(
                                                "flex-1 py-3 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all",
                                                type === 'income' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100/50" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            {t("transactions.income")}
                                        </button>
                                    </div>
                                </div>
                                {/* Description */}
                                <div className="space-y-6 px-6 py-5">
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2 px-1">{t("common.description")}</label>
                                        <input
                                            type="text"
                                            placeholder="..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        />
                                    </div>

                                    {/* Amount & Date Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2 px-1">{t("common.amount")} (Rp)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 italic">Rp</span>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={formatThousands(amount)}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-semibold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2 px-1">{t("common.date")}</label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Selection */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{t("dashboard.topCategories")}</label>
                                            {isAutoDetected && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-semibold text-blue-600 animate-in fade-in">
                                                    <span>✨</span> Auto-detected
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                            {(type === 'expense' ? expenseCategories : incomeCategories).map((c: string) => {
                                                const config = categoryConfig[c] || categoryConfig["Others"]
                                                const CatIcon = config.icon
                                                const color = config.color
                                                const isSelected = category === c
                                                return (
                                                    <button
                                                        key={c}
                                                        onClick={() => { setCategory(c); setIsAutoDetected(false); }}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                                            isSelected
                                                                ? "text-white shadow-lg scale-105"
                                                                : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                                                        )}
                                                        style={isSelected ? { backgroundColor: color, borderColor: color, boxShadow: `0 10px 15px -3px ${color}33` } : {}}
                                                    >
                                                        <CatIcon className="w-5 h-5" />
                                                        <span className={cn("text-[8px] font-semibold truncate w-full text-center", isSelected ? "text-white" : "text-gray-500")}>
                                                            {getCategoryLabel(c).split(' ')[0]}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2 px-1">{t("transactions.note")}</label>
                                        <textarea
                                            rows={2}
                                            placeholder="..."
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
                                        "w-full mt-8 py-4 rounded-2xl font-semibold text-sm tracking-widest uppercase transition-all shadow-xl",
                                        (!description || !amount)
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10 hover:-translate-y-0.5"
                                    )}
                                >
                                    {editingTransaction ? t("common.save") : t("transactions.addTransaction")}
                                </button>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </div >
    )
}
