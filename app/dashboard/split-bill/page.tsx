"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Utensils,
  ShoppingCart,
  Film,
  Coffee,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Loader2,
  Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CreateSplitModal } from "./splitmodel"
import { getSplitBills, type SplitBill } from "@/app/actions/split-bill"

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="w-5 h-5 text-blue-600" />,
  groceries: <ShoppingCart className="w-5 h-5 text-blue-600" />,
  movie: <Film className="w-5 h-5 text-blue-600" />,
  coffee: <Coffee className="w-5 h-5 text-blue-600" />,
  default: <Receipt className="w-5 h-5 text-blue-600" />,
}

function getIcon(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes("dinner") || lower.includes("makan") || lower.includes("food")) return categoryIcons.food
  if (lower.includes("groceries") || lower.includes("belanja")) return categoryIcons.groceries
  if (lower.includes("movie") || lower.includes("film") || lower.includes("nonton")) return categoryIcons.movie
  if (lower.includes("coffee") || lower.includes("kopi") || lower.includes("cafe")) return categoryIcons.coffee
  return categoryIcons.default
}

export default function SplitBillPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bills, setBills] = useState<SplitBill[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchBills = async () => {
    setLoading(true)
    const { data, error } = await getSplitBills()
    if (data) setBills(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const activeBills = bills.filter(b => b.status === "active")
  const completedBills = bills.filter(b => b.status === "settled")

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val).replace('Rp', 'Rp ')
  }

  // Stats — computed from ALL bills (active + settled)
  const totalSplit = bills.reduce((sum, b) => sum + b.total_amount, 0)
  const totalLunas = bills.reduce((sum, b) => {
    // For each bill, sum up paid participant amounts
    // paid_count * per-person amount
    const perPerson = b.participant_count > 0 ? b.total_amount / (b.participant_count + 1) : 0
    return sum + (perPerson * b.paid_count)
  }, 0)
  const totalBelumLunas = bills.reduce((sum, b) => {
    const perPerson = b.participant_count > 0 ? b.total_amount / (b.participant_count + 1) : 0
    const unpaidCount = b.participant_count - b.paid_count
    return sum + (perPerson * unpaidCount)
  }, 0)

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Split Bill</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium italic">Manage shared expenses with friends easily.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 h-11 shadow-lg shadow-blue-200 w-fit"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Split
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Split</p>
          </div>
          <p className="text-xl font-bold text-blue-600">{formatRp(totalSplit)}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Collected</p>
          </div>
          <p className="text-xl font-bold text-emerald-600">{formatRp(totalLunas)}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending</p>
          </div>
          <p className="text-xl font-bold text-rose-500">{formatRp(totalBelumLunas)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin" />
          <p className="text-xs font-medium">Loading splits...</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No splits yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">Create your first split bill to start tracking shared expenses.</p>
        </div>
      ) : (
        <>
          {/* Active Splits */}
          {activeBills.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Active Splits</h2>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {activeBills.length} Ongoing
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    status="ACTIVE"
                    icon={getIcon(bill.title)}
                    formatRp={formatRp}
                    onClick={() => router.push(`/dashboard/split-bill/${bill.id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Splits */}
          {completedBills.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-400">Completed</h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {completedBills.length} Settled
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
                {completedBills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    status="SETTLED"
                    icon={getIcon(bill.title)}
                    formatRp={formatRp}
                    onClick={() => router.push(`/dashboard/split-bill/${bill.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <CreateSplitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchBills}
      />
    </div>
  )
}

function BillCard({ bill, status, icon, formatRp, onClick }: {
  bill: SplitBill
  status: string
  icon: React.ReactNode
  formatRp: (val: number) => string
  onClick: () => void
}) {
  const percentage = bill.participant_count > 0
    ? (bill.paid_count / bill.participant_count) * 100
    : 0
  const isActive = bill.status === 'active'

  return (
    <Card
      className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border-none rounded-[24px] overflow-hidden shadow-sm"
      onClick={onClick}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
            isActive ? "bg-blue-50 group-hover:bg-blue-100" : "bg-slate-50"
          )}>
            {icon}
          </div>
          <span className={cn(
            "text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider",
            isActive ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-600"
          )}>
            {status}
          </span>
        </div>
        <div className="mt-5">
          <CardTitle className="text-lg font-bold text-slate-800">{bill.title}</CardTitle>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-blue-600 font-black text-xl">{formatRp(bill.total_amount)}</span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
            {bill.participant_count + 1} PEOPLE
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex justify-between text-[10px] font-black text-slate-500 mb-2.5 uppercase">
          <span>{bill.paid_count}/{bill.participant_count} Settled</span>
          <span className={isActive ? "text-blue-600" : ""}>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              isActive ? "bg-blue-600" : "bg-emerald-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}