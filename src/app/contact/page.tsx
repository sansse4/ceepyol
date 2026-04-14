"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
      <Breadcrumb items={[{ label: "İletişim" }]} />
      
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 mt-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-primary">İletişim ve Destek</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6">
          <p>
            Herhangi bir sorunuz, öneriniz veya yardıma ihtiyacınız olduğunda bize aşağıdaki yollardan ulaşabilirsiniz. Müşteri destek ekibimiz size en kısa sürede geri dönüş yapacaktır.
          </p>

          <div className="flex flex-col gap-6 mt-8 p-6 bg-surface-container-lowest dark:bg-surface-container/50 rounded-2xl border border-surface-variant/30">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <div className="font-bold text-on-surface mb-1">E-posta</div>
                <a href="mailto:info@ceepyool.store" className="text-primary font-medium hover:underline">info@ceepyool.store</a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined">phone_enabled</span>
              </div>
              <div>
                <div className="font-bold text-on-surface mb-1">Telefon / WhatsApp</div>
                <a href="https://wa.me/447916695072" className="text-primary font-medium hover:underline">+44 7916 695072</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
