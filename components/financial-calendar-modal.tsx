"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────
interface DayTransaction {
    id: string
    name: string
    category: string
    amount: number
    isExpense: boolean
    time: string
}

interface DayData {
    expense: number
    income: number
    transactions: DayTransaction[]
}

// ── Sample Data ───────────────────────────────────────────────────────────────
const calendarData: Record<number, DayData> = {
    1: { expense: 45000, income: 0, transactions: [{ id: "t1", name: "Indomaret", category: "Grocery", amount: 45000, isExpense: true, time: "08:12" }] },
    2: { expense: 120000, income: 0, transactions: [{ id: "t2", name: "GrabFood", category: "Food", amount: 75000, isExpense: true, time: "12:30" }, { id: "t2b", name: "Tokopedia", category: "Shopping", amount: 45000, isExpense: true, time: "19:00" }] },
    3: { expense: 0, income: 500000, transactions: [{ id: "t3", name: "Freelance Payment", category: "Income", amount: 500000, isExpense: false, time: "09:00" }] },
    4: { expense: 35000, income: 0, transactions: [{ id: "t4", name: "Kopi Kenangan", category: "Food", amount: 35000, isExpense: true, time: "07:45" }] },
    5: { expense: 280000, income: 0, transactions: [{ id: "t5", name: "Bensin", category: "Transport", amount: 80000, isExpense: true, time: "06:30" }, { id: "t5b", name: "Makan Siang", category: "Food", amount: 55000, isExpense: true, time: "13:00" }, { id: "t5c", name: "Baju Distro", category: "Shopping", amount: 145000, isExpense: true, time: "16:20" }] },
    6: { expense: 60000, income: 0, transactions: [{ id: "t6", name: "Netflix", category: "Entertainment", amount: 60000, isExpense: true, time: "00:01" }] },
    7: { expense: 95000, income: 0, transactions: [{ id: "t7", name: "GrabBike", category: "Transport", amount: 35000, isExpense: true, time: "09:10" }, { id: "t7b", name: "Bakso", category: "Food", amount: 60000, isExpense: true, time: "18:30" }] },
    9: { expense: 15000, income: 0, transactions: [{ id: "t9", name: "Parkir", category: "Transport", amount: 15000, isExpense: true, time: "14:00" }] },
    10: { expense: 550000, income: 0, transactions: [{ id: "t10", name: "Kos Bulanan", category: "Rent", amount: 550000, isExpense: true, time: "08:00" }] },
    11: { expense: 78000, income: 0, transactions: [{ id: "t11", name: "Dinner Fancy", category: "Food", amount: 78000, isExpense: true, time: "19:30" }] },
    12: { expense: 45000, income: 200000, transactions: [{ id: "t12", name: "Ojek Online", category: "Transport", amount: 45000, isExpense: true, time: "10:00" }, { id: "t12b", name: "Transfer Masuk", category: "Income", amount: 200000, isExpense: false, time: "13:30" }] },
    13: { expense: 320000, income: 0, transactions: [{ id: "t13", name: "Belanja Bulanan", category: "Grocery", amount: 320000, isExpense: true, time: "10:30" }] },
    14: { expense: 25000, income: 0, transactions: [{ id: "t14", name: "Snack Alfamart", category: "Grocery", amount: 25000, isExpense: true, time: "15:45" }] },
    15: { expense: 0, income: 1500000, transactions: [{ id: "t15", name: "Gaji Paruh Waktu", category: "Income", amount: 1500000, isExpense: false, time: "09:00" }] },
    16: { expense: 190000, income: 0, transactions: [{ id: "t16", name: "Makan + Nongkrong", category: "Food", amount: 190000, isExpense: true, time: "20:00" }] },
    18: { expense: 67000, income: 0, transactions: [{ id: "t18", name: "Spotify", category: "Entertainment", amount: 37000, isExpense: true, time: "00:01" }, { id: "t18b", name: "YouTube Premium", category: "Entertainment", amount: 30000, isExpense: true, time: "00:02" }] },
    19: { expense: 420000, income: 0, transactions: [{ id: "t19", name: "Sepatu Nike", category: "Shopping", amount: 420000, isExpense: true, time: "14:00" }] },
    20: { expense: 85000, income: 0, transactions: [{ id: "t20", name: "GrabFood + Kopi", category: "Food", amount: 85000, isExpense: true, time: "12:15" }] },
    21: { expense: 50000, income: 75000, transactions: [{ id: "t21", name: "Cetak Foto", category: "Others", amount: 50000, isExpense: true, time: "11:00" }, { id: "t21b", name: "Jual Barang Bekas", category: "Income", amount: 75000, isExpense: false, time: "16:00" }] },
    23: { expense: 110000, income: 0, transactions: [{ id: "t23", name: "Bensin + Tol", category: "Transport", amount: 110000, isExpense: true, time: "07:00" }] },
    24: { expense: 38000, income: 0, transactions: [{ id: "t24", name: "Indomie + Telur", category: "Grocery", amount: 38000, isExpense: true, time: "09:30" }] },
    26: { expense: 730000, income: 0, transactions: [{ id: "t26", name: "Fashion Haul", category: "Shopping", amount: 450000, isExpense: true, time: "13:00" }, { id: "t26b", name: "Dinner Date", category: "Food", amount: 280000, isExpense: true, time: "19:45" }] },
    27: { expense: 55000, income: 0, transactions: [{ id: "t27", name: "Parkir + Tol", category: "Transport", amount: 55000, isExpense: true, time: "08:30" }] },
    29: { expense: 42000, income: 0, transactions: [{ id: "t29", name: "Kopi Pagi", category: "Food", amount: 42000, isExpense: true, time: "07:15" }] },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatRp(val: number) {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`
    return `${val}`
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const categoryColors: Record<string, string> = {
    Food: "bg-orange-100 text-orange-600",
    Transport: "bg-blue-100 text-blue-600",
    Shopping: "bg-pink-100 text-pink-600",
    Grocery: "bg-green-100 text-green-600",
    Entertainment: "bg-purple-100 text-purple-600",
    Rent: "bg-red-100 text-red-600",
    Income: "bg-emerald-100 text-emerald-600",
    Others: "bg-gray-100 text-gray-600",
}

function getHeat(expense: number) {
    if (expense === 0) return ""
    if (expense < 50000) return "low"
    if (expense < 150000) return "medium"
    if (expense < 400000) return "high"
    return "critical"
}

const heatClasses = {
    low: "bg-blue-50 border-blue-200 text-blue-600",
    medium: "bg-amber-50 border-amber-200 text-amber-700",
    high: "bg-orange-100 border-orange-300 text-orange-700",
    critical: "bg-rose-100 border-rose-300 text-rose-700",
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
    isOpen: boolean
    onClose: () => void
}

export function FinancialCalendarModal({ isOpen, onClose }: Props) {
    const today = new Date()
    const [mounted, setMounted] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    // Mobile: show detail panel as overlay when day selected
    const [showDetail, setShowDetail] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [isOpen, onClose])

    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const prevMonth = () => {
        setSelectedDay(null); setShowDetail(false)
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
    }
    const nextMonth = () => {
        setSelectedDay(null); setShowDetail(false)
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
    }

    const handleDayClick = (day: number, isSelected: boolean) => {
        setSelectedDay(isSelected ? null : day)
        setShowDetail(!isSelected)
    }

    const selectedData = selectedDay ? (calendarData[selectedDay] ?? { expense: 0, income: 0, transactions: [] }) : null
    const totalMonthExpense = Object.values(calendarData).reduce((s, d) => s + d.expense, 0)
    const totalMonthIncome = Object.values(calendarData).reduce((s, d) => s + d.income, 0)

    const DetailPanel = () => (
        <AnimatePresence mode="wait">
            {selectedDay && selectedData ? (
                <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                >
                    <div className="mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Selected</p>
                        <h4 className="text-2xl font-black text-gray-900">{MONTHS[currentMonth].slice(0, 3)} {selectedDay}</h4>
                        <div className="flex gap-4 mt-2">
                            {selectedData.expense > 0 && (
                                <div>
                                    <p className="text-[9px] font-bold text-rose-400 uppercase">Expense</p>
                                    <p className="text-base font-black text-rose-600">Rp {formatRp(selectedData.expense)}</p>
                                </div>
                            )}
                            {selectedData.income > 0 && (
                                <div>
                                    <p className="text-[9px] font-bold text-emerald-400 uppercase">Income</p>
                                    <p className="text-base font-black text-emerald-600">Rp {formatRp(selectedData.income)}</p>
                                </div>
                            )}
                            {selectedData.expense === 0 && selectedData.income === 0 && (
                                <p className="text-xs text-gray-400 font-medium mt-1">No activity this day</p>
                            )}
                        </div>
                    </div>

                    {selectedData.transactions.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transactions</p>
                            {selectedData.transactions.map(tx => (
                                <div key={tx.id} className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 truncate">{tx.name}</p>
                                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block", categoryColors[tx.category] || "bg-gray-100 text-gray-500")}>
                                                {tx.category}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className={cn("text-sm font-black", tx.isExpense ? "text-rose-600" : "text-emerald-600")}>
                                                {tx.isExpense ? "-" : "+"}Rp {formatRp(tx.amount)}
                                            </p>
                                            <p className="text-[9px] text-gray-400 mt-0.5">{tx.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center py-8"
                >
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                        <Calendar className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-xs font-bold text-gray-400">Tap a date</p>
                    <p className="text-[10px] text-gray-300 mt-1">to see transactions</p>
                </motion.div>
            )}
        </AnimatePresence>
    )

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Full-page Backdrop ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]"
                        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
                    />

                    {/* ── Modal ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 24 }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
                    >
                        {/* Sheet on mobile, centered card on sm+ */}
                        <div className="pointer-events-auto w-full sm:max-w-3xl bg-white sm:rounded-[32px] rounded-t-[32px] shadow-2xl shadow-slate-900/30 overflow-hidden flex flex-col max-h-[93vh] sm:max-h-[88vh]">

                            {/* ── Header ── */}
                            <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-100 flex-shrink-0">
                                {/* Drag handle (mobile) */}
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-lg font-black text-gray-900 leading-none">Financial Calendar</h2>
                                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Monthly expense heatmap</p>
                                        </div>
                                    </div>
                                    <button
                                        suppressHydrationWarning
                                        onClick={onClose}
                                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Month Stats */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-rose-50 rounded-xl sm:rounded-2xl border border-rose-100">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-rose-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Expense</p>
                                            <p className="text-sm sm:text-base font-black text-rose-700 truncate">Rp {formatRp(totalMonthExpense)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Income</p>
                                            <p className="text-sm sm:text-base font-black text-emerald-700 truncate">Rp {formatRp(totalMonthIncome)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Body ── */}
                            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">

                                {/* Calendar panel */}
                                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                    {/* Month navigation */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button suppressHydrationWarning onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                            {MONTHS[currentMonth]} {currentYear}
                                        </h3>
                                        <button suppressHydrationWarning onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Day headers */}
                                    <div className="grid grid-cols-7 mb-1.5">
                                        {DAYS.map(d => (
                                            <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest py-1">{d}</div>
                                        ))}
                                    </div>

                                    {/* Date grid */}
                                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1
                                            const data = calendarData[day]
                                            const heat = data ? getHeat(data.expense) : ""
                                            const isSelected = selectedDay === day
                                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

                                            return (
                                                <motion.button
                                                    suppressHydrationWarning
                                                    key={day}
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDayClick(day, isSelected)}
                                                    className={cn(
                                                        "relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl border transition-all cursor-pointer min-h-[30px] sm:min-h-[52px]",
                                                        isSelected
                                                            ? "bg-blue-600 border-blue-500 shadow-md shadow-blue-500/30"
                                                            : heat && heatClasses[heat as keyof typeof heatClasses],
                                                        !heat && !isSelected && "border-transparent hover:bg-gray-50",
                                                        isToday && !isSelected && "ring-2 ring-blue-400 ring-offset-1"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "text-[11px] font-black leading-none mb-0.5",
                                                        isSelected ? "text-white" : isToday ? "text-blue-600" : "text-gray-800"
                                                    )}>
                                                        {day}
                                                    </span>
                                                    {data?.expense > 0 && (
                                                        <span className={cn(
                                                            "hidden sm:block text-[7px] font-bold leading-none",
                                                            isSelected ? "text-white/80" : "text-current opacity-80"
                                                        )}>
                                                            {formatRp(data.expense)}
                                                        </span>
                                                    )}
                                                    {data?.income > 0 && (
                                                        <div className={cn(
                                                            "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
                                                            isSelected ? "bg-white/60" : "bg-emerald-500"
                                                        )} />
                                                    )}
                                                </motion.button>
                                            )
                                        })}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center gap-2 sm:gap-3 mt-4 flex-wrap">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Heat:</span>
                                        {[
                                            { label: "Low", color: "bg-blue-100" },
                                            { label: "Medium", color: "bg-amber-100" },
                                            { label: "High", color: "bg-orange-200" },
                                            { label: "Critical", color: "bg-rose-200" },
                                        ].map(l => (
                                            <div key={l.label} className="flex items-center gap-1">
                                                <div className={cn("w-2.5 h-2.5 rounded-sm", l.color)} />
                                                <span className="text-[9px] font-semibold text-gray-400">{l.label}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-semibold text-gray-400">Income</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Detail Panel — desktop sidebar / mobile collapsible ── */}

                                {/* Desktop sidebar */}
                                <div className="hidden sm:flex sm:w-64 border-l border-gray-100 bg-slate-50/60 p-5 flex-col overflow-y-auto">
                                    <DetailPanel />
                                </div>

                                {/* Mobile detail — slide-up panel inside modal */}
                                <AnimatePresence>
                                    {showDetail && selectedDay && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="sm:hidden overflow-hidden border-t border-gray-100 bg-slate-50"
                                        >
                                            <div className="p-3 pb-6 overflow-y-auto max-h-72">
                                                <DetailPanel />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
