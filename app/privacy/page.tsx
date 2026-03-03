"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Header / Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group transition-all">
                        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold tracking-tight text-gray-900">CashMind Privacy</span>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Trust & Safety</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Your privacy is our priority. We are committed to protecting your personal data and being transparent about how we use it.
                        </p>
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center gap-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Version 1.0</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>Last updated: March 2026</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-blue-600" />
                                </div>
                                Information We Collect
                            </h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                                <p className="mb-4">
                                    We collect information to provide better services to all our users. The types of personal information we may collect include:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Registration details: Name, email address, and account preferences.</li>
                                    <li>Financial information: Transaction history, budget goals, and linked account data (encrypted).</li>
                                    <li>Usage data: How you interact with our features, session duration, and device information.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                </div>
                                How We Use Your Data
                            </h2>
                            <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed font-medium">
                                <p className="mb-4">
                                    The information we collect is used to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Provide, maintain, and improve our services and features.</li>
                                    <li>Personalize your experience and provide tailored financial insights.</li>
                                    <li>Ensure the security of your accounts and prevent fraudulent activities.</li>
                                    <li>Communicate with you regarding updates, security alerts, and support.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-indigo-600" />
                                </div>
                                Data Security
                            </h2>
                            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed font-medium">
                                <p>
                                    We use industry-standard encryption and security protocols to protect your sensitive data. All financial information is processed through secure channels and is never sold to third parties. We regularly audit our systems to ensure the highest level of protection for our users.
                                </p>
                            </div>
                        </section>

                        <section className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Our Privacy Team</h2>
                            <p className="text-gray-500 mb-6 font-medium">
                                If you have any questions or concerns about our Privacy Policy or data practices, please reach out to us.
                            </p>
                            <a
                                href="mailto:privacy@cashmind.com"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all underline decoration-blue-200 underline-offset-4"
                            >
                                privacy@cashmind.com
                            </a>
                        </section>
                    </div>
                </div>
            </main>

            {/* Simple footer for legal pages */}
            <footer className="py-12 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-400 font-medium">
                    © 2026 CashMind. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
