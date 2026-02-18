"use client"

import { Sidebar } from "@/components/sidebar"
import { Search, Bell, User, FileDown, Sparkles, Calendar, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, Suspense } from "react"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense fallback={
            <div className="flex bg-slate-50 min-h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <DashboardContent>{children}</DashboardContent>
        </Suspense>
    )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    const isAIPage = pathname === "/dashboard/ai"

    // Automatically collapse sidebar when AI panel is opened
    useEffect(() => {
        if (isAIPanelOpen && !isSidebarCollapsed) {
            setIsSidebarCollapsed(true)
        }
    }, [isAIPanelOpen])

    useEffect(() => {
        if (searchParams.get('onboarding') === 'true') {
            setIsOnboardingOpen(true)
        }
    }, [searchParams])

    const handleCloseOnboarding = () => {
        setIsOnboardingOpen(false)
        router.replace('/dashboard')
    }

    return (
        <div className="flex bg-slate-50 min-h-screen text-gray-900 font-inter">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header - Hidden on AI Deep Chat Page */}
                {!isAIPage && (
                    <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    suppressHydrationWarning
                                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all relative" title="Notifications" suppressHydrationWarning>
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                            </button>
                            <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Calendar" suppressHydrationWarning>
                                <Calendar className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors" title="Export Data" suppressHydrationWarning>
                                <FileDown className="w-4 h-4" /> <span className="hidden lg:inline">Export</span>
                            </button>



                            <button
                                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                                suppressHydrationWarning
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-lg group hover:scale-105 active:scale-95",
                                    isAIPanelOpen
                                        ? "bg-blue-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
                                        : "bg-blue-50 text-blue-600 shadow-transparent hover:bg-blue-100"
                                )}
                                title="AI Assistant"
                            >
                                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                            </button>
                        </div>
                    </header>
                )}

                {/* Content Container */}
                <main className={cn(
                    "flex-1 overflow-y-auto bg-slate-50/50 no-scrollbar @container/main",
                    isAIPage ? "p-0" : "p-10"
                )}>
                    {children}
                </main>
            </div>

            {/* Global AI Assistant Panel - Hidden on AI Deep Chat Page */}
            {!isAIPage && (
                <AIAssistantPanel
                    isOpen={isAIPanelOpen}
                    onClose={() => setIsAIPanelOpen(false)}
                />
            )}

            {/* Global Onboarding Modal */}
            <OnboardingWizard
                isOpen={isOnboardingOpen}
                onClose={handleCloseOnboarding}
            />
        </div>
    )
}
