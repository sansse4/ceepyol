export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "iphones" | "laptops" | "audio" | "watches" | "tablets" | "accessories" | "samsung" | "gaming";
  price: number;
  originalPrice?: number;
  monthlyPrice?: number;
  images: { src: string; alt: string }[];
  colors: { name: string; hex: string; image?: string }[];
  storage?: { label: string; priceAdd: number }[];
  specs: { label: string; value: string }[];
  description: string;
  badges: string[];
  condition: "Certified Refurbished" | "Like New" | "New";
  inStock: boolean;
  rating: number;
  reviewCount: number;
  buyerCount?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  unitPrice: number;
  productName: string;
  productImage: string;
  productSlug: string;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  text: string;
  verified: boolean;
}
