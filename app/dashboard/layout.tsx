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

    const isAIPage = pathname === "/dashboard/ai"

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
