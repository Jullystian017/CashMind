"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, Github, Square, Chrome, Monitor, CircleDot, ArrowUpRight, ChevronRight, ArrowRight } from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.15
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const marqueeVariants = {
    animate: {
        x: [0, -1000],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop" as const,
                duration: 20,
                ease: "linear" as const,
            },
        },
    },
}

export function HeroSection() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // 3D Scroll Transformation
    const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
    const translateZ = useTransform(scrollYProgress, [0, 1], [-100, 0])

    const partners = [
        { icon: <Github className="w-6 h-6" />, name: "GitHub" },
        { icon: <Square className="w-6 h-6" />, name: "Square" },
        { icon: <CircleDot className="w-6 h-6" />, name: "Medium" },
        { icon: null, name: "cansaas", className: "tracking-tighter italic" },
        { icon: null, name: "stripe", className: "text-2xl tracking-tighter" },
    ]

    return (
        <section ref={containerRef} className="relative pt-32 pb-40 overflow-hidden bg-white font-inter">
            {/* Background Shader Effect (Mesh Gradient) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-300/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-blue-100/30 blur-[120px] rounded-full animate-pulse [animation-delay:4s]"></div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
                    style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="mb-6 inline-block">
                        <Badge variant="outline" className="bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border-blue-100 flex items-center gap-2 text-gray-600 font-medium">
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                            AI-Powered Finance Platform
                        </Badge>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]"
                    >
                        Smart Solutions to <span className="inline-flex items-center text-blue-600"><Zap className="fill-current w-8 h-8 md:w-12 md:h-12 mr-1" /></span>Boost <br />
                        Your Financial Life.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Catat pengeluaran, atur tabungan, dan pantau langganan otomatis. Semua dalam satu dashboard modern dengan AI yang siap bantu kapan aja.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex justify-center mb-12 md:mb-16 font-inter">
                        <motion.button
                            initial="initial"
                            whileHover="hover"
                            className="group relative flex items-center gap-4 bg-blue-50/80 hover:bg-blue-100/50 transition-all rounded-full p-1.5 pl-6 md:pl-8 pr-1.5 border border-blue-100 shadow-sm overflow-hidden"
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
                                        Get Started Free
                                    </span>
                                    <span className="text-base md:text-lg font-bold text-blue-600 tracking-tight h-6 md:h-7 flex items-center">
                                        Get Started Free
                                    </span>
                                </motion.div>
                            </div>
                            <motion.div
                                variants={{
                                    initial: { scale: 1 },
                                    hover: { scale: 1.05 }
                                }}
                                className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 z-10"
                            >
                                <motion.div
                                    variants={{
                                        initial: { rotate: -45 },
                                        hover: { rotate: 0 }
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-center"
                                >
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                                </motion.div>
                            </motion.div>
                        </motion.button>
                    </motion.div>

                    {/* Dashboard Preview With Scroll Animation */}
                    <div style={{ perspective: "1500px" }} className="mb-24 md:mb-32">
                        <motion.div
                            style={{
                                rotateX,
                                scale,
                                translateZ,
                                transformStyle: "preserve-3d"
                            }}
                            className="relative mx-auto max-w-5xl"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 to-indigo-300 blur-3xl opacity-20 -z-10 animate-pulse"></div>
                            <div className="bg-gray-100/50 rounded-[2.5rem] p-2 md:p-4 backdrop-blur-xl border border-white/50 shadow-2xl">
                                <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl min-h-[500px] md:min-h-[600px] flex flex-col relative">
                                    {/* Mockup Header */}
                                    <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-gray-50/50">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Dashboard Preview</div>
                                    </div>
                                    {/* Mockup Content Body */}
                                    <div className="flex-1 p-8 grid grid-cols-12 gap-6 bg-white">
                                        {/* Simple Sidebar Mockup */}
                                        <div className="col-span-3 space-y-4 pr-6 border-r border-gray-50">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`h-8 rounded-lg animate-pulse ${i === 1 ? 'bg-blue-50 w-full' : 'bg-gray-50 w-3/4'}`} />
                                            ))}
                                        </div>
                                        {/* Main Content Mockup */}
                                        <div className="col-span-9 space-y-8">
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="h-24 bg-blue-50/50 rounded-2xl animate-pulse" />
                                                <div className="h-24 bg-indigo-50/50 rounded-2xl animate-pulse" />
                                                <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                                            </div>
                                            <div className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                                        <span className="text-gray-300 font-bold text-xl tracking-[0.2em] uppercase opacity-20">Full Dashboard Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Marquee Partner Logos */}
                    <motion.div
                        variants={itemVariants}
                        className="relative w-full overflow-hidden mb-12 py-4"
                    >
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

                        <motion.div
                            variants={marqueeVariants}
                            animate="animate"
                            className="flex whitespace-nowrap gap-12 md:gap-20 items-center w-max"
                        >
                            {[...partners, ...partners, ...partners].map((partner, idx) => (
                                <div key={idx} className="flex items-center gap-2 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                    {partner.icon}
                                    <span className={`font-bold text-xl md:text-2xl flex items-center ${partner.className || ""}`}>
                                        {partner.name}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
