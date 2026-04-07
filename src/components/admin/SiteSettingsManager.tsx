"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store/admin";

const BG_PRESETS = [
  { label: "Default White", mode: "color" as const, value: "#f8f9ff" },
  { label: "Warm Cream", mode: "color" as const, value: "#faf8f5" },
  { label: "Cool Gray", mode: "color" as const, value: "#f0f2f5" },
  { label: "Dark Mode", mode: "color" as const, value: "#0f1117" },
  { label: "Ocean Gradient", mode: "gradient" as const, value: "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)" },
  { label: "Forest", mode: "gradient" as const, value: "linear-gradient(135deg, #f8f9ff 0%, #e8f5e9 100%)" },
  { label: "Sunset", mode: "gradient" as const, value: "linear-gradient(135deg, #fff8f0 0%, #fce4ec 100%)" },
  { label: "Dark Gradient", mode: "gradient" as const, value: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)" },
];

export default function SiteSettingsManager() {
  const { siteSettings, updateSiteSettings } = useAdminStore();
  const [settings, setSettings] = useState({ ...siteSettings });
  const [saved, setSaved] = useState(false);

  const inputCls = "w-full px-3 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/30";
  const labelCls = "text-xs font-bold text-white/50 mb-1.5 block uppercase tracking-wider";

  const handleSave = () => {
    updateSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (key: string, val: string) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Site Settings</h3>

      {/* Background Settings */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400">wallpaper</span>Background
        </h4>
        {/* Mode */}
        <div className="flex gap-2">
          {(["color", "gradient", "image"] as const).map(m => (
            <button key={m} onClick={() => update("bgMode", m)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${settings.bgMode === m ? "bg-emerald-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
              {m === "color" ? "Solid Color" : m === "gradient" ? "Gradient" : "Image"}
            </button>
          ))}
        </div>
        {/* Controls per mode */}
        {settings.bgMode === "color" && (
          <div className="flex items-center gap-3">
            <input type="color" value={settings.bgColor} onChange={e => update("bgColor", e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border border-white/10" />
            <input type="text" value={settings.bgColor} onChange={e => update("bgColor", e.target.value)} className={inputCls + " font-mono max-w-[200px]"} />
          </div>
        )}
        {settings.bgMode === "gradient" && (
          <div><label className={labelCls}>CSS Gradient</label><input type="text" value={settings.bgGradient} onChange={e => update("bgGradient", e.target.value)} className={inputCls + " font-mono"} placeholder="linear-gradient(135deg, #f8f9ff, #e8f5e9)" /></div>
        )}
        {settings.bgMode === "image" && (
          <div><label className={labelCls}>Background Image URL</label><input type="url" value={settings.bgImage} onChange={e => update("bgImage", e.target.value)} className={inputCls} placeholder="https://example.com/bg.jpg" /></div>
        )}
        {/* Presets */}
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Quick Presets</p>
          <div className="grid grid-cols-4 gap-2">
            {BG_PRESETS.map((p, i) => (
              <button key={i} onClick={() => { update("bgMode", p.mode); if (p.mode === "color") update("bgColor", p.value); else update("bgGradient", p.value); }}
                className="group rounded-xl border border-white/10 overflow-hidden hover:border-emerald-500/40 transition-all">
                <div className="h-8" style={{ background: p.value }} />
                <p className="text-[10px] text-white/40 py-1 text-center group-hover:text-white/60">{p.label}</p>
              </button>
            ))}
          </div>
        </div>
        {/* Preview */}
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Preview</p>
          <div className="h-24 rounded-xl border border-white/10 overflow-hidden" style={{
            background: settings.bgMode === "color" ? settings.bgColor : settings.bgMode === "gradient" ? settings.bgGradient : `url(${settings.bgImage}) center/cover`,
          }}>
            <div className="h-full flex items-center justify-center text-sm font-bold" style={{ color: settings.bgColor === "#0f1117" || settings.bgGradient.includes("#0f1117") ? "#fff" : "#121c2a" }}>
              Website Background Preview
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400">palette</span>Brand Colors
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Primary Color</label><div className="flex gap-2"><input type="color" value={settings.primaryColor} onChange={e => update("primaryColor", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10" /><input type="text" value={settings.primaryColor} onChange={e => update("primaryColor", e.target.value)} className={inputCls + " font-mono"} /></div></div>
          <div><label className={labelCls}>Accent Color</label><div className="flex gap-2"><input type="color" value={settings.accentColor} onChange={e => update("accentColor", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10" /><input type="text" value={settings.accentColor} onChange={e => update("accentColor", e.target.value)} className={inputCls + " font-mono"} /></div></div>
        </div>
      </div>

      {/* Site Info */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400">settings</span>General
        </h4>
        <div><label className={labelCls}>Site Name</label><input type="text" value={settings.siteName} onChange={e => update("siteName", e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Promo Banner Text</label><textarea value={settings.promoText} onChange={e => update("promoText", e.target.value)} rows={2} className={inputCls + " resize-none"} /></div>
      </div>

      <button onClick={handleSave} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${saved ? "bg-emerald-500/20 text-emerald-400" : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25"}`}>
        <span className="material-symbols-outlined text-lg">{saved ? "check_circle" : "save"}</span>{saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
