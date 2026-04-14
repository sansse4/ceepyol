"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "Gizlilik Politikası" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">Gizlilik Politikası</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Ceepyol Store olarak gizliliğinizi ciddiye alıyoruz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya sitemiz üzerinden bir satın alma işlemi gerçekleştirdiğinizde kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve paylaşıldığını açıklamaktadır.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">1. Topladığımız Kişisel Bilgiler</h2>
          <p>
            Siteyi ziyaret ettiğinizde, cihazınız hakkında web tarayıcınız, IP adresiniz, saat diliminiz ve cihazınızda yüklü olan bazı çerezler hakkında bilgiler de dahil olmak üzere belirli bilgileri otomatik olarak toplarız.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">2. Verilerinizi Nasıl Kullanıyoruz?</h2>
          <p>
            Topladığımız Sipariş Bilgilerini genel olarak Site aracılığıyla verilen siparişleri yerine getirmek için kullanırız (ödeme bilgilerinizin işlenmesi, nakliyenin ayarlanması ve size fatura ve/veya sipariş onaylarının sağlanması dahil). Ayrıca size pazarlama iletişimleri göndermek için iletişim bilgilerinizi kullanabiliriz.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">3. Veri Güvenliği</h2>
          <p>
            Kişisel bilgilerinizi korumak için uygun güvenlik önlemleri uyguluyoruz. Ödeme işlemleri güvenli SSL şifrelemesi ile işlenmektedir.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-8 mb-4">İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili herhangi bir sorunuz varsa veya şikayette bulunmak istiyorsanız, lütfen bizimle e-posta yoluyla <strong>info@ceepyool.store</strong> adresinden iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
