"use client"

import React, { useState, useEffect } from "react"
import {
  Trophy, Medal, TrendingUp, TrendingDown, Minus,
  Crown, Star, Shield, Award, Loader2, ChevronDown,
  Users, Target, Sparkles, ArrowUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getLeaderboard, type LeaderboardEntry } from "@/app/actions/leaderboard"
import { getMyCircles } from "@/app/actions/circles"

type TimeRange = "week" | "month" | "all"
type Scope = "global" | "circle"

const PODIUM_CONFIG = [
  { rank: 2, height: "h-32", bg: "from-slate-200 to-slate-300", medal: "🥈", ringColor: "ring-slate-300", size: "w-16 h-16", textSize: "text-lg" },
  { rank: 1, height: "h-44", bg: "from-amber-400 to-yellow-500", medal: "🥇", ringColor: "ring-amber-400", size: "w-20 h-20", textSize: "text-xl" },
  { rank: 3, height: "h-24", bg: "from-amber-600 to-amber-700", medal: "🥉", ringColor: "ring-amber-700", size: "w-14 h-14", textSize: "text-base" },
]

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState(0)
  const [loading, setLoading] = useState(true)
  const [scope, setScope] = useState<Scope>("global")
  const [timeRange, setTimeRange] = useState<TimeRange>("month")
  const [circles, setCircles] = useState<any[]>([])
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const [lbRes, circleRes] = await Promise.all([
      getLeaderboard(scope, timeRange, selectedCircleId || undefined),
      getMyCircles()
    ])
    if (lbRes.data) setEntries(lbRes.data)
    setMyRank(lbRes.myRank)
    if (circleRes.data) setCircles(circleRes.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [scope, timeRange, selectedCircleId])

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  const myEntry = entries.find((e) => e.isCurrentUser)

  // Rearrange for podium: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3

  const trendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />
    if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />
    return <Minus className="w-3.5 h-3.5 text-gray-400" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24 @container" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-semibold text-gray-900 tracking-tight">Leaderboard</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium">Financial Health Score — ranked by what truly matters</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col @md:flex-row gap-3">
        {/* Scope */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["global", "circle"] as Scope[]).map((s) => (
            <button key={s} onClick={() => { setScope(s); if (s === "global") setSelectedCircleId(null) }}
              className={cn("px-5 py-2 rounded-lg text-xs font-semibold transition-all",
                scope === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              {s === "global" ? "Global" : "My Circle"}
            </button>
          ))}
        </div>

        {/* Circle Selector */}
        {scope === "circle" && (
          <select value={selectedCircleId || ""} onChange={(e) => setSelectedCircleId(e.target.value || null)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-blue-400 transition-all">
            <option value="">Select Circle</option>
            {circles.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        )}

        {/* Time Range */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["week", "month", "all"] as TimeRange[]).map((t) => (
            <button key={t} onClick={() => setTimeRange(t)}
              className={cn("px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                timeRange === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              {t === "week" ? "This Week" : t === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Your Position Card */}
      {myEntry && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-[28px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="relative z-10 flex flex-col @md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur text-2xl font-bold">
                #{myEntry.rank}
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium">Your Position</p>
                <h3 className="text-xl font-bold">{myEntry.displayName}</h3>
                <p className="text-xs text-white/60 mt-0.5">Level {myEntry.level} — {myEntry.title}</p>
              </div>
            </div>
            <div className="flex gap-4 @md:ml-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-white/50 font-medium">Health Score</p>
                <p className="text-lg font-bold">{myEntry.healthScore}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-white/50 font-medium">Savings Rate</p>
                <p className="text-lg font-bold">{myEntry.savingsRate}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-white/50 font-medium">Badges</p>
                <p className="text-lg font-bold">{myEntry.badgesCount}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-8">
          {podiumOrder.map((entry, i) => {
            const config = PODIUM_CONFIG[i]
            return (
              <motion.div key={entry.rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center">
                {/* Avatar */}
                <div className={cn("rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br mb-3 ring-4 shadow-lg",
                  config.size, config.bg, config.ringColor)}>
                  <span className={config.textSize}>{entry.displayName.charAt(0)}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-0.5">{entry.displayName}</p>
                <p className="text-[10px] text-gray-400 mb-2">Level {entry.level}</p>
                {/* Podium Block */}
                <div className={cn("w-24 @md:w-32 rounded-t-2xl flex flex-col items-center justify-start pt-4 relative",
                  config.height,
                  i === 1 ? "bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-200/50"
                    : i === 0 ? "bg-gradient-to-b from-gray-100 to-gray-50 border border-gray-200/50"
                      : "bg-gradient-to-b from-amber-100/60 to-amber-50/40 border border-amber-200/30")}>
                  <span className="text-2xl mb-1">{config.medal}</span>
                  <span className="text-xs font-bold text-gray-700">{entry.healthScore}</span>
                  <span className="text-[9px] text-gray-400 font-medium">Health Score</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Score Explanation */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-gray-900">How Financial Health Score Works</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-blue-700">40%</p>
            <p className="text-[10px] text-blue-500 mt-0.5">Savings Rate</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-indigo-700">30%</p>
            <p className="text-[10px] text-indigo-500 mt-0.5">Consistency</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-purple-700">30%</p>
            <p className="text-[10px] text-purple-500 mt-0.5">Goal Achievement</p>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">Full Rankings</h4>
          <span className="text-xs text-gray-400">{entries.length} users</span>
        </div>
        <div className="divide-y divide-gray-50">
          {entries.map((entry, i) => (
            <motion.div key={entry.userId}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={cn("flex items-center gap-4 px-5 py-3.5 transition-colors",
                entry.isCurrentUser ? "bg-blue-50/50" : "hover:bg-gray-50")}>
              {/* Rank */}
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                entry.rank === 1 ? "bg-amber-100 text-amber-700"
                  : entry.rank === 2 ? "bg-gray-100 text-gray-700"
                    : entry.rank === 3 ? "bg-amber-50 text-amber-600"
                      : "bg-gray-50 text-gray-400")}>
                {entry.rank <= 3 ? (
                  <span className="text-sm">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
                ) : entry.rank}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0",
                  entry.isCurrentUser ? "bg-blue-600" : "bg-gray-300")}>
                  {entry.displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold truncate", entry.isCurrentUser ? "text-blue-700" : "text-gray-900")}>
                    {entry.displayName}
                    {entry.isCurrentUser && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                  </p>
                  <p className="text-[10px] text-gray-400">Level {entry.level} • {entry.title}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden @md:flex items-center gap-6">
                <div className="text-center w-16">
                  <p className="text-xs font-bold text-gray-900">{entry.savingsRate}%</p>
                  <p className="text-[9px] text-gray-400">Savings</p>
                </div>
                <div className="text-center w-16">
                  <p className="text-xs font-bold text-gray-900">{entry.challengesCompleted}</p>
                  <p className="text-[9px] text-gray-400">Challenges</p>
                </div>
                <div className="text-center w-16">
                  <p className="text-xs font-bold text-gray-900">{entry.badgesCount}</p>
                  <p className="text-[9px] text-gray-400">Badges</p>
                </div>
              </div>

              {/* Health Score */}
              <div className="flex items-center gap-2">
                {trendIcon(entry.trend)}
                <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold",
                  entry.healthScore >= 70 ? "bg-green-50 text-green-700"
                    : entry.healthScore >= 40 ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700")}>
                  {entry.healthScore}
                </div>
              </div>
            </motion.div>
          ))}

          {entries.length === 0 && (
            <div className="p-12 text-center text-sm text-gray-500">
              No data available. Start tracking your finances to appear on the leaderboard.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
