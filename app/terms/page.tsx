"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Scale, Gavel, CheckCircle2, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
                        <Scale className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold tracking-tight text-gray-900">CashMind Terms</span>
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
                            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Please read these terms carefully before using CashMind. By using our services, you agree to be bound by these terms.
                        </p>
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center gap-8 text-sm text-gray-400 text-center">
                            <span className="font-medium">Last updated: March 2026</span>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                </div>
                                Acceptance of Terms
                            </h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                                <p>
                                    By accessing or using CashMind, you implicitly agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must refrain from using the application and our associated services immediately.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <Scale className="w-4 h-4 text-emerald-600" />
                                </div>
                                User License
                            </h2>
                            <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed font-medium">
                                <p className="mb-4">
                                    Permission is granted to use CashMind for personal, non-commercial purposes only. Under this license, you may not:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Modify or copy the materials within the app.</li>
                                    <li>Use the materials for any commercial purpose or public display.</li>
                                    <li>Attempt to decompile or reverse engineer any software contained in the app.</li>
                                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-indigo-600" />
                                </div>
                                Disclaimer
                            </h2>
                            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed font-medium">
                                <p>
                                    The financial insights and advice provided by CashMind (including AI coach "Mindy") are for informational purposes only. We do not provide professional financial or investment advice. Users should consult with a qualified financial advisor before making significant financial decisions.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                    <Gavel className="w-4 h-4 text-red-600" />
                                </div>
                                Termination
                            </h2>
                            <div className="prose prose-red max-w-none text-gray-600 leading-relaxed font-medium">
                                <p>
                                    We reserve the right to terminate or suspend access to our application immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
                                </p>
                            </div>
                        </section>

                        <section className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Questions?</h2>
                            <p className="text-gray-500 mb-6 font-medium">
                                For any questions regarding our terms of service, please contact our legal department.
                            </p>
                            <a
                                href="mailto:legal@cashmind.com"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all underline decoration-blue-200 underline-offset-4"
                            >
                                legal@cashmind.com
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
