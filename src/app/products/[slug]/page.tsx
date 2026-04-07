import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProductsByCategory } from "@/lib/data/products-db";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ImageGallery from "@/components/product/ImageGallery";
import ProductOptions from "@/components/product/ProductOptions";
import SpecsTable from "@/components/product/SpecsTable";
import ProductCard from "@/components/ui/ProductCard";

const categoryLabels: Record<string, string> = {
  iphones: "iPhones",
  samsung: "Samsung",
  laptops: "Laptops",
  audio: "Audio",
  watches: "Watches",
  tablets: "Tablets",
  accessories: "Accessories",
  gaming: "Gaming",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
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
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: categoryLabels[product.category] || product.category, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 mb-10 sm:mb-16">
        {/* Image Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-block bg-slate-800 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                {product.condition}
              </span>
              <div className="flex items-center gap-1 text-sm">
                <span
                  className="material-symbols-outlined text-amber-400 text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-bold">{product.rating}</span>
                <span className="text-on-surface-variant">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-on-surface-variant mb-6 leading-relaxed">{product.description}</p>

          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-primary-fixed/15 text-primary text-xs font-bold rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <ProductOptions product={product} />
        </div>
      </div>

      {/* Specifications */}
      <section className="mb-10 sm:mb-16">
        <h2 className="text-xl sm:text-2xl font-extrabold font-[family-name:var(--font-headline)] mb-4 sm:mb-6">
          Specifications
        </h2>
        <SpecsTable specs={product.specs} />
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-extrabold font-[family-name:var(--font-headline)] mb-4 sm:mb-6">
            You May Also Like
          </h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
