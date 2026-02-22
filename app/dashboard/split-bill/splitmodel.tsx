"use client"

import * as React from "react"
import { useState } from "react"
import { X, UserPlus, Check } from "lucide-react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function CreateSplitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // 1. Form State untuk pengiriman ke DB
  const [formData, setFormData] = useState({
    eventName: "",
    totalAmount: "",
    payer: "you",
  })

  // 2. Fix Hydration Error: Gunakan state untuk menampung elemen scroll
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  // 3. Logic Scroll (Hanya jalan jika container sudah terdeteksi/hydrated)
  const { scrollYProgress } = useScroll({
    container: container ? { current: container } : undefined,
  })

  // Spring membuat animasi garis biru terasa "kenyal" dan halus
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  // Transformasi lebar garis biru antar step
  const line1Width = useTransform(smoothProgress, [0, 0.45], ["0%", "100%"])
  const line2Width = useTransform(smoothProgress, [0.55, 0.9], ["0%", "100%"])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Data siap dikirim ke DB:", formData)
    alert("Split Bill Created!")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[560px]"
      >
        <Card className="bg-white shadow-2xl rounded-[24px] overflow-hidden border-none flex flex-col max-h-[90vh]">
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            
            {/* --- HEADER --- */}
            <div className="px-8 pt-8 pb-4 shrink-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Create New Split</h2>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stepper (Mirip Gambar Ref) */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-50">
                <StepItem number={1} label="DETAILS" active />
                <div className="h-[2px] flex-1 mx-4 bg-slate-100 relative overflow-hidden">
                  <motion.div className="absolute inset-0 bg-blue-600 origin-left" style={{ width: line1Width }} />
                </div>
                <StepItem number={2} label="PARTICIPANTS" scrollProgress={smoothProgress} range={[0.4, 0.6]} />
                <div className="h-[2px] flex-1 mx-4 bg-slate-100 relative overflow-hidden">
                  <motion.div className="absolute inset-0 bg-blue-600 origin-left" style={{ width: line2Width }} />
                </div>
                <StepItem number={3} label="SUMMARY" scrollProgress={smoothProgress} range={[0.85, 1]} />
              </div>
            </div>

            {/* --- SCROLLABLE CONTENT (Hydration Safe) --- */}
            <div 
              ref={setContainer} // Fungsi ini memperbaiki error "ref not hydrated"
              className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar scroll-smooth"
            >
              
              {/* STEP 1: DETAILS */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-700">Event Name</label>
                  <Input 
                    required
                    placeholder="e.g. Dinner at Nongkrong Cafe" 
                    className="h-12 border-slate-200 rounded-lg focus-visible:ring-blue-600/20"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Total Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rp</span>
                      <Input 
                        required
                        type="number"
                        placeholder="0" 
                        className="h-12 pl-12 border-slate-200 rounded-lg"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* WHO PAID TOGGLE (Radio Group Concept) */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-700">Who paid?</label>
                    <div className="flex bg-slate-50 p-1 rounded-lg h-12 border border-slate-100">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, payer: "you"})}
                        className={`flex-1 rounded-md text-sm font-bold transition-all ${formData.payer === "you" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                      >
                        You
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, payer: "friend"})}
                        className={`flex-1 rounded-md text-sm font-bold transition-all ${formData.payer === "friend" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                      >
                        Friend
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* STEP 2: PARTICIPANTS */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Step 2: Participants</h3>
                  <div className="flex bg-slate-50 p-1 rounded-md text-[10px] font-bold border border-slate-100">
                    <span className="px-3 py-1 bg-white text-blue-600 rounded shadow-sm">Equal</span>
                    <span className="px-3 py-1 text-slate-400">Custom</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <ParticipantItem name="Sarah Jenkins" email="sarah@email.com" amount={`Rp ${(Number(formData.totalAmount)/3).toLocaleString()}`} />
                  <ParticipantItem name="Marcus Wright" email="marcus.w@email.com" amount={`Rp ${(Number(formData.totalAmount)/3).toLocaleString()}`} />
                  
                  <button type="button" className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 transition-all">
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm font-bold">Add Participant</span>
                  </button>
                </div>
              </section>

              {/* STEP 3: SUMMARY */}
              <section className="space-y-4 pb-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 space-y-4">
                  <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">Step 3: Summary</h4>
                  <div className="space-y-3">
                    <SummaryRow label="Sarah Jenkins owes you" value={`Rp ${(Number(formData.totalAmount)/3).toLocaleString()}`} />
                    <SummaryRow label="Marcus Wright owes you" value={`Rp ${(Number(formData.totalAmount)/3).toLocaleString()}`} />
                    <div className="flex justify-between items-center pt-2 border-t border-blue-100/50 mt-1">
                      <span className="text-sm font-bold text-slate-900">Total you will receive</span>
                      <span className="text-lg font-black text-blue-600">Rp {((Number(formData.totalAmount)/3)*2).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-8 border-t border-slate-50 flex items-center justify-between shrink-0 bg-white">
              <button type="button" onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Cancel
              </button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-11 px-8 rounded-lg font-bold border-slate-200">Back</Button>
                <Button type="submit" className="h-11 px-8 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
                  Create Split
                </Button>
              </div>
            </div>

          </form>
        </Card>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function StepItem({ number, label, active, scrollProgress, range }: any) {
  const circleColor = scrollProgress ? useTransform(scrollProgress, range, ["#F1F5F9", "#2563EB"]) : (active ? "#2563EB" : "#F1F5F9")
  const textColor = scrollProgress ? useTransform(scrollProgress, range, ["#94A3B8", "#2563EB"]) : (active ? "#2563EB" : "#94A3B8")

  return (
    <div className="flex items-center gap-2">
      <motion.div 
        style={{ backgroundColor: circleColor }}
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
      >
        {number}
      </motion.div>
      <motion.span style={{ color: textColor }} className="text-[10px] font-bold tracking-wider">{label}</motion.span>
    </div>
  )
}

function ParticipantItem({ name, email, amount }: { name: string; email: string; amount: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-100 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">{name}</p>
          <p className="text-[11px] text-slate-400 mt-1">{email}</p>
        </div>
      </div>
      <span className="text-sm font-bold text-blue-600">{amount}</span>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  )
}