"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Wallet,
    ShieldCheck,
    Zap,
    Clock,
    Smartphone
} from "lucide-react";

const features = [
    {
        title: "Real-time Analytics",
        description: "Monitor your financial health with instant data updates and professional charts.",
        icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
        className: "md:col-span-2 md:row-span-2 bg-blue-50/50",
    },
    {
        title: "Smart Wallet",
        description: "Manage multiple accounts and categories effortlessly.",
        icon: <Wallet className="w-6 h-6 text-emerald-600" />,
        className: "md:col-span-1 md:row-span-1 bg-emerald-50/50",
    },
    {
        title: "Bank-grade Security",
        description: "Your data is protected with 256-bit encryption.",
        icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
        className: "md:col-span-1 md:row-span-1 bg-purple-50/50",
    },
    {
        title: "Instant Alerts",
        description: "Get notified about unusual spending patterns immediately.",
        icon: <Zap className="w-6 h-6 text-amber-600" />,
        className: "md:col-span-1 md:row-span-2 bg-amber-50/50",
    },
    {
        title: "Automated Tracking",
        description: "Save time with automated recurring expense tracking.",
        icon: <Clock className="w-6 h-6 text-rose-600" />,
        className: "md:col-span-1 md:row-span-1 bg-rose-50/50",
    },
    {
        title: "Mobile App",
        description: "Take your finances anywhere with our iOS and Android apps.",
        icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
        className: "md:col-span-1 md:row-span-1 bg-indigo-50/50",
    },
];

export const Features = () => {
    return (
        <section id="features" className="py-24 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Features</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Everything you need to <br className="hidden md:block" /> scale your finances.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-full">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 ${feature.className}`}
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
