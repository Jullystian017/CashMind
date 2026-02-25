"use client"

import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Target, Zap, ShieldCheck, Info, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FinancialScoreData } from "@/app/actions/financial-score"

interface FinancialScoreModalProps {
    isOpen: boolean
    onClose: () => void
    data: FinancialScoreData | null
}

export function FinancialScoreModal({ isOpen, onClose, data }: FinancialScoreModalProps) {
    if (!data) return null

    const items = [
        {
            label: "Savings & Income",
            score: data.breakdown.savings,
            max: 40,
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            description: "Measures your income-to-expense ratio. Aim for a 20%+ savings rate."
        },
        {
            label: "Budget Discipline",
            score: data.breakdown.budget,
            max: 20,
            icon: ShieldCheck,
            color: "text-blue-500",
            bg: "bg-blue-50",
            description: "How well you stick to your category limits. Overspending reduces this score."
        },
        {
            label: "Goal Progress",
            score: data.breakdown.goals,
            max: 20,
            icon: Target,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            description: "Progress towards your active savings goals. Consistency is key."
        },
        {
            label: "Activity & Growth",
            score: data.breakdown.activity,
            max: 20,
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50",
            description: "Based on your challenge participation and XP level. Stay active!"
        }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100/80 mb-2">Detailed Breakdown</span>
                                <div className="relative">
                                    <h2 className="text-6xl font-black tracking-tighter">{data.score}</h2>
                                    <span className="absolute -top-1 -right-8 text-xl font-bold text-blue-200/50">/100</span>
                                </div>
                                <div className="mt-4 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-bold uppercase tracking-wider">{data.status} Status</span>
                                </div>
                            </div>

                            {/* Decorative background circle */}
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-4">
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-5 rounded-3xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", item.bg, item.color)}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{item.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-gray-900 leading-none">{item.score}</span>
                                                <span className="text-[10px] font-bold text-gray-400 block uppercase">out of {item.max}</span>
                                            </div>
                                        </div>

                                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.score / item.max) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                className={cn("absolute h-full rounded-full bg-current", item.color)}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Insights Section */}
                            <div className="p-5 rounded-3xl bg-blue-600 text-white flex items-start gap-4 shadow-xl shadow-blue-500/20">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold tracking-tight">Financial Pro-Tip</h4>
                                    <p className="text-xs text-blue-100 leading-relaxed font-medium">
                                        Your score is influenced by your spending habits this month. Try setting stricter budget limits for discretionary categories like 'Entertainment'.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                                Close Breakdown
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
