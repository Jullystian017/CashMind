"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
                            Start your journey to <br /> financial freedom today.
                        </h2>
                        <p className="text-blue-100 text-lg md:text-xl font-medium mb-12">
                            Join 10,000+ users who are already scaling their finances with CashMind. No credit card required.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/register">
                                <button className="px-8 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl shadow-black/10">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="px-8 py-5 bg-blue-700/50 text-white font-bold rounded-full hover:bg-blue-700/80 transition-all w-full sm:w-auto border border-blue-500/30">
                                    Talk to Sales
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Decorative gradients */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
            </div>
        </section>
    );
};
