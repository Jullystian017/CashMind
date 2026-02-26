"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export function Hero() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <>
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
                <Link href={user ? "/dashboard" : "/register"}>
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
                                    {user ? "Go to Dashboard" : "Get Started Free"}
                                </span>
                                <span className="text-base md:text-lg font-bold text-blue-600 tracking-tight h-6 md:h-7 flex items-center">
                                    {user ? "Go to Dashboard" : "Get Started Free"}
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
                </Link>
            </motion.div>
        </>
    )
}
