"use client";

import { useState } from "react";
import { Product } from "@/lib/types/product";

interface Props { onAdd: (p: Product) => void; onCancel: () => void; }

export default function AddProductForm({ onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [category, setCategory] = useState<Product["category"]>("iphones");
  const [condition, setCondition] = useState<Product["condition"]>("New");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [colors, setColors] = useState([{ name: "", hex: "#888888", image: "" }]);
  const [storage, setStorage] = useState([{ label: "", priceAdd: 0 }]);
  const [specs, setSpecs] = useState([{ label: "", value: "" }]);
  const [badges, setBadges] = useState<string[]>([""]);
  const [inStock, setInStock] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: `custom-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      name, brand, price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      monthlyPrice: monthlyPrice ? Number(monthlyPrice) : undefined,
      category, condition, description,
      images: imageUrls.filter(u => u.trim()).map(u => ({ src: u, alt: name })),
      colors: colors.filter(c => c.name.trim()).map(c => ({ name: c.name, hex: c.hex, image: c.image || undefined })),
      storage: storage.filter(s => s.label.trim()).map(s => ({ label: s.label, priceAdd: Number(s.priceAdd) || 0 })),
      specs: specs.filter(s => s.label.trim() && s.value.trim()),
      badges: badges.filter(b => b.trim()),
      inStock, rating: 5.0, reviewCount: 0,
    };
    if (product.images.length === 0) product.images = [{ src: "", alt: name }];
    if (product.colors.length === 0) product.colors = [{ name: "Default", hex: "#888888" }];
    onAdd(product);
  };

  const inputCls = "w-full px-3 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-white/30";
  const labelCls = "text-xs font-bold text-white/50 mb-1.5 block uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-emerald-400 text-lg">info</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Product Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="iPhone 16 Pro Max" /></div>
          <div><label className={labelCls}>Brand *</label><input type="text" value={brand} onChange={e => setBrand(e.target.value)} required className={inputCls} placeholder="Apple" /></div>
          <div><label className={labelCls}>Price *</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required className={inputCls} placeholder="999" /></div>
          <div><label className={labelCls}>Original Price</label><input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className={inputCls} placeholder="1299" /></div>
          <div><label className={labelCls}>Monthly Price</label><input type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} className={inputCls} placeholder="49.95" /></div>
          <div>
            <label className={labelCls}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value as Product["category"])} className={inputCls}>
              <option value="iphones">iPhones</option><option value="samsung">Samsung</option><option value="laptops">Laptops</option>
              <option value="tablets">Tablets</option><option value="watches">Watches</option><option value="audio">Audio</option>
              <option value="gaming">Gaming</option><option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Condition</label>
            <select value={condition} onChange={e => setCondition(e.target.value as Product["condition"])} className={inputCls}>
              <option value="New">New</option><option value="Like New">Like New</option><option value="Certified Refurbished">Certified Refurbished</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
              <span className="text-sm text-white/70">In Stock</span>
            </label>
          </div>
        </div>
        <div className="mt-4"><label className={labelCls}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="Describe the product..." /></div>
      </div>

      {/* Images */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-blue-400 text-lg">image</span>
          Product Images
          <span className="text-[10px] text-white/30 font-normal ml-auto">{imageUrls.filter(u=>u.trim()).length} images</span>
        </h3>
        <div className="space-y-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="url" value={url} onChange={e => { const u = [...imageUrls]; u[i] = e.target.value; setImageUrls(u); }} className={inputCls} placeholder={`Image URL ${i + 1}`} />
              {url && <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0"><img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display='none'} /></div>}
              {imageUrls.length > 1 && <button type="button" onClick={() => setImageUrls(imageUrls.filter((_,j) => j!==i))} className="text-red-400 hover:text-red-300"><span className="material-symbols-outlined text-lg">close</span></button>}
            </div>
          ))}
          <button type="button" onClick={() => setImageUrls([...imageUrls, ""])} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2"><span className="material-symbols-outlined text-sm">add</span>Add Image</button>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-purple-400 text-lg">palette</span>Colors
        </h3>
        <div className="space-y-3">
          {colors.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="color" value={c.hex} onChange={e => { const cl=[...colors]; cl[i]={...cl[i],hex:e.target.value}; setColors(cl); }} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10" />
              <input type="text" value={c.name} onChange={e => { const cl=[...colors]; cl[i]={...cl[i],name:e.target.value}; setColors(cl); }} className={inputCls} placeholder="Color name" />
              <input type="url" value={c.image||""} onChange={e => { const cl=[...colors]; cl[i]={...cl[i],image:e.target.value}; setColors(cl); }} className={inputCls} placeholder="Color image URL (optional)" />
              {colors.length > 1 && <button type="button" onClick={() => setColors(colors.filter((_,j) => j!==i))} className="text-red-400"><span className="material-symbols-outlined text-lg">close</span></button>}
            </div>
          ))}
          <button type="button" onClick={() => setColors([...colors, { name: "", hex: "#888888", image: "" }])} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span>Add Color</button>
        </div>
      </div>

      {/* Storage */}
      <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-amber-400 text-lg">storage</span>Storage Options
        </h3>
        <div className="space-y-2">
          {storage.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={s.label} onChange={e => { const st=[...storage]; st[i]={...st[i],label:e.target.value}; setStorage(st); }} className={inputCls} placeholder="e.g. 256GB" />
              <input type="number" value={s.priceAdd||""} onChange={e => { const st=[...storage]; st[i]={...st[i],priceAdd:Number(e.target.value)}; setStorage(st); }} className={inputCls + " max-w-[120px]"} placeholder="+$0" />
              {storage.length > 1 && <button type="button" onClick={() => setStorage(storage.filter((_,j) => j!==i))} className="text-red-400"><span className="material-symbols-outlined text-lg">close</span></button>}
            </div>
          ))}
          <button type="button" onClick={() => setStorage([...storage, { label: "", priceAdd: 0 }])} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span>Add Storage</button>
        </div>
      </div>

      {/* Specs & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-cyan-400 text-lg">list_alt</span>Specs
          </h3>
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input type="text" value={s.label} onChange={e => { const sp=[...specs]; sp[i]={...sp[i],label:e.target.value}; setSpecs(sp); }} className={inputCls} placeholder="Display" />
              <input type="text" value={s.value} onChange={e => { const sp=[...specs]; sp[i]={...sp[i],value:e.target.value}; setSpecs(sp); }} className={inputCls} placeholder='6.7" OLED' />
              {specs.length > 1 && <button type="button" onClick={() => setSpecs(specs.filter((_,j) => j!==i))} className="text-red-400"><span className="material-symbols-outlined text-lg">close</span></button>}
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, { label: "", value: "" }])} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span>Add Spec</button>
        </div>
        <div className="bg-[#1a1d27]/50 rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-pink-400 text-lg">sell</span>Badges
          </h3>
          {badges.map((b, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input type="text" value={b} onChange={e => { const bd=[...badges]; bd[i]=e.target.value; setBadges(bd); }} className={inputCls} placeholder="e.g. Best Seller" />
              {badges.length > 1 && <button type="button" onClick={() => setBadges(badges.filter((_,j) => j!==i))} className="text-red-400"><span className="material-symbols-outlined text-lg">close</span></button>}
            </div>
          ))}
          <button type="button" onClick={() => setBadges([...badges, ""])} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><span className="material-symbols-outlined text-sm">add</span>Add Badge</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-lg">check</span>Add Product
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 bg-white/5 text-white/60 font-bold rounded-xl hover:bg-white/10 transition-all">Cancel</button>
      </div>
    </form>
  );
}
