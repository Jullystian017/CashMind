"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Target, Heart, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";
import { CTA } from "@/components/homepage/cta"; // Import the actual CTA component

const coreValues = [
    {
        icon: Target,
        title: "Purpose-Driven",
        description: "We build tools that actively guide users toward their long-term financial goals, not just track their past expenses.",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        icon: Zap,
        title: "Frictionless UI",
        description: "Finance is complex; our interface isn't. We prioritize speed, clarity, and an intuitive user experience above all else.",
        color: "text-amber-500",
        bg: "bg-amber-50"
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "Your financial data is your most sensitive information. We protect it with enterprise-level encryption and strict privacy policies.",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        icon: Heart,
        title: "User Empathy",
        description: "We understand that managing money can be stressful. Our platform is designed to ease anxiety, not induce it.",
        color: "text-rose-500",
        bg: "bg-rose-50"
    },
    {
        icon: TrendingUp,
        title: "Continuous Growth",
        description: "We are constantly iterating and improving our AI models to provide you with the most accurate and actionable insights possible.",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        icon: Users,
        title: "Community First",
        description: "We listen to our users. Our roadmap is heavily influenced by the feedback and needs of the CashMind community.",
        color: "text-teal-600",
        bg: "bg-teal-50"
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-blue-50/80 to-white">
                {/* Background Shader Effect (Matching Homepage) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
                            backgroundSize: '90px 90px'
                        }}
                    />
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px]" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-50/40 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-gray-50/50 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <SectionBadge label="Our Story" className="mb-6 mx-auto" variant="light" />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        Democratizing <br className="hidden md:block" />
                        <span className="text-blue-600">Financial Intelligence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium mb-12"
                    >
                        CashMind was born from a simple belief: everyone deserves access to the same caliber of financial analysis and strategic planning that the wealthy have enjoyed for decades.
                    </motion.p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-gray-50/50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <SectionBadge label="Mission" className="mb-6 mx-auto" />
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                            The Principles That Drive Us
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coreValues.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="group relative p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className={`w-7 h-7 ${value.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                                    {value.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reusable Premium CTA Section */}
            <CTA />

            <Footer />
        </main>
    );
}
