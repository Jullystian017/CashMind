"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ReceiptText,
    PiggyBank,
    Target,
    Bot,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Transactions", icon: ReceiptText, href: "/dashboard/transactions" },
    { name: "Budget Planner", icon: PiggyBank, href: "/dashboard/budget" },
    { name: "Savings Goals", icon: Target, href: "/dashboard/savings" },
    { name: "AI Coach (Mindy)", icon: Bot, href: "/dashboard/ai-coach" },
]

const bottomMenuItems = [
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-40",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 overflow-hidden">
                    <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                            src="/cashmind-logo.png"
                            alt="CashMind Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap"
                        >
                            CashMind
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-2 mt-8">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                            {!isCollapsed && (
                                <span className="text-sm font-bold whitespace-nowrap font-inter">{item.name}</span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 space-y-2 border-t border-gray-100">
                {bottomMenuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all group relative"
                    >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {!isCollapsed && (
                            <span className="text-sm font-bold whitespace-nowrap font-inter">{item.name}</span>
                        )}
                    </Link>
                ))}

                <button className="flex items-center gap-3 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all w-full group relative">
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && (
                        <span className="text-sm font-bold whitespace-nowrap font-inter">Logout</span>
                    )}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-sm transition-all z-50"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    )
}
