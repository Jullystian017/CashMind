"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Wallet, Bell, Shield, Save, ChevronRight, Sparkles, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProfile, updateProfile } from "@/app/actions/profile"
import { updateUserPassword } from "@/app/actions/auth"
import { Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useTranslation } from "@/lib/i18n/useTranslation"
import type { Locale } from "@/lib/i18n/i18n-config"

const ONBOARDING_COMPLETED_KEY = "cashmind_onboarding_completed"

type SettingsSection = "profile" | "subscriptions" | "notifications" | "security" | "language"

export default function SettingsPage() {
    const { t } = useTranslation()
    const [section, setSection] = useState<SettingsSection>("profile")
    const { locale, setLocale } = useLanguage()
    const [toast, setToast] = useState<string | null>(null)
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        age: "20",
        school: "Universitas Indonesia",
        income: "4500000",
        incomeType: "monthly"
    })

    // Password state
    const [passwords, setPasswords] = useState({
        new: "",
        confirm: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        getProfile().then(({ data }) => {
            if (mounted.current && data) {
                setProfile((p) => ({
                    ...p,
                    name: data.display_name ?? "",
                    email: data.email ?? "",
                }))
                setOnboardingCompleted(data.onboarding_completed)
            }
        })
        return () => { mounted.current = false }
    }, [])
    useEffect(() => {
        if (onboardingCompleted === null && typeof window !== "undefined") {
            const local = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true"
            setOnboardingCompleted(local)
        }
    }, [onboardingCompleted])

    const handleSave = async () => {
        const { error } = await updateProfile({ display_name: profile.name || undefined })
        if (!error) {
            setToast(t("settings.saved"))
            setTimeout(() => setToast(null), 2000)
        }
    }

    const handleUpdatePassword = async () => {
        if (!passwords.new || !passwords.confirm) {
            setToast(t("settings.fillAll"))
            setTimeout(() => setToast(null), 2000)
            return
        }

        if (passwords.new !== passwords.confirm) {
            setToast(t("settings.passNotMatch"))
            setTimeout(() => setToast(null), 2000)
            return
        }

        if (passwords.new.length < 6) {
            setToast(t("settings.passTooShort"))
            setTimeout(() => setToast(null), 2000)
            return
        }

        setPasswordLoading(true)
        const { error } = await updateUserPassword(passwords.new)
        setPasswordLoading(false)

        if (error) {
            setToast(`Error: ${error}`)
            setTimeout(() => setToast(null), 2000)
        } else {
            setToast(t("settings.passwordUpdated"))
            setPasswords({ new: "", confirm: "" })
            setTimeout(() => setToast(null), 2000)
        }
    }

    const handleLanguageChange = (lang: Locale) => {
        setLocale(lang)
        setToast(lang === "en" ? t("settings.langEn") : t("settings.langId"))
        setTimeout(() => setToast(null), 2000)
    }

    const navItems: { key: SettingsSection; name: string; icon: typeof User }[] = [
        { key: "profile", name: t("settings.profile"), icon: User },
        { key: "subscriptions", name: t("settings.subscriptions"), icon: Wallet },
        { key: "notifications", name: t("settings.notifications"), icon: Bell },
        { key: "security", name: t("settings.security"), icon: Shield },
        { key: "language", name: t("settings.language"), icon: Globe },
    ]

    return (
        <div className="max-w-4xl space-y-8 pb-24">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 leading-tight tracking-tight">
                    {t("settings.title")}
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    {t("settings.subtitle")}
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
                                <p className="font-semibold text-gray-900">{t("settings.completeSetup")}</p>
                                <p className="text-sm text-gray-600">{t("settings.onboardingNotice")}</p>
                            </div>
                        </div>
                        <span className="text-blue-600 font-semibold flex items-center gap-1 shrink-0">
                            {t("settings.continue")}
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
                                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all",
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
                                            <h3 className="text-lg font-semibold text-gray-900">{t("settings.personalInfo")}</h3>
                                            <p className="text-xs text-gray-400 font-medium mt-1">{t("settings.updateDetails")}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.fullName")}</Label>
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.email")}</Label>
                                            <Input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.age")}</Label>
                                            <Input
                                                value={profile.age}
                                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.school")}</Label>
                                            <Input
                                                value={profile.school}
                                                onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                                className="h-12 rounded-xl border-gray-100 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-12 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2">
                                            <Save className="w-4 h-4" /> {t("settings.save")}
                                        </Button>
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("settings.financialPrefs")}</h3>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.defaultIncome")}</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                                            <Input
                                                value={profile.income.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                onChange={(e) => setProfile({ ...profile, income: e.target.value.replace(/\D/g, "") })}
                                                className="pl-12 h-12 rounded-xl border-gray-100 font-semibold"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleSave} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 h-11 rounded-xl">
                                            {t("common.save")}
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("settings.subscriptions")}</h3>
                                <p className="text-sm text-gray-500 mb-6">{t("settings.manageSubs")}</p>
                                <Link
                                    href="/dashboard/subscriptions"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                                >
                                    {t("settings.goToSubs")}
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("settings.notifications")}</h3>
                                <p className="text-sm text-gray-500 mb-6">{t("settings.notifDesc")}</p>
                                <div className="space-y-4">
                                    {[
                                        { key: "billingReminders", label: t("settings.billingReminders") },
                                        { key: "challengeUpdates", label: t("settings.challengeUpdates") },
                                        { key: "weeklySummary", label: t("settings.weeklySummary") }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 flex justify-end">
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-11 rounded-xl">{t("common.save")}</Button>
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("settings.security")}</h3>
                                <p className="text-sm text-gray-500 mb-6">{t("settings.securityDesc")}</p>
                                <div className="space-y-4 text-gray-900">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.newPassword")}</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-12 rounded-xl border-gray-100 pr-10"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("settings.confirmPassword")}</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 rounded-xl border-gray-100"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-end">
                                    <Button
                                        onClick={handleUpdatePassword}
                                        disabled={passwordLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {passwordLoading ? t("settings.updating") : t("settings.updatePassword")}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {section === "language" && (
                            <motion.div
                                key="language"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Globe className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{t("settings.language")}</h3>
                                        <p className="text-xs text-gray-400 font-medium mt-1">{t("settings.langDesc")}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                    {[
                                        { code: "en" as const, label: "English", flag: "🇺🇸", desc: "English (US)" },
                                        { code: "id" as const, label: "Indonesia", flag: "🇮🇩", desc: "Bahasa Indonesia" },
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={cn(
                                                "relative p-5 rounded-2xl border-2 transition-all text-left group",
                                                locale === lang.code
                                                    ? "border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-100"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                                            )}
                                        >
                                            {locale === lang.code && (
                                                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="text-3xl mb-3 block">{lang.flag}</span>
                                            <p className="font-semibold text-gray-900 text-sm">{lang.label}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{lang.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                        {t("settings.langNotice")}
                                    </p>
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
