"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ReceiptText,
    Zap,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    ChevronDown,
    Search,
    Bot,
    TrendingUp,
    PanelLeft,
    PanelLeftClose,
    Target,
    Wallet,
    Repeat,
    Sparkles,
    Trophy,
    Award
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n/useTranslation"

const getMenuCategories = (t: (key: string) => string) => [
    {
        title: t("dashboard.sidebarOverview"),
        items: [
            { name: t("nav.dashboard"), icon: LayoutDashboard, href: "/dashboard" },
        ]
    },
    {
        title: t("dashboard.sidebarFinancial"),
        items: [
            { name: t("nav.transactions"), icon: ReceiptText, href: "/dashboard/transactions" },
            { name: t("nav.budgets"), icon: Wallet, href: "/dashboard/budgets" },
            { name: t("nav.subscriptions"), icon: Repeat, href: "/dashboard/subscriptions" },
        ]
    },
    {
        title: t("dashboard.sidebarGrowth"),
        items: [
            { name: t("dashboard.futureSimulator"), icon: Sparkles, href: "/dashboard/simulation" },
            { name: t("nav.challenges"), icon: Trophy, href: "/dashboard/challenges" },
            { name: t("nav.aiAdvisor"), icon: Bot, href: "/dashboard/ai" },
        ]
    },
    {
        title: t("dashboard.sidebarUtilities"),
        items: [
            { name: t("nav.splitBill"), icon: TrendingUp, href: "/dashboard/split-bill" },
            { name: t("nav.export"), icon: ReceiptText, href: "/dashboard/export" },
        ]
    }
]

const getBottomMenuItems = (t: (key: string) => string) => []

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
    isMobileOpen?: boolean
    setIsMobileOpen?: (value: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname()
    const { t } = useTranslation()

    // On mobile, sidebar is always full width — never icon-only
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    const effectiveCollapsed = isMobile ? false : isCollapsed

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-50",
                "fixed lg:sticky top-0 left-0",
                effectiveCollapsed ? "w-20" : "w-64",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                "shadow-2xl lg:shadow-none"
            )}
        >
            {/* Logo Section & Toggle Integration */}
            <div className={cn(
                "h-[88px] flex items-center border-b border-gray-100 bg-white flex-shrink-0",
                effectiveCollapsed ? "justify-center" : "px-6"
            )}>
                {!effectiveCollapsed ? (
                    <div className="flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2 overflow-hidden group">
                            <div className="relative w-10 h-10 flex-shrink-0 transition-transform group-hover:scale-105">
                                <Image
                                    src="/cashmind-logo2.png"
                                    alt="CashMind Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-semibold tracking-tight text-gray-900 whitespace-nowrap"
                            >
                                CashMind
                            </motion.span>
                        </Link>

                        <div className="flex items-center gap-1">
                            {/* Desktop Toggle */}
                            <button
                                onClick={() => setIsCollapsed(true)}
                                suppressHydrationWarning
                                className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all group lg:flex hidden"
                                title={t("dashboard.collapseSidebar")}
                            >
                                <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div
                            onClick={() => setIsCollapsed(false)}
                            className="group relative flex items-center justify-center p-2 rounded-2xl transition-all hover:bg-blue-50 cursor-pointer h-12 w-12"
                        >
                            <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                                {/* Logo: Visible by default, hidden on hover */}
                                <Image
                                    src="/cashmind-logo2.png"
                                    alt="CashMind Logo"
                                    fill
                                    className="object-contain transition-opacity group-hover:opacity-0"
                                />
                                {/* Toggle: Hidden by default, visible on hover */}
                                <div className="absolute inset-0 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                                    <PanelLeft className="w-5 h-5" />
                                </div>
                            </div>
                        </div>


                    </div>
                )}
            </div>



            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto px-4 no-scrollbar pt-4">
                {getMenuCategories(t).map((category) => (
                    <div key={category.title} className="mb-8">
                        {!effectiveCollapsed && (
                            <h4 className="px-3 mb-4 text-xs font-medium text-gray-400">
                                {category.title}
                            </h4>
                        )}
                        <div className="space-y-1">
                            {category.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <div key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all group relative",
                                                isActive
                                                    ? "bg-white text-blue-600 shadow-[0px_2px_8px_0px_rgba(37,99,235,0.1)] border border-blue-100/50"
                                                    : "text-gray-500 hover:bg-blue-50/50 hover:text-blue-600"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600")} />
                                            {!effectiveCollapsed && (
                                                <span className="text-sm font-semibold tracking-tight flex-1">
                                                    {item.name}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Menu - Removed Profile & Settings as per user request */}
        </aside>
    )
}
