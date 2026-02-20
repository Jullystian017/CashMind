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
                        className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
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
