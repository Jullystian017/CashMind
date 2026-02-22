import React from 'react';
import { Sparkles, Utensils, Trophy, Target, Star } from "lucide-react";

export default function ChallengesPage() {
    return (
        <div className="space-y-8 pb-24" suppressHydrationWarning={true}>
            {/* Header Section */}
            <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Financial Challenges</h2>
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
                            <p className="text-xs text-slate-400">2 Active Challenges • 5 Badges Earned</p>
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
                <button className="bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-full px-6 py-2.5 text-sm font-bold shrink-0">
                    Generate Challenge
                </button>
            </div>

            {/* Challenge Tabs */}
            <div className="space-y-6">
                <div className="flex gap-6 border-b border-slate-200">
                    <button className="text-sm font-bold border-b-2 border-slate-900 pb-3">Active</button>
                    <button className="text-sm text-slate-400 pb-3 hover:text-slate-600">Completed</button>
                    <button className="text-sm text-slate-400 pb-3 hover:text-slate-600">Badges</button>
                </div>

                {/* Challenge Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ChallengeCard
                        difficulty="EASY"
                        title="Reduce Food Spending by 10%"
                        xp={50}
                        limit="Rp 315.000"
                        duration="7 days duration"
                        difficultyColor="text-green-600 bg-green-50"
                    />
                    <ChallengeCard
                        difficulty="MEDIUM"
                        title="Reduce Food Spending by 20%"
                        xp={120}
                        limit="Rp 280.000"
                        duration="7 days duration"
                        recommended
                        difficultyColor="text-orange-600 bg-orange-50"
                    />
                    <ChallengeCard
                        difficulty="HARD"
                        title="No Eating Out for 7 Days"
                        xp={300}
                        limit="Rp 0 Eating Out"
                        duration="Discipline Badge"
                        difficultyColor="text-red-600 bg-red-50"
                    />
                </div>
            </div>

            {/* Active Tracking */}
            <div className="space-y-4 pt-4">
                <h3 className="font-bold text-slate-800">Active Tracking</h3>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full">
                        <div className="p-4 bg-orange-50 rounded-2xl shrink-0">
                            <Utensils className="text-orange-500 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Reduce Food Spending 20%</h4>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <span className="inline-block w-3 h-3 text-slate-400">🕒</span> 5 days left
                            </p>
                            <div className="mt-3 max-w-xs">
                                {/* Custom Tracker Progress */}
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full transition-all w-[42%]" />
                                </div>
                                <div className="flex justify-between mt-2 text-[9px] font-bold tracking-wider">
                                    <span className="text-orange-500 uppercase">42% CONSUMED</span>
                                    <span className="text-slate-400 uppercase font-medium">RP 160.000 REMAINING</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        <div className="text-right">
                            <p className="text-xl font-black text-slate-900">Rp 120.000</p>
                            <p className="text-[10px] text-slate-400 font-medium">Limit: Rp 280.000</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-5 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors">Details</button>
                            <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">Track Expense</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChallengeCard({ difficulty, title, xp, limit, duration, recommended = false, difficultyColor }: any) {
    return (
        <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between h-full bg-white relative ${recommended ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-100' : 'border-slate-100 shadow-sm'}`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest shadow-md">
                    RECOMMENDED
                </div>
            )}
            <div>
                <div className="flex justify-between items-center mb-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md tracking-wider ${difficultyColor}`}>
                        {difficulty}
                    </span>
                    <span className="text-blue-600 text-[11px] font-bold flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> +{xp} XP
                    </span>
                </div>
                <h4 className="font-bold text-slate-800 text-base leading-tight mb-4">{title}</h4>
                <div className="space-y-2 text-slate-500 text-[11px] font-medium">
                    <p className="flex items-center gap-2"><Target size={14} className="text-slate-400" /> Max {limit}</p>
                    <p className="flex items-center gap-2"><span className="text-slate-400">🕒</span> {duration}</p>
                </div>
            </div>
            <button className="w-full mt-6 py-2.5 rounded-2xl border-2 border-slate-100 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all">
                Accept Challenge
            </button>
        </div>
    );
}