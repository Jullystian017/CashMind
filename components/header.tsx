"use client"

import { Search, Bell, Sparkles, Menu, ChevronDown, User, AlertTriangle, CheckCircle, CreditCard, Settings, LogOut, Loader2, Target, Trophy, ArrowRight } from "lucide-react"
import { globalSearch, type SearchResult } from "@/app/actions/search"
import { cn } from "@/lib/utils"
import { useRef, useEffect, useState } from "react"

function useMounted() {
    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => { mounted.current = false }
    }, [])
    return mounted
}
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User as AuthUser } from "@supabase/supabase-js"

type Notification = {
    id: string
    type: "alert" | "success" | "info"
    title: string
    message: string
    time: string
    read: boolean
}

interface HeaderProps {
    /** Controls whether the AI Assistant button shows as active */
    isAIPanelOpen: boolean
    /** Toggle callback for the AI Assistant panel */
    onAIPanelToggle: () => void
    /** Callback to open the mobile sidebar */
    onMobileMenuOpen: () => void
}

const mockNotifications: Notification[] = [
    { id: "1", type: "alert", title: "Netflix renewal soon", message: "Insufficient balance in Dana for Rp 186.000", time: "2h ago", read: false },
    { id: "2", type: "success", title: "Challenge completed", message: "Reduce Food Spending 20% – +120 XP earned", time: "5h ago", read: false },
    { id: "3", type: "info", title: "Spotify billing", message: "Payment due Oct 5th – Rp 86.000", time: "1d ago", read: true },
]

