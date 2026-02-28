"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: { text: string; image: string; name: string; role: string }[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-lg shadow-blue-500/5 max-w-[320px] w-full" key={i}>
                                    <div className="text-gray-600 text-sm leading-relaxed italic">"{text}"</div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full object-cover border-2 border-blue-50"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-bold text-gray-900 tracking-tight leading-5 text-sm">{name}</div>
                                            <div className="text-xs text-blue-600 font-medium opacity-80 tracking-tight leading-5">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};
