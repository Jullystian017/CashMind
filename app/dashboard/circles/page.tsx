"use client"

import React, { useState, useEffect } from "react"
import {
  Users, Plus, Copy, Check, X, Loader2, ArrowLeft,
  TrendingUp, TrendingDown, Target, DollarSign,
  AlertTriangle, Sparkles, ChevronRight,
  PieChart, BarChart3, Calendar, Shield, ShoppingBag,
  Zap, LogIn, UserPlus,
  Trash2, UtensilsCrossed, Car, Gamepad2, Home, HeartPulse, GraduationCap, MoreHorizontal, ShoppingCart
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatRp } from "@/lib/utils"
import {
  createCircle, joinCircle, getMyCircles, getCircleDetail, addCircleExpense, leaveCircle, deleteCircleExpense,
  type FinanceCircle, type CircleExpense
} from "@/app/actions/circles"

// ─── Category Options ───
const CATEGORIES = [
  "Food & Groceries", "Dining Out", "Transport", "Shopping", "Entertainment",
  "Utilities", "Health", "Education", "Housing", "Others"
]

const categoryConfig: Record<string, { icon: any, color: string }> = {
    "Food & Groceries": { icon: ShoppingCart, color: "#3b82f6" },
    "Dining Out": { icon: UtensilsCrossed, color: "#f59e0b" },
    "Transport": { icon: Car, color: "#f97316" },
    "Shopping": { icon: ShoppingBag, color: "#ec4899" },
    "Entertainment": { icon: Gamepad2, color: "#a855f7" },
    "Education": { icon: GraduationCap, color: "#0ea5e9" },
    "Health": { icon: HeartPulse, color: "#10b981" },
    "Housing": { icon: Home, color: "#6366f1" },
    "Utilities": { icon: Zap, color: "#ef4444" },
    "Others": { icon: MoreHorizontal, color: "#94a3b8" },
}

const EMOJIS = ["👨‍👩‍👧‍👦", "👥", "🏠", "💼", "🎓", "❤️", "🌟", "🚀", "💰", "🎯", "🏆", "🌍"]

