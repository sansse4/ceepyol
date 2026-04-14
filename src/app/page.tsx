import HeroCarousel from "@/components/home/HeroCarousel";
import FlashSaleCountdown from "@/components/home/FlashSaleCountdown";
import ScrollVideoPromo from "@/components/ui/ScrollVideoPromo";
import ShopIphoneSection from "@/components/home/ShopIphoneSection";
import HomeStaticSections from "@/components/home/HomeStaticSections";
import { getProductsByCategory } from "@/lib/data/products-db";

export default async function Home() {
  const iphoneProducts = await getProductsByCategory("iphones");

  return (
    <>
      <HeroCarousel />
      <HomeStaticSections
        afterCategories={<ShopIphoneSection products={iphoneProducts} />}
      />
      <FlashSaleCountdown />
      <ScrollVideoPromo />
    </>
  );
}
