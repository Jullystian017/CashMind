"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/homepage/pricing";
import { CTA } from "@/components/homepage/cta";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { SectionBadge } from "@/components/ui/section-badge";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-4 overflow-hidden bg-gradient-to-b from-blue-100/80 via-blue-50/50 to-white">
                {/* Background Shader Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
                            backgroundSize: '90px 90px'
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <SectionBadge label="Plans & Pricing" className="mb-6 mx-auto" variant="light" />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-4xl sm:text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        Invest in Your <br className="hidden md:block" />
                        <span className="text-blue-600">Financial Future</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium mb-8"
                    >
                        Start for free, or upgrade to unlock our most powerful AI-driven wealth management tools.
                    </motion.p>
                </div>
            </section>

            {/* Pricing Component */}
            <div className="relative z-20">
                <Pricing showHeader={false} />
            </div>

            {/* Feature Comparison Table */}
            <section className="py-24 bg-white relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
                            Compare Features
                        </h3>
                        <p className="text-gray-500 font-medium text-base sm:text-lg">
                            See exactly what's included in each plan to make the right choice.
                        </p>
                    </div>

                    <div className="space-y-4 sm:hidden">
                        {[
                            { name: "Expense & Income Tracking", free: true, pro: true },
                            { name: "Number of Accounts", free: "Unlimited", pro: "Unlimited" },
                            { name: "Automated Budget Planner", free: true, pro: true },
                            { name: "Split Bill & Community Tasks", free: true, pro: true },
                            { name: "Monthly AI Chat Limits", free: "50 Queries/mo", pro: "Unlimited" },
                            { name: "AI Insight Deep-Dive", free: false, pro: true },
                            { name: "Priority AI Processing Speed", free: false, pro: true },
                            { name: "Export to PDF/CSV", free: false, pro: true },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-900 font-semibold mb-4 text-sm">{feature.name}</p>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starter</span>
                                        <div className="flex items-center gap-2">
                                            {typeof feature.free === 'boolean' ? (
                                                feature.free ? <Check className="w-4 h-4 text-gray-400" /> : <X className="w-4 h-4 text-gray-300" />
                                            ) : (
                                                <span className="text-sm text-gray-600 font-medium">{feature.free}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 border-l border-gray-100 pl-4">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pro</span>
                                        <div className="flex items-center gap-2">
                                            {typeof feature.pro === 'boolean' ? (
                                                feature.pro ? <Check className="w-4 h-4 text-blue-600" strokeWidth={3} /> : <X className="w-4 h-4 text-gray-300" />
                                            ) : (
                                                <span className="text-sm text-blue-700 font-semibold">{feature.pro}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-6 px-8 text-lg font-semibold text-gray-900 border-b border-gray-100 bg-gray-50/50 w-1/2">Features</th>
                                    <th className="py-6 px-8 text-lg font-semibold text-gray-900 border-b border-gray-100 bg-gray-50/50 text-center w-1/4">Starter</th>
                                    <th className="py-6 px-8 text-lg font-semibold text-blue-600 border-b border-blue-100 bg-blue-50/50 text-center w-1/4">Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { name: "Expense & Income Tracking", free: true, pro: true },
                                    { name: "Number of Accounts", free: "Unlimited", pro: "Unlimited" },
                                    { name: "Automated Budget Planner", free: true, pro: true },
                                    { name: "Split Bill & Community Tasks", free: true, pro: true },
                                    { name: "Monthly AI Chat Limits", free: "50 Queries/mo", pro: "Unlimited" },
                                    { name: "AI Insight Deep-Dive", free: false, pro: true },
                                    { name: "Priority AI Processing Speed", free: false, pro: true },
                                    { name: "Export to PDF/CSV", free: false, pro: true },
                                ].map((feature, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="py-5 px-8 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{feature.name}</td>
                                        <td className="py-5 px-8 text-center">
                                            {typeof feature.free === 'boolean' ? (
                                                feature.free ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600 font-medium">{feature.free}</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-8 text-center bg-blue-50/10 group-hover:bg-blue-50/20 transition-colors">
                                            {typeof feature.pro === 'boolean' ? (
                                                feature.pro ? <Check className="w-5 h-5 text-blue-600 mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : (
                                                <span className="text-blue-700 font-semibold">{feature.pro}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <CTA />
            <Footer />
        </main>
    );
}
