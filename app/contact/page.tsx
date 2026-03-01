"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Clock, MessageSquare, Send, PhoneCall } from "lucide-react";
import { SectionBadge } from "@/components/ui/section-badge";
import { useState } from "react";

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        details: "jullystian01@gmail.com",
        subDetails: "We'll respond within 24 hours.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: PhoneCall,
        title: "Call Us",
        details: "+62 857-9805-1625",
        subDetails: "Mon-Fri from 9am to 6pm.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: MapPin,
        title: "Visit Us",
        details: "CashMind HQ, Banyumas",
        subDetails: "Jl. DI Panjaitan No. 227, Purwokerto, Jawa Tengah",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-blue-100/80 via-blue-50/50 to-white">
                {/* Background Shader Effect (Matches Homepage, About, Features) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
                            backgroundSize: '90px 90px'
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <SectionBadge label="Get in Touch" className="mb-6 mx-auto" variant="light" />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        We'd Love to <br className="hidden md:block" />
                        <span className="text-blue-600">Hear From You</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium mb-12"
                    >
                        Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </motion.p>
                </div>
            </section>

            {/* Split Content Section */}
            <section className="py-12 bg-white relative z-10 -mt-16 sm:-mt-24 mb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">

                        {/* Left Column: Contact Info Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect with us</h3>
                                <p className="text-gray-500">Reach out using any of the methods below.</p>
                            </motion.div>

                            {contactInfo.map((info, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                >
                                    <div className={`shrink-0 w-14 h-14 rounded-2xl ${info.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <info.icon className={`w-6 h-6 ${info.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h4>
                                        <p className="text-gray-900 font-medium">{info.details}</p>
                                        <p className="text-sm text-gray-500">{info.subDetails}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden"
                        >
                            {/* Decorative background glow inside form card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10 flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Send a Message</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            required
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            required
                                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">How can we help?</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="Tell us a little about your project or inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : isSuccess ? (
                                        <>Message Sent!</>
                                    ) : (
                                        <>Send Message <Send className="w-4 h-4 ml-1" /></>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isSuccess && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-emerald-600 font-medium text-sm mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
                                        >
                                            Thank you for reaching out! We will get back to you shortly.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
