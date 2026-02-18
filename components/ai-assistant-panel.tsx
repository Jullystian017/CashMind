"use client"

import Link from "next/link"
import { Bot, Sparkles, Send, TrendingUp, Calculator, Lightbulb, FileText, X, Maximize2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

interface AIAssistantPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function AIAssistantPanel({ isOpen, onClose }: AIAssistantPanelProps) {
    const quickActions = [
        { name: "Analyze My Spending", icon: TrendingUp },
        { name: "Suggest Budget Plan", icon: Calculator },
        { name: "Saving Tips", icon: Lightbulb },
        { name: "Subscription Check", icon: FileText },
    ]

    if (!isOpen) return null

    return (
        <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-100 flex flex-col z-50 shadow-2xl lg:shadow-none lg:static">
            <div className="p-5 flex items-center justify-between border-b border-gray-50 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900 tracking-tight">Mindy AI</span>
                </div>
                <Link
                    href="/dashboard/ai"
                    className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors"
                    title="Deep Chat Mode"
                >
                    <Maximize2 className="w-5 h-5" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col no-scrollbar bg-slate-50/30">
                {/* Advisor Profile */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center relative group">
                            <Bot className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                            <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full"></div>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Hi, Fajar Alexander! 👋</h3>
                    <p className="text-xs text-gray-500 font-medium px-4">
                        I'm <span className="text-blue-600 font-bold">Mindy</span>, your smart financial coach. How can I help you today?
                    </p>
                </div>

                {/* Today's Tip Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-200" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Today's Tip</span>
                        </div>
                        <p className="text-sm font-semibold leading-relaxed">
                            "Kamu sudah hemat 12% dibanding bulan lalu. Terus pertahankan bray!"
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <Sparkles className="absolute -right-4 -bottom-4 w-20 h-20 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
                </motion.div>

                {/* Quick Actions */}
                <div className="w-full space-y-2 mb-8">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">SMART ACTIONS</p>
                    {quickActions.map((action) => (
                        <button
                            key={action.name}
                            suppressHydrationWarning
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100/50 hover:border-blue-100 hover:bg-white hover:shadow-md hover:shadow-blue-500/5 transition-all text-left group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-colors">
                                <action.icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{action.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Ask Mindy anything..."
                        suppressHydrationWarning
                        className="w-full bg-gray-50 border-transparent rounded-xl py-3.5 pl-4 pr-12 text-xs font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    />
                    <button
                        suppressHydrationWarning
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
