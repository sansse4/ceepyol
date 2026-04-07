"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/product";

// Map DB row (snake_case) to Product interface (camelCase)
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as Product["category"],
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    monthlyPrice: row.monthly_price ? Number(row.monthly_price) : undefined,
    images: row.images as { src: string; alt: string }[],
    colors: row.colors as { name: string; hex: string; image?: string }[],
    storage: row.storage as { label: string; priceAdd: number }[] | undefined,
    specs: row.specs as { label: string; value: string }[],
    description: row.description as string,
    badges: row.badges as string[],
    condition: row.condition as Product["condition"],
    inStock: row.in_stock as boolean,
    rating: Number(row.rating),
    reviewCount: row.review_count as number,
  };
}

let cachedProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map(mapProduct);
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetchProducts();
    }

    fetchPromise.then((data) => {
      cachedProducts = data;
      setProducts(data);
      setLoading(false);
      fetchPromise = null;
    });
  }, []);

  return { products, loading };
}
