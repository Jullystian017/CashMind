"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import {
    Activity,
    PieChart,
    Calculator,
    Calendar,
    Bot,
    Gamepad2,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Smartphone
} from "lucide-react"

const features = [
    {
        title: "Financial Score",
        description: "Evaluasi kesehatan finansialmu dengan skor 0-100 secara otomatis berdasarkan pola pengeluaran.",
        icon: Activity,
        color: "bg-blue-500"
    },
    {
        title: "Smart Analytics",
        description: "Grafik interaktif (Pie, Bar, & Line) yang mempermudahmu mengerti ke mana setiap rupiah pergi.",
        icon: PieChart,
        color: "bg-indigo-500"
    },
    {
        title: "Budget Planner",
        description: "Set anggaran per kategori dan dapatkan notifikasi instan sebelum kamu jajan berlebihan.",
        icon: Calculator,
        color: "bg-cyan-500"
    },
    {
        title: "AI Coach (Mindy)",
        description: "Chatbot pintar yang siap menjawab pertanyaan keuangan dan memberikan rekomendasi personal.",
        icon: Bot,
        color: "bg-purple-500"
    },
    {
        title: "Savings Goals",
        description: "Visualisasi target tabunganmu dengan progress bar. Menabung untuk barang impian jadi lebih terukur.",
        icon: ArrowUpRight,
        color: "bg-emerald-500"
    },
    {
        title: "Gamification",
        description: "Kumpulkan badge, selesaikan challenge, dan naikkan level finansialmu dengan cara yang fun.",
        icon: Gamepad2,
        color: "bg-amber-500"
    }
]

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6"
                    >
                        <Zap className="w-4 h-4" /> Powerhouse Tools
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        One App. <span className="text-blue-600">Infinite Control.</span>
                    </motion.h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Jelajahi fitur premium CashMind yang dirancang khusus untuk mempermudah hidup finansialmu sebai pelajar.
                    </p>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 rounded-[2.5rem] bg-slate-50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500`}>
                                    <f.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    {f.description}
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm cursor-pointer hover:gap-3 transition-all">
                                    Learn More <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extra Features / Value Prop */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                                Built with Modern <br />
                                <span className="text-blue-500">Stability & Security</span>
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Bukan sekadar aplikasi biasa, CashMind menggunakan teknologi terkini untuk memastikan pengalaman pengguna yang super smooth.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                                    <div className="text-left">
                                        <h4 className="font-bold">Real-time Sync</h4>
                                        <p className="text-xs text-gray-500">Data update instan.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <Smartphone className="w-8 h-8 text-blue-400" />
                                    <div className="text-left">
                                        <h4 className="font-bold">Mobile First</h4>
                                        <p className="text-xs text-gray-500">Akses di mana saja.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] shadow-2xl relative z-20"
                            >
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🍱</div>
                                            <div className="text-sm font-bold">Lunch expense tracked!</div>
                                        </div>
                                        <div className="text-xs text-blue-300">-Rp 25.000</div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl scale-105 border border-white/20 shadow-xl shadow-black/20">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🎯</div>
                                            <div className="text-sm font-bold">Laptop Goal: 85% reached</div>
                                        </div>
                                        <div className="text-xs text-blue-300">+6% Today</div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
                                            <div className="text-sm font-bold text-left">Mindy says: "You're doing great!"</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.71 12 2.29l1 9.01h6.39L12 21.71l-1-9.01H4.61z" />
        </svg>
    )
}
