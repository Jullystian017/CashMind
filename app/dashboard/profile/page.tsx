"use client"

import { useState, useEffect, useRef } from "react"
import { User, Mail, Calendar, Trophy, Target, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getProfile } from "@/app/actions/profile"
import type { Profile } from "@/app/actions/profile"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    getProfile().then(({ data }) => {
      if (mounted.current && data) setProfile(data)
    })
    return () => { mounted.current = false }
  }, [])
  const memberSince = "January 2026"
  const stats = [
    { label: "Challenges completed", value: "12", icon: Trophy },
    { label: "Active goals", value: "2", icon: Target },
  ]

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Profile</h2>
        <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium">Your account overview</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center shrink-0">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900">{profile?.display_name ?? profile?.email?.split("@")[0] ?? "User"}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                {profile?.email ?? "—"}
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-2 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                Member since {memberSince}
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Edit profile
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pt-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
      >
        <h4 className="font-bold text-gray-900 mb-4">Quick links</h4>
        <div className="space-y-2">
          {[
            { label: "Settings & preferences", href: "/dashboard/settings" },
            { label: "Transactions", href: "/dashboard/transactions" },
            { label: "Challenges", href: "/dashboard/challenges" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{link.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
