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
    X,
    Menu
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/useTranslation"
import { 
    getChatSessions, 
    createChatSession, 
    getSessionMessages, 
    addMessageToSession, 
    deleteChatSession 
} from "@/app/actions/chat"

interface Message {
    id: string
    role: "user" | "model"
    text: string
    time: string
}

interface ChatSession {
    id: string
    title: string
    messages?: Message[]
    updated_at: string
}

export default function DeepChatPage() {
    const { t } = useTranslation();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const quickActions = [
        { key: "analyze", icon: TrendingUp },
        { key: "suggest", icon: Calculator },
        { key: "tips", icon: Lightbulb },
        { key: "review", icon: FileText },
    ]

    // Fetch sessions on mount
    useEffect(() => {
        const fetchSessions = async () => {
            const { data, error } = await getChatSessions()
            if (!error && data) {
                setChatSessions(data.map(s => ({
                    id: s.id,
                    title: s.title,
                    updated_at: s.updated_at
                })))
            }
        }
        fetchSessions()
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, isLoading])

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return

        let currentSessionId = activeSessionId

        // 1. Create session if it doesn't exist
        if (!currentSessionId) {
            const title = text.trim().slice(0, 40) + (text.length > 40 ? "..." : "")
            const { data, error } = await createChatSession(title)
            if (error || !data) return
            currentSessionId = data.id
            setActiveSessionId(currentSessionId)
            setChatSessions(prev => [{
                id: data.id,
                title: data.title,
                updated_at: data.updated_at
            }, ...prev])
        }

        const userMsg: Message = {
            id: Math.random().toString(),
            role: "user",
            text: text.trim(),
            time: formatTime()
        }

        // 2. Save user message to DB
        if (currentSessionId) {
            await addMessageToSession(currentSessionId, "user", text.trim())
        }

        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setMessage("")
        setIsLoading(true)

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
            const reply = data.error ? `⚠️ ${data.error}` : data.reply

            // 3. Save AI message to DB
            if (currentSessionId) {
                await addMessageToSession(currentSessionId, "model", reply)
            }

            const aiMsg: Message = {
                id: Math.random().toString(),
                role: "model",
                text: reply,
                time: formatTime()
            }

            setMessages([...updatedMessages, aiMsg])
            
            // Update session list order/time
            setChatSessions(prev => {
                const session = prev.find(s => s.id === currentSessionId)
                if (!session) return prev
                return [
                    { ...session, updated_at: new Date().toISOString() },
                    ...prev.filter(s => s.id !== currentSessionId)
                ]
            })

        } catch {
            setMessages(prev => [...prev, {
                id: Math.random().toString(),
                role: "model",
                text: "⚠️ " + t("errors.networkError"),
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

    const loadSession = async (session: ChatSession) => {
        setActiveSessionId(session.id)
        setMessage("")
        setIsLoading(true)
        try {
            const { data, error } = await getSessionMessages(session.id)
            if (!error && data) {
                setMessages(data.map(m => ({
                    id: m.id,
                    role: m.role as "user" | "model",
                    text: m.text,
                    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSession = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const { error } = await deleteChatSession(id)
        if (!error) {
            setChatSessions(prev => prev.filter(s => s.id !== id))
            if (activeSessionId === id) {
                setMessages([])
                setActiveSessionId(null)
            }
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        e.target.style.height = "64px"
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex h-[100dvh] md:h-screen bg-slate-50/50 overflow-hidden relative @container">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Chat Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 md:relative md:translate-x-0 md:bg-white/50",
                isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-5 flex items-center justify-between">
                    <button
                        onClick={handleNewChat}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:shadow-md transition-all shadow-sm group"
                    >
                        <Plus className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
                        {t("ai.newChat")}
                    </button>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 ml-2 hover:bg-gray-100 rounded-xl md:hidden text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 no-scrollbar pb-8">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{t("ai.history")}</p>
                        {chatSessions.length > 0 && (
                            <button
                                onClick={() => { setChatSessions([]); handleNewChat() }}
                                className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
                            >
                                {t("ai.clearAll")}
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
                                            onClick={() => { loadSession(session); setIsSidebarOpen(false); }}
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
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(session.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={(e) => deleteSession(session.id, e)}
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
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t("ai.noHistory")}</p>
                                    <p className="text-[11px] text-gray-400 mt-1 font-medium">{t("ai.noHistorySubtitle")}</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-white">
                {/* Header */}
                <header className="h-[64px] md:h-[72px] shrink-0 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/dashboard" className="p-2 md:p-2.5 bg-gray-50 md:bg-transparent hover:bg-gray-100 rounded-xl md:rounded-2xl text-gray-500 md:text-gray-400 transition-colors">
                            <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
                        </Link>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors md:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 ml-1 md:ml-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm md:text-lg font-semibold text-gray-900 tracking-tight leading-tight">Mindy AI</h2>
                                <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">{t("ai.online")}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        {messages.length === 0 ? (
                            /* Welcome Screen */
                            <div className="flex flex-col items-center mt-8 @md:mt-16 text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-8 shrink-0">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h1 className="text-2xl @md:text-4xl font-bold text-gray-900 tracking-tight mb-3 px-4">{t("ai.greeting")}</h1>
                                <p className="text-gray-400 text-sm @md:text-base font-medium mb-12 max-w-sm @md:max-w-md px-6 leading-relaxed">
                                    {t("ai.greetingSubtitle")}
                                </p>

                                <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4 w-full max-w-lg px-4 pb-12">
                                    {quickActions.map((action) => (
                                        <button
                                            key={action.key}
                                            onClick={() => sendMessage(t(`ai.quickActions.${action.key}`))}
                                            className="flex flex-col items-start p-6 rounded-[24px] bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group active:scale-[0.98]"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors shadow-sm">
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm md:text-base font-bold text-gray-800 mb-1 leading-tight">{t(`ai.quickActions.${action.key}`)}</p>
                                            <p className="text-[11px] md:text-xs text-gray-400 font-semibold leading-relaxed line-clamp-2">{t(`ai.quickActions.${action.key}Desc`)}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Chat Messages */
                            <div className="space-y-8 pb-4">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex w-full px-2",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[92%] @md:max-w-[85%] flex gap-3",
                                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}>
                                                {msg.role === "model" && (
                                                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-blue-100/50">
                                                        <Bot className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <div className={cn(
                                                        "p-4 @md:p-5 rounded-[22px] text-[14px] @md:text-[15px] leading-relaxed shadow-sm",
                                                        msg.role === "user"
                                                            ? "bg-blue-600 text-white rounded-tr-sm font-medium shadow-blue-500/10"
                                                            : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm font-medium"
                                                    )}>
                                                        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                                                    </div>
                                                    <p className={cn(
                                                        "mt-2 text-[10px] font-bold text-gray-400/80 tracking-wider uppercase px-2",
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
                                    <div className="flex justify-start px-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="bg-white border border-gray-100 rounded-[22px] rounded-tl-sm px-6 py-4 shadow-sm">
                                                <div className="flex items-center gap-3 text-blue-600">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm font-bold uppercase tracking-widest">{t("ai.thinking")}</span>
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
                                placeholder={t("ai.placeholder")}
                                disabled={isLoading}
                                className="w-full bg-white border-2 border-gray-100 rounded-[24px] md:rounded-[28px] py-3.5 md:py-5 pl-5 md:pl-8 pr-14 md:pr-16 text-[16px] md:text-[15px] font-medium text-gray-900 focus:border-blue-400 focus:shadow-2xl focus:shadow-blue-500/10 transition-all outline-none min-h-[52px] md:min-h-[64px] h-[52px] md:h-[64px] resize-none overflow-hidden placeholder:text-gray-400 shadow-sm disabled:opacity-50"
                                rows={1}
                            />
                            <button
                                onClick={() => sendMessage(message)}
                                disabled={isLoading || !message.trim()}
                                className="absolute right-2 md:right-3 top-1.5 md:top-3 w-[40px] h-[40px] bg-blue-600 text-white rounded-[16px] md:rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-40"
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
