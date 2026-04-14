import { Product } from "@/lib/types/product";
import localProducts from "./local-products.json";

// The local products are already somewhat formatted but might have camelCase vs snake_case differences. 
// Assuming the script generated the data with camelCase matching Product interface:
// id, slug, name, brand, category, price, images, colors, specs, description, badges, condition, inStock, rating, reviewCount
const productsData = localProducts as Product[];

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return productsData.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return productsData.filter((p) => p.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return [...productsData].sort((a, b) => b.rating - a.rating).slice(0, 4);
}

export async function getAllProducts(): Promise<Product[]> {
  return productsData;
}

export async function getAllCategories(): Promise<string[]> {
  return [...new Set(productsData.map((r) => r.category))];
}

export async function getAllBrands(): Promise<string[]> {
  return [...new Set(productsData.map((r) => r.brand))];
}

export interface FilterParams {
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "rating" | "newest";
}

export async function filterProducts(params: FilterParams): Promise<Product[]> {
  let results = [...productsData];

  if (params.category && params.category !== "all" && params.category !== "deals") {
    results = results.filter((p) => p.category === params.category);
  }

  if (params.brand) {
    results = results.filter((p) => p.brand === params.brand);
  }

  if (params.condition) {
    results = results.filter((p) => p.condition === params.condition);
  }

  if (params.minPrice !== undefined) {
    results = results.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= params.maxPrice!);
  }

  switch (params.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // no date on local products, just keep original array order or any default
      break;
  }

  if (params.category === "deals") {
    results = results.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }

  return results;
}

export async function getProductsByCategoryAndBrand(
  category: string,
  brand?: string
): Promise<Product[]> {
  let results = productsData.filter((p) => p.category === category);
  if (brand) {
    results = results.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }
  return results;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();

  if (!q) {
    return productsData;
  }

  return productsData.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}
