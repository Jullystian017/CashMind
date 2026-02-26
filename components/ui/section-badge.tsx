"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
    label: string;
    className?: string;
}

export const SectionBadge = ({ label, className }: SectionBadgeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-100 backdrop-blur-sm shadow-sm mb-4",
                className
            )}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-700 text-xs md:text-sm font-bold uppercase tracking-widest">
                {label}
            </span>
        </motion.div>
    );
};
