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
                        className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        Invest in Your <br className="hidden md:block" />
                        <span className="text-blue-600">Financial Future</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium mb-8"
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
                        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
                            Compare Features
                        </h3>
                        <p className="text-gray-500 font-medium text-lg">
                            See exactly what's included in each plan to make the right choice.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-6 px-6 text-xl font-bold text-gray-900 border-b border-gray-100 bg-gray-50/50 w-1/2">Features</th>
                                    <th className="py-6 px-6 text-xl font-bold text-gray-900 border-b border-gray-100 bg-gray-50/50 text-center w-1/4">Starter</th>
                                    <th className="py-6 px-6 text-xl font-bold text-blue-600 border-b border-blue-100 bg-blue-50/50 text-center w-1/4">Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { name: "Connected Accounts", free: "1 Account", pro: "Unlimited" },
                                    { name: "Expense Tracking", free: true, pro: true },
                                    { name: "Basic Health Score", free: true, pro: true },
                                    { name: "Community Support", free: true, pro: true },
                                    { name: "Advanced AI Analytics", free: false, pro: true },
                                    { name: "AI Financial Coach (Chatbot)", free: false, pro: true },
                                    { name: "Automated Budget Planner", free: false, pro: true },
                                    { name: "Priority 24/7 Support", free: false, pro: true },
                                    { name: "Export to PDF/CSV", free: false, pro: true },
                                ].map((feature, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-6 text-gray-700 font-medium">{feature.name}</td>
                                        <td className="py-5 px-6 text-center">
                                            {typeof feature.free === 'boolean' ? (
                                                feature.free ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600 font-medium">{feature.free}</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 text-center bg-blue-50/20">
                                            {typeof feature.pro === 'boolean' ? (
                                                feature.pro ? <Check className="w-5 h-5 text-blue-600 mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : (
                                                <span className="text-blue-700 font-bold">{feature.pro}</span>
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
