import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProductsByCategory } from "@/lib/data/products-db";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductCard from "@/components/ui/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";

// Buyer reviews for iPhone 17 Pro Max
const IP17PM_REVIEWS = [
  {
    id: "r1",
    name: "Ahmet Yılmaz",
    initials: "AY",
    rating: 5,
    date: "12 Mart 2026",
    text: "Bu telefon gerçekten muhteşem. Kamera sistemi inanılmaz — gece çekimlerinde bile kristal netliğinde fotoğraflar çekiyor. Titanium kasası hem hafif hem de çok dayanıklı hissettiriyor. Pil ömrü de bir önceki modelime göre çok daha iyi.",
    photos: [
      { src: "/images/reviews/review-1.jpg", alt: "Ahmet'in fotoğrafı" },
      { src: "/images/reviews/review-2.jpg", alt: "Ahmet'in fotoğrafı 2" },
    ],
    verified: true,
  },
  {
    id: "r2",
    name: "Elif Kaya",
    initials: "EK",
    rating: 5,
    date: "28 Şubat 2026",
    text: "Cosmic Orange rengi gerçekten çok etkileyici, görsellerde de harika görünüyor ama elde tutunca çok daha güzel. Apple Intelligence özellikleri de beklediğimden çok daha kullanışlı çıktı. Kesinlikle tavsiye ederim.",
    photos: [
      { src: "/images/reviews/review-3.jpg", alt: "Elif'in fotoğrafı" },
    ],
    verified: true,
  },
  {
    id: "r3",
    name: "Murat Demir",
    initials: "MD",
    rating: 4,
    date: "15 Şubat 2026",
    text: "Harika bir telefon, hiç şüphe yok. Kamera kalitesi ve ekran mükemmel. Tek şikayetim fiyatının biraz yüksek olması ama aldığınızda değdiğini anlıyorsunuz. Camera Control butonu başta tuhaf geldi ama alıştıktan sonra çok kullanışlı.",
    photos: [
      { src: "/images/reviews/review-4.jpg", alt: "Murat'ın fotoğrafı" },
      { src: "/images/reviews/review-5.jpg", alt: "Murat'ın fotoğrafı 2" },
    ],
    verified: true,
  },
  {
    id: "r4",
    name: "Zeynep Arslan",
    initials: "ZA",
    rating: 5,
    date: "5 Şubat 2026",
    text: "iPhone 15 Pro Max'ten geçtim ve fark inanılmaz. A19 Pro çip her şeyi uçurcasına açıyor, hiçbir şey kasılmıyor. Ekran parlaklığı güneş altında bile mükemmel görünüyor. Bu fiyata bu kalite gerçekten değer.",
    photos: [
      { src: "/images/reviews/review-6.jpg", alt: "Zeynep'in fotoğrafı" },
    ],
    verified: true,
  },
  {
    id: "r5",
    name: "Burak Şahin",
    initials: "BŞ",
    rating: 5,
    date: "22 Ocak 2026",
    text: "Kamera sistemi benim için çok kritikti ve bu telefon beklentimi fazlasıyla karşıladı. 5x optik zoom ile çok uzaktan bile net fotoğraflar çekebiliyorum. Video kalitesi sinematik düzeyde. Profesyonel fotoğrafçılar bile bu telefonla iş yapabilir.",
    photos: [
      { src: "/images/reviews/review-7.jpg", alt: "Burak'ın fotoğrafı" },
      { src: "/images/reviews/review-8.jpg", alt: "Burak'ın fotoğrafı 2" },
    ],
    verified: true,
  },
  {
    id: "r6",
    name: "Selin Öztürk",
    initials: "SÖ",
    rating: 4,
    date: "10 Ocak 2026",
    text: "Telefon gerçekten harika ama kutu içeriği biraz sade. Adaptör gelmemesi can sıkıcı. Bunun dışında her şey mükemmel — Face ID anında açıyor, ekran her açıdan muhteşem görünüyor, pil gün içinde hiç bitmedi.",
    photos: [
      { src: "/images/reviews/review-9.jpg", alt: "Selin'in fotoğrafı" },
    ],
    verified: true,
  },
  {
    id: "r7",
    name: "Kerem Yıldız",
    initials: "KY",
    rating: 5,
    date: "3 Ocak 2026",
    text: "Deep Blue rengi harika görünüyor, titanyum çerçevesiyle çok premium bir his veriyor. Apple Intelligence ile mesajlaşma, özetleme ve görüntü oluşturma özellikleri çok kullanışlı. Gaming performansı da çok iyi, hiç ısınmıyor.",
    photos: [
      { src: "/images/reviews/review-10.jpg", alt: "Kerem'in fotoğrafı" },
    ],
    verified: true,
  },
];

const categoryLabels: Record<string, string> = {
  iphones: "iPhone'lar",
  samsung: "Samsung",
  laptops: "Dizüstü",
  audio: "Ses",
  watches: "Saatler",
  tablets: "Tabletler",
  accessories: "Aksesuarlar",
  gaming: "Oyun",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  return {
    title: `${product.name} | ceepyol`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ceepyol`,
      description: product.description,
      images: product.images.map((img) => ({ url: img.src })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = (await getProductsByCategory(product.category)).filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler", href: "/products" },
          {
            label: categoryLabels[product.category] || product.category,
            href: `/products?category=${product.category}`,
          },
          { label: product.name },
        ]}
      />

      {/* Main Product Section */}
      <ProductPageClient product={product} />

      {/* Specs Section */}
      {product.specs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Teknik Özellikler</h2>
          <div className="bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex gap-4 px-6 py-4 ${
                    i % 2 === 0
                      ? "bg-transparent"
                      : "bg-black/[0.02] dark:bg-white/[0.02]"
                  } ${
                    i < product.specs.length - 2
                      ? "border-b border-black/[0.06] dark:border-white/[0.06]"
                      : ""
                  }`}
                >
                  <span className="text-sm text-on-surface-variant font-medium min-w-[120px] shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's in the Box - Visual section */}
      <section className="mb-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-3xl p-8 sm:p-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12">
          <div className="text-center sm:text-left">
            <span className="material-symbols-outlined text-4xl text-primary mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            <h3 className="text-xl font-bold mb-2">Kutu İçeriği</h3>
            <p className="text-sm text-on-surface-variant">
              Orijinal kutu ve tüm aksesuarları ile birlikte
            </p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            {[
              { icon: "devices", label: product.name.split(" ").slice(0, 2).join(" ") },
              { icon: "cable", label: "USB-C Kablo" },
              { icon: "power", label: "Adaptör" },
              { icon: "inventory_2", label: "Orijinal Kutu" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 bg-white/60 dark:bg-black/20 rounded-2xl px-5 py-4 min-w-[90px]"
              >
                <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Reviews — only for iPhone 17 Pro Max */}
      {product.slug === "iphone-17-pro-max" && (
        <ProductReviews
          reviews={IP17PM_REVIEWS}
          totalReviews={product.reviewCount}
          averageRating={product.rating}
        />
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Bunları da Beğenebilirsiniz</h2>
            <a
              href={`/products?category=${product.category}`}
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Tümünü Gör
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4">
            {relatedProducts.slice(0, 6).map((p) => (
              <div key={p.id} className="shrink-0 w-[220px] sm:w-[260px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