export function Header({ isAIPanelOpen, onAIPanelToggle, onMobileMenuOpen }: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchRef = useRef<HTMLInputElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)

    const [searchValue, setSearchValue] = useState(searchParams.get('q') || "")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [user, setUser] = useState<AuthUser | null>(null)
    const mounted = useMounted()

    // Real-time search with debounce
    useEffect(() => {
        if (!searchValue || searchValue.length < 2) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        const timer = setTimeout(async () => {
            setIsSearching(true)
            setShowResults(true)
            const { data, error } = await globalSearch(searchValue)
            if (!error && data) {
                setSearchResults(data)
                setSelectedIndex(-1)
            }
            setIsSearching(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchValue])

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted.current) setUser(session?.user ?? null)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted.current) setUser(session?.user ?? null)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        setProfileOpen(false)
        await createClient().auth.signOut()
        router.push("/")
        router.refresh()
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
            if (searchRef.current?.parentElement && !searchRef.current.parentElement.contains(e.target as Node)) setShowResults(false)
        }
        if (notifOpen || profileOpen || showResults) document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [notifOpen, profileOpen, showResults])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                searchRef.current?.focus()
                setShowResults(true)
            }
            if (showResults) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev))
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
                } else if (e.key === 'Enter' && selectedIndex >= 0) {
                    e.preventDefault()
                    const result = searchResults[selectedIndex]
                    handleResultClick(result)
                } else if (e.key === 'Escape') {
                    setShowResults(false)
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showResults, searchResults, selectedIndex])

    // Update URL when search changes
    const handleSearchInput = (val: string) => {
        setSearchValue(val)

        // Sync with URL query parameter
        const params = new URLSearchParams(searchParams.toString())
        if (val) {
            params.set('q', val)
        } else {
            params.delete('q')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleResultClick = (result: SearchResult) => {
        setShowResults(false)
        router.push(result.link)
    }

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
                    <div className="flex-1 max-w-md hidden sm:block relative">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search transactions, goals..."
                                value={searchValue}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                onFocus={() => searchValue.length >= 2 && setShowResults(true)}
                                suppressHydrationWarning
                                className="w-full pl-10 pr-16 py-2.5 bg-gray-100 border border-transparent rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                            />
                            {isSearching ? (
                                <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                            ) : (
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-semibold text-gray-400 shadow-sm pointer-events-none">
                                    ⌘K
                                </kbd>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden max-h-[480px] flex flex-col"
                                >
                                    <div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Results for "{searchValue}"</span>
                                        {searchResults.length > 0 && <span className="text-[10px] font-medium text-gray-400">{searchResults.length} found</span>}
                                    </div>

                                    <div className="overflow-y-auto py-2">
                                        {searchResults.length === 0 && !isSearching ? (
                                            <div className="py-8 px-4 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Search className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500">No results found</p>
                                                <p className="text-xs text-gray-400 mt-1">Try another keyword</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {searchResults.map((res, index) => {
                                                    const Icon = res.type === 'transaction' ? CreditCard : res.type === 'goal' ? Target : Trophy;
                                                    const isSelected = selectedIndex === index;
                                                    return (
                                                        <button
                                                            key={`${res.type}-${res.id}`}
                                                            onClick={() => handleResultClick(res)}
                                                            onMouseEnter={() => setSelectedIndex(index)}
                                                            className={cn(
                                                                "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors",
                                                                isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                                res.type === 'transaction' ? "bg-amber-50 text-amber-600" :
                                                                    res.type === 'goal' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                                                            )}>
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <p className="text-sm font-bold text-gray-900 truncate">{res.title}</p>
                                                                    {res.amount !== undefined && (
                                                                        <span className="text-xs font-black text-gray-900 shrink-0">
                                                                            Rp {new Intl.NumberFormat('id-ID').format(res.amount)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center justify-between mt-0.5">
                                                                    <p className="text-xs text-gray-500 truncate capitalize">{res.type} • {res.subtitle}</p>
                                                                    {isSelected && <ArrowRight className="w-3 h-3 text-blue-500" />}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-400">↑</kbd>
                                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-400">↓</kbd>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">to navigate</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-400">Enter</kbd>
                                            <span className="text-[10px] text-gray-400 font-medium">to select</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                    <div className="relative hidden sm:block" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            suppressHydrationWarning
                            className={cn(
                                "p-2.5 rounded-full border transition-all relative",
                                notifOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-100 border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            )}
                            title="Notifications"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    className="absolute right-0 top-full mt-2 w-[360px] max-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[320px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-sm text-gray-500">No notifications</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={cn(
                                                        "flex gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0",
                                                        !n.read && "bg-blue-50/50"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                                            n.type === "alert" && "bg-amber-100 text-amber-600",
                                                            n.type === "success" && "bg-emerald-100 text-emerald-600",
                                                            n.type === "info" && "bg-blue-100 text-blue-600"
                                                        )}
                                                    >
                                                        {n.type === "alert" && <AlertTriangle className="w-4 h-4" />}
                                                        {n.type === "success" && <CheckCircle className="w-4 h-4" />}
                                                        {n.type === "info" && <CreditCard className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn("text-sm font-medium", !n.read && "font-semibold text-gray-900")}>{n.title}</p>
                                                        <p className="text-xs text-gray-500 truncate">{n.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                                                    </div>
                                                    {!n.read && (
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-gray-100">
                                        <button
                                            onClick={() => { setNotifOpen(false); router.push("/dashboard/transactions"); }}
                                            className="w-full py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                        >
                                            View all activity
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User / Profile - suppressHydrationWarning: avoids mismatch from extensions (fdprocessedid) and class order */}
                    <div className="relative" ref={profileRef} suppressHydrationWarning>
                        <button
                            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                            className={cn(
                                "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 group",
                                profileOpen ? "bg-blue-50 border-blue-200" : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                            )}
                            title="Profile"
                            aria-label="Profile menu"
                            suppressHydrationWarning
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                                profileOpen ? "bg-blue-100 border-blue-200 text-blue-600" : "bg-gray-100 border-gray-200 text-gray-500"
                            )}>
                                <User className="w-4 h-4" />
                            </div>
                            <div className="hidden sm:flex flex-col items-start leading-none">
                                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors truncate max-w-[120px]">
                                    {user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium mt-0.5 truncate max-w-[120px]">{user?.email ?? ""}</span>
                            </div>
                            <ChevronDown className={cn("w-3 h-3 text-gray-400 hidden sm:block transition-transform", profileOpen && "rotate-180 text-blue-600")} suppressHydrationWarning />
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email ?? ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => { setProfileOpen(false); router.push("/dashboard/profile"); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-gray-400" />
                                            My profile
                                        </button>
                                        <button
                                            onClick={() => { setProfileOpen(false); router.push("/dashboard/settings"); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </header>
    )
}
