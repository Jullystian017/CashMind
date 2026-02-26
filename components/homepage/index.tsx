"use client"

import { useRef } from "react"
import { useScroll, useTransform, motion } from "framer-motion"
import { Hero } from "./hero"
import { DashboardPreview } from "./dashboard-preview"
import { Partners } from "./partners"

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

export default function Homepage() {
    const containerRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // 3D Scroll Transformation for DashboardPreview
    const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
    const translateZ = useTransform(scrollYProgress, [0, 1], [-100, 0])

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
                    <Hero />
                    <DashboardPreview rotateX={rotateX} scale={scale} translateZ={translateZ} />
                    <Partners />
                </motion.div>
            </div>
        </section>
    )
}
