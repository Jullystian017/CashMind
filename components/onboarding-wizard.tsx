"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Wallet,
    Target,
    Zap,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    CheckCircle2,
    X
} from "lucide-react"

const steps = [
    { title: "Financial Baseline", icon: Wallet },
    { title: "Savings Goal", icon: Target },
    { title: "Personalization", icon: Sparkles }
]

function formatRupiahInput(raw: string): string {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return ""
    return parseInt(digits, 10).toLocaleString("id-ID")
}

interface OnboardingWizardProps {
    isOpen: boolean
    onClose: (completed?: boolean) => void
}

export function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        income: "",
        incomeType: "monthly",
        targetName: "",
        targetAmount: "",
        categories: [] as string[]
    })

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    const toggleCategory = (cat: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }))
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => onClose(false)}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
                >
                    <button
                        onClick={() => onClose(false)}
                        className="absolute top-6 right-8 text-gray-400 hover:text-gray-900 transition-colors z-20"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {/* Enhanced Progress Steps */}
                    <div className="px-12 pt-8 pb-4 flex justify-between relative">
                        {/* Background Line */}
                        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

                        {steps.map((step, i) => {
                            const isActive = i <= currentStep
                            const isCurrent = i === currentStep
                            return (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                    <motion.div
                                        animate={{
                                            scale: isCurrent ? 1.1 : 1,
                                            backgroundColor: isActive ? "#2563eb" : "#f3f4f6",
                                            color: isActive ? "#ffffff" : "#9ca3af"
                                        }}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                                            isActive ? "shadow-lg shadow-blue-500/20" : ""
                                        )}
                                    >
                                        {i + 1}
                                    </motion.div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                        isActive ? "text-blue-600" : "text-gray-400"
                                    )}>
                                        {step.title.split(" ")[0]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-12 pt-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2 text-center">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">How much do you get? 💰</h2>
                                        <p className="text-gray-500 font-medium">Let's set your financial baseline.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Pocket Money / Income</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    className="pl-12 h-12 rounded-xl text-lg font-bold border-gray-100 focus:ring-blue-500/20"
                                                    value={formatRupiahInput(formData.income)}
                                                    onChange={(e) => setFormData({ ...formData, income: e.target.value.replace(/\D/g, "") })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {["daily", "monthly"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFormData({ ...formData, incomeType: type })}
                                                    className={cn(
                                                        "py-3 rounded-xl border-2 font-bold transition-all capitalize",
                                                        formData.incomeType === type
                                                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                                                            : "border-gray-100 text-gray-400 hover:border-blue-200"
                                                    )}
                                                >
                                                    Every {type === "daily" ? "Day" : "Month"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2 text-center">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">What's your main goal? 🎯</h2>
                                        <p className="text-gray-500 font-medium">What are you saving for right now?</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Goal Name</Label>
                                            <Input
                                                placeholder="e.g. New Gaming Laptop"
                                                className="h-12 rounded-xl text-lg font-bold border-gray-100"
                                                value={formData.targetName}
                                                onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Target Amount</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    className="pl-12 h-12 rounded-xl text-lg font-bold border-gray-100"
                                                    value={formatRupiahInput(formData.targetAmount)}
                                                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value.replace(/\D/g, "") })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2 text-center">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequent Spends 🍱</h2>
                                        <p className="text-gray-500 font-medium">Which categories do you spend most on?</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {["Food & Drinks", "Transport", "Entertainment", "Shopping", "Education", "Health"].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => toggleCategory(cat)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 font-bold transition-all text-sm",
                                                    formData.categories.includes(cat)
                                                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                                                        : "border-gray-100 text-gray-400 hover:border-blue-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    formData.categories.includes(cat) ? "bg-blue-600" : "bg-gray-200"
                                                )} />
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-black text-gray-900">You're all set! 🚀</h1>
                                        <p className="text-gray-500 font-medium">CashMind is ready to supercharge your finances.</p>
                                    </div>
                                    <Button
                                        onClick={() => onClose(true)}
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20"
                                    >
                                        Start Exploring
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {currentStep < 3 && (
                            <div className="mt-12 flex gap-4">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        className="h-12 px-6 rounded-xl font-bold text-gray-500 border-gray-100 flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    onClick={nextStep}
                                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 gap-2"
                                >
                                    {currentStep === 2 ? "Finalize Profile" : "Continue"}
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
