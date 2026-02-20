"use client"

import { TrendingUp } from "lucide-react"

export default function SplitBillPage() {
    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Header Section */}
            <div>
                <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Split Bill</h2>
                <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Divide expenses fairly among your friends.</p>
            </div>

            {/* Content Placeholder */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No active groups</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                    Start a new split bill and invite your friends to get started.
                </p>
                <button
                    suppressHydrationWarning={true}
                    className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    Create New Split
                </button>
            </div>
        </div>
    )
}
