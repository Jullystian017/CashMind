"use client"

import { motion, MotionValue } from "framer-motion"

interface DashboardPreviewProps {
    rotateX: MotionValue<number>
    scale: MotionValue<number>
    translateZ: MotionValue<number>
}

export function DashboardPreview({ rotateX, scale, translateZ }: DashboardPreviewProps) {
    return (
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
    )
}