const identityConfig = {
  efficient: { bg: "from-emerald-500 to-green-600", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "🟢", badge: "bg-emerald-100 text-emerald-700" },
  balanced: { bg: "from-amber-500 to-yellow-600", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "🟡", badge: "bg-amber-100 text-amber-700" },
  high_consumption: { bg: "from-red-500 to-rose-600", light: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "🔴", badge: "bg-red-100 text-red-700" }
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null)
  const [circleDetail, setCircleDetail] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  // Create form
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("👥")
  const [newBudget, setNewBudget] = useState("")

  // Join form
  const [joinCode, setJoinCode] = useState("")

  // Add expense form
  const [expDesc, setExpDesc] = useState("")
  const [expAmount, setExpAmount] = useState("")
  const [expCategory, setExpCategory] = useState("Food & Groceries")
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) setter("");
    else setter(parseInt(raw, 10).toLocaleString("id-ID"));
  }

  // Toast
  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchCircles = async () => {
    setLoading(true)
    const { data } = await getMyCircles()
    if (data) setCircles(data)
    setLoading(false)
  }

  const fetchDetail = async (id: string) => {
    setDetailLoading(true)
    const { data } = await getCircleDetail(id)
    if (data) setCircleDetail(data)
    setDetailLoading(false)
  }

  useEffect(() => { fetchCircles() }, [])

  useEffect(() => {
    if (selectedCircleId) fetchDetail(selectedCircleId)
  }, [selectedCircleId])

  const handleCreate = async () => {
    if (!newName.trim()) return
    const { data, error } = await createCircle({
      name: newName.trim(),
      emoji: newEmoji,
      monthlyBudget: newBudget ? parseInt(newBudget.replace(/\D/g, "")) : undefined,
    })
    if (error) { showToast(`❌ ${error}`); return }
    showToast("✅ Circle created!")
    setIsCreateOpen(false)
    setNewName(""); setNewEmoji("👥"); setNewBudget("")
    await fetchCircles()
    if (data) setSelectedCircleId(data.id)
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    const { error } = await joinCircle(joinCode)
    if (error) { showToast(`❌ ${error}`); return }
    showToast("✅ Joined circle!")
    setIsJoinOpen(false)
    setJoinCode("")
    await fetchCircles()
  }

  const handleAddExpense = async () => {
    if (!expDesc || !expAmount || !selectedCircleId) return
    const { error } = await addCircleExpense({
      circleId: selectedCircleId,
      description: expDesc,
      amount: parseInt(expAmount.replace(/\D/g, "")),
      category: expCategory,
      date: expDate,
    })
    if (error) { showToast(`❌ ${error}`); return }
    showToast("✅ Expense added!")
    setIsAddExpenseOpen(false)
    setExpDesc(""); setExpAmount(""); setExpCategory("Food & Groceries")
    await fetchDetail(selectedCircleId)
  }

  const handleLeave = async () => {
    if (!selectedCircleId || !confirm("Leave this circle?")) return
    await leaveCircle(selectedCircleId)
    setSelectedCircleId(null)
    setCircleDetail(null)
    await fetchCircles()
    showToast("Left circle")
  }

  const handleDeleteExpense = async (id: string) => {
    if (!selectedCircleId || !confirm("Hapus pengeluaran ini?")) return
    const { error } = await deleteCircleExpense(id)
    if (error) { showToast(`❌ ${error}`); return }
    showToast("✅ Expense deleted!")
    await fetchDetail(selectedCircleId)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ═══════════════════════════════════════
  // Circle Detail View
  // ═══════════════════════════════════════
  if (selectedCircleId && circleDetail) {
    const { circle, members, expenses, stats, identity, insights, behavioralPatterns } = circleDetail
    const idc = identityConfig[identity.type as keyof typeof identityConfig]

    return (
      <div className="space-y-8 pb-24 @container" suppressHydrationWarning>
        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => { setSelectedCircleId(null); setCircleDetail(null) }} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{circle.emoji}</span>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{circle.name}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{members.length} members</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => copyCode(circle.invite_code)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 transition-all">
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {circle.invite_code}
            </button>
            <button onClick={() => setIsAddExpenseOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>

        {/* ─── Financial Identity Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br ${idc.bg} text-white shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur text-2xl">{idc.icon}</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Circle Identity</p>
                <h3 className="text-xl font-bold">{identity.label}</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-xs text-white/60 font-medium">Total Spend</p>
                <p className="text-2xl font-bold mt-1">{formatRp(stats.totalSpend)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-xs text-white/60 font-medium">Essential Ratio</p>
                <p className="text-2xl font-bold mt-1">{stats.essentialRatio}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-xs text-white/60 font-medium">Lifestyle Focus</p>
                <p className="text-2xl font-bold mt-1">{stats.lifestyleRatio || 0}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Circle Insights ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Circle Insights</h3>
          </div>
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
            {insights.map((insight: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Behavioral Patterns ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Behavioral Patterns</h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {behavioralPatterns.map((pattern: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="p-4 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">{pattern}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Spending Analytics ─── */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <PieChart className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900">Spending Distribution</h4>
            </div>
            <div className="space-y-3">
              {stats.categoryBreakdown.slice(0, 6).map((cat: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{cat.category}</span>
                    <span className="text-xs font-semibold text-gray-900">{cat.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percent}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={cn("h-2 rounded-full", i === 0 ? "bg-blue-600" : i === 1 ? "bg-indigo-500" : i === 2 ? "bg-purple-500" : "bg-gray-400")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Essential vs Non-Essential */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900">Essential vs Non-Essential</h4>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">Essential</span>
                  <span className="text-xs font-bold text-gray-900">{stats.essentialRatio}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stats.essentialRatio}%` }} transition={{ duration: 1 }}
                    className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-600">Non-Essential</span>
                  <span className="text-xs font-bold text-gray-900">{100 - stats.essentialRatio}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${100 - stats.essentialRatio}%` }} transition={{ duration: 1 }}
                    className="h-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 leading-relaxed">
                {stats.essentialRatio >= 60
                  ? "✅ Your circle prioritizes essential spending — a healthy allocation."
                  : stats.essentialRatio >= 40
                    ? "⚠️ Non-essential spending is relatively high. Consider reviewing discretionary expenses."
                    : "🔴 Most spending is non-essential. This pattern may impact long-term financial goals."}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Weekly Pattern ─── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900">Weekend vs Weekday</h4>
            </div>
            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", stats.weekendSpendRatio > 40 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
              {stats.weekendSpendRatio}% weekends
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-blue-50 rounded-2xl p-5 text-center">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Weekday</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{100 - stats.weekendSpendRatio}%</p>
            </div>
            <div className={cn("flex-1 rounded-2xl p-5 text-center", stats.weekendSpendRatio > 40 ? "bg-red-50" : "bg-amber-50")}>
              <p className={cn("text-xs font-semibold uppercase tracking-wider", stats.weekendSpendRatio > 40 ? "text-red-600" : "text-amber-600")}>Weekend</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.weekendSpendRatio}%</p>
            </div>
          </div>
        </div>

        {/* ─── Members Spending ─── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900">Member Contributions</h4>
            </div>
            <span className="text-xs text-gray-400">{members.length} members</span>
          </div>
          <div className="space-y-4">
            {stats.memberSpending.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                  {m.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 truncate">{m.name}</span>
                    <span className="text-xs font-semibold text-gray-900">{formatRp(m.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.percent}%` }} transition={{ duration: 0.8 }}
                      className="h-2 rounded-full bg-blue-500" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400 w-10 text-right">{m.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Recent Expenses ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Recent Expenses</h4>
            <button onClick={() => setIsAddExpenseOpen(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              + Add
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">No expenses yet</div>
            ) : (
              expenses.slice(0, 10).map((exp: CircleExpense) => (
                <div key={exp.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{exp.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-red-600">-{formatRp(exp.amount)}</span>
                    <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Expense">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leave Circle */}
        <div className="flex justify-center pb-8">
          <button onClick={handleLeave} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
            Leave this circle
          </button>
        </div>

        {/* Add Expense Modal */}
        <AnimatePresence>
          {isAddExpenseOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setIsAddExpenseOpen(false)}>
              <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Add Expense</h3>
                  <button onClick={() => setIsAddExpenseOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    <input value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="What was it for?"
                      className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
                    <input value={expAmount} onChange={(e) => handleAmountChange(e, setExpAmount)} placeholder="Rp 0"
                      className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-semibold" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CATEGORIES.map((c) => {
                        const config = categoryConfig[c] || categoryConfig["Others"]
                        const Icon = config.icon
                        const isSelected = expCategory === c
                        return (
                          <button
                            key={c}
                            onClick={() => setExpCategory(c)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all border",
                              isSelected ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center")} style={{ color: config.color, backgroundColor: `${config.color}15` }}>
                              <Icon className="w-3 h-3" />
                            </div>
                            <span className="truncate">{c}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                    <input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)}
                      className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all" />
                  </div>
                  <button onClick={handleAddExpense} disabled={!expDesc || !expAmount}
                    className="w-full mt-4 py-3.5 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg shadow-blue-500/20">
                    Add Expense
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ═══════════════════════════════════════
  // Main Circles List View
  // ═══════════════════════════════════════
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24 @container" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-semibold text-gray-900 tracking-tight">Financial Circles</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium">Collective Financial Intelligence — understand how your social circle impacts your financial future</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsJoinOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 transition-all">
            <LogIn className="w-4 h-4" /> Join Circle
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all">
            <Plus className="w-4 h-4" /> Create Circle
          </button>
        </div>
      </div>

      {/* Concept Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 p-8 rounded-[32px] border border-blue-400/20 relative overflow-hidden shadow-2xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col @md:flex-row items-center gap-6">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20">
            <Users className="w-8 h-8 text-blue-100" />
          </div>
          <div className="text-center @md:text-left">
            <h3 className="text-xl font-bold text-white">Collective Financial Intelligence</h3>
            <p className="text-sm text-blue-100/70 mt-1 max-w-lg">
              Understand how your social circle influences your financial decisions. Get AI-powered insights, detect behavioral patterns, and simulate your financial future together.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Circles Grid */}
      {circles.length === 0 ? (
        <div className="bg-white p-12 rounded-[32px] border border-gray-100 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Circles Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Create your first Financial Circle or join one with an invite code to start tracking collective finances.</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setIsCreateOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Create Circle
            </button>
            <button onClick={() => setIsJoinOpen(true)} className="px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-100 border border-gray-200 transition-all">
              Join with Code
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 @md:grid-cols-2 @[1200px]:grid-cols-3 gap-6">
          {circles.map((circle, i) => {
            // Just mock it slightly for the grid icon based on some random logic to avoid computing heavy here
            // Next iteration we should fetch Identity per circle in getMyCircles
            const isHighScore = circle.totalSpend > 5000000;
            const identityType = isHighScore ? "high_consumption" : circle.totalSpend > 2000000 ? "balanced" : "efficient";
            const idc = identityConfig[identityType]

            return (
              <motion.div key={circle.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedCircleId(circle.id)}
                className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform">{circle.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 tracking-tight">{circle.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{circle.memberCount} members</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", idc.badge)}>
                    {identityType === "efficient" ? "Efficient" : identityType === "balanced" ? "Balanced" : "High Spend"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium">Total Spend</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{formatRp(circle.totalSpend)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium">Status</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize">{identityType.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">View details</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create Circle Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setIsCreateOpen(false)}>
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Create Financial Circle</h3>
                <p className="text-sm text-gray-500 mt-1">Start tracking finances collectively</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Circle Name</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Family Finance"
                    className="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Choose Emoji</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {EMOJIS.map((e) => (
                      <button key={e} onClick={() => setNewEmoji(e)}
                        className={cn("w-11 h-11 text-xl rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110",
                          newEmoji === e ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-100 bg-gray-50")}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleCreate} disabled={!newName.trim()}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-xl shadow-blue-500/20 mt-2">
                  Create Circle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Circle Modal */}
      <AnimatePresence>
        {isJoinOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setIsJoinOpen(false)}>
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join a Circle</h3>
              <p className="text-sm text-gray-500 mb-8">Enter the 6-character invite code</p>
              <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. ABC123" maxLength={6}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all uppercase" />
              <button onClick={handleJoin} disabled={joinCode.length < 6}
                className="w-full mt-6 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-xl shadow-green-500/20">
                Join Circle
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
