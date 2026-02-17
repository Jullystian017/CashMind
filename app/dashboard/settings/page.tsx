"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Wallet, Bell, Shield, Save } from "lucide-react"

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: "Rizky Ardi",
        age: "20",
        school: "Universitas Indonesia",
        income: "4500",
        incomeType: "monthly"
    })

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                    Settings & Profile
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    Manage your personal information and financial preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation (Internal Page) */}
                <div className="space-y-2">
                    {[
                        { name: "My Profile", icon: User, active: true },
                        { name: "Subscriptions", icon: Wallet, active: false },
                        { name: "Notifications", icon: Bell, active: false },
                        { name: "Security", icon: Shield, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                                item.active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-gray-100"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-8 shadow-sm">
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                <p className="text-xs text-gray-400 font-medium tracking-wide border px-2 py-0.5 rounded-full w-fit mt-1">SUPER SAVER HERO</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                                <Input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                            <div className="sm:col-span-2 space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">School / Institution</Label>
                                <Input
                                    value={profile.school}
                                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                    className="h-12 rounded-xl border-gray-100 font-bold"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-12 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes
                            </Button>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900">Financial Preferences</h3>
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Default Monthly Income</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <Input
                                    value={profile.income}
                                    onChange={(e) => setProfile({ ...profile, income: e.target.value })}
                                    className="pl-8 h-12 rounded-xl border-gray-100 font-bold"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
