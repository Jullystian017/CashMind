"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Plus,
    MessageSquare,
    History,
    Sparkles,
    Bot,
    Trash2,
    ArrowLeft,
    TrendingUp,
    Calculator,
    Lightbulb,
    FileText,
    Loader2,
    RotateCcw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Message {
    id: number
    role: "user" | "model"
    text: string
    time: string
}

interface ChatSession {
    id: number
    title: string
    messages: Message[]
    time: string
}

export default function DeepChatPage() {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const quickActions = [
        { name: "Analyze My Spending", icon: TrendingUp, desc: "Get insights on your expenses" },
        { name: "Suggest Budget Plan", icon: Calculator, desc: "Create a personalized budget" },
        { name: "Saving Tips", icon: Lightbulb, desc: "Ways to save more money" },
        { name: "Subscription Check", icon: FileText, desc: "Review recurring payments" },
    ]

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, isLoading])

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return

        const userMsg: Message = {
            id: Date.now(),
            role: "user",
            text: text.trim(),
            time: formatTime()
        }

        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setMessage("")
        setIsLoading(true)

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "64px"
        }

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.role, text: m.text }))
                })
            })

            const data = await res.json()

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: "model",
                text: data.error ? `⚠️ ${data.error}` : data.reply,
                time: formatTime()
            }

            const finalMessages = [...updatedMessages, aiMsg]
            setMessages(finalMessages)

            // Save to session history
            if (activeSessionId === null) {
                const newSession: ChatSession = {
                    id: Date.now(),
                    title: text.trim().slice(0, 40) + (text.length > 40 ? "..." : ""),
                    messages: finalMessages,
                    time: "Just now"
                }
                setChatSessions(prev => [newSession, ...prev])
                setActiveSessionId(newSession.id)
            } else {
                setChatSessions(prev =>
                    prev.map(s => s.id === activeSessionId
                        ? { ...s, messages: finalMessages, time: "Just now" }
                        : s
                    )
                )
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "model",
                text: "⚠️ Failed to connect. Please check your connection.",
                time: formatTime()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setActiveSessionId(null)
        setMessage("")
    }

    const loadSession = (session: ChatSession) => {
        setMessages(session.messages)
        setActiveSessionId(session.id)
        setMessage("")
    }

    const deleteSession = (id: number) => {
        setChatSessions(prev => prev.filter(s => s.id !== id))
        if (activeSessionId === id) {
            setMessages([])
            setActiveSessionId(null)
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        e.target.style.height = "64px"
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
    }

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            {/* Chat Sidebar */}
            <aside className="w-72 border-r border-gray-100 flex flex-col bg-white/50 flex-shrink-0">
                <div className="p-5">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm group"
                    >
                        <Plus className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 no-scrollbar pb-8">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">HISTORY</p>
                        {chatSessions.length > 0 && (
                            <button
                                onClick={() => { setChatSessions([]); handleNewChat() }}
                                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <AnimatePresence initial={false}>
                            {chatSessions.length > 0 ? (
                                chatSessions.map((session) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative"
                                    >
                                        <button
                                            onClick={() => loadSession(session)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group",
                                                activeSessionId === session.id
                                                    ? "bg-blue-50 border border-blue-100"
                                                    : "hover:bg-gray-50 border border-transparent"
                                            )}
                                        >
                                            <MessageSquare className={cn(
                                                "w-4 h-4 shrink-0 transition-colors",
                                                activeSessionId === session.id ? "text-blue-600" : "text-gray-400"
                                            )} />
                                            <div className="flex-1 overflow-hidden pr-6">
                                                <p className="text-sm font-semibold text-gray-700 truncate">{session.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{session.time}</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteSession(session.id) }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-3">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No History</p>
                                    <p className="text-[11px] text-gray-400 mt-1 font-medium">Your chat sessions will appear here.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-white">
                {/* Header */}
                <header className="h-[72px] border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Mindy AI</h2>
                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Online</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        {messages.length === 0 ? (
                            /* Welcome Screen */
                            <div className="flex flex-col items-center mt-16">
                                <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-8">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Hi, I'm Mindy! ✨</h1>
                                <p className="text-gray-400 text-sm font-medium mb-12 max-w-md text-center">
                                    Your smart financial AI assistant. Ask me anything about your spending, budgets, savings, or financial goals.
                                </p>

                                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                                    {quickActions.map((action) => (
                                        <button
                                            key={action.name}
                                            onClick={() => sendMessage(action.name)}
                                            className="flex flex-col items-start p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-100 transition-colors">
                                                <action.icon className="w-5 h-5" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 mb-0.5">{action.name}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{action.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Chat Messages */
                            <div className="space-y-6 pb-4">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex w-full",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[75%] flex gap-3",
                                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}>
                                                {msg.role === "model" && (
                                                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <Bot className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={cn(
                                                        "p-5 rounded-[20px] text-[15px] leading-relaxed",
                                                        msg.role === "user"
                                                            ? "bg-blue-600 text-white rounded-tr-sm font-medium shadow-lg shadow-blue-500/10"
                                                            : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm font-medium shadow-sm"
                                                    )}>
                                                        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
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

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-sm px-5 py-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm font-semibold">Mindy is thinking...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 pb-8 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative group">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleTextareaChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        sendMessage(message)
                                    }
                                }}
                                placeholder="Ask Mindy anything about your finances..."
                                disabled={isLoading}
                                className="w-full bg-white border-2 border-gray-100 rounded-[28px] py-5 pl-8 pr-16 text-[15px] font-medium text-gray-900 focus:border-blue-400 focus:shadow-2xl focus:shadow-blue-500/10 transition-all outline-none min-h-[64px] h-[64px] resize-none overflow-hidden placeholder:text-gray-400 shadow-sm disabled:opacity-50"
                                rows={1}
                            />
                            <button
                                onClick={() => sendMessage(message)}
                                disabled={isLoading || !message.trim()}
                                className="absolute right-3 top-3 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-40"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
