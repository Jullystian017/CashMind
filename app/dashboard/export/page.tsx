"use client"

import React, { useState } from 'react';
import {
    Download,
    Calendar,
    FileText,
    Shield,
    RotateCcw,
    ChevronRight,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    ListChecks,
    HelpCircle,
    FileSpreadsheet,
    FileJson,
    FileCheck,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExportPage() {
    const [period, setPeriod] = useState('Monthly');
    const [reportType, setReportType] = useState('Monthly Summary');
    const [format, setFormat] = useState('CSV');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasDownloaded, setHasDownloaded] = useState(false);

    const handleDownload = () => {
        setIsGenerating(true);
        setHasDownloaded(false);
        // Simulate generation process
        setTimeout(() => {
            setIsGenerating(false);
            setHasDownloaded(true);

            // Reset success message after 3 seconds
            setTimeout(() => setHasDownloaded(false), 3000);
        }, 2000);
    };

    const reportTypes = [
        { name: "Transactions Only", description: "Row-by-row data of every movement." },
        { name: "Monthly Summary", description: "Aggregated totals and category breakdowns." },
        { name: "Full Financial Report", description: "Comprehensive analysis with AI insights." }
    ];

    const formats = [
        { id: 'CSV', name: 'CSV', icon: FileSpreadsheet, color: 'text-green-600' },
        { id: 'PDF', name: 'PDF', icon: FileCheck, color: 'text-red-500' },
        { id: 'JSON', name: 'JSON', icon: FileJson, color: 'text-amber-500' },
    ];

    return (
        <div className="space-y-10 pb-24" suppressHydrationWarning={true}>
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Export Data</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">Download your financial footprints for offline depth analysis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-12 space-y-8">
                    {/* Main Configuration Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Period Selection */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Time Period</label>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                {['Monthly', 'Quarterly', 'Custom'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={cn(
                                            "flex-1 py-2.5 text-xs font-bold transition-all rounded-xl",
                                            period === p
                                                ? "bg-white shadow-sm text-blue-600 border border-blue-50"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Calendar size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        value={period === 'Custom' ? "Select Range..." : "January 2026"}
                                        readOnly
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-200 focus:bg-white transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Export Type */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Report Type</label>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {reportTypes.map((type) => (
                                    <button
                                        key={type.name}
                                        onClick={() => setReportType(type.name)}
                                        className={cn(
                                            "w-full text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border",
                                            reportType === type.name
                                                ? "bg-blue-50/50 border-blue-100 text-blue-600 shadow-sm shadow-blue-500/5 scale-[1.02]"
                                                : "bg-slate-50/30 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                                        )}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* File Format */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Format & Security</label>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                {formats.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f.id)}
                                        className={cn(
                                            "flex-1 py-3 text-xs font-black transition-all rounded-xl flex items-center justify-center gap-2",
                                            format === f.id
                                                ? "bg-white shadow-sm text-slate-900 border border-slate-50"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        <f.icon className={cn("w-3.5 h-3.5", format === f.id ? f.color : "text-slate-300")} />
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/30 rounded-2xl border border-blue-100/30">
                                <Shield className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-wider leading-none">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Preview & Action */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                        <div className="p-8 flex justify-between items-center border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <ListChecks className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-800 tracking-tight">Preview Summary</h3>
                            </div>
                            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20">JAN 2026</span>
                        </div>
                        <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
                            {[
                                { label: "Total Income", val: "Rp 3.000.000", icon: ArrowUpCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "Total Expense", val: "Rp 2.100.000", icon: ArrowDownCircle, color: "text-rose-500", bg: "bg-rose-50" },
                                { label: "Net Balance", val: "Rp 900.000", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Transactions", val: "42 items", icon: FileText, color: "text-slate-600", bg: "bg-slate-50" }
                            ].map((stat) => (
                                <div key={stat.label} className="group transition-all">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">{stat.label}</p>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">{stat.val}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-50/50 px-10 py-4 flex items-center gap-3">
                            <HelpCircle className="w-4 h-4 text-slate-300" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Real-time data synchronization enabled</p>
                        </div>
                    </div>
                </div>

                {/* Final Action Column */}
                <div className="lg:col-span-4">
                    <div className="bg-blue-600 p-10 rounded-[32px] shadow-2xl shadow-blue-500/20 text-center space-y-8 h-full flex flex-col justify-center relative overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center mx-auto shadow-inner border border-white/20">
                                {isGenerating ? (
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                ) : hasDownloaded ? (
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                                ) : (
                                    <Download className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white tracking-tight">
                                    {isGenerating ? "Processing..." : hasDownloaded ? "Export Ready!" : "Ready to Export"}
                                </h3>
                                <p className="text-blue-100 text-xs font-medium max-w-[200px] mx-auto opacity-80 italic">
                                    {isGenerating ? "Crunching your numbers and securing the payload..." : `Your ${reportType} is ready to be packaged in ${format} format.`}
                                </p>
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className={cn(
                                    "w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                                    isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
                                )}
                            >
                                {isGenerating ? "Generating..." : hasDownloaded ? "Download Again" : "Generate & Download"}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-center items-center gap-3 pt-4 relative z-10">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-white/60 uppercase tracking-widest">
                                <Shield size={12} className="text-white/80" /> Secure
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-white/60 uppercase tracking-widest">
                                <RotateCcw size={12} className="text-white/80" /> archived
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Footer */}
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-10 h-1 rounded-full bg-slate-100" />
                <p className="text-xs text-slate-400 font-medium tracking-tight">
                    Need a custom data structure? <button className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-blue-200">Request Custom Report</button>
                </p>
            </div>
        </div>
    );
}
