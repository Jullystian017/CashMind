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
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const menuCategories = [
    {
        title: "Home",
        items: [
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { name: "Transactions", icon: ReceiptText, href: "/dashboard/transactions" },
            { name: "Budgets", icon: Wallet, href: "/dashboard/budgets" },
            { name: "Goals & Savings", icon: Target, href: "/dashboard/goals" },
            { name: "Challenges", icon: Trophy, href: "/dashboard/challenges" },
            { name: "Mindy AI", icon: Bot, href: "/dashboard/ai" },
        ]
    },
    {
        title: "Reports",
        items: [
            { name: "Insights", icon: TrendingUp, href: "/dashboard/reports" },
            { name: "Reports / Export", icon: ReceiptText, href: "/dashboard/export" },
        ]
    }
]

const bottomMenuItems = [
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
]

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-40",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section & Toggle Integration */}
            <div className={cn(
                "h-[88px] flex items-center border-b border-gray-100 bg-white flex-shrink-0",
                isCollapsed ? "justify-center" : "px-6"
            )}>
                {!isCollapsed ? (
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
                        <button
                            onClick={() => setIsCollapsed(true)}
                            suppressHydrationWarning
                            className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all group lg:flex hidden"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                ) : (
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
                )}
            </div>



            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto px-4 no-scrollbar pt-4">
                {menuCategories.map((category) => (
                    <div key={category.title} className="mb-8">
                        {!isCollapsed && (
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
                                            {!isCollapsed && (
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


            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <User className="w-6 h-6 text-gray-500" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold tracking-tight text-gray-800 truncate">Fajar Alexander</p>
                            <p className="text-[10px] text-gray-400 truncate font-medium">fajar@gmail.com</p>
                        </div>
                    )}
                    {!isCollapsed && <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />}
                </div>
            </div>

        </aside>
    )
}
