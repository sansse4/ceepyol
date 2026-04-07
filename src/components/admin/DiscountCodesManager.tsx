"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store/admin";

export default function DiscountCodesManager() {
  const { discountCodes, addDiscountCode, updateDiscountCode, deleteDiscountCode } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const inputCls = "w-full px-3 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/30";
  const labelCls = "text-xs font-bold text-white/50 mb-1.5 block uppercase tracking-wider";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDiscountCode({
      code: code.toUpperCase(), type, value: Number(value),
      minOrder: Number(minOrder) || 0, maxUses: Number(maxUses) || 0,
      active, expiresAt: expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
    });
    setCode(""); setValue(""); setMinOrder(""); setMaxUses(""); setShowForm(false);
  };

  const copyCode = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-bold text-white">Discount Codes</h3><p className="text-xs text-white/40">{discountCodes.length} codes · {discountCodes.filter(c => c.active).length} active</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-emerald-500/20 transition-all">
          <span className="material-symbols-outlined text-lg">{showForm ? "close" : "add"}</span>{showForm ? "Cancel" : "New Code"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Discount Code *</label><input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required className={inputCls + " font-mono uppercase"} placeholder="SAVE20" /></div>
            <div><label className={labelCls}>Type</label><select value={type} onChange={e => setType(e.target.value as "percentage"|"fixed")} className={inputCls}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount ($)</option></select></div>
            <div><label className={labelCls}>Value *</label><input type="number" value={value} onChange={e => setValue(e.target.value)} required className={inputCls} placeholder={type === "percentage" ? "20" : "50"} /></div>
            <div><label className={labelCls}>Min Order ($)</label><input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className={inputCls} placeholder="0" /></div>
            <div><label className={labelCls}>Max Uses (0 = unlimited)</label><input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} className={inputCls} placeholder="100" /></div>
            <div><label className={labelCls}>Expires At</label><input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className={inputCls} /></div>
          </div>
          {/* Preview */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl p-4 border border-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><span className="material-symbols-outlined text-emerald-400 text-2xl">confirmation_number</span></div>
              <div><p className="text-white font-bold font-mono text-lg">{code || "CODE"}</p><p className="text-emerald-400 text-sm">{value ? (type === "percentage" ? `${value}% off` : `$${value} off`) : "..."}{minOrder ? ` · Min order: $${minOrder}` : ""}</p></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="accent-emerald-500" /><span className="text-sm text-white/60">Active</span></label>
            <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"><span className="material-symbols-outlined text-lg">check</span>Create Code</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {discountCodes.length === 0 && <div className="text-center py-12"><span className="material-symbols-outlined text-5xl text-white/10 block mb-2">confirmation_number</span><p className="text-white/30 text-sm">No discount codes yet</p></div>}
        {discountCodes.map(dc => {
          const expired = new Date(dc.expiresAt) < new Date();
          const usedUp = dc.maxUses > 0 && dc.usedCount >= dc.maxUses;
          return (
            <div key={dc.id} className="bg-[#1a1d27]/50 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex-shrink-0 flex items-center justify-center"><span className="material-symbols-outlined text-emerald-400">confirmation_number</span></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-bold font-mono">{dc.code}</p>
                  <button onClick={() => copyCode(dc.code)} className="text-white/30 hover:text-white/60 transition-colors"><span className="material-symbols-outlined text-sm">{copied === dc.code ? "check" : "content_copy"}</span></button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/30 mt-1">
                  <span className="px-1.5 py-0.5 bg-white/5 rounded">{dc.type === "percentage" ? `${dc.value}%` : `$${dc.value}`}</span>
                  <span>Used: {dc.usedCount}{dc.maxUses > 0 ? `/${dc.maxUses}` : ""}</span>
                  {expired && <span className="text-red-400">Expired</span>}
                  {usedUp && <span className="text-amber-400">Used up</span>}
                </div>
              </div>
              <button onClick={() => updateDiscountCode(dc.id, { active: !dc.active })} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${dc.active && !expired && !usedUp ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                {dc.active && !expired && !usedUp ? "Active" : "Inactive"}
              </button>
              <button onClick={() => deleteDiscountCode(dc.id)} className="text-red-400/60 hover:text-red-400"><span className="material-symbols-outlined text-lg">delete</span></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
