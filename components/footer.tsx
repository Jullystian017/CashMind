"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                                <Image
                                    src="/cashmind-logo.png"
                                    alt="CashMind Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                CashMind
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Smart fintech solution for students and young professionals to manage their pocket money and future goals.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons (Placeholders) */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Discovery</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">About Us</Link></li>
                            <li><Link href="/features" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Pricing</Link></li>
                            <li><Link href="/faq" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="/dashboard" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Dashboard</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Budget Planner</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Savings Goals</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">AI Coach</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="text-gray-500 text-sm">support@cashmind.com</li>
                            <li className="text-gray-500 text-sm">+62 812-3456-7890</li>
                            <li className="text-gray-500 text-sm">Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs text-center md:text-left">
                        © 2026 CashMind. All rights reserved. Made for future generation.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-400 hover:text-blue-600 text-xs transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-gray-400 hover:text-blue-600 text-xs transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
