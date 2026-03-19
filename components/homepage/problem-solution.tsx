"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, BookX, TrendingDown, EyeOff, Zap, ShieldCheck, Trophy, Target, ArrowDown, AlertCircle } from "lucide-react";

const problems = [
  {
    title: "Fragmented Tracking",
    description: "Managing finances across multiple apps and accounts is messy, overwhelming, and time-consuming.",
    icon: <TrendingDown className="w-6 h-6 text-red-500" />,
    iconReal: TrendingDown,
    color: "bg-red-100",
    textColor: "text-red-500",
  },
  {
    title: "Blind Spending",
    description: "Without real-time, categorized insights, small daily expenses silently drain your long-term wealth.",
    iconReal: EyeOff,
    color: "bg-orange-100",
    textColor: "text-orange-500",
  },
  {
    title: "Lack of Literacy",
    description: "Traditional tools only record data. They don't educate or help you build healthy financial habits.",
    iconReal: BookX,
    color: "bg-rose-100",
    textColor: "text-rose-500",
  },
];

const solutions = [
  {
    title: "AI Financial Advisor",
    description: "Your personal AI, Mindy, analyzes habits and provides proactive, personalized financial advice 24/7.",
    iconReal: BrainCircuit,
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    title: "Automated Intelligence",
    description: "From OCR receipt scanning to smart categorization, CashMind automates your financial tracking seamlessly.",
    iconReal: Zap,
    color: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    title: "Gamified Growth",
    description: "Level up your financial literacy through engaging challenges, specific goals, and a comprehensive scoring system.",
    iconReal: Trophy,
    color: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const ProblemSolution = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* THE PROBLEM SECTION */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-semibold tracking-wider text-xs uppercase">The Reality</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
              Why Financial Independence <br className="hidden md:block" /> Feels Out of Reach
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {problems.map((prob, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 \${prob.color}` }>
                  <prob.iconReal className={`w-6 h-6 \${prob.textColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{prob.title}</h3>
                <p className="text-gray-500 leading-relaxed">{prob.description}</p>
                
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-200 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* TRANSITION CONNECTOR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center my-12 relative"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-px h-32 bg-gradient-to-b from-gray-200 via-gray-300 to-blue-200" />
            </div>
            <div className="relative z-10 w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
            </div>
        </motion.div>

        {/* THE SOLUTION SECTION (INNOVATION FOCUS) */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-semibold tracking-wider text-xs uppercase">The Innovation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
              Empowering Your Wealth <br className="hidden md:block" /> with Artificial Intelligence
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {solutions.map((sol, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-white border border-blue-50 rounded-2xl p-8 shadow-lg shadow-blue-900/5 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group"
              >
                 {/* Glassmorphism subtle background element */}
                 <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors" />

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 \${sol.color} relative z-10`}>
                  <sol.iconReal className={`w-7 h-7 \${sol.textColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">{sol.title}</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{sol.description}</p>
                 
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
