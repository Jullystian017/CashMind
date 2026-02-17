"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Plus,
    MessageSquare,
    History,
    Sparkles,
    Bot,
    MoreVertical,
    Search,
    ArrowLeft,
    Shield,
    TrendingUp,
    Calculator,
    Lightbulb,
    FileText
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DeepChatPage() {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "mindy",
            text: "Halo Fajar! Aku sudah menganalisa data transaksi kamu selama 30 hari terakhir. Ada beberapa hal menarik yang perlu kita bahas, mulai dari kenaikan biaya langganan sampai potensi tabungan ekstra. Apa yang mau kita bedah duluan?",
            time: "10:00 AM"
        },
        {
            id: 2,
            role: "user",
            text: "Boleh dong, coba summarize pengeluaran bulan ini.",
            time: "10:01 AM"
        },
        {
            id: 3,
            role: "mindy",
            text: "Siap bray! Ringkasan pengeluaran kamu bulan ini: \n\n• **Total Pengeluaran**: Rp 4.250.000\n• **Kategori Terbesar**: Food & Drinks (35%)\n• **Anomali**: Ada kenaikan 15% di biaya internet dibanding bulan lalu.\n\nMau aku buatin rekomendasi penghematan atau cek detail transaksinya?",
            time: "10:02 AM"
        }
    ])

    const chatHistory = [
        { id: 1, title: "Monthly Expense Analysis", time: "2 hours ago" },
        { id: 2, title: "Budgeting for College Life", time: "Yesterday" },
        { id: 3, title: "Investment Strategy for Beginners", time: "3 days ago" },
        { id: 4, title: "Savings Goal: New Laptop", time: "Last week" },
    ]

    const suggestions = [
        "Analyze my food spending",
        "Generate a savings plan",
        "Check my subscriptions",
        "How can I save Rp 500k?"
    ]


    const quickActions = [
        { name: "Analyze My Spending", icon: TrendingUp },
        { name: "Suggest Budget Plan", icon: Calculator },
        { name: "Saving Tips", icon: Lightbulb },
        { name: "Subscription Check", icon: FileText },
    ]

    const handleSendMessage = () => {
        if (!message.trim()) return
        const newMsg = {
            id: Date.now(),
            role: "user",
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([...messages, newMsg])
        setMessage("")
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden shadow-sm">
            {/* Chat Sidebar */}
            <aside className="w-64 border-r border-gray-100 flex flex-col bg-slate-50/50 flex-shrink-0">
                <div className="p-6">
                    <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm group">
                        <Plus className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
                        New Consultation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 no-scrollbar pb-8">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-4">RECENT CONSULTATIONS</p>
                        <div className="space-y-1">
                            {chatHistory.map((chat) => (
                                <button
                                    key={chat.id}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group group"
                                >
                                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-gray-900">{chat.title}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{chat.time}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-white">
                {/* Chat Header */}
                <header className="h-16 border-b border-gray-50 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-600" />
                            <h2 className="text-base font-bold text-gray-900 tracking-tight">Deep Consultation with Mindy</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 mr-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                            ))}
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Welcome Branding */}
                        <div className="flex flex-col items-center mb-12 mt-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">Financial Health Session</h1>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Personalized Insights for Fajar</p>
                        </div>

                        {/* Messages */}
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full mb-4",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[80%] flex gap-3",
                                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        {msg.role === "mindy" && (
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-blue-600" />
                                            </div>
                                        )}
                                        <div>
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                msg.role === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-none font-semibold"
                                                    : "bg-white border border-gray-100 text-gray-700 rounded-tl-none font-medium"
                                            )}>
                                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                            </div>
                                            <p className={cn(
                                                "mt-1.5 text-[10px] font-bold text-gray-400 px-1",
                                                msg.role === "user" ? "text-right" : "text-left"
                                            )}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Fixed Input at Bottom */}
                <div className="p-8 pb-10 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {quickActions.map((s) => (
                                <button
                                    key={s.name}
                                    onClick={() => setMessage(s.name)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-[10px] font-bold text-gray-500 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm group"
                                >
                                    <s.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                placeholder="Ask Mindy anything about your budget..."
                                className="w-full bg-white border-2 border-gray-200 rounded-3xl py-4 pl-6 pr-16 text-sm font-semibold text-gray-900 focus:border-blue-400 focus:shadow-2xl focus:shadow-blue-500/10 transition-all outline-none min-h-[56px] h-[56px] resize-none overflow-hidden placeholder:text-gray-400 shadow-sm"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group-focus-within:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-center mt-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            Premium Financial Advisory Interface
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
