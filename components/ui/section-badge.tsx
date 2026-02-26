"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
    label: string;
    className?: string;
    variant?: "light" | "dark";
}

export const SectionBadge = ({ label, className, variant = "light" }: SectionBadgeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full backdrop-blur-sm shadow-sm mb-4",
                variant === "light"
                    ? "bg-blue-50/50 border border-blue-100"
                    : "bg-white/5 border border-white/10",
                className
            )}
        >
            <span className={cn(
                "text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]",
                variant === "light" ? "text-blue-700" : "text-blue-400"
            )}>
                {label}
            </span>
        </motion.div>
    );
};
