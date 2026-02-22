"use client"

import React, { useState } from 'react';
import { Sparkles, Utensils, Trophy, Target, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "active" | "completed" | "badges";

type Challenge = {
  id: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  title: string;
  xp: number;
  limit: string;
  duration: string;
  difficultyColor: string;
  recommended?: boolean;
};

type ActiveChallenge = Challenge & {
  daysLeft: number;
  consumedPercent: number;
  spent: number;
  limitAmount: number;
  remaining: number;
};

const availableChallenges: Challenge[] = [
  { id: "1", difficulty: "EASY", title: "Reduce Food Spending by 10%", xp: 50, limit: "Rp 315.000", duration: "7 days duration", difficultyColor: "text-green-600 bg-green-50" },
  { id: "2", difficulty: "MEDIUM", title: "Reduce Food Spending by 20%", xp: 120, limit: "Rp 280.000", duration: "7 days duration", recommended: true, difficultyColor: "text-orange-600 bg-orange-50" },
  { id: "3", difficulty: "HARD", title: "No Eating Out for 7 Days", xp: 300, limit: "Rp 0 Eating Out", duration: "Discipline Badge", difficultyColor: "text-red-600 bg-red-50" },
];

const badgesData = [
  { id: "1", name: "First Saver", desc: "Saved your first Rp 100k", icon: "🏆" },
  { id: "2", name: "Week Warrior", desc: "7-day spending challenge", icon: "⚡" },
  { id: "3", name: "Food Master", desc: "Reduced food spend 20%", icon: "🍽️" },
  { id: "4", name: "No Eating Out", desc: "7 days no restaurants", icon: "🍳" },
  { id: "5", name: "Level 3", desc: "Disciplined Saver", icon: "🌟" },
];

const formatRp = (val: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
    .format(val)
    .replace("Rp", "Rp ");

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([
    {
      ...availableChallenges[1],
      daysLeft: 5,
      consumedPercent: 42,
      spent: 120000,
      limitAmount: 280000,
      remaining: 160000,
    },
  ]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | ActiveChallenge | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackingChallenge, setTrackingChallenge] = useState<ActiveChallenge | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalXp = 540;
  const xpToNext = 800;
  const levelProgress = Math.round((totalXp / xpToNext) * 100);

  const handleAcceptChallenge = (ch: Challenge) => {
    if (activeChallenges.some((a) => a.id === ch.id)) {
      setToast("Challenge already active!");
    } else {
      const limitMatch = ch.limit.match(/[\d.]+/);
      const limitAmount = limitMatch ? parseInt(limitMatch[0].replace(/\./g, ""), 10) : 280000;
      setActiveChallenges((prev) => [
        ...prev,
        {
          ...ch,
          daysLeft: 7,
          consumedPercent: 0,
          spent: 0,
          limitAmount,
          remaining: limitAmount,
        },
      ]);
      setToast(`Accepted: ${ch.title}`);
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleCompleteChallenge = (ch: ActiveChallenge) => {
    setActiveChallenges((prev) => prev.filter((a) => a.id !== ch.id));
    setCompletedChallenges((prev) => [...prev, ch]);
    setSelectedChallenge(null);
    setToast(`Challenge completed! +${ch.xp} XP`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleTrackExpense = (amount: number) => {
    if (!trackingChallenge) return;
    const newSpent = trackingChallenge.spent + amount;
    const consumed = Math.min(100, Math.round((newSpent / trackingChallenge.limitAmount) * 100));
    setActiveChallenges((prev) =>
      prev.map((a) =>
        a.id === trackingChallenge.id
          ? {
              ...a,
              spent: newSpent,
              consumedPercent: consumed,
              remaining: Math.max(0, trackingChallenge.limitAmount - newSpent),
            }
          : a
      )
    );
    setIsTrackModalOpen(false);
    setTrackingChallenge(null);
    setToast("Expense tracked!");
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
      {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Cashmind Challenges</h2>
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
                            <h3 className="font-bold text-lg text-slate-800">Level 3 – Disciplined Saver</h3>
                            <p className="text-xs text-slate-400">{activeChallenges.length} Active Challenge{activeChallenges.length !== 1 ? "s" : ""} • 5 Badges Earned</p>
                        </div>
                        <span className="text-sm font-bold text-slate-700">540 <span className="text-slate-400 font-normal">/ 800 XP</span></span>
                    </div>
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all w-[65%]" />
                    </div>
                    <p className="text-[10px] text-right text-slate-400 mt-1">260 XP to Level 4</p>
                </div>
            </div>

            {/* AI Personalized Challenge Banner */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-purple-100 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Sparkles className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Mindy AI Personalized Challenge</h4>
                        <p className="text-sm text-slate-600 max-w-md">Generate challenges based on your spending behavior. Our AI noticed your food spending increased 35% last month.</p>
                    </div>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-full px-6 py-2.5 text-sm font-bold shrink-0 active:scale-[0.98]"
                >
                  Generate Challenge
                </button>
            </div>

      {/* Challenge Tabs */}
      <div className="space-y-6">
        <div className="flex gap-6 border-b border-slate-200">
          {(["active", "completed", "badges"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-bold pb-3 border-b-2 transition-colors capitalize ${
                tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "active" && (
          <>
            {/* Challenge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableChallenges.map((ch) => (
                <ChallengeCard
                  key={ch.id}
                  challenge={ch}
                  isActive={activeChallenges.some((a) => a.id === ch.id)}
                  onAccept={() => handleAcceptChallenge(ch)}
                  onClick={() => setSelectedChallenge(ch)}
                />
              ))}
            </div>

            {/* Active Tracking */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-800">Active Tracking</h3>
              {activeChallenges.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <p className="text-slate-500 text-sm">No active challenges. Accept a challenge above to start!</p>
                </div>
              ) : (
                activeChallenges.map((ac) => (
                  <div
                    key={ac.id}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedChallenge(ac)}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="p-4 bg-orange-50 rounded-2xl shrink-0">
                        <Utensils className="text-orange-500 w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{ac.title}</h4>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>🕒</span> {ac.daysLeft} days left
                        </p>
                        <div className="mt-3 max-w-xs">
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${ac.consumedPercent}%` }} />
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
                        <p className="text-[10px] text-slate-400 font-medium">Limit: {formatRp(ac.limitAmount)}</p>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedChallenge(ac)}
                          className="px-5 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => { setTrackingChallenge(ac); setIsTrackModalOpen(true); }}
                          className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                          Track Expense
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "completed" && (
          <div className="space-y-4">
            {completedChallenges.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-500 text-sm">No completed challenges yet.</p>
              </div>
            ) : (
              completedChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between"
                  onClick={() => setSelectedChallenge(ch)}
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{ch.title}</h4>
                    <span className="text-blue-600 text-xs font-bold flex items-center gap-1 mt-1">
                      <Star size={12} fill="currentColor" /> +{ch.xp} XP earned
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">DONE</span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgesData.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-3xl">{b.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-800">{b.name}</h4>
                  <p className="text-xs text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
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
          <DetailModal
            challenge={selectedChallenge}
            isActive={activeChallenges.some((a) => a.id === selectedChallenge.id)}
            onClose={() => setSelectedChallenge(null)}
            onAccept={() => { handleAcceptChallenge(selectedChallenge); setSelectedChallenge(null); }}
            onComplete={selectedChallenge && "spent" in selectedChallenge ? () => handleCompleteChallenge(selectedChallenge as ActiveChallenge) : undefined}
          />
        )}
      </AnimatePresence>

      {/* Track Expense Modal */}
      <AnimatePresence>
        {isTrackModalOpen && trackingChallenge && (
          <TrackExpenseModal
            challenge={trackingChallenge}
            onClose={() => { setIsTrackModalOpen(false); setTrackingChallenge(null); }}
            onTrack={handleTrackExpense}
          />
        )}
      </AnimatePresence>

      {/* Generate Challenge Modal */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <GenerateModal
            onClose={() => setIsGenerateModalOpen(false)}
            onGenerate={() => {
              setIsGenerateModalOpen(false);
              setToast("AI challenge generated! (Demo)");
              setTimeout(() => setToast(null), 2000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeCard({
  challenge,
  isActive,
  onAccept,
  onClick,
}: {
  challenge: Challenge;
  isActive: boolean;
  onAccept: () => void;
  onClick: () => void;
}) {
  const { difficulty, title, xp, limit, duration, recommended, difficultyColor } = challenge;
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-3xl border transition-all flex flex-col justify-between h-full bg-white relative cursor-pointer hover:shadow-lg active:scale-[0.99] ${recommended ? "ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-100" : "border-slate-100 shadow-sm"}`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest shadow-md">
          RECOMMENDED
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mb-5">
          <span className={`text-[10px] font-black px-2 py-1 rounded-md tracking-wider ${difficultyColor}`}>{difficulty}</span>
          <span className="text-blue-600 text-[11px] font-bold flex items-center gap-1">
            <Star size={12} fill="currentColor" /> +{xp} XP
          </span>
        </div>
        <h4 className="font-bold text-slate-800 text-base leading-tight mb-4">{title}</h4>
        <div className="space-y-2 text-slate-500 text-[11px] font-medium">
          <p className="flex items-center gap-2">
            <Target size={14} className="text-slate-400" /> Max {limit}
          </p>
          <p className="flex items-center gap-2">
            <span>🕒</span> {duration}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onAccept(); }}
        disabled={isActive}
        className={`w-full mt-6 py-2.5 rounded-2xl border-2 text-xs font-bold transition-all ${
          isActive
            ? "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
            : "border-slate-100 text-slate-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
        }`}
      >
        {isActive ? "Already Active" : "Accept Challenge"}
      </button>
    </div>
  );
}

function DetailModal({
  challenge,
  isActive,
  onClose,
  onAccept,
  onComplete,
}: {
  challenge: Challenge | ActiveChallenge;
  isActive: boolean;
  onClose: () => void;
  onAccept: () => void;
  onComplete?: () => void;
}) {
  const isTracking = "spent" in challenge;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
            <Utensils className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${challenge.difficultyColor}`}>{challenge.difficulty}</span>
            <h3 className="font-bold text-slate-900 text-lg">{challenge.title}</h3>
          </div>
        </div>
        <div className="space-y-3 mb-6 text-sm text-slate-600">
          <p className="flex items-center gap-2"><Target size={16} /> Max {challenge.limit}</p>
          <p className="flex items-center gap-2">🕒 {challenge.duration}</p>
          <p className="flex items-center gap-2"><Star size={16} className="text-blue-500" fill="currentColor" /> +{challenge.xp} XP reward</p>
          {isTracking && (
            <div className="pt-3 border-t">
              <p className="font-medium">Progress: {(challenge as ActiveChallenge).consumedPercent}% consumed</p>
              <p className="text-xs text-slate-500">{(challenge as ActiveChallenge).daysLeft} days left</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {!isActive && <button onClick={onAccept} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold">Accept Challenge</button>}
          {onComplete && <button onClick={onComplete} className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold">Mark Complete</button>}
          <button onClick={onClose} className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold">Close</button>
        </div>
      </motion.div>
    </div>
  );
}

function TrackExpenseModal({
  challenge,
  onClose,
  onTrack,
}: {
  challenge: ActiveChallenge;
  onClose: () => void;
  onTrack: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ""), 10) || 0;
    if (num > 0) onTrack(num);
  };
  const formatThousands = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return parseInt(digits, 10).toLocaleString("id-ID");
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          <h3 className="font-bold text-slate-900">Track Expense</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">{challenge.title}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Amount (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formatThousands(amount)}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            {[25000, 50000, 100000].map((n) => (
              <button key={n} type="button" onClick={() => setAmount(n.toString())} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                +{formatRp(n)}
              </button>
            ))}
          </div>
          <button type="submit" disabled={!amount} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50">
            Add Expense
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function GenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Mindy will analyze your spending and suggest a personalized challenge.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold">Cancel</button>
          <button onClick={onGenerate} className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold">Generate</button>
        </div>
      </motion.div>
    </div>
  );
}