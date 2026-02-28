"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Activity, CreditCard, Wallet, Rocket } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

interface CharProps {
    children: React.ReactNode;
    range: [number, number];
    progress: MotionValue<number>;
}

const Char = ({ children, range, progress }: CharProps) => {
    const opacity = useTransform(progress, range, [0.15, 1]);
    return (
        <motion.span style={{ opacity }} className="relative">
            {children}
        </motion.span>
    );
};
export const AboutSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const lines = [
        "Powered by intelligent insights,",
        "CashMind monitors every financial flow",
        "across your accounts — helping you",
        "save smarter, spend wiser,",
        "and take full control of your financial future."
    ];

    // Calculate reveal ranges based on total characters (roughly)
    // We'll give each line a 20% chunk of the scroll
    const getRange = (lineIndex: number, charIndex: number, lineLength: number) => {
        const lineStart = lineIndex * 0.2;
        const lineEnd = (lineIndex + 1) * 0.2;
        const charStep = (lineEnd - lineStart) / lineLength;
        const start = lineStart + (charIndex * charStep);
        const end = start + charStep;
        return [start, end] as [number, number];
    };

    return (
        <section id="about-section" ref={containerRef} className="h-[400vh] bg-white relative">
            {/* Sticky Wrapper */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4">

                {/* Background Radial Glow - Pulse on scroll */}
                <motion.div
                    style={{
                        scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.1]),
                        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.4, 0.15])
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300 rounded-full blur-[140px] pointer-events-none"
                />

                <div className="max-w-5xl mx-auto relative z-10 text-center px-6">
                    {/* Section Badge */}
                    <SectionBadge label="About" className="mb-6" />

                    {/* Main Content with Word Reveal */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Line 1 */}
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-semibold tracking-tighter leading-[1.2] text-slate-900 md:whitespace-nowrap flex items-center justify-center flex-wrap gap-x-0">
                            <motion.span style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0.15, 1]) }} className="inline-flex items-center mr-2 align-middle">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden p-1.5 md:p-2">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/cashmind-logo2.png"
                                            alt="Logo"
                                            fill
                                            className="object-contain brightness-0 invert"
                                        />
                                    </div>
                                </div>
                            </motion.span>
                            {lines[0].split("").map((char, i) => (
                                <Char key={i} progress={scrollYProgress} range={getRange(0, i, lines[0].length)}>
                                    {char === " " ? "\u00A0" : char}
                                </Char>
                            ))}
                        </h2>

                        {/* Line 2 */}
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-semibold tracking-tighter leading-[1.2] text-slate-900 md:whitespace-nowrap flex items-center justify-center flex-wrap gap-x-0">
                            {lines[1].split(" ").map((word, wordIndex) => {
                                const startIdx = lines[1].split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
                                return (
                                    <span key={wordIndex} className="inline-flex items-center">
                                        {word === "monitors" && (
                                            <motion.span style={{ opacity: useTransform(scrollYProgress, [0.25, 0.3], [0.15, 1]) }} className="inline-flex items-center mx-2 align-middle">
                                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                                    <Activity className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600" />
                                                </div>
                                            </motion.span>
                                        )}
                                        {word.split("").map((char, i) => (
                                            <Char key={i} progress={scrollYProgress} range={getRange(1, startIdx + i, lines[1].length)}>
                                                {char}
                                            </Char>
                                        ))}
                                        {wordIndex < lines[1].split(" ").length - 1 && "\u00A0"}
                                    </span>
                                );
                            })}
                        </h2>

                        {/* Line 3 */}
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-semibold tracking-tighter leading-[1.2] text-slate-900 md:whitespace-nowrap flex items-center justify-center flex-wrap gap-x-0">
                            {lines[2].split(" ").map((word, wordIndex) => {
                                const startIdx = lines[2].split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
                                return (
                                    <span key={wordIndex} className="inline-flex items-center">
                                        {word === "—" && (
                                            <motion.span style={{ opacity: useTransform(scrollYProgress, [0.45, 0.5], [0.15, 1]) }} className="inline-flex items-center mx-2 align-middle">
                                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                                    <CreditCard className="w-3.5 h-3.5 md:w-5 md:h-5 text-emerald-500" />
                                                </div>
                                            </motion.span>
                                        )}
                                        {word.split("").map((char, i) => (
                                            <Char key={i} progress={scrollYProgress} range={getRange(2, startIdx + i, lines[2].length)}>
                                                {char}
                                            </Char>
                                        ))}
                                        {wordIndex < lines[2].split(" ").length - 1 && "\u00A0"}
                                    </span>
                                );
                            })}
                        </h2>

                        {/* Line 4 */}
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-semibold tracking-tighter leading-[1.2] text-slate-900 md:whitespace-nowrap flex items-center justify-center flex-wrap gap-x-0">
                            {lines[3].split(" ").map((word, wordIndex) => {
                                const startIdx = lines[3].split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
                                return (
                                    <span key={wordIndex} className="inline-flex items-center">
                                        {word.split("").map((char, i) => (
                                            <Char key={i} progress={scrollYProgress} range={getRange(3, startIdx + i, lines[3].length)}>
                                                {char}
                                            </Char>
                                        ))}
                                        {word === "wiser," && (
                                            <motion.span style={{ opacity: useTransform(scrollYProgress, [0.75, 0.8], [0.15, 1]) }} className="inline-flex items-center mx-2 align-middle">
                                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                                    <Wallet className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600" />
                                                </div>
                                            </motion.span>
                                        )}
                                        {wordIndex < lines[3].split(" ").length - 1 && "\u00A0"}
                                    </span>
                                );
                            })}
                        </h2>

                        {/* Line 5 */}
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-semibold tracking-tighter leading-[1.2] text-slate-900 md:whitespace-nowrap flex items-center justify-center flex-wrap gap-x-0">
                            {lines[4].split(" ").map((word, wordIndex) => {
                                const startIdx = lines[4].split(" ").slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
                                return (
                                    <span key={wordIndex} className="inline-flex items-center">
                                        {word.split("").map((char, i) => (
                                            <Char key={i} progress={scrollYProgress} range={getRange(4, startIdx + i, lines[4].length)}>
                                                {char}
                                            </Char>
                                        ))}
                                        {wordIndex < lines[4].split(" ").length - 1 && "\u00A0"}
                                    </span>
                                );
                            })}
                            <motion.span style={{ opacity: useTransform(scrollYProgress, [0.95, 1], [0.15, 1]) }} className="inline-flex items-center ml-2 align-middle">
                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                                    <Rocket className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-500" />
                                </div>
                            </motion.span>
                        </h2>
                    </div>
                </div>

                {/* Top and Bottom atmospheric borders */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>
        </section>
    );
};
