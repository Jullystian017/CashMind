"use client"

import React, { useState, useEffect, useMemo } from 'react';
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
    CheckCircle2,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    TrendingUp,
    CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExportData, type ExportTransaction } from "@/app/actions/export";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportPage() {
    const now = new Date();
    const [selectedDate, setSelectedDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    const [reportType, setReportType] = useState('Full History');
    const [format, setFormat] = useState('CSV');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasDownloaded, setHasDownloaded] = useState(false);
    const [data, setData] = useState<ExportTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDateData = async () => {
        setLoading(true);
        const { data: result, error } = await getExportData(selectedDate.getMonth(), selectedDate.getFullYear());
        if (!error && result) {
            setData(result);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDateData();
    }, [selectedDate]);

    const stats = useMemo(() => {
        const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
            income,
            expense,
            balance: income - expense,
            count: data.length
        };
    }, [data]);

    const formatRp = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val).replace('Rp', 'Rp ');
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
        setSelectedDate(newDate);
    };

    const convertToCSV = (transactions: ExportTransaction[]) => {
        const headers = ["Date", "Description", "Type", "Category", "Amount", "Method", "Status", "Note"];
        const rows = transactions.map(t => [
            t.date,
            `"${t.description.replace(/"/g, '""')}"`,
            t.type,
            t.category,
            t.amount,
            t.paymentMethod,
            t.status,
            `"${(t.note || "").replace(/"/g, '""')}"`
        ]);
        return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    };

    const generatePDF = (transactions: ExportTransaction[]) => {
        const doc = new jsPDF();
        const monthName = selectedDate.toLocaleString('default', { month: 'long' });
        const yearNum = selectedDate.getFullYear();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("CASHMIND", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Financial Report: ${monthName} ${yearNum}`, 14, 28);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 33);
        doc.setLineWidth(0.5);
        doc.line(14, 38, 196, 38);

        // Summary Section
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Financial Summary", 14, 48);

        autoTable(doc, {
            startY: 53,
            head: [['Indicator', 'Value']],
            body: [
                ['Total Income', formatRp(stats.income)],
                ['Total Expense', formatRp(stats.expense)],
                ['Net Balance', formatRp(stats.balance)],
                ['Total Transactions', `${stats.count} items`]
            ],
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        // Category Chart Section
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryMap: { [key: string]: number } = {};
        expenses.forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        const sortedCategories = Object.entries(categoryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        if (sortedCategories.length > 0) {
            const chartStartY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text("Top Categories (Spending)", 14, chartStartY);

            let currentY = chartStartY + 10;
            const maxSpent = sortedCategories[0][1];
            const maxBarWidth = 140;

            sortedCategories.forEach(([name, amount], index) => {
                const barWidth = (amount / maxSpent) * maxBarWidth;

                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.text(name, 14, currentY + 5);

                doc.setFillColor(241, 245, 249);
                doc.rect(50, currentY, maxBarWidth, 6, 'F');

                doc.setFillColor(59, 130, 246);
                doc.rect(50, currentY, barWidth, 6, 'F');

                doc.setTextColor(15, 23, 42);
                doc.setFont("helvetica", "bold");
                doc.text(formatRp(amount), 145 + 50, currentY + 5, { align: 'right' });
                doc.setFont("helvetica", "normal");

                currentY += 12;
            });

            (doc as any).lastAutoTable.finalY = currentY + 5;
        }

        // Transactions Table
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Detailed Transactions", 14, (doc as any).lastAutoTable.finalY + 10);

        const tableData = transactions.map(t => [
            new Date(t.date).toLocaleDateString('id-ID'),
            t.description,
            t.category,
            t.type.toUpperCase(),
            formatRp(t.amount)
        ]);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
            body: tableData,
            headStyles: { fillColor: [59, 130, 246] },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        return doc;
    };

    const handleDownload = () => {
        if (data.length === 0) return;
        setIsGenerating(true);
        setHasDownloaded(false);

        setTimeout(() => {
            let fileName = `CashMind_Export_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}`;

            if (format === 'CSV') {
                const csv = convertToCSV(data);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", fileName + ".csv");
                link.click();
            } else if (format === 'JSON') {
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", fileName + ".json");
                link.click();
            } else if (format === 'PDF') {
                const doc = generatePDF(data);
                doc.save(fileName + ".pdf");
            }

            setIsGenerating(false);
            setHasDownloaded(true);
            setTimeout(() => setHasDownloaded(false), 3000);
        }, 1500);
    };

    const formats = [
        { id: 'CSV', name: 'CSV', desc: 'Spreadsheet', icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'JSON', name: 'JSON', desc: 'Raw Data', icon: FileJson, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 'PDF', name: 'PDF', desc: 'Report', icon: FileCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Export Data</h2>
                    <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium italic">Download your financial records for offline analysis or backup.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Connected
                    </div>
                </div>
            </div>

            {/* Step 1: Select Period */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-black">1</div>
                    <h3 className="text-base font-bold text-gray-900">Select Period</h3>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleMonthChange(-1)}
                        className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex-1 text-center py-3 px-6 bg-gray-50 rounded-2xl">
                        <p className="text-lg font-bold text-gray-900">
                            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            1 — {lastDay} {selectedDate.toLocaleString('default', { month: 'short' })}
                        </p>
                    </div>
                    <button
                        onClick={() => handleMonthChange(1)}
                        className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <ChevronRightIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Step 2: Choose Format */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-black">2</div>
                    <h3 className="text-base font-bold text-gray-900">Choose Format</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {formats.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFormat(f.id)}
                            className={cn(
                                "relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
                                format === f.id
                                    ? "border-blue-500 bg-blue-50/40 shadow-sm"
                                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                            )}
                        >
                            {format === f.id && (
                                <div className="absolute top-2.5 right-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                </div>
                            )}
                            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", f.bg)}>
                                <f.icon className={cn("w-5 h-5", f.color)} />
                            </div>
                            <div className="text-center">
                                <p className={cn("text-sm font-bold", format === f.id ? "text-blue-700" : "text-gray-800")}>{f.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{f.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 3: Preview & Download */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-black">3</div>
                            <h3 className="text-base font-bold text-gray-900">Preview</h3>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getFullYear()}
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                            <Loader2 className="w-7 h-7 animate-spin" />
                            <p className="text-xs font-medium">Loading data...</p>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Income", val: formatRp(stats.income), icon: ArrowUpCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                                    { label: "Expense", val: formatRp(stats.expense), icon: ArrowDownCircle, color: "text-rose-500", bg: "bg-rose-50" },
                                    { label: "Net Balance", val: formatRp(stats.balance), icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                                    { label: "Transactions", val: `${stats.count}`, icon: FileText, color: "text-gray-600", bg: "bg-gray-50" }
                                ].map((stat) => (
                                    <div key={stat.label} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100/80">
                                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                                            <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-sm font-bold text-gray-900">{stat.val}</p>
                                    </div>
                                ))}
                            </div>

                            {data.length > 0 && (
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="font-medium">{data.length} transactions ready for export</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                                            <Shield className="w-3 h-3" />
                                            Verified
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.length === 0 && (
                                <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                                    <p className="text-sm text-gray-400 font-medium">No transactions found for this period.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Download Card */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-3xl shadow-lg shadow-blue-500/20 text-center flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full translate-y-12 -translate-x-12 blur-xl" />

                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            {isGenerating ? (
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            ) : hasDownloaded ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                            ) : (
                                <Download className="w-8 h-8 text-white" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {isGenerating ? "Processing..." : hasDownloaded ? "Downloaded!" : "Ready to Export"}
                            </h3>
                            <p className="text-blue-100/70 text-xs font-medium mt-1.5 max-w-[180px] mx-auto leading-relaxed">
                                {isGenerating
                                    ? "Generating your file..."
                                    : data.length === 0
                                        ? "Select a period with transactions"
                                        : `${data.length} transactions as ${format}`}
                            </p>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={isGenerating || data.length === 0}
                            className={cn(
                                "w-full bg-white text-blue-700 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm",
                                (isGenerating || data.length === 0)
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-blue-50 active:scale-[0.98] shadow-lg"
                            )}
                        >
                            {isGenerating ? "Generating..." : hasDownloaded ? "Done ✓" : "Download"}
                            {!isGenerating && !hasDownloaded && <Download className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="relative z-10 flex items-center justify-center gap-3 mt-6 pt-5 border-t border-white/15">
                        <span className="text-[10px] text-blue-100/40 font-semibold flex items-center gap-1">
                            <Shield size={10} /> Encrypted
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span className="text-[10px] text-blue-100/40 font-semibold uppercase">
                            {format}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
