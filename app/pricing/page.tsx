"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/homepage/pricing";
import { CTA } from "@/components/homepage/cta";
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
                <Pricing />
            </div>

            <CTA />
            <Footer />
        </main>
    );
}
