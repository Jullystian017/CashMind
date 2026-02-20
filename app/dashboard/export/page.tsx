"use client"

import { ReceiptText } from "lucide-react"

export default function ExportPage() {
    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Header Section */}
            <div>
                <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Reports & Export</h2>
                <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Download your financial data for offline analysis.</p>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <ReceiptText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Generate a report</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                    Select a date range and format to export your transactions and insights.
                </p>
                <div className="flex gap-4 mt-8">
                    <button
                        suppressHydrationWarning={true}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
                    >
                        PDF Format
                    </button>
                    <button
                        suppressHydrationWarning={true}
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        CSV/Excel Format
                    </button>
                </div>
            </div>
        </div>
    )
}
