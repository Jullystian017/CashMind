"use client"

import { Search, Bell, Sparkles, Menu, ChevronDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useEffect } from "react"

interface HeaderProps {
    /** Controls whether the AI Assistant button shows as active */
    isAIPanelOpen: boolean
    /** Toggle callback for the AI Assistant panel */
    onAIPanelToggle: () => void
    /** Callback to open the mobile sidebar */
    onMobileMenuOpen: () => void
}

export function Header({ isAIPanelOpen, onAIPanelToggle, onMobileMenuOpen }: HeaderProps) {
    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                searchRef.current?.focus()
                searchRef.current?.select()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <header className="h-[88px] bg-white border-b border-gray-100 flex-shrink-0">
            <div className="max-w-[1600px] mx-auto w-full h-full flex items-center justify-between px-4 lg:px-8">

                {/* Left — Mobile trigger + Search */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile menu trigger */}
                    <button
                        onClick={onMobileMenuOpen}
                        suppressHydrationWarning
                        className="p-2.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search bar */}
                    <div className="flex-1 max-w-sm hidden sm:block">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search anything..."
                                suppressHydrationWarning
                                className="w-full pl-10 pr-16 py-2.5 bg-gray-100 border border-transparent rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                            />
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-semibold text-gray-400 shadow-sm pointer-events-none">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right — AI button + Notifications + User */}
                <div className="flex items-center gap-2">
                    {/* AI Assistant toggle */}
                    <button
                        onClick={onAIPanelToggle}
                        suppressHydrationWarning
                        className={cn(
                            "flex items-center gap-2 py-1 rounded-full border transition-all duration-300 group hover:scale-105 active:scale-95",
                            isAIPanelOpen
                                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20 pl-3 pr-1 flex-row-reverse"
                                : "bg-gray-100 border-gray-200 hover:bg-gray-200 pl-1 pr-3"
                        )}
                        title="AI Assistant"
                        aria-label="Toggle AI Assistant"
                    >
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shadow-md flex-shrink-0",
                            isAIPanelOpen
                                ? "bg-white/20 backdrop-blur"
                                : "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"
                        )}>
                            <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
                        </div>
                        <span className={cn(
                            "text-xs font-semibold tracking-tight transition-colors",
                            isAIPanelOpen ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                        )}>
                            Assistant
                        </span>
                    </button>

                    {/* Notifications */}
                    <button
                        suppressHydrationWarning
                        className="p-2.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all relative hidden sm:flex"
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
                    </button>

                    {/* User Avatar */}
                    <div
                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-200 cursor-pointer group"
                        title="Profile"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="hidden sm:flex flex-col leading-none">
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Jullystian</span>
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5">jullystian@gmail.com</span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                    </div>
                </div>

            </div>
        </header>
    )
}
