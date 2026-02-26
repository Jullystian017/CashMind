"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Bot, Sparkles, Send, TrendingUp, Calculator, Lightbulb, FileText, X, Maximize2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: number
    role: "user" | "model"
    text: string
}

interface AIAssistantPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function AIAssistantPanel({ isOpen, onClose }: AIAssistantPanelProps) {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const quickActions = [
        { name: "Analyze My Spending", icon: TrendingUp },
        { name: "Suggest Budget Plan", icon: Calculator },
        { name: "Saving Tips", icon: Lightbulb },
        { name: "Subscription Check", icon: FileText },
    ]

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return

        const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() }
        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.role, text: m.text }))
                })
            })

            const data = await res.json()

            if (data.error) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: "model",
                    text: `⚠️ ${data.error}`
                }])
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: "model",
                    text: data.reply
                }])
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "model",
                text: "⚠️ Failed to connect. Please check your connection."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-100 flex flex-col z-[70] shadow-2xl lg:shadow-none lg:static">
            {/* Header */}
            <div className="h-[88px] px-6 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900 tracking-tight">Mindy AI</span>
                </div>
                <Link
                    href="/dashboard/ai"
                    className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors"
                    title="Full Chat Mode"
                >
                    <Maximize2 className="w-5 h-5" />
                </Link>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar bg-slate-50/30">
                {messages.length === 0 ? (
                    /* Welcome + Quick Actions */
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col items-center text-center mb-8 mt-4">
                            <div className="relative mb-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center relative group">
                                    <Bot className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                    <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Hi there! 👋</h3>
                            <p className="text-xs text-gray-500 font-medium px-4">
                                I'm <span className="text-blue-600 font-bold">Mindy</span>, your smart financial coach. How can I help?
                            </p>
                        </div>

                        <div className="w-full space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">SMART ACTIONS</p>
                            {quickActions.map((action) => (
                                <button
                                    key={action.name}
                                    onClick={() => sendMessage(action.name)}
                                    className="w-full flex items-center gap-3 p-4 rounded-[21px] bg-white border border-gray-100/50 hover:border-blue-100 hover:bg-white hover:shadow-md hover:shadow-blue-500/5 transition-all text-left group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors">
                                        <action.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{action.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Messages */
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-sm font-medium"
                                        : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm font-medium"
                                )}>
                                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span className="text-[11px] font-semibold">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage(input)
                            }
                        }}
                        placeholder="Ask Mindy anything..."
                        disabled={isLoading}
                        className="w-full bg-gray-50 border-transparent rounded-[24px] py-4 pl-5 pr-12 text-xs font-medium focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 disabled:opacity-40"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
