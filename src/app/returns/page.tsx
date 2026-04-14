"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "İade ve Geri Ödeme Politikası" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">İade ve Değişim Şartları</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Müşteri memnuniyeti bizim önceliğimizdir. Satın aldığınız bir üründen memnun kalmazsanız, ürünü teslim aldığınız tarihten itibaren 14 gün içinde aşağıdaki koşullar dahilinde iade edebilirsiniz.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">1. İade Koşulları</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ürünler kutusunda, orijinal ambalajında ve kullanılmamış olmalıdır.</li>
            <li>Kurulumu tamamlanmış veya aktive edilmiş elektronik cihazların iadesi kabul edilememektedir.</li>
            <li>Promosyon ve hediyeler iade edilecek ürünle birlikte gönderilmelidir.</li>
          </ul>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">2. İade Süreci</h2>
          <p>
            İade işlemi başlatmak için lütfen <strong>info@ceepyool.store</strong> adresinden müşteri hizmetlerimizle iletişime geçin. Talebiniz onaylandıktan sonra tarafınıza bir iade kodu sağlanacaktır.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">3. Geri Ödemeler</h2>
          <p>
            İade edilen ürün depomuzda incelendikten sonra, ödeme yaptığınız aynı yöntemle geri ödemeniz 5-7 iş günü içinde gerçekleştirilir.
          </p>
        </div>
      </div>
    </div>
  );
}
