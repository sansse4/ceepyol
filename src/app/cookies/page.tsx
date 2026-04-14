"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "Çerez Politikası" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">Çerez Politikası (Cookie Policy)</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Alışveriş deneyiminizi iyileştirmek, tercihlerinizi hatırlamak ve sitemizin nasıl kullanıldığını anlamak için çerezleri (cookies) ve benzer teknolojileri kullanıyoruz.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">Çerez Nedir?</h2>
          <p>
            Çerezler, ziyaret ettiğiniz web siteleri tarafından bilgisayarınıza veya mobil cihazınıza yerleştirilen küçük metin dosyalarıdır. Siteyi tekrar ziyaret ettiğinizde cihazınızı tanımasını sağlarlar.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">Nasıl Kullanıyoruz?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Zorunlu Çerezler:</strong> Alışveriş sepeti ve güvenli ödeme gibi temel işlevlerin çalışması için gereklidir.</li>
            <li><strong>Performans Çerezleri:</strong> Ziyaretçilerin siteyi nasıl kullandığını ölçmemize ve hataları tespit etmemize yardımcı olur.</li>
            <li><strong>İşlevsellik Çerezleri:</strong> Dil ve konum gibi tercihlerinizi hatırlar.</li>
          </ul>
          <p className="mt-8 text-sm">
            Çerez tercihlerinizi dilediğiniz zaman tarayıcı ayarlarınızdan değiştirebilirsiniz. Sorularınız için: <strong>info@ceepyool.store</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
