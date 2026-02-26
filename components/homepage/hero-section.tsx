"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export const HeroSection = () => {
    return (
        <div className="flex flex-col overflow-hidden bg-white pt-16 md:pt-24">
            <ContainerScroll
                titleComponent={
                    <div className="max-w-4xl mx-auto pb-8 text-center">
                        <div className="mb-8 inline-block animate-fade-in">
                            <div className="flex items-center gap-3 p-1 pr-4 rounded-full bg-blue-50/50 border border-blue-100/80 backdrop-blur-sm shadow-sm">
                                <span className="px-3 py-1 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-bold shadow-sm">
                                    New
                                </span>
                                <span className="text-blue-700/80 text-xs md:text-sm font-medium tracking-tight">
                                    AI-Powered Finance Platform
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                            Smart Solutions to{" "}
                            <span className="inline-flex items-center text-blue-600">
                                <Zap className="fill-current w-8 h-8 md:w-12 md:h-12 mr-1" />
                            </span>
                            Boost <br />
                            Your Financial Life.
                        </h1>
                        <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            Track expenses, manage savings, and monitor automatic subscriptions. All in one modern dashboard with AI ready to help anytime.
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
                }
            >
                <Image
                    src="/dashboard.png"
                    alt="hero"
                    fill
                    className="object-cover"
                    draggable={false}
                    priority
                />
            </ContainerScroll>
        </div>
    );
};
