"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Trash2,
    Loader2,
    Users,
    Receipt,
    Shield,
    Clock,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    getSplitBillDetail,
    toggleParticipantPaid,
    settleBill,
    deleteSplitBill,
    type SplitBillDetail
} from "@/app/actions/split-bill"

export default function SplitBillDetailPage() {
    const router = useRouter()
    const params = useParams()
    const billId = params.id as string

    const [bill, setBill] = useState<SplitBillDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [settling, setSettling] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const fetchDetail = async () => {
        setLoading(true)
        const { data, error } = await getSplitBillDetail(billId)
        if (data) setBill(data)
        setLoading(false)
    }

    useEffect(() => {
        if (billId) fetchDetail()
    }, [billId])

    const formatRp = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val).replace('Rp', 'Rp ')
    }

    const handleTogglePaid = async (participantId: string) => {
        setTogglingId(participantId)
        await toggleParticipantPaid(participantId)
        await fetchDetail()
        setTogglingId(null)
    }

    const handleSettle = async () => {
        if (!confirm("Mark all participants as settled?")) return
        setSettling(true)
        await settleBill(billId)
        await fetchDetail()
        setSettling(false)
    }

    const handleDelete = async () => {
        if (!confirm("Delete this split bill? This cannot be undone.")) return
        setDeleting(true)
        await deleteSplitBill(billId)
        router.push("/dashboard/split-bill")
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3 text-gray-400">
                <Loader2 className="w-7 h-7 animate-spin" />
                <p className="text-xs font-medium">Loading details...</p>
            </div>
        )
    }

    if (!bill) {
        return (
            <div className="text-center py-32">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Split bill not found</h3>
                <p className="text-sm text-gray-400 mb-6">It may have been deleted.</p>
                <Button onClick={() => router.push("/dashboard/split-bill")} variant="outline" className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        )
    }

    const paidCount = bill.participants.filter(p => p.is_paid).length
    const totalParticipants = bill.participants.length
    const progress = totalParticipants > 0 ? (paidCount / totalParticipants) * 100 : 0
    const isActive = bill.status === "active"
    const totalCollected = bill.participants.filter(p => p.is_paid).reduce((s, p) => s + p.amount, 0)
    const totalPending = bill.participants.filter(p => !p.is_paid).reduce((s, p) => s + p.amount, 0)

    return (
        <div className="space-y-8 pb-24 max-w-3xl" suppressHydrationWarning={true}>
            {/* Back */}
            <button
                onClick={() => router.push("/dashboard/split-bill")}
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Split Bills
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{bill.title}</h2>
                        <span className={cn(
                            "text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider",
                            isActive ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {isActive ? "ACTIVE" : "SETTLED"}
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">
                        Created {new Date(bill.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {" · "}Paid by {bill.payer === "you" ? "You" : "Friend"}
                    </p>
                </div>
                {isActive && (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSettle}
                            disabled={settling}
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 px-5 shadow-sm text-sm font-bold"
                        >
                            {settling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Settle All
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleting}
                            variant="outline"
                            className="rounded-xl h-10 px-4 border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                    </div>
                )}
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total</p>
                    <p className="text-lg font-bold text-gray-900">{formatRp(bill.total_amount)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">People</p>
                    <p className="text-lg font-bold text-gray-900">{totalParticipants + 1}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">Collected</p>
                    <p className="text-lg font-bold text-emerald-600">{formatRp(totalCollected)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Pending</p>
                    <p className="text-lg font-bold text-orange-500">{formatRp(totalPending)}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-800">Settlement Progress</p>
                    <p className="text-sm font-bold text-blue-600">{paidCount}/{totalParticipants} settled</p>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Participants List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        Participants
                    </h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {/* You */}
                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                Y
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    You {bill.payer === "you" && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-1">Payer</span>}
                                </p>
                                <p className="text-[11px] text-gray-400">Your share</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">
                                {formatRp(bill.total_amount - bill.participants.reduce((s, p) => s + p.amount, 0))}
                            </span>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>

                    {/* Other Participants */}
                    {bill.participants.map((p) => (
                        <div
                            key={p.id}
                            className={cn(
                                "flex items-center justify-between p-5 transition-colors",
                                isActive && "hover:bg-gray-50 cursor-pointer"
                            )}
                            onClick={() => isActive && handleTogglePaid(p.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                    p.is_paid ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                                )}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className={cn("text-sm font-bold", p.is_paid ? "text-gray-400 line-through" : "text-gray-900")}>{p.name}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {p.is_paid ? "Settled ✓" : isActive ? "Tap to mark as settled" : "Not settled"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn("text-sm font-bold", p.is_paid ? "text-gray-400" : "text-gray-900")}>
                                    {formatRp(p.amount)}
                                </span>
                                {togglingId === p.id ? (
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                ) : p.is_paid ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-200" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete for settled bills */}
            {!isActive && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        variant="ghost"
                        className="text-sm font-medium text-gray-400 hover:text-rose-500"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Delete this split bill
                    </Button>
                </div>
            )}
        </div>
    )
}
