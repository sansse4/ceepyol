import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'src', 'lib', 'data', 'local-products.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    // Total site buyers = 500k, distribute randomly across products
    const totalBuyers = 500000;
    const productCount = data.length;

    // Generate random weights for distribution
    const weights = data.map(() => Math.random() * 10 + 1);
    const totalWeight = weights.reduce((a: number, b: number) => a + b, 0);

    data.forEach((p: any, i: number) => {
      // Distribute buyers proportionally with randomness
      const baseBuyers = Math.round((weights[i] / totalWeight) * totalBuyers);
      // Add some noise: between 500 and baseBuyers + 5000
      p.buyerCount = Math.max(500, baseBuyers + Math.floor(Math.random() * 5000 - 2500));
      
      // Random realistic rating between 4.2 and 4.9
      p.rating = Math.round((4.2 + Math.random() * 0.7) * 10) / 10;
      
      // Review count: roughly 5-15% of buyers leave reviews
      p.reviewCount = Math.floor(p.buyerCount * (0.05 + Math.random() * 0.10));
    });

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${data.length} products with random buyers, ratings, and reviews.`,
      sample: data.slice(0, 3).map((p: any) => ({
        name: p.name, 
        buyerCount: p.buyerCount, 
        rating: p.rating, 
        reviewCount: p.reviewCount
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
