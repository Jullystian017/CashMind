"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Utensils, Trophy, Target, Star, X, Loader2, Ban, Car, ShoppingBag, Gamepad2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getChallengeTemplates,
  getUserChallenges,
  acceptChallenge,
  completeChallenge,
  cancelChallenge,
  getUserBadges,
  getUserXpAndLevel,
  type ChallengeTemplate,
  type UserBadge,
} from "@/app/actions/challenges";

type Tab = "active" | "completed" | "badges";

// Map category to icon
const categoryIcons: Record<string, any> = {
  "Food & Drinks": Utensils,
  "Transport": Car,
  "Shopping": ShoppingBag,
  "Entertainment": Gamepad2,
  "Utilities": Zap,
};

const difficultyColors: Record<string, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-orange-600 bg-orange-50",
  HARD: "text-red-600 bg-red-50",
};

const formatRp = (val: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
    .format(val)
    .replace("Rp", "Rp ");

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  const [failedChallenges, setFailedChallenges] = useState<any[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [xpData, setXpData] = useState<{ totalXp: number; level: number; title: string; xpForNext: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAll = async () => {
    setLoading(true);
    const [tplRes, ucRes, badgeRes, xpRes] = await Promise.all([
      getChallengeTemplates(),
      getUserChallenges(),
      getUserBadges(),
      getUserXpAndLevel(),
    ]);
    if (tplRes.data) setTemplates(tplRes.data);
    if (ucRes.data) {
      setActiveChallenges(ucRes.data.active);
      setCompletedChallenges(ucRes.data.completed);
      setFailedChallenges(ucRes.data.failed);
    }
    if (badgeRes.data) setBadges(badgeRes.data);
    if (xpRes.data) setXpData(xpRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAccept = async (templateId: string) => {
    const { error } = await acceptChallenge(templateId);
    if (error) {
      showToast(`❌ ${error}`);
    } else {
      showToast("✅ Challenge accepted!");
      await fetchAll();
    }
  };

  const handleComplete = async (challengeId: string) => {
    const { error, badgesEarned } = await completeChallenge(challengeId);
    if (error) {
      showToast(`❌ ${error}`);
    } else {
      let msg = "🎉 Challenge completed!";
      if (badgesEarned && badgesEarned.length > 0) {
        msg += ` + Badge: ${badgesEarned.join(", ")}`;
      }
      showToast(msg);
      setSelectedChallenge(null);
      await fetchAll();
    }
  };

  const handleCancel = async (challengeId: string) => {
    const { error } = await cancelChallenge(challengeId);
    if (error) {
      showToast(`❌ ${error}`);
    } else {
      showToast("Challenge cancelled.");
      setSelectedChallenge(null);
      await fetchAll();
    }
  };

  const isTemplateActive = (templateId: string) =>
    activeChallenges.some((ac: any) => ac.template_id === templateId);

  const levelProgress = xpData ? Math.min(100, Math.round((xpData.totalXp / xpData.xpForNext) * 100)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
      {/* Header */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">CashMind Challenges</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Level up your financial habits with fun challenges.</p>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100 shrink-0">
          <Trophy className="text-blue-600 w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Level {xpData?.level ?? 1} – {xpData?.title ?? "Beginner Saver"}
              </h3>
              <p className="text-xs text-slate-400">
                {activeChallenges.length} Active Challenge{activeChallenges.length !== 1 ? "s" : ""} • {badges.length} Badge{badges.length !== 1 ? "s" : ""} Earned
              </p>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {xpData?.totalXp ?? 0} <span className="text-slate-400 font-normal">/ {xpData?.xpForNext ?? 200} XP</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
          <p className="text-[10px] text-right text-slate-400 mt-1">
            {(xpData?.xpForNext ?? 200) - (xpData?.totalXp ?? 0)} XP to Level {(xpData?.level ?? 1) + 1}
          </p>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-purple-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Sparkles className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Mindy AI Personalized Challenge</h4>
            <p className="text-sm text-slate-600 max-w-md">Generate challenges based on your spending behavior.</p>
          </div>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-full px-6 py-2.5 text-sm font-bold shrink-0 active:scale-[0.98]"
        >
          Generate Challenge
        </button>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-6 border-b border-slate-200">
          {(["active", "completed", "badges"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-bold pb-3 border-b-2 transition-colors capitalize ${tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              {t} {t === "active" && activeChallenges.length > 0 && (
                <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black">{activeChallenges.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Active Tab */}
        {tab === "active" && (
          <>
            {/* Available Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => {
                const Icon = categoryIcons[tpl.category] || Target;
                const isActive = isTemplateActive(tpl.id);
                return (
                  <motion.div
                    key={tpl.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedChallenge({ type: "template", ...tpl })}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between h-full bg-white relative cursor-pointer hover:shadow-lg active:scale-[0.99] ${tpl.is_recommended ? "ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-100" : "border-slate-100 shadow-sm"
                      }`}
                  >
                    {tpl.is_recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest shadow-md">
                        RECOMMENDED
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md tracking-wider ${difficultyColors[tpl.difficulty]}`}>{tpl.difficulty}</span>
                        <span className="text-blue-600 text-[11px] font-bold flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> +{tpl.xp_reward} XP
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base leading-tight mb-4">{tpl.title}</h4>
                      <div className="space-y-2 text-slate-500 text-[11px] font-medium">
                        <p className="flex items-center gap-2">
                          <Target size={14} className="text-slate-400" /> {tpl.limit_amount > 0 ? `Max ${formatRp(tpl.limit_amount)}` : "Zero spending"}
                        </p>
                        <p className="flex items-center gap-2">
                          <span>🕒</span> {tpl.duration_days} days duration
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAccept(tpl.id); }}
                      disabled={isActive}
                      className={`w-full mt-6 py-2.5 rounded-2xl border-2 text-xs font-bold transition-all ${isActive
                        ? "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
                        : "border-slate-100 text-slate-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                        }`}
                    >
                      {isActive ? "Already Active" : "Accept Challenge"}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Active Tracking */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-800">Active Tracking</h3>
              {activeChallenges.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <p className="text-slate-500 text-sm">No active challenges. Accept a challenge above to start!</p>
                </div>
              ) : (
                activeChallenges.map((ac: any) => {
                  const Icon = categoryIcons[ac.template?.category] || Target;
                  const progressColor = ac.consumedPercent >= 80 ? "bg-red-500" : ac.consumedPercent >= 50 ? "bg-orange-500" : "bg-blue-600";
                  return (
                    <motion.div
                      key={ac.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-200 transition-colors cursor-pointer"
                      onClick={() => setSelectedChallenge({ type: "active", ...ac })}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="p-4 bg-orange-50 rounded-2xl shrink-0">
                          <Icon className="text-orange-500 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{ac.template?.title}</h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>🕒</span> {ac.daysLeft} day{ac.daysLeft !== 1 ? "s" : ""} left
                            {ac.consumedPercent >= 80 && <span className="ml-2 text-red-500 font-bold">⚠️ AT RISK</span>}
                          </p>
                          <div className="mt-3 max-w-xs">
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className={`${progressColor} h-2 rounded-full transition-all`} style={{ width: `${ac.consumedPercent}%` }} />
                            </div>
                            <div className="flex justify-between mt-2 text-[9px] font-bold tracking-wider">
                              <span className="text-orange-500 uppercase">{ac.consumedPercent}% CONSUMED</span>
                              <span className="text-slate-400 uppercase font-medium">{formatRp(ac.remaining)} REMAINING</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">{formatRp(ac.spent)}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Limit: {formatRp(ac.template?.limit_amount ?? 0)}</p>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCancel(ac.id)}
                            className="px-4 py-2 rounded-full border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleComplete(ac.id)}
                            className="px-5 py-2 rounded-full bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Completed Tab */}
        {tab === "completed" && (
          <div className="space-y-4">
            {completedChallenges.length === 0 && failedChallenges.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-500 text-sm">No completed or failed challenges yet.</p>
              </div>
            ) : (
              <>
                {completedChallenges.map((ch: any) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">{ch.template?.title}</h4>
                      <span className="text-blue-600 text-xs font-bold flex items-center gap-1 mt-1">
                        <Star size={12} fill="currentColor" /> +{ch.xp_earned} XP earned
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">DONE</span>
                  </motion.div>
                ))}
                {failedChallenges.map((ch: any) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl border border-red-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">{ch.template?.title}</h4>
                      <span className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                        <Ban size={12} /> {ch.failure_reason === "over_spending" ? "Over spending limit" : ch.failure_reason === "user_cancelled" ? "Cancelled" : "Time expired"}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      {ch.status === "cancelled" ? "CANCELLED" : "FAILED"}
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {tab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-500 text-sm">No badges earned yet. Complete challenges to earn badges!</p>
              </div>
            ) : (
              badges.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div className="text-3xl">{b.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-800">{b.name}</h4>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChallenge(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10"
            >
              <button onClick={() => setSelectedChallenge(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Target className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${difficultyColors[selectedChallenge.difficulty] || ""}`}>
                    {selectedChallenge.difficulty}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedChallenge.title || selectedChallenge.template?.title}</h3>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Target size={16} />
                  {(selectedChallenge.limit_amount ?? selectedChallenge.template?.limit_amount ?? 0) > 0
                    ? `Max ${formatRp(selectedChallenge.limit_amount ?? selectedChallenge.template?.limit_amount)}`
                    : "Zero spending"}
                </p>
                <p className="flex items-center gap-2">🕒 {selectedChallenge.duration_days ?? selectedChallenge.template?.duration_days} days</p>
                <p className="flex items-center gap-2">
                  <Star size={16} className="text-blue-500" fill="currentColor" />
                  +{selectedChallenge.xp_reward ?? selectedChallenge.template?.xp_reward} XP reward
                </p>
                {selectedChallenge.type === "active" && (
                  <div className="pt-3 border-t space-y-1">
                    <p className="font-medium">Progress: {selectedChallenge.consumedPercent ?? 0}% consumed</p>
                    <p className="text-xs text-slate-500">Spent: {formatRp(selectedChallenge.spent ?? 0)} / {formatRp(selectedChallenge.template?.limit_amount ?? 0)}</p>
                    <p className="text-xs text-slate-500">{selectedChallenge.daysLeft} day{selectedChallenge.daysLeft !== 1 ? "s" : ""} left</p>
                  </div>
                )}
                {selectedChallenge.description && (
                  <p className="text-xs text-slate-400 italic pt-2">{selectedChallenge.description}</p>
                )}
              </div>

              <div className="flex gap-3">
                {selectedChallenge.type === "template" && !isTemplateActive(selectedChallenge.id) && (
                  <button
                    onClick={() => { handleAccept(selectedChallenge.id); setSelectedChallenge(null); }}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Accept Challenge
                  </button>
                )}
                {selectedChallenge.type === "active" && (
                  <>
                    <button
                      onClick={() => handleCancel(selectedChallenge.id)}
                      className="flex-1 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleComplete(selectedChallenge.id)}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                    >
                      Complete
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedChallenge(null)} className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generate Modal */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGenerateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Generate AI Challenge</h3>
                <button onClick={() => setIsGenerateModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-6">Mindy will analyze your spending and suggest a personalized challenge.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsGenerateModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold">Cancel</button>
                <button
                  onClick={() => { setIsGenerateModalOpen(false); showToast("AI challenge generated! (Coming soon)"); }}
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}