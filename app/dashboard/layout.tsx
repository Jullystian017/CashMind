"use client"

import { Sidebar } from "@/components/sidebar"
import { Search, Bell, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding-wizard"

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
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

    useEffect(() => {
        if (searchParams.get('onboarding') === 'true') {
            setIsOnboardingOpen(true)
        }
    }, [searchParams])

    const handleCloseOnboarding = () => {
        setIsOnboardingOpen(false)
        // Clean up URL
        router.replace('/dashboard')
    }

    return (
        <div className="flex bg-slate-50 min-h-screen text-gray-900 font-inter">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl w-full max-w-md">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions, goals..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notifications */}
                        <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Rizky Ardi</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Hero</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold group-hover:scale-105 transition-transform">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>

            {/* Global Onboarding Modal */}
            <OnboardingWizard
                isOpen={isOnboardingOpen}
                onClose={handleCloseOnboarding}
            />
        </div>
    )
}
