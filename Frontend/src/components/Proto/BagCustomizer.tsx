"use client";

import { useState } from "react";
import DynamicBag from "./DynamicBag";

const BagCustomizer = () => {
  // State untuk menyimpan warna yang sedang dipilih (default: Pink)
  const [selectedColor, setSelectedColor] = useState<string>("#C05D7A");

  // Daftar pilihan warna untuk e-commerce
  const colorOptions = [
    { name: "Monster Pink", hex: "#C05D7A" },
    { name: "Toxic Green", hex: "#10B981" },
    { name: "Ocean Blue", hex: "#3B82F6" },
    { name: "Dark Shadow", hex: "#374151" },
  ];

  return (
    <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-center justify-center">
      {/* Bagian Kiri: Preview Gambar */}
      <div className="w-full md:w-1/2 flex justify-center bg-gray-50 rounded-2xl p-8">
        <DynamicBag color={selectedColor} />
      </div>

      {/* Bagian Kanan: Detail Produk & Pilihan Warna */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monster Sling Bag 3D</h1>
          <p className="text-gray-500">Customize your little monster companion.</p>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-gray-700">
            Color: <span className="font-normal text-gray-500">{colorOptions.find(c => c.hex === selectedColor)?.name}</span>
          </p>
          
          {/* Tombol Pemilih Warna */}
          <div className="flex gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedColor(color.hex)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.hex ? "border-gray-900 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>

        <button className="mt-4 bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full md:w-auto">
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default BagCustomizer;