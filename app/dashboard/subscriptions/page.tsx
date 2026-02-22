import React from 'react';
import { SiSpotify } from '@icons-pack/react-simple-icons';
import {
  Plus,
  AlertTriangle,
  ChevronRight,
  Calendar,
  CreditCard,
  Music,
  Tv,
  Dumbbell,
  PenTool
} from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>

      {/* Top Header Section */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Subscriptions Management</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Manage your recurring payments and digital services.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all w-fit">
          <Plus size={18} /> Add Subscription
        </button>
      </div>

      {/* Alert Banner */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <AlertTriangle className="text-orange-600 w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-orange-900">Smart Mode: Action Required</h4>
            <p className="text-xs text-orange-700">⚠️ Insufficient balance in Dana for Netflix renewal (Rp 186.000)</p>
          </div>
        </div>
        <button className="text-xs font-black text-orange-900 uppercase tracking-widest hover:underline">Top Up Now</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Active Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Recurring Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-xs font-medium mb-1">Total Recurring / Month</p>
              <h2 className="text-4xl font-black text-white mb-6">Rp 850.000 <span className="text-lg font-normal text-blue-200">/mo</span></h2>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/20">
                Across 5 active subscriptions
              </span>
            </div>
            {/* Background Decorative Circle */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Active Subscriptions</h3>
              <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
            </div>

            {/* Subscription List */}
            <div className="space-y-3">
              <SubscriptionItem
                icon={<Music className="text-white w-5 h-5" />}
                bgColor="bg-green-500"
                name="Spotify Family"
                billing="Monthly • Next: Oct 5th"
                price="Rp 86.000"
              />
              <SubscriptionItem
                icon={<Tv className="text-white w-5 h-5" />}
                bgColor="bg-red-600"
                name="Netflix Premium"
                billing="Monthly • Next: Oct 12th"
                price="Rp 186.000"
              />
              <SubscriptionItem
                icon={<Dumbbell className="text-white w-5 h-5" />}
                bgColor="bg-slate-800"
                name="Gold's Gym Membership"
                billing="Monthly • Next: Oct 15th"
                price="Rp 450.000"
              />
              <SubscriptionItem
                icon={<PenTool className="text-white w-5 h-5" />}
                bgColor="bg-red-500"
                name="Adobe Creative Cloud"
                billing="Annual (Monthly pay) • Next: Oct 20th"
                price="Rp 128.000"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Upcoming & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold">Upcoming (Next 7 Days)</h3>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
              <TimelineItem
                date="DUE IN 2 DAYS"
                name="Spotify Family"
                price="Oct 5th • Rp 86.000"
                dotColor="bg-orange-400"
              />
              <TimelineItem
                date="IN 5 DAYS"
                name="Medium Subscription"
                price="Oct 8th • Rp 75.000"
                dotColor="bg-blue-400"
              />
              <TimelineItem
                date="IN 7 DAYS"
                name="ChatGPT Plus"
                price="Oct 10th • Rp 310.000"
                dotColor="bg-blue-400"
              />
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Total</p>
                <p className="text-lg font-black text-slate-900">Rp 471.000</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
              View Detailed Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-komponen untuk Baris Langganan
function SubscriptionItem({ icon, bgColor, name, billing, price }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`${bgColor} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{name}</h4>
          <p className="text-[10px] text-slate-400">{billing}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-black text-slate-900">{price}</p>
          <span className="text-[9px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded uppercase">Active</span>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}

// Sub-komponen untuk Timeline
function TimelineItem({ date, name, price, dotColor }: any) {
  return (
    <div className="relative pl-8">
      <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-4 border-white shadow-sm ${dotColor}`}></div>
      <p className={`text-[9px] font-black uppercase tracking-tighter ${date.includes('DUE') ? 'text-orange-500' : 'text-slate-400'}`}>
        {date}
      </p>
      <h4 className="text-sm font-bold text-slate-800 mt-0.5">{name}</h4>
      <p className="text-[10px] text-slate-400 font-medium">{price}</p>
    </div>
  );
}