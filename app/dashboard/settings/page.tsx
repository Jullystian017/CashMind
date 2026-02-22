"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Wallet, Bell, Shield, Save, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const ONBOARDING_COMPLETED_KEY = "cashmind_onboarding_completed"

type SettingsSection = "profile" | "subscriptions" | "notifications" | "security"

export default function SettingsPage() {
    const [section, setSection] = useState<SettingsSection>("profile")
    const [toast, setToast] = useState<string | null>(null)
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
    const [profile, setProfile] = useState({
        name: "Jullystian",
        email: "jullystian@gmail.com",
        age: "20",
        school: "Universitas Indonesia",
        income: "4500000",
        incomeType: "monthly"
    })

    useEffect(() => {
        setOnboardingCompleted(typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true" : null)
    }, [])

    const handleSave = () => {
        setToast("Settings saved!")
        setTimeout(() => setToast(null), 2000)
    }

    const navItems: { key: SettingsSection; name: string; icon: typeof User }[] = [
        { key: "profile", name: "My Profile", icon: User },
        { key: "subscriptions", name: "Subscriptions", icon: Wallet },
        { key: "notifications", name: "Notifications", icon: Bell },
        { key: "security", name: "Security", icon: Shield },
    ]

    return (
        <div className="max-w-4xl space-y-8 pb-24">
            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                    Settings
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    Manage your personal information and preferences.
                </p>
            </div>

            {/* Onboarding incomplete – prompt to finish setup */}
            {onboardingCompleted === false && (
                <Link
                    href="/dashboard?onboarding=true"
                    className="block p-5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100/80 transition-colors"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Complete your setup</p>
                                <p className="text-sm text-gray-600">Finish onboarding to set your income, goals, and spending categories.</p>
                            </div>
                        </div>
                        <span className="text-blue-600 font-bold flex items-center gap-1 shrink-0">
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation */}
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setSection(item.key)}
                            className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                                section === item.key
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-100"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </span>
                            {section === item.key && <ChevronRight className="w-4 h-4 opacity-80" />}
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="md:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {section === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="space-y-6"
                            >
                                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                            <p className="text-xs text-gray-400 font-medium mt-1">Update your details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</Label>
                                            <Input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Age</Label>
                                            <Input
                                                value={profile.age}
                                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">School / Institution</Label>
                                            <Input
                                                value={profile.school}
                                                onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2">
                                            <Save className="w-4 h-4" /> Save Changes
                                        </Button>
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Preferences</h3>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Default Monthly Income (Rp)</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                                            <Input
                                                value={profile.income.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                onChange={(e) => setProfile({ ...profile, income: e.target.value.replace(/\D/g, "") })}
                                                className="pl-12 h-12 rounded-xl border-gray-100 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleSave} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 h-11 rounded-xl">
                                            Save
                                        </Button>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {section === "subscriptions" && (
                            <motion.div
                                key="subscriptions"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Subscriptions</h3>
                                <p className="text-sm text-gray-500 mb-6">Manage your recurring payments and plans.</p>
                                <Link
                                    href="/dashboard/subscriptions"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
                                >
                                    Go to Subscriptions
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        )}

                        {section === "notifications" && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Notifications</h3>
                                <p className="text-sm text-gray-500 mb-6">Choose what updates you receive (billing, challenges, tips).</p>
                                <div className="space-y-4">
                                    {["Billing reminders", "Challenge updates", "Weekly summary"].map((label) => (
                                        <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                            <span className="text-sm font-medium text-gray-700">{label}</span>
                                            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 flex justify-end">
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-11 rounded-xl">Save</Button>
                                </div>
                            </motion.div>
                        )}

                        {section === "security" && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Security</h3>
                                <p className="text-sm text-gray-500 mb-6">Password and security options.</p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Current password</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-gray-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">New password</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-gray-100" />
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end">
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-11 rounded-xl">Update password</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
