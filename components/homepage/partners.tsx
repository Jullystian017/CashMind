"use client"

import { motion } from "framer-motion"
import { Github, Square, CircleDot } from "lucide-react"

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

export function Partners() {
    const partners = [
        { icon: <Github className="w-6 h-6" />, name: "GitHub" },
        { icon: <Square className="w-6 h-6" />, name: "Square" },
        { icon: <CircleDot className="w-6 h-6" />, name: "Medium" },
        { icon: null, name: "cansaas", className: "tracking-tighter italic" },
        { icon: null, name: "stripe", className: "text-2xl tracking-tighter" },
    ]

    return (
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
    )
}
