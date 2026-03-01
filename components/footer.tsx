"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative overflow-hidden">
            {/* Subtle premium background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <Image
                                    src="/cashmind-logo2.png"
                                    alt="CashMind Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                CashMind
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                            Smart fintech solution for students and young professionals to manage their pocket money, track expenses, and plan their financial future.
                        </p>
                        <div className="flex gap-3">
                            {/* Interactive Social Icons */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold text-gray-900 mb-6">Discovery</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">About Us</Link></li>
                            <li><Link href="/features" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Features</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Pricing</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="/dashboard" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Dashboard</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Budget Planner</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">Savings Goals</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block text-sm font-medium transition-all">AI Coach (Mindy)</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-3">
                        <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-500 text-sm font-medium group">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                jullystian01@gmail.com
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm font-medium group">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Phone className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                +62 857-9805-1625
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm font-medium group">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                Banyumas, Jawa Tengah
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm font-medium text-center md:text-left">
                        © 2026 CashMind. All rights reserved. <span className="hidden sm:inline">Made for the future generation.</span>
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
