"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Founding Engineer @ Vercel",
        content: "CashMind has completely transformed how I manage my personal finances. The AI insights are scary accurate!",
        avatar: "S",
        color: "bg-blue-100 text-blue-600",
    },
    {
        name: "Michael Chen",
        role: "Product Designer @ Airbnb",
        content: "The interface is so smooth and intuitive. It's the first time I actually enjoy looking at my expenses.",
        avatar: "M",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        name: "Alex Rivera",
        role: "Freelance Creative",
        content: "Managing income from multiple sources used to be a nightmare. Now it's all in one place. Game changer.",
        avatar: "A",
        color: "bg-purple-100 text-purple-600",
    },
];

export const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-gray-50/50 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <SectionBadge label="Testimonials" />
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Loved by thousands of <br className="hidden md:block" /> builders and creators.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 font-medium italic mb-8">"{testimonial.content}"</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${testimonial.color}`}>
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
