"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Target, Heart, Shield, Zap, TrendingUp, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Empowering the Future <br />
                        <span className="text-blue-600">Generation of Finance</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        CashMind lahir dari keinginan untuk membantu pelajar dan mahasiswa mengelola uang saku mereka dengan lebih cerdas, transparan, dan terukur.
                    </motion.p>
                </div>
            </section>


            <Footer />
        </main>
    )
}
