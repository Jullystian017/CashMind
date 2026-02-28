"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

export const CTA = () => {
    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white border border-blue-200 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/10">

                    {/* Background Shader Effect (Matching Hero, inside the Card) */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 opacity-60"
                            style={{
                                backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)`,
                                backgroundSize: '80px 80px'
                            }}
                        />

                        {/* More Vibrant Blue Glows for Depth */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            {/* Top Left Glow */}
                            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

                            {/* Bottom Right Glow */}
                            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[130px] translate-x-1/3 translate-y-1/3" />

                            {/* Center Glow (Main Blue Accent) */}
                            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />

                            {/* Extra subtle overall blue tint */}
                            <div className="absolute inset-0 bg-blue-50/10" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        <SectionBadge label="Get Started" className="mb-6" />
                        <h2 className="text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-8 leading-tight">
                            Start your journey to <br /> financial freedom today.
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl font-medium mb-12 max-w-lg">
                            Join 10,000+ users who are already scaling their finances with CashMind. No credit card required.
                        </p>

                        <div className="flex justify-center">
                            <Link href="/register">
                                <motion.button
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="group relative flex items-center gap-4 bg-blue-50/80 hover:bg-white transition-all rounded-full p-1.5 pl-6 md:pl-8 pr-1.5 border border-blue-100 shadow-sm overflow-hidden"
                                >
                                    <div className="relative h-6 md:h-7 overflow-hidden pointer-events-none">
                                        <motion.div
                                            variants={{
                                                initial: { y: 0 },
                                                hover: { y: "-50%" }
                                            }}
                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                            className="flex flex-col"
                                        >
                                            <span className="text-base md:text-lg font-bold text-blue-600 tracking-tight h-6 md:h-7 flex items-center">
                                                Get Started
                                            </span>
                                            <span className="text-base md:text-lg font-bold text-blue-600 tracking-tight h-6 md:h-7 flex items-center">
                                                Get Started
                                            </span>
                                        </motion.div>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 overflow-hidden relative">
                                        <motion.div
                                            variants={{
                                                initial: { rotate: -40, x: 0, y: 0 },
                                                hover: { rotate: 0, x: 0, y: 0 },
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="flex items-center justify-center"
                                        >
                                            <ArrowRight
                                                className="w-5 h-5 md:w-6 md:h-6"
                                                strokeWidth={2.5}
                                            />
                                        </motion.div>
                                    </div>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
