"use client"

import { motion } from "framer-motion"
import { TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react"

export function AuthPreview() {
    return (
        <div className="hidden lg:flex flex-col justify-center items-center h-full w-full bg-blue-600 relative overflow-hidden p-12">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-xl text-center mb-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-[1.2] tracking-tight"
                >
                    Simplify Your Finances and Boost Your Productivity
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-white/80 text-base font-medium"
                >
                    Elevate Your Wealth with Powerful AI-Driven Insights.
                </motion.p>
            </div>

            {/* Floating Dashboard Cards */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute z-20 bg-white rounded-3xl p-6 shadow-2xl border border-white/20 w-[85%] overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Today's Revenue</p>
                            <h3 className="text-3xl font-black text-gray-900">$3,543</h3>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                            <ArrowUpRight className="w-3 h-3" />
                            40% <span className="text-gray-400 font-normal">last month</span>
                        </div>
                    </div>
                    {/* Mock Chart Area */}
                    <div className="h-40 w-full bg-slate-50 rounded-2xl flex items-end justify-between p-4 gap-2">
                        {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                className={`w-full rounded-t-lg ${i % 2 === 0 ? 'bg-blue-500' : 'bg-blue-300'}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Secondary Card (Expense) */}
                <motion.div
                    initial={{ opacity: 0, x: 50, y: 50 }}
                    animate={{ opacity: 1, x: 140, y: 120 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute z-30 bg-white rounded-2xl p-5 shadow-2xl border border-white/20 w-[60%]"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-0.5">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Today's Expense</p>
                            <h3 className="text-xl font-black text-gray-900">$1,258</h3>
                        </div>
                        <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <ArrowDownRight className="w-2.5 h-2.5" />
                            25% <span className="text-gray-400 font-normal">last month</span>
                        </div>
                    </div>
                    <div className="h-12 w-full flex items-center">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                                className="h-full bg-red-500"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Partner Logos */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12 opacity-60">
                <span className="text-white text-xl font-bold tracking-tighter italic">Meta</span>
                <span className="text-white text-xl font-bold tracking-widest uppercase">Sony</span>
                <span className="text-white text-xl font-bold tracking-tight">Google</span>
                <span className="text-white text-xl font-bold tracking-tighter uppercase">Samsung</span>
            </div>
        </div>
    )
}
