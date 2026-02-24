import BagCustomizer3D from "@/components/ProtoV2/BagCustomizer3D";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Bag",
  description: "Customize your bag in 3D",
};

export default function ConfiguratorPage() {

  return (
    <main>
      <BagCustomizer3D />
    </main>
  );

}