"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, Suspense } from "react"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"

const ONBOARDING_COMPLETED_KEY = "cashmind_onboarding_completed"

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
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false)
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

    const isAIPage = pathname === "/dashboard/ai"
    const showOnboardingBanner = onboardingCompleted === false && !isAIPage

    // Automatically collapse sidebar when AI page or AI panel is opened
    useEffect(() => {
        if ((isAIPage || isAIPanelOpen) && !isSidebarCollapsed) {
            setIsSidebarCollapsed(true)
        }
    }, [isAIPage, isAIPanelOpen])

    // Automatically close AI panel when sidebar is expanded
    useEffect(() => {
        if (!isSidebarCollapsed && isAIPanelOpen) {
            setIsAIPanelOpen(false)
        }
    }, [isSidebarCollapsed])

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsSidebarMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        setOnboardingCompleted(typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true" : null)
    }, [])

    useEffect(() => {
        if (searchParams.get('onboarding') === 'true') {
            setIsOnboardingOpen(true)
        }
    }, [searchParams])

    const handleCloseOnboarding = (completed?: boolean) => {
        if (typeof window !== "undefined" && completed) {
            localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true")
            setOnboardingCompleted(true)
        } else if (typeof window !== "undefined") {
            setOnboardingCompleted(false)
        }
        setIsOnboardingOpen(false)
        router.replace('/dashboard')
    }

    return (
        <div className="flex bg-slate-50 min-h-screen text-gray-900 font-inter">
            {/* Sidebar Overlay (Mobile Only) */}
            <AnimatePresence>
                {isSidebarMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarMobileOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* AI Panel Backdrop (Mobile Only) */}
            <AnimatePresence>
                {isAIPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAIPanelOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                isMobileOpen={isSidebarMobileOpen}
                setIsMobileOpen={setIsSidebarMobileOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header - Hidden on AI Deep Chat Page */}
                {!isAIPage && (
                    <Header
                        isAIPanelOpen={isAIPanelOpen}
                        onAIPanelToggle={() => setIsAIPanelOpen(!isAIPanelOpen)}
                        onMobileMenuOpen={() => setIsSidebarMobileOpen(true)}
                    />
                )}

                {/* Onboarding incomplete banner - below header */}
                <AnimatePresence>
                    {showOnboardingBanner && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-blue-600 border-b border-blue-500/30 px-4 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Complete your setup</p>
                                    <p className="text-xs text-blue-100">Finish onboarding to get the most out of CashMind.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsOnboardingOpen(true)}
                                className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl h-10 px-5 shrink-0 flex items-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 no-scrollbar @container/main">
                    <div className={cn(
                        "max-w-[1600px] mx-auto w-full",
                        isAIPage ? "p-0" : "p-4 lg:p-10"
                    )}>
                        {children}
                    </div>
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
