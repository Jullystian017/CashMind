"use client"

import React, { useState, useEffect } from 'react';
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
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatRp } from "@/lib/utils";

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

export default function ChallengesPage() {
  const { t } = useTranslation();
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
      showToast(`✅ ${t("challenges.accepted")}`);
      await fetchAll();
    }
  };

  const handleComplete = async (challengeId: string) => {
    const { error, badgesEarned } = await completeChallenge(challengeId);
    if (error) {
      showToast(`❌ ${error}`);
    } else {
      let msg = `🎉 ${t("challenges.congrats")}`;
      if (badgesEarned && badgesEarned.length > 0) {
        msg += ` + ${t("challenges.badgeEarned")}: ${badgesEarned.join(", ")}`;
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
      showToast(t("common.cancel"));
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
    <div className="space-y-8 pb-24 @container" suppressHydrationWarning={true}>
      {/* Header */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-semibold text-gray-900 tracking-tight">{t("challenges.title")}</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">{t("challenges.subtitle")}</p>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col @md:flex-row @md:items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
        <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Trophy className="text-white w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="font-semibold text-lg text-slate-800">
                {t("challenges.level")} {xpData?.level ?? 1} – {xpData?.title ?? "Beginner Saver"}
              </h3>
              <p className="text-xs text-slate-400">
                {activeChallenges.length} {t("challenges.active")} • {badges.length} {t("challenges.badges")} {t("common.verified")}
              </p>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {xpData?.totalXp ?? 0} <span className="text-slate-400 font-normal">/ {xpData?.xpForNext ?? 200} {t("challenges.xp")}</span>
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
            {t("challenges.xpToNext", { xp: ((xpData?.xpForNext ?? 200) - (xpData?.totalXp ?? 0)).toString() })}
          </p>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 p-8 rounded-[32px] flex flex-col @md:flex-row items-center justify-between border border-blue-400/20 gap-6 relative overflow-hidden group shadow-2xl shadow-blue-500/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>

        <div className="flex items-center gap-5 relative z-10 w-full @md:w-auto">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20">
            <Sparkles className="text-blue-100 w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg tracking-tight">{t("challenges.mindyTitle")}</h4>
            <p className="text-sm text-blue-100/70 max-w-md font-medium">{t("challenges.mindySubtitle")}</p>
          </div>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-white text-blue-700 hover:bg-blue-50 transition-all rounded-2xl px-8 py-3.5 text-sm font-bold shrink-0 active:scale-95 shadow-lg shadow-black/10 relative z-10 w-full @md:w-auto"
        >
          {t("challenges.generate")}
        </button>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-6 border-b border-slate-200">
          {[
            { key: "active", label: t("challenges.active") },
            { key: "completed", label: t("challenges.completed") },
            { key: "badges", label: t("challenges.badges") }
          ].map((tab_item) => (
            <button
              key={tab_item.key}
              onClick={() => setTab(tab_item.key as Tab)}
              className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${tab === tab_item.key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab_item.label} {tab_item.key === "active" && activeChallenges.length > 0 && (
                <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">{activeChallenges.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Active Tab */}
        {tab === "active" && (
          <>
            {/* Available Challenges */}
            <div className="grid grid-cols-1 @lg:grid-cols-2 @[1200px]:grid-cols-3 gap-6">
              {templates.map((tpl) => {
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
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-semibold tracking-widest shadow-md">
                        {t("challenges.recommended")}
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-md tracking-wider ${difficultyColors[tpl.difficulty]}`}>
                          {(t(`challenges.difficultyLevels.${tpl.difficulty}`) as string) || tpl.difficulty}
                        </span>
                        <span className="text-blue-600 text-[11px] font-semibold flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> +{tpl.xp_reward} {t("challenges.xp")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-base leading-tight mb-4">{tpl.title}</h4>
                      <div className="space-y-2 text-slate-500 text-[11px] font-medium">
                        <p className="flex items-center gap-2">
                          <Target size={14} className="text-slate-400" /> {tpl.limit_amount > 0 ? `${t("challenges.max")} ${formatRp(tpl.limit_amount)}` : t("challenges.zeroSpending")}
                        </p>
                        <p className="flex items-center gap-2">
                          <span>🕒</span> {t("challenges.daysDuration", { days: tpl.duration_days.toString() })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAccept(tpl.id); }}
                      disabled={isActive}
                      className={`w-full mt-6 py-2.5 rounded-2xl border-2 text-xs font-semibold transition-all ${isActive
                        ? "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
                        : "border-slate-100 text-slate-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                        }`}
                    >
                      {isActive ? t("challenges.alreadyActive") : t("challenges.startChallenge")}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Active Tracking */}
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-slate-800">{t("challenges.activeTracking")}</h3>
              {activeChallenges.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <p className="text-slate-500 text-sm">{t("challenges.noActive")}</p>
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
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col @md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all cursor-pointer"
                      onClick={() => setSelectedChallenge({ type: "active", ...ac })}
                    >
                      <div className="flex items-center gap-5 w-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center shrink-0 border border-orange-200/50">
                          <Icon className="text-orange-500 w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-lg tracking-tight truncate">{ac.template?.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Clock size={12} className="text-slate-300" /> {t("dashboard.daysLeft", { days: ac.daysLeft.toString() })}
                            </span>
                            {ac.consumedPercent >= 80 && (
                              <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5 border border-red-100 animate-pulse">
                                <AlertTriangle size={10} /> {t("challenges.atRisk")}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-4 w-full @md:max-w-xs">
                            <div className="flex justify-between items-center mb-2">
                                <span className={cn("text-[9px] font-bold uppercase tracking-widest", ac.consumedPercent >= 80 ? "text-red-500" : "text-blue-600")}>
                                    {ac.consumedPercent}% {t("challenges.consumed")}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {formatRp(ac.remaining)} {t("challenges.remaining")}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 padding-[1px]">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${ac.consumedPercent}%` }}
                                className={cn("h-full rounded-full relative overflow-hidden", progressColor)} 
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col @md:items-end gap-5 w-full @md:w-auto pt-4 @md:pt-0 border-t border-slate-50 @md:border-t-0">
                        <div className="@md:text-right">
                          <p className="text-2xl font-bold text-slate-900 tracking-tight">{formatRp(ac.spent)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">
                            {t("challenges.limit")}: {formatRp(ac.template?.limit_amount ?? 0)}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full @md:w-auto" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCancel(ac.id)}
                            className="flex-1 @md:flex-none px-6 py-2.5 rounded-2xl border-2 border-slate-100 text-slate-500 text-xs font-bold hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all active:scale-95"
                          >
                            {t("common.cancel")}
                          </button>
                          <button
                            onClick={() => handleComplete(ac.id)}
                            className="flex-1 @md:flex-none px-8 py-2.5 rounded-2xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
                          >
                            {t("challenges.completeChallenge")}
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
                <p className="text-slate-500 text-sm">{t("challenges.noHistory")}</p>
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
                      <h4 className="font-semibold text-slate-800">{ch.template?.title}</h4>
                      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 mt-1">
                        <Star size={12} fill="currentColor" /> +{ch.xp_earned} {t("challenges.xp")} {t("common.verified")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{t("challenges.done")}</span>
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
                      <h4 className="font-semibold text-slate-800">{ch.template?.title}</h4>
                      <span className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                        <Ban size={12} /> {ch.failure_reason === "over_spending" ? t("challenges.overSpending") : ch.failure_reason === "user_cancelled" ? t("challenges.userCancelled") : t("challenges.timeExpired")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                      {ch.status === "cancelled" ? t("challenges.cancelledCapital") : t("challenges.failedCapital")}
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
                <p className="text-slate-500 text-sm">{t("challenges.noBadges")}</p>
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
                    <h4 className="font-semibold text-slate-800">{b.name}</h4>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${selectedChallenge.type === 'active' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                  <Target size={32} />
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 text-xl tracking-tight leading-tight">
                    {selectedChallenge.title || selectedChallenge.template?.title}
                  </h3>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1 ${difficultyColors[selectedChallenge.difficulty || selectedChallenge.template?.difficulty]}`}>
                    {(t(`challenges.difficultyLevels.${selectedChallenge.difficulty || selectedChallenge.template?.difficulty}`) as string) || (selectedChallenge.difficulty || selectedChallenge.template?.difficulty)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500 flex items-center gap-2"><Target size={16} /> {t("challenges.max")}</span>
                    <span className="text-slate-900">{(selectedChallenge.limit_amount ?? selectedChallenge.template?.limit_amount ?? 0) > 0 ? formatRp(selectedChallenge.limit_amount ?? selectedChallenge.template?.limit_amount) : t("challenges.zeroSpending")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500 flex items-center gap-2">🕒 {t("challenges.duration")}</span>
                    <span className="text-slate-900">{t("challenges.daysDuration", { days: (selectedChallenge.duration_days ?? selectedChallenge.template?.duration_days).toString() })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500 flex items-center gap-2"><Star size={16} className="text-blue-500" fill="currentColor" /> {t("challenges.reward")}</span>
                    <span className="text-blue-600 font-bold">+{selectedChallenge.xp_reward ?? selectedChallenge.template?.xp_reward} {t("challenges.xp")}</span>
                  </div>
                </div>

                {selectedChallenge.type === "active" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="text-orange-500">{selectedChallenge.consumedPercent}% {t("challenges.consumed")}</span>
                      <span className="text-slate-400">{selectedChallenge.daysLeft} {t("challenges.days")} {t("challenges.remaining")}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${selectedChallenge.consumedPercent >= 80 ? 'bg-red-500' : 'bg-orange-500'}`} 
                        style={{ width: `${selectedChallenge.consumedPercent}%` }} 
                      />
                    </div>
                  </div>
                )}
                
                {(selectedChallenge.description || selectedChallenge.template?.description) && (
                  <p className="text-xs text-slate-400 italic text-center px-4 leading-relaxed">
                    {selectedChallenge.description || selectedChallenge.template?.description}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {selectedChallenge.type === "template" && (
                   <button
                    onClick={() => { handleAccept(selectedChallenge.id); setSelectedChallenge(null); }}
                    disabled={isTemplateActive(selectedChallenge.id)}
                    className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg ${isTemplateActive(selectedChallenge.id) 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}
                  >
                    {isTemplateActive(selectedChallenge.id) ? t("challenges.alreadyActive") : t("challenges.startChallenge")}
                  </button>
                )}
                {selectedChallenge.type === "active" && (
                  <>
                    <button
                      onClick={() => handleCancel(selectedChallenge.id)}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      onClick={() => handleComplete(selectedChallenge.id)}
                      className="flex-1 py-4 rounded-2xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                    >
                      {t("challenges.completeChallenge")}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mindy AI Modal Placeholder */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setIsGenerateModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-sm relative text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 bg-purple-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Sparkles className="text-purple-600 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{t("challenges.mindyTitle")}</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed px-2">
                {t("challenges.mindySubtitle")}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => { setIsGenerateModalOpen(false); showToast("✨ " + t("ai.thinking")); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                >
                  {t("challenges.generate")}
                </button>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  {t("common.back")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}