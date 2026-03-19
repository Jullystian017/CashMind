"use client"

import React, { useState, useEffect } from "react"
import {
  Trophy, Medal, TrendingUp, TrendingDown, Minus,
  Crown, Star, Shield, Award, Loader2, ChevronDown,
  Users, Target, Sparkles, ArrowUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getIndividualLeaderboard, getCircleLeaderboard, type LeaderboardEntry, type CircleLeaderboardEntry } from "@/app/actions/leaderboard"
import { getMyCircles } from "@/app/actions/circles"
import { useTranslation } from "@/lib/i18n/useTranslation"

type Mode = "individual" | "circle"
type Scope = "global" | "circle"

const PODIUM_CONFIG = [
  { rank: 2, height: "h-32", bg: "from-slate-200 to-slate-300", medal: "🥈", ringColor: "ring-slate-300", size: "w-16 h-16", textSize: "text-lg" },
  { rank: 1, height: "h-44", bg: "from-amber-400 to-yellow-500", medal: "🥇", ringColor: "ring-amber-400", size: "w-20 h-20", textSize: "text-xl" },
  { rank: 3, height: "h-24", bg: "from-amber-600 to-amber-700", medal: "🥉", ringColor: "ring-amber-700", size: "w-14 h-14", textSize: "text-base" },
]

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>("individual")
  const [scope, setScope] = useState<Scope>("global")
  
  const [individualEntries, setIndividualEntries] = useState<LeaderboardEntry[]>([])
  const [circleEntries, setCircleEntries] = useState<CircleLeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState(0)
  const [myCircleRanks, setMyCircleRanks] = useState<number[]>([])
  
  const [loading, setLoading] = useState(true)
  const [circles, setCircles] = useState<any[]>([])
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const circleRes = await getMyCircles()
    if (circleRes.data) setCircles(circleRes.data)

    if (mode === "individual") {
      const res = await getIndividualLeaderboard(scope, selectedCircleId || undefined)
      if (res.data) setIndividualEntries(res.data)
      setMyRank(res.myRank)
    } else {
      const res = await getCircleLeaderboard()
      if (res.data) setCircleEntries(res.data)
      setMyCircleRanks(res.myCircleRanks || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [mode, scope, selectedCircleId])

  const top3Individual = individualEntries.slice(0, 3)
  const top3Circle = circleEntries.slice(0, 3)
  
  const myEntry = individualEntries.find((e) => e.isCurrentUser)

  // Rearrange for podium: [2nd, 1st, 3rd] if 3 entries
  // If 2 entries: [2nd, 1st]. If 1 entry: [1st].
  const getPodiumOrder = (top: any[]) => {
    if (top.length === 3) return [top[1], top[0], top[2]];
    if (top.length === 2) return [top[1], top[0]];
    return top;
  };

  const podiumOrderIndividual = getPodiumOrder(top3Individual);
  const podiumOrderCircle = getPodiumOrder(top3Circle);

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
          <h2 className="text-2xl @md:text-3xl font-semibold text-gray-900 tracking-tight">{t("leaderboard.title")}</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium">{t("leaderboard.subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col @md:flex-row gap-3">
        {/* Mode Toggle: Pribadi vs Circle */}
        <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
          <button onClick={() => setMode("individual")}
            className={cn("px-5 py-2 rounded-lg text-xs font-semibold transition-all flex border border-transparent items-center gap-2",
              mode === "individual" ? "bg-white text-blue-700 shadow-sm border-gray-200" : "text-gray-500 hover:text-gray-700")}>
            <Trophy className="w-3.5 h-3.5" /> {t("leaderboard.individual")}
          </button>
          <button onClick={() => setMode("circle")}
            className={cn("px-5 py-2 rounded-lg text-xs font-semibold transition-all flex border border-transparent items-center gap-2",
              mode === "circle" ? "bg-white text-indigo-700 shadow-sm border-gray-200" : "text-gray-500 hover:text-gray-700")}>
            <Users className="w-3.5 h-3.5" /> {t("leaderboard.circle")}
          </button>
        </div>

        {/* Scope (Only for Individual) */}
        {mode === "individual" && (
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["global", "circle"] as Scope[]).map((s) => (
              <button key={s} onClick={() => { setScope(s); if (s === "global") setSelectedCircleId(null) }}
                className={cn("px-5 py-2 rounded-lg text-xs font-semibold transition-all",
                  scope === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                {s === "global" ? t("leaderboard.global") : t("leaderboard.myCircle")}
              </button>
            ))}
          </div>
        )}

        {/* Circle Selector (Only for Individual -> Circle scope) */}
        {mode === "individual" && scope === "circle" && (
          <select value={selectedCircleId || ""} onChange={(e) => setSelectedCircleId(e.target.value || null)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-blue-400 transition-all">
            <option value="">{t("leaderboard.selectCircle")}</option>
            {circles.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        )}
      </div>

      {/* Your Position Card (Individual Mode) */}
      {mode === "individual" && myEntry && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-[28px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="relative z-10 flex flex-col @md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur text-2xl font-bold">
                #{myEntry.rank}
              </div>
              <div>
                <p className="text-xs text-white/80 font-medium">{t("leaderboard.yourPosition")}</p>
                <h3 className="text-xl font-bold">{myEntry.displayName}</h3>
                <p className="text-xs text-white/80 mt-0.5">{t("leaderboard.level")} {myEntry.level} — {myEntry.title}</p>
              </div>
            </div>
            <div className="flex gap-4 @md:ml-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">{t("leaderboard.healthScore")}</p>
                <p className="text-lg font-bold">{myEntry.healthScore}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">{t("leaderboard.savingsRate")}</p>
                <p className="text-lg font-bold">{myEntry.savingsRate}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center hidden @sm:block">
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">{t("leaderboard.badges")}</p>
                <p className="text-lg font-bold">{myEntry.badgesCount}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Your Circles Position Card (Circle Mode) */}
      {mode === "circle" && myCircleRanks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-800 p-6 rounded-[28px] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="relative z-10 flex flex-col items-start gap-2">
            <p className="text-xs text-white/80 font-medium">{t("leaderboard.yourCircleRankings")}</p>
            <div className="flex flex-wrap gap-4">
               {circleEntries.filter(c => c.isYourCircle).map(c => (
                 <div key={c.circleId} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <div className="text-xl font-bold bg-white/20 w-8 h-8 flex items-center justify-center rounded-lg">#{c.rank}</div>
                    <div>
                      <h4 className="font-semibold text-sm">{c.emoji} {c.name}</h4>
                      <p className="text-[10px] text-indigo-200">{t("leaderboard.avgScore")}: {c.averageHealthScore}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium */}
      {((mode === "individual" && top3Individual.length > 0) || (mode === "circle" && top3Circle.length > 0)) && (
        <div className="flex items-end justify-center gap-4 py-8">
          {(mode === "individual" ? podiumOrderIndividual : podiumOrderCircle).map((entry: any, i) => {
            const config = PODIUM_CONFIG.find(c => c.rank === entry.rank) || PODIUM_CONFIG[1]
            const name = entry.displayName || `${entry.emoji} ${entry.name}`
            const sub = mode === "individual" ? `${t("leaderboard.level")} ${entry.level}` : `${entry.memberCount} ${t("leaderboard.members")}`
            const score = mode === "individual" ? entry.healthScore : entry.averageHealthScore

            return (
              <motion.div key={entry.rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center">
                {/* Avatar */}
                <div className={cn("rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br mb-3 ring-4 shadow-lg",
                  config.size, config.bg, config.ringColor)}>
                  <span className={config.textSize}>{mode === "individual" ? name.charAt(0) : entry.emoji}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-0.5">{name}</p>
                <p className="text-[10px] text-gray-400 mb-2">{sub}</p>
                {/* Podium Block */}
                <div className={cn("w-24 @md:w-32 rounded-t-2xl flex flex-col items-center justify-start pt-4 relative",
                  config.height,
                  entry.rank === 1 ? "bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-200/50"
                    : entry.rank === 2 ? "bg-gradient-to-b from-gray-100 to-gray-50 border border-gray-200/50"
                      : "bg-gradient-to-b from-amber-100/60 to-amber-50/40 border border-amber-200/30")}>
                  <span className="text-2xl mb-1">{config.medal}</span>
                  <span className="text-xs font-bold text-gray-700">{score}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{t("leaderboard.score")}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Score Explanation */}
      {mode === "individual" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">{t("leaderboard.howItWorks")}</h4>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100/50">
              <p className="text-xs font-bold text-emerald-700">40%</p>
              <p className="text-[10px] font-semibold text-emerald-600/80 mt-0.5 uppercase tracking-wide">{t("leaderboard.savingsRate")}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100/50">
              <p className="text-xs font-bold text-blue-700">20%</p>
              <p className="text-[10px] font-semibold text-blue-600/80 mt-0.5 uppercase tracking-wide">{t("leaderboard.budgeting")}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100/50">
              <p className="text-xs font-bold text-purple-700">20%</p>
              <p className="text-[10px] font-semibold text-purple-600/80 mt-0.5 uppercase tracking-wide">{t("leaderboard.goalAchieve")}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100/50">
              <p className="text-xs font-bold text-amber-700">20%</p>
              <p className="text-[10px] font-semibold text-amber-600/80 mt-0.5 uppercase tracking-wide">{t("leaderboard.xpActivity")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">{mode === "individual" ? t("leaderboard.userRankings") : t("leaderboard.circleRankings")}</h4>
          <span className="text-xs text-gray-400">{mode === "individual" ? individualEntries.length + ` ${t("leaderboard.users")}` : circleEntries.length + ` ${t("leaderboard.circlesPlaceholder")}`}</span>
        </div>
        
        {mode === "individual" ? (
          <div className="divide-y divide-gray-50">
            {individualEntries.map((entry, i) => (
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
                      {entry.isCurrentUser && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{t("leaderboard.you")}</span>}
                    </p>
                    <p className="text-[10px] text-gray-400">{t("leaderboard.level")} {entry.level} • {entry.title}</p>
                  </div>
                </div>

                {/* Score */}
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
            {individualEntries.length === 0 && (
              <div className="p-12 text-center text-sm text-gray-500">
                No users found.
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {circleEntries.map((entry, i) => (
              <motion.div key={entry.circleId}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={cn("flex items-center gap-4 px-5 py-3.5 transition-colors",
                  entry.isYourCircle ? "bg-indigo-50/50" : "hover:bg-gray-50")}>
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

                {/* Circle Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-lg shrink-0">
                    {entry.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", entry.isYourCircle ? "text-indigo-700" : "text-gray-900")}>
                      {entry.name}
                      {entry.isYourCircle && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">YOUR CIRCLE</span>}
                    </p>
                    <p className="text-[10px] text-gray-400">{entry.memberCount} Members Active</p>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2">
                  {trendIcon(entry.trend)}
                  <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold",
                    entry.averageHealthScore >= 70 ? "bg-green-50 text-green-700"
                      : entry.averageHealthScore >= 40 ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700")}>
                    {entry.averageHealthScore} <span className="text-[10px] font-medium opacity-70">AVG</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {circleEntries.length === 0 && (
              <div className="p-12 text-center text-sm text-gray-500">
                No circles found. Create one to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
