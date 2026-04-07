import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data/products-db";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}
