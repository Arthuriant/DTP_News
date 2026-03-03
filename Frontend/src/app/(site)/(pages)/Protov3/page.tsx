import BagCustomizer from "@/components/ProtoV3/BagCustomizer";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Bag | NextCommerce Nextjs E-commerce template",
  description: "Customize your own bag with our real-time 3D preview.",
};

const CustomizerPage = () => {
  return (
    <main>
      <BagCustomizer />
    </main>
  );
};

export default CustomizerPage;