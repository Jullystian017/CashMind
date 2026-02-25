"use client"

import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Target, Zap, ShieldCheck, Lightbulb, Sparkles, HelpCircle } from "lucide-react"
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
            label: "Savings",
            score: data.breakdown.savings,
            max: 40,
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            description: "Based on your income-to-expense ratio. Target 20%+"
        },
        {
            label: "Budget",
            score: data.breakdown.budget,
            max: 20,
            icon: ShieldCheck,
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "border-blue-100",
            description: "How well you stay within your monthly budget limits."
        },
        {
            label: "Goals",
            score: data.breakdown.goals,
            max: 20,
            icon: Target,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            description: "Your progress towards funding your active savings goals."
        },
        {
            label: "Activity",
            score: data.breakdown.activity,
            max: 20,
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
            description: "Points earned from challenges and regular app usage."
        }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* Compact Header */}
                        <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 group z-20"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="relative">
                                    <svg className="w-20 h-20 transform -rotate-90">
                                        <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="6" fill="transparent" opacity="0.1" />
                                        <motion.circle
                                            cx="40" cy="40" r="36" stroke="white" strokeWidth="6" fill="transparent"
                                            strokeDasharray={226.2}
                                            initial={{ strokeDashoffset: 226.2 }}
                                            animate={{ strokeDashoffset: 226.2 - (226.2 * data.score) / 100 }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black">{data.score}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-blue-200" />
                                        <span className="text-xl font-black tracking-tight">{data.status}</span>
                                    </div>
                                    <p className="text-xs text-blue-100/80 font-medium">
                                        Calculated from month-to-date data.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Grid - Informative but Compact */}
                        <div className="p-6 space-y-4 bg-gray-50/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                        className={cn(
                                            "p-4 rounded-[24px] border bg-white shadow-sm hover:shadow-md transition-all",
                                            item.border
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                                    <item.icon className="w-4.5 h-4.5" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                                            </div>
                                            <span className="text-sm font-black text-gray-900">{item.score}<span className="text-[10px] text-gray-400 font-bold">/{item.max}</span></span>
                                        </div>

                                        <p className="text-[11px] text-gray-500 font-medium leading-normal mb-3 pl-12">
                                            {item.description}
                                        </p>

                                        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden ml-12">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.score / item.max) * 100}%` }}
                                                className={cn("absolute h-full rounded-full bg-current", item.color)}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Tip Card */}
                            <div className="p-4 rounded-[24px] bg-white border border-blue-100 flex items-start gap-3 relative shadow-sm overflow-hidden">
                                <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Scoring Logic</h4>
                                    <p className="text-[11px] text-gray-600 leading-normal font-medium">
                                        Your score reflects current month habits. Maintain higher <span className="text-emerald-600 font-bold">Savings</span> to boost it quickly!
                                    </p>
                                </div>
                                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-blue-100" />
                            </div>
                        </div>

                        {/* Action */}
                        <div className="px-6 pb-6 pt-2 bg-white flex">
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-[#0f172a] text-white text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
