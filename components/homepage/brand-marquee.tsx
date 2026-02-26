"use client";

import React from "react";
import { motion } from "framer-motion";

const brands = [
    { name: "Microsoft", logo: "Ⓜ️" },
    { name: "Apple", logo: "🍎" },
    { name: "Google", logo: "G" },
    { name: "Amazon", logo: "A" },
    { name: "Meta", logo: "∞" },
    { name: "Netflix", logo: "N" },
    { name: "Tesla", logo: "T" },
    { name: "Airbnb", logo: "🏠" },
];

export const BrandMarquee = () => {
    return (
        <section className="pt-10 pb-20 md:pt-16 md:pb-32 bg-white flex flex-col items-center">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-[0.2em] mb-12">
                Trusted and used by
            </h2>

            <div className="w-full max-w-4xl mx-auto overflow-hidden relative">
                {/* Gradient Overlay for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    animate={{
                        x: [0, -1035],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex whitespace-nowrap gap-16 md:gap-24 items-center px-4"
                >
                    {[...brands, ...brands].map((brand, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 text-2xl md:text-3xl font-bold text-gray-300/80 hover:text-gray-900 transition-colors cursor-default grayscale hover:grayscale-0"
                        >
                            <span className="opacity-50">{brand.logo}</span>
                            <span className="tracking-tight">{brand.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
