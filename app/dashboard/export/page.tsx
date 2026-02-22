import React from 'react';
import { Download, Calendar, FileText, Shield, RotateCcw, ChevronRight } from "lucide-react";

export default function ExportPage() {
    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Header */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Export Data</h2>
                    <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Download your financial data for offline analysis.</p>
                </div>
            </div>

            {/* Main Configuration Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                {/* Period Selection */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Period</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="flex-1 py-2 text-sm font-bold bg-white rounded-lg shadow-sm text-slate-900">This Month</button>
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Last Month</button>
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Custom Range</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-medium">Start Date</label>
                            <div className="relative">
                                <input type="text" value="2026-01-01" readOnly className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-10 text-sm text-slate-600 focus:outline-none" />
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-medium">End Date</label>
                            <div className="relative">
                                <input type="text" value="2026-01-31" readOnly className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-10 text-sm text-slate-600 focus:outline-none" />
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Type */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Export Type</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500">Transactions Only</button>
                        <button className="flex-1 py-2 text-sm font-bold bg-white rounded-lg shadow-sm text-slate-900">Monthly Summary</button>
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500">Full Report</button>
                    </div>
                </div>

                {/* File Format */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">File Format</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="flex-1 py-2 text-sm font-bold bg-white rounded-lg shadow-sm text-slate-900">CSV</button>
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500">Excel</button>
                        <button className="flex-1 py-2 text-sm font-medium text-slate-500">PDF</button>
                    </div>
                </div>
            </div>

            {/* Preview Summary Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-slate-50">
                    <h3 className="font-bold text-slate-800">Preview Summary</h3>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">January 2026</span>
                </div>
                <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Income</p>
                        <p className="text-lg font-black text-blue-600">Rp 3.000.000</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Expense</p>
                        <p className="text-lg font-black text-red-500">Rp 2.100.000</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Net Balance</p>
                        <p className="text-lg font-black text-slate-900">Rp 900.000</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Transactions</p>
                        <p className="text-lg font-black text-slate-900">42 items</p>
                    </div>
                </div>
                <div className="bg-slate-50 px-8 py-3 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">i</div>
                    <p className="text-[10px] text-slate-400 font-medium italic">Preview shows estimated figures for the current selection.</p>
                </div>
            </div>

            {/* Download Action Section */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center space-y-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-3 mx-auto transition-all active:scale-95">
                    <Download size={20} />
                    Download File
                </button>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Your report is generated in real-time. Large data sets may take a few seconds.</p>

                <div className="flex justify-center items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        <Shield size={14} /> Secure Export
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <RotateCcw size={14} /> Auto-Archived
                    </div>
                </div>
            </div>

            {/* Footer Support */}
            <p className="text-center text-xs text-slate-400">
                Need help with your data? <button className="text-blue-600 font-bold hover:underline">Contact Support</button>
            </p>
        </div>
    );
}