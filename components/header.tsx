"use client"

import { Search, Bell, Crown, Sparkles, Menu, ChevronDown, User, AlertTriangle, CheckCircle, CreditCard, Settings, LogOut, Loader2, Target, Trophy, ArrowRight, Zap } from "lucide-react"
import { globalSearch, type SearchResult } from "@/app/actions/search"
import { getNotifications, markAsRead, markAllAsRead, type Notification } from "@/app/actions/notifications"
import { getUserPlan } from "@/app/actions/payment"
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
import { useTranslation } from "@/lib/i18n/useTranslation"


interface HeaderProps {
    /** Controls whether the AI Assistant button shows as active */
    isAIPanelOpen: boolean
    /** Toggle callback for the AI Assistant panel */
    onAIPanelToggle: () => void
    /** Callback to open the mobile sidebar */
    onMobileMenuOpen: () => void
}

// No mock notifications needed anymore

export function Header({ isAIPanelOpen, onAIPanelToggle, onMobileMenuOpen }: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchRef = useRef<HTMLInputElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || "")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [notificationsLoading, setNotificationsLoading] = useState(false)
    const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null)
    const [user, setUser] = useState<AuthUser | null>(null)
    const [userPlan, setUserPlan] = useState<string>("starter")
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

    const fetchNotifications = async () => {
        if (!mounted.current) return
        setNotificationsLoading(true)
        const { data, error } = await getNotifications()
        if (mounted.current && !error && data) {
            setNotifications(data)
        }
        setNotificationsLoading(false)
    }

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted.current) {
                setUser(session?.user ?? null)
                if (session?.user) fetchNotifications()
            }
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted.current) {
                setUser(session?.user ?? null)
                if (session?.user) fetchNotifications()
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (user) {
            getUserPlan().then(({ data }) => {
                if (mounted.current && data?.plan) setUserPlan(data.plan)
            })
        }
    }, [user])

    const handleLogout = async () => {
        setProfileOpen(false)
        await createClient().auth.signOut()
        router.push("/")
        router.refresh()
    }

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const handleMarkAsRead = async (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
        await markAsRead(id)
    }

    const handleMarkAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        await markAllAsRead()
    }

    // Refresh notifications when panel opens
    useEffect(() => {
        if (notifOpen) {
            fetchNotifications()
        }
    }, [notifOpen])

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
        <header className="h-[88px] bg-white border-b border-gray-100 flex-shrink-0 relative z-50">
            <div className="max-w-[1600px] mx-auto w-full h-full flex items-center justify-between px-4 lg:px-8">

                {/* Left — Mobile trigger + Desktop Search */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile menu trigger */}
                    <button
                        onClick={onMobileMenuOpen}
                        suppressHydrationWarning
                        className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Desktop Search Bar */}
                    <div className="flex-1 max-w-md hidden lg:block relative">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder={t("header.searchPlaceholder")}
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

                        {/* Search Results Dropdown (Desktop) */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden max-h-[480px] flex flex-col"
                                >
                                    <div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">{t("header.searchResults")} "{searchValue}"</span>
                                        {searchResults.length > 0 && <span className="text-[10px] font-medium text-gray-400">{searchResults.length} {t("common.done").toLowerCase()}</span>}
                                    </div>

                                    <div className="overflow-y-auto py-2">
                                        {searchResults.length === 0 && !isSearching ? (
                                            <div className="py-8 px-4 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Search className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500">{t("header.noResults")}</p>
                                                <p className="text-xs text-gray-400 mt-1">{t("header.noResults")}</p>
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
                                                                    <p className="text-sm font-semibold text-gray-900 truncate">{res.title}</p>
                                                                    {res.amount !== undefined && (
                                                                        <span className="text-xs font-semibold text-gray-900 shrink-0">
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
                                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-semibold text-gray-400">↑</kbd>
                                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-semibold text-gray-400">↓</kbd>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">{t("header.toNavigate")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-semibold text-gray-400">Enter</kbd>
                                            <span className="text-[10px] text-gray-400 font-medium">{t("header.toSelect")}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                </div>

            </div>

                {/* Right — Search Toggle (Mobile) + AI button + Notifications + User */}
                <div className="flex items-center gap-2">
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-full transition-all lg:hidden flex-shrink-0",
                            isMobileSearchOpen ? "bg-blue-50 text-blue-600 shadow-inner" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                        aria-label="Toggle search"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* AI Assistant toggle */}
                    <button
                        onClick={onAIPanelToggle}
                        suppressHydrationWarning
                        className={cn(
                            "flex items-center gap-2 rounded-full border transition-all duration-300 group hover:scale-105 active:scale-95 flex-shrink-0",
                            "w-10 h-10 lg:w-auto lg:py-1.5",
                            isAIPanelOpen
                                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20 lg:pl-3 lg:pr-1.5 flex-row-reverse"
                                : "bg-gray-100 border-gray-200 hover:bg-gray-200 lg:pl-1.5 lg:pr-3"
                        )}
                        title="AI Assistant"
                        aria-label="Toggle AI Assistant"
                    >
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mx-auto lg:mx-0",
                            isAIPanelOpen
                                ? "bg-white/20 backdrop-blur"
                                : "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"
                        )}>
                            <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
                        </div>
                        <span className={cn(
                            "text-xs font-semibold tracking-tight transition-colors hidden lg:block",
                            isAIPanelOpen ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                        )}>
                            {t("header.aiAssistant")}
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
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-rose-500 text-white text-[10px] font-semibold rounded-full border-2 border-white">
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
                                        <h3 className="text-sm font-semibold text-gray-900">{t("header.notifications")}</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                {t("notifications.markAllRead")}
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[320px] overflow-y-auto">
                                        {notificationsLoading && notifications.length === 0 ? (
                                            <div className="p-8 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-8 text-center text-sm text-gray-500">{t("notifications.noNotifications")}</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => {
                                                        handleMarkAsRead(n.id)
                                                        setExpandedNotifId(prev => prev === n.id ? null : n.id)
                                                    }}
                                                    className={cn(
                                                        "flex gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-50 last:border-0",
                                                        !n.is_read && "bg-blue-50/50"
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
                                                        <p className={cn("text-sm font-medium", !n.is_read && "font-semibold text-gray-900")}>{n.title}</p>
                                                        <p className={cn(
                                                            "text-xs text-gray-500 transition-all",
                                                            expandedNotifId === n.id ? "" : "line-clamp-2"
                                                        )}>{n.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {new Date(n.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {!n.is_read && (
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
                                            {t("dashboard.viewAll")}
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
                                "flex items-center gap-2 rounded-full border transition-all duration-200 group flex-shrink-0",
                                "w-10 h-10 lg:w-auto lg:pl-1 lg:pr-3 lg:py-1",
                                profileOpen 
                                    ? "bg-blue-50 border-blue-200" 
                                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                            )}
                            title="Profile"
                            aria-label="Profile menu"
                            suppressHydrationWarning
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border mx-auto lg:mx-0 transition-all",
                                profileOpen 
                                    ? "bg-blue-100 border-blue-200 text-blue-600" 
                                    : "bg-gray-100 border-gray-200 text-gray-500"
                            )}>
                                {userPlan === "pro" ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className="hidden lg:flex flex-col items-start leading-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors truncate max-w-[120px]">
                                        {user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}
                                    </span>
                                    {userPlan === "pro" && (
                                        <span className="text-[9px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">PRO</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium mt-0.5 truncate max-w-[120px]">{user?.email ?? ""}</span>
                            </div>
                            <ChevronDown className={cn("w-3 h-3 text-gray-400 hidden lg:block transition-transform", profileOpen && "rotate-180 text-blue-600")} suppressHydrationWarning />
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
                                            <div className={cn(
                                                "w-11 h-11 rounded-full flex items-center justify-center border transition-all",
                                                profileOpen
                                                    ? "bg-blue-100 border-blue-200 text-blue-600"
                                                    : "bg-gray-50 border-gray-200 text-gray-500"
                                            )}>
                                                {userPlan === "pro" ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}</p>
                                                    {userPlan === "pro" && (
                                                        <span className="text-[9px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider">PRO</span>
                                                    )}
                                                </div>
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
                                            {t("header.viewProfile")}
                                        </button>
                                        <button
                                            onClick={() => { setProfileOpen(false); router.push("/dashboard/settings"); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            {t("nav.settings")}
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-gray-100">
                                        {userPlan === "starter" && (
                                            <button
                                                onClick={() => { setProfileOpen(false); router.push("/checkout"); }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group mb-1"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Zap className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-semibold text-blue-700">{t("common.upgrade") || "Upgrade to Pro"}</span>
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {t("nav.logout")}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Mobile Search Bar Expansion */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden relative z-50 shadow-lg"
                    >
                        <div className="px-4 py-4 relative">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                <input
                                    autoFocus
                                    ref={searchRef}
                                    type="text"
                                    placeholder={t("header.searchPlaceholder")}
                                    value={searchValue}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    suppressHydrationWarning
                                    className="w-full pl-10 pr-10 py-3 bg-gray-100 border border-transparent rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-400 transition-all duration-200 shadow-inner"
                                />
                                {searchValue && (
                                    <button
                                        onClick={() => handleSearchInput("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                                    >
                                        <ChevronDown className="w-3 h-3 rotate-45" />
                                    </button>
                                )}
                            </div>

                            {/* Mobile Search Results */}
                            {showResults && (
                                <div className="mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl max-h-[350px] overflow-y-auto">
                                    <div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">{t("header.searchResults")} "{searchValue}"</span>
                                    </div>
                                    <div className="py-2">
                                        {searchResults.length === 0 && !isSearching ? (
                                            <div className="py-6 px-4 text-center">
                                                <p className="text-sm font-medium text-gray-500">{t("header.noResults")}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {searchResults.map((res) => {
                                                    const Icon = res.type === 'transaction' ? CreditCard : res.type === 'goal' ? Target : Trophy;
                                                    return (
                                                        <button
                                                            key={`${res.type}-${res.id}`}
                                                            onClick={() => {
                                                                handleResultClick(res);
                                                                setIsMobileSearchOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
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
                                                                    <p className="text-sm font-semibold text-gray-900 truncate">{res.title}</p>
                                                                    {res.amount !== undefined && (
                                                                        <span className="text-xs font-semibold text-gray-900 shrink-0">
                                                                            Rp {new Intl.NumberFormat('id-ID').format(res.amount)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-500 truncate capitalize">{res.type} • {res.subtitle}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
