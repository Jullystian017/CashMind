"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ChevronLeft, 
  Share2, 
  CheckCircle2, 
  Info, 
  Download, 
  MoreHorizontal,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SplitDetailsPage() {
  const router = useRouter()
  const params = useParams()
  
  // Menangkap ID dari URL (Contoh: dinner-mcd)
  const id = params.id as string
  const displayTitle = id ? id.replace(/-/g, ' ') : "Split Details"

  // Data ini nantinya bisa kamu ambil dari database berdasarkan 'id'
  const participants = [
    { name: "Andi", email: "andi@example.com", amount: "Rp 60.000", status: "Unpaid" },
    { name: "Budi", email: "budi@example.com", amount: "Rp 60.000", status: "Paid" },
    { name: "Citra", email: "citra@example.com", amount: "Rp 60.000", status: "Unpaid" },
    { name: "You (Owner)", email: "alex@example.com", amount: "Rp 60.000", status: "Paid", isOwner: true },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
      {/* --- TOP NAVIGATION --- */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all tracking-[0.2em] mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          BACK TO DASHBOARD
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Badge className="bg-blue-600 hover:bg-blue-600 text-[9px] font-black px-2 rounded-md uppercase">Active</Badge>
               <span className="text-[11px] font-bold text-slate-400">ID: {id}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tight">
              {displayTitle}
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-2">
              Created on Feb 21, 2026 • Last updated 2 hours ago
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-slate-200 bg-white font-bold text-slate-600 h-12 w-12 p-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-12 flex gap-2 font-black shadow-xl shadow-blue-100 transition-all active:scale-[0.95]">
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-8">
        
        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailStatCard label="Total Amount" value="Rp 240.000" />
          
          <Card className="p-7 border-none shadow-sm rounded-[32px] bg-white flex flex-col justify-between h-40">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">4 People</span>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-[3px] border-white bg-blue-600 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                  YOU
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-7 border-none shadow-sm rounded-[32px] bg-white flex flex-col justify-between h-40">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-slate-900">2/4 <span className="text-sm text-slate-400 font-bold tracking-normal">Paid</span></span>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">50%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-1/2 rounded-full transition-all duration-1000" />
              </div>
            </div>
          </Card>
        </div>

        {/* --- TABLE SECTION --- */}
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-xl">
                  <History className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-extrabold text-slate-900 text-lg">Participant Tracking</h3>
            </div>
            <button className="text-xs font-black text-blue-600 hover:underline tracking-tight">MARK ALL AS PAID</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  <th className="px-10 py-5">Participant Name</th>
                  <th className="px-10 py-5">Amount</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {participants.map((person, idx) => (
                  <tr key={idx} className={`group transition-colors ${person.isOwner ? 'bg-blue-50/20' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          person.isOwner ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-slate-900">{person.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium tracking-tight">{person.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-slate-700">{person.amount}</td>
                    <td className="px-10 py-6">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black border-2 ${
                        person.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" 
                        : "bg-orange-50 text-orange-600 border-orange-100/50"
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2.5 ${person.status === "Paid" ? "bg-emerald-500" : "bg-orange-500 animate-pulse"}`} />
                        {person.status.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {person.status === "Paid" ? (
                        <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : person.isOwner ? (
                        <span className="text-[10px] font-bold text-slate-300">ADMIN</span>
                      ) : (
                        <Button className="bg-white hover:bg-blue-600 border-2 border-blue-600 text-blue-600 hover:text-white text-[10px] font-black h-10 px-5 rounded-2xl transition-all shadow-sm">
                          Confirm Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* --- INFO BOX --- */}
        <div className="bg-slate-900 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="flex gap-5 relative z-10">
            <div className="bg-white/10 p-3 h-fit rounded-2xl backdrop-blur-md">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Audit Tracking</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                Every status update is logged manually. This platform does not handle direct bank transfers. Confirm with your bank before settling up.
              </p>
            </div>
          </div>
          <Button variant="outline" className="relative z-10 bg-transparent hover:bg-white/10 border-white/20 text-white font-bold text-xs flex gap-2 rounded-2xl px-8 h-14 transition-all">
            <Download className="w-4 h-4" />
            Download Summary PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

function DetailStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-7 border-none shadow-sm rounded-[32px] flex flex-col justify-between h-40 bg-white">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
    </Card>
  )
}