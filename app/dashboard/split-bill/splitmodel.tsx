"use client"

import * as React from "react"
import { useState } from "react"
import { X, UserPlus, Trash2, Loader2, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createSplitBill } from "@/app/actions/split-bill"

interface Participant {
  name: string
  amount: number
}

export function CreateSplitModal({
  isOpen,
  onClose,
  onCreated
}: {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}) {
  const [eventName, setEventName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [payer, setPayer] = useState("you")
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal")
  const [peopleCount, setPeopleCount] = useState(2) // total people including you
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", amount: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = Number(totalAmount) || 0
  const perPerson = peopleCount > 0 ? Math.floor(total / peopleCount) : 0

  // When user changes people count, sync participant array
  const handlePeopleCountChange = (count: number) => {
    const actualCount = Math.max(2, count) // at least 2 (you + 1 person)
    setPeopleCount(actualCount)
    const othersCount = actualCount - 1 // exclude "You"

    const newParticipants: Participant[] = []
    for (let i = 0; i < othersCount; i++) {
      // Preserve existing data if available
      if (i < participants.length) {
        newParticipants.push(participants[i])
      } else {
        newParticipants.push({ name: `Orang ${i + 1}`, amount: 0 })
      }
    }
    setParticipants(newParticipants)
  }

  const updateParticipantName = (index: number, name: string) => {
    const updated = [...participants]
    updated[index] = { ...updated[index], name }
    setParticipants(updated)
  }

  const updateParticipantAmount = (index: number, amount: number) => {
    const updated = [...participants]
    updated[index] = { ...updated[index], amount }
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventName.trim() || total <= 0) return
    if (participants.length === 0) return

    setIsSubmitting(true)

    const data = {
      title: eventName.trim(),
      totalAmount: total,
      payer,
      participants: participants.map(p => ({
        name: p.name.trim() || "Tanpa Nama",
        amount: splitMode === "equal" ? perPerson : p.amount
      }))
    }

    const { error } = await createSplitBill(data)

    setIsSubmitting(false)

    if (!error) {
      // Reset form
      setEventName("")
      setTotalAmount("")
      setPayer("you")
      setPeopleCount(2)
      setParticipants([{ name: "", amount: 0 }])
      onClose()
      onCreated?.()
    }
  }

  if (!isOpen) return null

  const yourShare = splitMode === "equal" ? perPerson : total - participants.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[520px]"
      >
        <Card className="bg-white shadow-2xl rounded-[24px] overflow-hidden border-none flex flex-col max-h-[85vh]">
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">

            {/* Header */}
            <div className="px-8 pt-8 pb-5 shrink-0 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Split</h2>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

              {/* Event Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700">Event Name</label>
                <Input
                  required
                  placeholder="e.g. Dinner at Cafe"
                  className="h-12 border-gray-200 rounded-xl focus-visible:ring-blue-600/20"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              {/* Amount, People, Payer */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700">Total Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                    <Input
                      required
                      type="number"
                      placeholder="0"
                      className="h-12 pl-10 border-gray-200 rounded-xl"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700">People</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      min={2}
                      max={100}
                      className="h-12 pl-10 border-gray-200 rounded-xl"
                      value={peopleCount}
                      onChange={(e) => handlePeopleCountChange(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-700">Paid by</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl h-12 border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setPayer("you")}
                      className={`flex-1 rounded-lg text-sm font-bold transition-all ${payer === "you" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                    >
                      You
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayer("friend")}
                      className={`flex-1 rounded-lg text-sm font-bold transition-all ${payer === "friend" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Friend
                    </button>
                  </div>
                </div>
              </div>

              {/* Per-person preview */}
              {total > 0 && splitMode === "equal" && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-5 py-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600">Per person</span>
                  <span className="text-sm font-bold text-blue-700">Rp {perPerson.toLocaleString('id-ID')}</span>
                </div>
              )}

              {/* Split Mode & Participants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">Participants ({participants.length})</label>
                  <div className="flex bg-gray-50 p-1 rounded-lg text-[10px] font-bold border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setSplitMode("equal")}
                      className={`px-3 py-1 rounded transition-all ${splitMode === "equal" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Equal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode("custom")}
                      className={`px-3 py-1 rounded transition-all ${splitMode === "custom" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {/* You (always shown) */}
                  <div className="flex items-center justify-between p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        Y
                      </div>
                      <p className="text-sm font-bold text-gray-900">You</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {total > 0 ? `Rp ${yourShare.toLocaleString('id-ID')}` : "-"}
                    </span>
                  </div>

                  {/* Other Participants */}
                  {participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3.5 bg-white border border-gray-100 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          placeholder={`Person ${i + 1}`}
                          className="h-8 border-gray-200 rounded-lg text-sm"
                          value={p.name}
                          onChange={(e) => updateParticipantName(i, e.target.value)}
                        />
                      </div>
                      {splitMode === "custom" ? (
                        <div className="w-28 shrink-0">
                          <Input
                            type="number"
                            placeholder="Amount"
                            className="h-8 border-gray-200 rounded-lg text-sm"
                            value={p.amount || ""}
                            onChange={(e) => updateParticipantAmount(i, Number(e.target.value))}
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 shrink-0 w-24 text-right">
                          {total > 0 ? `Rp ${perPerson.toLocaleString('id-ID')}` : "-"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {total > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total bill</span>
                    <span className="font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Split between {peopleCount} people</span>
                    <span className="font-bold text-gray-900">Rp {perPerson.toLocaleString('id-ID')} / person</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-1">
                    <span className="text-sm font-bold text-gray-900">Your share</span>
                    <span className="text-lg font-black text-blue-600">Rp {yourShare.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 flex items-center justify-between shrink-0 bg-white">
              <button type="button" onClick={onClose} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isSubmitting || !eventName.trim() || total <= 0}
                className="h-11 px-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Split"
                )}
              </Button>
            </div>

          </form>
        </Card>
      </motion.div>
    </div>
  )
}