"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "Şartlar ve Koşullar" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">Kullanım Şartları ve Koşulları</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Ceepyol Store web sitesini ziyaret ettiğiniz için teşekkür ederiz. Sitemizi kullanarak, aşağıdaki hüküm ve koşulları kabul etmiş olursunuz.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">1. Genel Şartlar</h2>
          <p>
            Bu web sitesinde sunulan ürünler ve hizmetler yalnızca yasal satışlar için tasarlanmıştır. Site üzerinden gerçekleştirilen tüm satışlar, stok durumu ve ödeme onayına tabidir.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">2. Fiyatlandırma ve Ödeme</h2>
          <p>
            Tüm fiyatlar önceden haber verilmeksizin değiştirilebilir. Sipariş onayı aşamasında gösterilen fiyat, ilgili sipariş için geçerli ve son fiyattır. Yanlış fiyatlandırma durumunda, siparişi iptal etme hakkını saklı tutarız.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">3. Fikri Mülkiyet</h2>
          <p>
            Bu sitede bulunan tüm logolar, metinler, grafikler ve yazılımlar Ceepyol Store'un veya lisans verenlerinin mülkiyetindedir ve yasal olarak korunmaktadır.
          </p>
          <p className="mt-8 text-sm">
            Daha fazla bilgi için: <strong>info@ceepyool.store</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
