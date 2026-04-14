import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = {
  title: "Hakkımızda",
  description: "ceepyol'un premium teknolojiyi erişilebilir ve sürdürülebilir kılma misyonunu öğrenin.",
};

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]} />

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-headline)] mb-6">
          Premium Teknoloji,{" "}
          <span className="text-primary">Sorumlu Bir Şekilde Seçilmiş</span>
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          ceepyol, elektronik atığı azaltırken premium teknolojiyi herkese erişilebilir kılma misyonundadır. Harika teknolojinin dünyaya mal olmaması gerektiğine inanıyoruz — kelimenin tam anlamıyla.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: "verified",
            title: "Kalite Garantisi",
            desc: "Her cihaz titiz 70+ noktalı bir incelemeden geçer. Yalnızca en yüksek standartlarımızı karşılayan ürünleri satıyoruz.",
          },
          {
            icon: "recycling",
            title: "Sürdürülebilir Seçim",
            desc: "Yenilenmiş teknoloji seçerek e-atıkları ve yeni cihaz üretiminin çevresel etkisini azaltmaya yardımcı olursunuz.",
          },
          {
            icon: "shield",
            title: "Alıcı Koruması",
            desc: "12 ay garanti, 30 gün iade ve ₺3000 üzeri siparişlerde ücretsiz kargo. Güvenle alışveriş yapın.",
          },
        ].map((value) => (
          <div
            key={value.title}
            className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">{value.icon}</span>
            </div>
            <h3 className="font-bold text-xl mb-3">{value.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-primary to-[#004d1a] rounded-3xl p-12 lg:p-16 text-white text-center mb-20">
        <h2 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-12">
          Rakamlarla Etkimiz
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "500B+", label: "Mutlu Müşteri" },
            { value: "5+ Ton", label: "E-atık Engellendi" },
            { value: "4.8/5", label: "Ortalama Puan" },
            { value: "70B+", label: "Değerlendirme" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-emerald-200 text-sm font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-6">
          Hikayemiz
        </h2>
        <div className="text-on-surface-variant leading-relaxed space-y-4">
          <p>
            ceepyol basit bir fikirle kuruldu: premium teknoloji tek kullanımlık olmamalı.
            Her yıl milyonlarca mükemmel çalışan cihaz atılarak büyüyen e-atık krizine katkıda bulunuyor.
          </p>
          <p>
            Kalite konusundaki kararlılığımızı paylaşan yalnızca sertifikalı yenileyicilerle çalışıyoruz.
            Her cihaz, en yüksek standartları karşıladığından emin olmak için kapsamlı teste, onarıma ve kozmetik restorasyona tabi tutulur.
          </p>
          <p>
            ceepyol&apos;u seçerek sadece harika bir fırsat yakalamış olmuyorsunuz — atığı azaltmak ve daha sürdürülebilir bir teknoloji ekosistemini desteklemek için bilinçli bir tercih yapıyorsunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
