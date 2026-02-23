"use client"

import { useState, useEffect } from "react"
import { upsertGoal, deleteGoal, allocateToGoal } from "@/app/actions/goals"

/** Format raw digit string → "1.000.000" (id-ID style) */
const fmtThousands = (raw: string) => {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return ""
    return parseInt(digits, 10).toLocaleString("id-ID")
}
const parseDisplay = (display: string) => {
    const n = parseInt(display.replace(/\D/g, ""), 10)
    return isNaN(n) ? 0 : n
}

const formatCompact = (val: number) => {
    if (val >= 1000000) {
        return `Rp ${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
    }
    if (val >= 1000) {
        return `Rp ${(val / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}k`
    }
    return `Rp ${val.toLocaleString('id-ID')}`
}

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Target, Calendar, Trash2, Edit2, ChevronRight, Wallet, Save, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Goal } from "@/app/dashboard/page"

interface GoalsManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    goals: Goal[];
    onUpdateGoals: (goals: Goal[]) => void;
    onGoalsMutated?: () => void;
}

export function GoalsManagementModal({ isOpen, onClose, goals, onUpdateGoals, onGoalsMutated }: GoalsManagementModalProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Omit<Goal, 'id'>>({
        title: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: "",
        color: "bg-blue-600"
    })
    const [targetDisplay, setTargetDisplay] = useState("")

    // Allocation state
    const [allocatingId, setAllocatingId] = useState<string | null>(null)
    const [allocationDisplay, setAllocationDisplay] = useState("")
    const [isAllocating, setIsAllocating] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Clear error message after some time
    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => setErrorMsg(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMsg])

    const formatIndoDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    const calculateTimeLeft = (deadlineStr: string) => {
        try {
            const now = new Date()
            const deadline = new Date(deadlineStr)
            const diffTime = deadline.getTime() - now.getTime()

            if (diffTime < 0) return "Terminated"

            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays < 30) return `${diffDays} days left`

            const diffMonths = Math.ceil(diffDays / 30)
            return `${diffMonths} months left`
        } catch {
            return "No deadline"
        }
    }

    const handleSave = async () => {
        const targetAmount = parseDisplay(targetDisplay)
        const payload = { ...formData, targetAmount, currentAmount: editingId ? formData.currentAmount : 0 }
        const { error } = await upsertGoal(
            editingId ? { id: editingId, ...payload } : { ...payload }
        )
        if (error) {
            setErrorMsg(error)
            return
        }
        setEditingId(null)
        setIsAdding(false)
        setFormData({ title: "", targetAmount: 0, currentAmount: 0, deadline: "", color: "bg-blue-600" })
        setTargetDisplay("")
        onGoalsMutated?.()
    }

    const handleAllocate = async (goal: Goal) => {
        const amount = parseDisplay(allocationDisplay)
        if (amount <= 0) return

        setIsAllocating(true)
        const { error } = await allocateToGoal({
            goalId: goal.id,
            amount: amount,
            title: goal.title
        })
        setIsAllocating(false)

        if (error) {
            setErrorMsg(error)
            return
        }

        setAllocatingId(null)
        setAllocationDisplay("")
        onGoalsMutated?.()
    }

    const handleDelete = async (id: string) => {
        const { error } = await deleteGoal(id)
        if (error) {
            setErrorMsg(error)
            return
        }
        onUpdateGoals(goals.filter(g => g.id !== id))
        onGoalsMutated?.()
    }

    const startEdit = (goal: Goal) => {
        setEditingId(goal.id)
        setFormData({
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
            color: goal.color
        })
        setTargetDisplay(fmtThousands(goal.targetAmount.toString()))
        setIsAdding(true)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
                    >
                        {/* Error Alert */}
                        <AnimatePresence>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] w-[90%] md:w-auto"
                                >
                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-5 h-5 text-rose-600" />
                                        </div>
                                        <p className="text-xs font-bold text-rose-900">{errorMsg}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                    <Target className="w-6 h-6 text-blue-600" />
                                    Manage Savings Goals
                                </h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Track and achieve your financial milestones.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                            {isAdding ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 space-y-4"
                                >
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest px-1">
                                        {editingId ? 'Edit Goal' : 'Create New Goal'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Goal Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. Trip to Bali"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deadline Date</label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Amount (Rp)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={targetDisplay}
                                                    onChange={(e) => setTargetDisplay(fmtThousands(e.target.value))}
                                                    placeholder="5.000.000"
                                                    className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            onClick={handleSave}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-500/20"
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Save Goal
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => { setIsAdding(false); setEditingId(null); }}
                                            className="px-6 rounded-xl h-12 font-bold text-gray-500 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest px-1">Current Milestones</h3>
                                        <Button
                                            onClick={() => setIsAdding(true)}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-bold uppercase tracking-widest px-4 py-2 h-auto"
                                        >
                                            <Plus className="w-3 h-3 mr-1.5" /> Add Goal
                                        </Button>
                                    </div>

                                    {goals.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                                <Target className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-900 font-bold">No goals created yet</p>
                                            <p className="text-gray-500 text-xs mt-1">Start by adding your first financial milestone!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {goals.map((goal) => {
                                                const progress = (goal.currentAmount / goal.targetAmount) * 100
                                                return (
                                                    <div key={goal.id} className="group p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", goal.color.replace('bg-', 'bg-opacity-10 text-'))}>
                                                                    <Wallet className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">{goal.title}</h4>
                                                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Calendar className="w-3 h-3 text-gray-400" />
                                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatIndoDate(goal.deadline)}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Clock className="w-3 h-3 text-blue-500" />
                                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{calculateTimeLeft(goal.deadline)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => startEdit(goal)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDelete(goal.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-end">
                                                                <p className="text-xs font-bold text-gray-900">
                                                                    {formatCompact(goal.currentAmount)}
                                                                    <span className="text-gray-400 font-medium"> / {formatCompact(goal.targetAmount)}</span>
                                                                </p>
                                                                <span className="text-xs font-black text-blue-600">{Math.round(progress)}%</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden p-[1px] border border-gray-100 mb-4">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${progress}%` }}
                                                                    className={cn("h-full rounded-full shadow-sm", goal.color)}
                                                                />
                                                            </div>

                                                            {allocatingId === goal.id ? (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    className="flex gap-2 items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100"
                                                                >
                                                                    <div className="relative flex-1">
                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-400">Rp</span>
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            value={allocationDisplay}
                                                                            onChange={(e) => setAllocationDisplay(fmtThousands(e.target.value))}
                                                                            placeholder="Nominal nabung..."
                                                                            className="w-full pl-8 pr-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                                                        />
                                                                    </div>
                                                                    <Button
                                                                        disabled={isAllocating}
                                                                        onClick={() => handleAllocate(goal)}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-xs font-bold rounded-lg shrink-0"
                                                                    >
                                                                        {isAllocating ? 'Saving...' : 'Nabung'}
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        onClick={() => setAllocatingId(null)}
                                                                        className="h-9 w-9 p-0 rounded-lg text-gray-400"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </motion.div>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => setAllocatingId(goal.id)}
                                                                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest transition-all"
                                                                >
                                                                    <Plus className="w-3 h-3 mr-2" /> Allocate From Balance
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {!isAdding && (
                            <div className="p-8 border-t border-gray-50 bg-gray-50/30 sticky bottom-0">
                                <Button
                                    onClick={onClose}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold transition-all shadow-lg"
                                >
                                    Done
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
