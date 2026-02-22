"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  AlertTriangle,
  ChevronRight,
  Music,
  Tv,
  Dumbbell,
  PenTool,
  X,
  Pencil,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscriptions, createSubscription, deleteSubscription } from "@/app/actions/subscriptions";

type Subscription = {
  id: string;
  name: string;
  price: number;
  billing: string;
  nextDate: string;
  bgColor: string;
  icon: "music" | "tv" | "gym" | "adobe";
  paymentMethod?: string;
};

const formatRp = (val: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
    .format(val)
    .replace("Rp", "Rp ");

// Reference date untuk demo: "hari ini" - upcoming = next 7 days from here
// Pakai string comparison supaya server & client hasilnya sama (hindari hydration mismatch)
const REFERENCE_DATE = "2026-10-03";

function addDaysToDateStr(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDaysStr(from: string, to: string): number {
  const a = new Date(from + "T12:00:00Z").getTime();
  const b = new Date(to + "T12:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function formatDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[m - 1]}`;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const mounted = useRef(true);
  const fetchSubscriptions = async () => {
    const { data } = await getSubscriptions();
    if (mounted.current && data) setSubscriptions(data);
  };
  useEffect(() => {
    mounted.current = true;
    fetchSubscriptions();
    return () => { mounted.current = false };
  }, []);

  const totalRecurring = subscriptions.reduce((acc, s) => acc + s.price, 0);

  // Upcoming: subscription yang nextDate-nya dalam 7 hari ke depan (string-based, no timezone drift)
  const endDateStr = addDaysToDateStr(REFERENCE_DATE, 7);
  const upcomingItems = subscriptions
    .filter((s) => s.nextDate >= REFERENCE_DATE && s.nextDate <= endDateStr)
    .sort((a, b) => (a.nextDate < b.nextDate ? -1 : a.nextDate > b.nextDate ? 1 : 0))
    .map((s) => {
      const diffDays = diffDaysStr(REFERENCE_DATE, s.nextDate);
      const label = diffDays <= 1 ? `DUE ${diffDays === 0 ? "TODAY" : "TOMORROW"}` : `IN ${diffDays} DAYS`;
      return {
        ...s,
        dateLabel: label,
        dateStr: formatDateStr(s.nextDate),
        dotColor: diffDays <= 2 ? "bg-orange-400" : "bg-blue-400",
      };
    });

  const upcomingTotal = upcomingItems.reduce((acc, u) => acc + u.price, 0);

  const handleTopUp = () => {
    setToast("Top up initiated! (Demo)");
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeleteSubscription = async (id: string) => {
    const { error } = await deleteSubscription(id);
    if (!error) {
      await fetchSubscriptions();
      setSelectedSubscription(null);
    }
  };

  const showDetail = (sub: Subscription) => setSelectedSubscription(sub);

  const IconMap = { music: Music, tv: Tv, gym: Dumbbell, adobe: PenTool };

  return (
    <div className="space-y-8 pb-24" suppressHydrationWarning={true}>

      {/* Top Header Section */}
      <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl @md:text-3xl font-bold text-gray-900 tracking-tight">Subscriptions Management</h2>
          <p className="text-gray-500 text-xs @md:text-sm mt-1 font-medium italic">Manage your recurring payments and digital services.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all w-fit active:scale-[0.98]"
        >
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
        <button
          onClick={handleTopUp}
          className="text-xs font-black text-orange-900 uppercase tracking-widest hover:underline active:opacity-80"
        >
          Top Up Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Active Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Recurring Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-xs font-medium mb-1">Total Recurring / Month</p>
              <h2 className="text-4xl font-black text-white mb-6">{formatRp(totalRecurring)} <span className="text-lg font-normal text-blue-200">/mo</span></h2>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/20">
                Across {subscriptions.length} active subscription{subscriptions.length !== 1 ? "s" : ""}
              </span>
            </div>
            {/* Background Decorative Circle */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Active Subscriptions</h3>
              <button
              onClick={() => { setToast("Showing all subscriptions"); setTimeout(() => setToast(null), 2000); }}
              className="text-blue-600 text-xs font-bold hover:underline active:opacity-80"
            >
              View All
            </button>
            </div>

            {/* Subscription List */}
            <div className="space-y-3">
              {subscriptions.map((sub) => {
                const IconComp = IconMap[sub.icon];
                return (
                  <SubscriptionItem
                    key={sub.id}
                    icon={<IconComp className="text-white w-5 h-5" />}
                    bgColor={sub.bgColor}
                    name={sub.name}
                    billing={`${sub.billing} • Next: ${new Date(sub.nextDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                    price={formatRp(sub.price)}
                    onClick={() => showDetail(sub)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Upcoming & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold">Upcoming (Next 7 Days)</h3>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
              {upcomingItems.length === 0 ? (
                <p className="text-sm text-slate-400 pl-8">No upcoming renewals in the next 7 days</p>
              ) : (
                upcomingItems.map((item) => (
                  <TimelineItem
                    key={item.id}
                    date={item.dateLabel}
                    name={item.name}
                    price={`${item.dateStr} • ${formatRp(item.price)}`}
                    dotColor={item.dotColor}
                    onClick={() => setSelectedSubscription(item)}
                  />
                ))
              )}
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Total</p>
                <p className="text-lg font-black text-slate-900">{formatRp(upcomingTotal)}</p>
              </div>
            </div>
          </div>
        </div>

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

      {/* Subscription Detail Modal */}
      <AnimatePresence>
        {selectedSubscription && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubscription(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`${selectedSubscription.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm`}>
                    {React.createElement(IconMap[selectedSubscription.icon], { className: "text-white w-7 h-7" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedSubscription.name}</h3>
                    <p className="text-sm text-slate-500">{formatRp(selectedSubscription.price)} / {selectedSubscription.billing}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Next billing</p>
                  <p className="text-base font-medium text-slate-800">
                    {new Date(selectedSubscription.nextDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setToast("Edit coming soon (Demo)");
                      setTimeout(() => setToast(null), 2000);
                    }}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Cancel this subscription?")) handleDeleteSubscription(selectedSubscription.id);
                    }}
                    className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-100 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubscription(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Subscription Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddSubscriptionModal
            onClose={() => setIsAddModalOpen(false)}
            onAdded={() => {
              fetchSubscriptions();
              setIsAddModalOpen(false);
              setToast("Subscription added!");
              setTimeout(() => setToast(null), 2000);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-komponen untuk Baris Langganan
function SubscriptionItem({ icon, bgColor, name, billing, price, onClick }: { icon: React.ReactNode; bgColor: string; name: string; billing: string; price: string; onClick?: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.99]"
    >
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
function TimelineItem({ date, name, price, dotColor, onClick }: { date: string; name: string; price: string; dotColor: string; onClick?: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="relative pl-8 cursor-pointer hover:opacity-80 active:scale-[0.99] transition-transform"
    >
      <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-4 border-white shadow-sm ${dotColor}`}></div>
      <p className={`text-[9px] font-black uppercase tracking-tighter ${date.includes('DUE') ? 'text-orange-500' : 'text-slate-400'}`}>
        {date}
      </p>
      <h4 className="text-sm font-bold text-slate-800 mt-0.5">{name}</h4>
      <p className="text-[10px] text-slate-400 font-medium">{price}</p>
    </div>
  );
}

function AddSubscriptionModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState("Monthly");
  const [icon, setIcon] = useState<Subscription["icon"]>("music");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(price.replace(/\D/g, ""), 10) || 0;
    if (!name || amount <= 0) return;
    setLoading(true);
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    const bgColor = icon === "music" ? "bg-green-500" : icon === "tv" ? "bg-red-600" : icon === "gym" ? "bg-slate-800" : "bg-red-500";
    const { error } = await createSubscription({
      name,
      price: amount,
      billing,
      nextDate: next.toISOString().slice(0, 10),
      bgColor,
      icon,
    });
    setLoading(false);
    if (!error) {
      onAdded();
      onClose();
    }
  };

  const formatThousands = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return parseInt(digits, 10).toLocaleString("id-ID");
  };

  const iconOptions: { key: Subscription["icon"]; Icon: typeof Music; label: string }[] = [
    { key: "music", Icon: Music, label: "Music" },
    { key: "tv", Icon: Tv, label: "Streaming" },
    { key: "gym", Icon: Dumbbell, label: "Gym" },
    { key: "adobe", Icon: PenTool, label: "Creative" },
  ];

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Add Subscription</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Name</label>
            <input
              type="text"
              placeholder="e.g. Spotify Premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Amount (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formatThousands(price)}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Billing</label>
            <select
              value={billing}
              onChange={(e) => setBilling(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option>Monthly</option>
              <option>Annual</option>
              <option>Annual (Monthly pay)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Icon</label>
            <div className="flex gap-2">
              {iconOptions.map(({ key, Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    icon === key ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!name || !price || loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Adding…" : "Add Subscription"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}