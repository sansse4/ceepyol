"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "Garanti Politikası" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">Garanti Kapsamı</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Tüm ürünlerimiz, distribütör veya üretici firmaların belirttiği garanti koşulları altındadır.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">Garanti Şartları</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ürünlerimiz standart 1-2 yıl veya satın aldığınız ürün grubuna göre değişen Apple, Samsung, vb. markaların kendi uluslararası ya da yerel garanti kapsamındadır.</li>
            <li>Garanti süresi boyunca üründe meydana gelen üretim hatasından kaynaklı arızalar ücretsiz onarılır veya değiştirilir.</li>
            <li>Kullanıcı hatasından kaynaklanan fiziksel hasarlar, sıvı teması, vs. garanti kapsamı dışındadır.</li>
          </ul>
          <p className="mt-8 text-sm">
            Garanti kaydı veya talebi için bize ulaşın: <strong>info@ceepyool.store</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
