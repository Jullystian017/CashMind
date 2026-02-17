"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Target, Heart, Shield, Zap, TrendingUp, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        Empowering the Future <br />
                        <span className="text-blue-600">Generation of Finance</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        CashMind lahir dari keinginan untuk membantu pelajar dan mahasiswa mengelola uang saku mereka dengan lebih cerdas, transparan, dan terukur.
                    </motion.p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Visi Kami</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Menjadi platform edukasi dan pengelolaan keuangan nomor satu bagi pelajar di Indonesia, menciptakan generasi yang melek finansial dan siap menghadapi masa depan.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Misi Kami</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5"></span>
                                Menyediakan alat pencatatan keuangan yang intuitif dan menyenangkan.
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5"></span>
                                Mengintegrasikan teknologi AI untuk memberikan saran finansial yang personal.
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5"></span>
                                Mengedukasi pentingnya menabung dan dana darurat melalui fitur yang interaktif.
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Manfaat Untuk Kamu</h2>
                        <p className="text-gray-600">Kenapa pelajar harus pakai CashMind?</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Keamanan Data", desc: "Semua data transaksi kamu tersimpan dengan aman dan terenkripsi." },
                            { icon: Zap, title: "Instan & Real-time", desc: "Lihat sisa uang saku kamu detik itu juga setelah mencatat." },
                            { icon: TrendingUp, title: "Analisis Akurat", desc: "Pahami ke mana perginya uang kamu dengan grafik yang mudah dibaca." },
                            { icon: Users, title: "Relate Banget", desc: "Fitur split bill dan kategori jajan yang pas buat kehidupan kampus/sekolah." },
                            { icon: Heart, title: "GRATIS Selamanya", desc: "Fitur utama CashMind bisa kamu nikmati secara gratis tanpa biaya admin." },
                            { icon: Target, title: "Capai Goals", desc: "Beli barang impian jadi lebih cepat dengan perencanaan tabungan yang matang." }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
