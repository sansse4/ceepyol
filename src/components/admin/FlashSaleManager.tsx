"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store/admin";
import { useProducts } from "@/lib/hooks/useProducts";

export default function FlashSaleManager() {
  const { flashSale, updateFlashSale } = useAdminStore();
  const { products } = useProducts();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({ ...flashSale });

  const isExpired = new Date(form.endsAt) < new Date();
  const timeLeft = new Date(form.endsAt).getTime() - Date.now();
  const days = Math.max(0, Math.floor(timeLeft / 86400000));
  const hours = Math.max(0, Math.floor((timeLeft % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((timeLeft % 3600000) / 60000));

  function handleSave() {
    updateFlashSale(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleProduct(id: string) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((p) => p !== id)
        : [...f.productIds, id],
    }));
  }

  // Quick presets for end date
  const presets = [
    { label: "1 Hour", ms: 3600000 },
    { label: "6 Hours", ms: 21600000 },
    { label: "24 Hours", ms: 86400000 },
    { label: "3 Days", ms: 259200000 },
    { label: "7 Days", ms: 604800000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">Flash Sale</h3>
          <p className="text-xs text-white/40">Control the limited-time discount timer shown on the storefront</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Active Toggle */}
          <button
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              form.active
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-white/40 border border-white/10"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${form.active ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
            {form.active ? "Sale Active" : "Sale Off"}
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              {saved ? "check" : "save"}
            </span>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${form.bgFrom}, ${form.bgTo})` }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest opacity-70 uppercase">{form.label}</span>
            <h4 className="text-2xl font-extrabold mt-0.5">{form.title}</h4>
            <p className="text-sm opacity-70 mt-1">Up to {form.discount}% OFF selected items</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { val: String(days).padStart(2, "0"), lbl: "Days" },
              { val: String(hours).padStart(2, "0"), lbl: "Hrs" },
              { val: String(mins).padStart(2, "0"), lbl: "Min" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-xl font-bold opacity-40">:</span>}
                <div className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-2 min-w-[56px]">
                  <span className="text-2xl font-bold tabular-nums">{t.val}</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-60">{t.lbl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isExpired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
            <span className="text-red-400 font-extrabold text-lg">⚠ Sale Expired</span>
          </div>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Sale Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
            placeholder="Spring Sale Event"
          />
        </div>

        {/* Label */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Badge Label</label>
          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
            placeholder="LIMITED TIME OFFER"
          />
        </div>

        {/* Discount */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
            Discount — <span className="text-emerald-400 text-base font-extrabold">{form.discount}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={90}
            value={form.discount}
            onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-white/20">
            <span>1%</span><span>45%</span><span>90%</span>
          </div>
        </div>

        {/* End Date */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Ends At</label>
          <input
            type="datetime-local"
            value={form.endsAt.slice(0, 16)}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: new Date(e.target.value).toISOString() }))}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
          />
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setForm((f) => ({ ...f, endsAt: new Date(Date.now() + p.ms).toISOString() }))}
                className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-400 text-white/40 rounded-lg text-[10px] font-bold transition-all"
              >
                +{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Background Colors</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-white/30 mb-1.5">From</p>
              <div className="flex items-center gap-2 bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={form.bgFrom}
                  onChange={(e) => setForm((f) => ({ ...f, bgFrom: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-white/50 font-mono">{form.bgFrom}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-white/30 mb-1.5">To</p>
              <div className="flex items-center gap-2 bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={form.bgTo}
                  onChange={(e) => setForm((f) => ({ ...f, bgTo: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-white/50 font-mono">{form.bgTo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5 space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
            Apply To
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setForm((f) => ({ ...f, productIds: [] }))}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                form.productIds.length === 0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setForm((f) => ({ ...f, productIds: f.productIds.length === 0 ? [products[0]?.id || ""] : f.productIds }))}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                form.productIds.length > 0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Select Products
            </button>
          </div>
        </div>
      </div>

      {/* Product Picker */}
      {form.productIds.length > 0 && (
        <div className="bg-[#14161e] rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
              Select Products — <span className="text-emerald-400">{form.productIds.length} selected</span>
            </label>
            <button onClick={() => setForm((f) => ({ ...f, productIds: [] }))} className="text-[10px] text-white/30 hover:text-white/50 transition-all">
              Clear All
            </button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto hide-scrollbar">
            {products.map((p) => {
              const selected = form.productIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    selected ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-[#1a1d27] border border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                  }`}>
                    {selected && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-white/30">{p.brand} · ${p.price}</p>
                  </div>
                  {selected && (
                    <span className="text-[10px] font-bold text-emerald-400">-{form.discount}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
