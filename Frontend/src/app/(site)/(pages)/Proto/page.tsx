import BagCustomizer from "@/components/Proto/BagCustomizer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize Your Bag | NextCommerce Nextjs E-commerce template",
  description: "Customize the color of your 3D monster bag directly on NextCommerce.",
  // other metadata
};

const CustomizePage = () => {
  return (
    <main>
      {/* Memanggil komponen interaktif utama */}
      <BagCustomizer />
    </main>
  );
};

export default CustomizePage;