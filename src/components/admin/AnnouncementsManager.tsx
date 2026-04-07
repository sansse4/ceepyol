"use client";

import { useState } from "react";
import { useAdminStore, Announcement } from "@/lib/store/admin";

const COLORS_PRESETS = [
  { bg: "#006e28", text: "#ffffff" },
  { bg: "#be0037", text: "#ffffff" },
  { bg: "#1a1a2e", text: "#e0e0e0" },
  { bg: "#ff6b00", text: "#ffffff" },
  { bg: "#0d47a1", text: "#ffffff" },
];

export default function AnnouncementsManager() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<Announcement["type"]>("banner");
  const [bgColor, setBgColor] = useState("#006e28");
  const [textColor, setTextColor] = useState("#ffffff");
  const [link, setLink] = useState("");
  const [active, setActive] = useState(true);

  const inputCls = "w-full px-3 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/30";
  const labelCls = "text-xs font-bold text-white/50 mb-1.5 block uppercase tracking-wider";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({ text, type, bgColor, textColor, link: link || undefined, active });
    setText(""); setLink(""); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Announcements</h3>
          <p className="text-xs text-white/40">{announcements.length} total · {announcements.filter(a => a.active).length} active</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-emerald-500/20 transition-all">
          <span className="material-symbols-outlined text-lg">{showForm ? "close" : "add"}</span>
          {showForm ? "Cancel" : "New Announcement"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5 space-y-4">
          <div><label className={labelCls}>Announcement Text *</label><input type="text" value={text} onChange={e => setText(e.target.value)} required className={inputCls} placeholder="🔥 Special offer! 50% OFF everything..." /></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select value={type} onChange={e => setType(e.target.value as Announcement["type"])} className={inputCls}>
                <option value="banner">Banner</option><option value="popup">Popup</option><option value="bar">Bar</option>
              </select>
            </div>
            <div><label className={labelCls}>BG Color</label><div className="flex gap-2"><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10" /><input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className={inputCls + " font-mono"} /></div></div>
            <div><label className={labelCls}>Text Color</label><div className="flex gap-2"><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10" /><input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className={inputCls + " font-mono"} /></div></div>
            <div><label className={labelCls}>Link (optional)</label><input type="url" value={link} onChange={e => setLink(e.target.value)} className={inputCls} placeholder="https://..." /></div>
          </div>
          {/* Preview */}
          <div className="rounded-xl overflow-hidden"><div style={{ backgroundColor: bgColor, color: textColor }} className="px-4 py-3 text-center text-sm font-bold">{text || "Preview text..."}</div></div>
          {/* Presets */}
          <div className="flex gap-2 items-center"><span className="text-[10px] text-white/30 uppercase">Presets:</span>{COLORS_PRESETS.map((p, i) => (<button key={i} type="button" onClick={() => { setBgColor(p.bg); setTextColor(p.text); }} className="w-6 h-6 rounded-full border-2 border-white/10 hover:border-white/40 transition-all" style={{ backgroundColor: p.bg }} />))}</div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="accent-emerald-500" /><span className="text-sm text-white/60">Active</span></label>
            <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"><span className="material-symbols-outlined text-lg">check</span>Create</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {announcements.length === 0 && <div className="text-center py-12"><span className="material-symbols-outlined text-5xl text-white/10 block mb-2">campaign</span><p className="text-white/30 text-sm">No announcements yet</p></div>}
        {announcements.map(ann => (
          <div key={ann.id} className="bg-[#1a1d27]/50 rounded-xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: ann.bgColor }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-semibold truncate">{ann.text}</p>
              <div className="flex items-center gap-2 text-[10px] text-white/30 mt-1">
                <span className="px-1.5 py-0.5 bg-white/5 rounded">{ann.type}</span>
                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button onClick={() => updateAnnouncement(ann.id, { active: !ann.active })} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${ann.active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
              {ann.active ? "Active" : "Inactive"}
            </button>
            <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
          </div>
        ))}
      </div>
    </div>
  );
}
