"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Pastikan import ini ada
import { Plus, Utensils, ShoppingCart, Film, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { CreateSplitModal } from "./splitmodel"

// Mock Data dengan tambahan ID untuk navigasi
const ActiveBill = [
  {
    id: "dinner-mcd",
    title: "Dinner McD",
    cost: "240.000",
    people: "4",
    paidCount: 2,
    totalCount: 4,
    icon: <Utensils className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "groceries",
    title: "Groceries",
    cost: "500.000",
    people: "2",
    paidCount: 1,
    totalCount: 2,
    icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
  }
]

const CompleteBill = [
  {
    id: "movie-night",
    title: "Movie Night",
    cost: "150.000",
    people: "3",
    paidCount: 3,
    totalCount: 3,
    icon: <Film className="w-5 h-5 text-gray-500" />,
  }
]

export default function SplitBillPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter() // Inisialisasi router

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Split Bill</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Welcome back, Alex. Here's what's happening.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 h-11 shadow-lg shadow-blue-200 w-fit"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Split
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total balance" amount="Rp 1.250.000" color="text-blue-600" />
        <StatCard title="You are owed" amount="Rp 850.000" color="text-emerald-600" />
        <StatCard title="You owe" amount="Rp 400.000" color="text-rose-500" />
      </div>

      {/* Active Splits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Active Splits</h2>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
            2 Ongoing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ActiveBill.map((bill, index) => (
            <BillCard
              key={index}
              bill={bill}
              status="ACTIVE"
              onClick={() => router.push(`/dashboard/split-bill/${bill.id}`)} // Navigasi yang benar
            />
          ))}
        </div>
      </section>

      {/* Completed Splits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-slate-400">Completed Splits</h2>
          <Button variant="link" className="text-blue-600 text-xs font-bold p-0">
            View All History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
          {CompleteBill.map((bill, index) => (
            <BillCard
              key={index}
              bill={bill}
              status="SETTLED"
              onClick={() => router.push(`/dashboard/split-bill/${bill.id}`)}
            />
          ))}
        </div>
      </section>

      <CreateSplitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function StatCard({ title, amount, color }: { title: string, amount: string, color: string }) {
  return (
    <Card className="bg-white border-none shadow-sm rounded-2xl">
      <CardHeader className="px-6 py-5">
        <CardDescription className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
          {title}
        </CardDescription>
        <CardTitle className={`text-2xl font-black ${color}`}>{amount}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function BillCard({ bill, status, onClick }: { bill: any, status: 'ACTIVE' | 'SETTLED', onClick: () => void }) {
  const percentage = (bill.paidCount / bill.totalCount) * 100
  const isActive = status === 'ACTIVE'

  return (
    <Card
      className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border-none rounded-[24px] overflow-hidden shadow-sm"
      onClick={onClick}
    >
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-50'}`}>
            {bill.icon}
          </div>
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider ${isActive ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
            {status}
          </span>
        </div>
        <div className="mt-5">
          <CardTitle className="text-lg font-bold text-slate-800">{bill.title}</CardTitle>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-blue-600 font-black text-xl">Rp {bill.cost}</span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{bill.people} PEOPLE INVOLVED</p>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="flex justify-between text-[10px] font-black text-slate-500 mb-2.5 uppercase">
          <span>{bill.paidCount}/{bill.totalCount} Settle up</span>
          <span className={isActive ? "text-blue-600" : ""}>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}