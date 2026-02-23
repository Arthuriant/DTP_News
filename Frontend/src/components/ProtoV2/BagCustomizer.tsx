"use client";
import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb"; // Sesuaikan path jika perlu

// --- KONFIGURASI WARNA & LABEL ---
const COLOR_PALETTE = {
  body: [
    { key: "black", label: "Black", hex: "#111111" },
    { key: "charcoal", label: "Charcoal", hex: "#3a3a3a" },
    { key: "grey", label: "Grey", hex: "#8a8a8a" },
    { key: "lightgrey", label: "Light Grey", hex: "#c8c8c8" },
    { key: "pink", label: "Pink", hex: "#e8729a" },
    { key: "hotpink", label: "Hot Pink", hex: "#c0185a" },
    { key: "red", label: "Red", hex: "#c0392b" },
    { key: "darkred", label: "Dark Red", hex: "#7b1a1a" },
    { key: "blue", label: "Blue", hex: "#2563eb" },
    { key: "navy", label: "Navy", hex: "#1b2a4a" },
  ],
  telinga: [
    { key: "black", label: "Black", hex: "#111111" },
    { key: "charcoal", label: "Charcoal", hex: "#3a3a3a" },
    { key: "grey", label: "Grey", hex: "#8a8a8a" },
    { key: "pink", label: "Pink", hex: "#e8729a" },
    { key: "hotpink", label: "Hot Pink", hex: "#c0185a" },
    { key: "red", label: "Red", hex: "#c0392b" },
    { key: "blue", label: "Blue", hex: "#2563eb" },
    { key: "navy", label: "Navy", hex: "#1b2a4a" },
  ],
  tali: [
    { key: "black", label: "Black", hex: "#111111" },
    { key: "charcoal", label: "Charcoal", hex: "#3a3a3a" },
    { key: "grey", label: "Grey", hex: "#8a8a8a" },
    { key: "pink", label: "Pink", hex: "#e8729a" },
    { key: "hotpink", label: "Hot Pink", hex: "#c0185a" },
    { key: "red", label: "Red", hex: "#c0392b" },
    { key: "blue", label: "Blue", hex: "#2563eb" },
    { key: "navy", label: "Navy", hex: "#1b2a4a" },
  ],
  hiasan: [
    { key: "black", label: "Black", hex: "#111111" },
    { key: "grey", label: "Grey", hex: "#8a8a8a" },
    { key: "pink", label: "Pink", hex: "#e8729a" },
    { key: "hotpink", label: "Hot Pink", hex: "#c0185a" },
    { key: "red", label: "Red", hex: "#c0392b" },
    { key: "darkred", label: "Dark Red", hex: "#7b1a1a" },
    { key: "blue", label: "Blue", hex: "#2563eb" },
    { key: "navy", label: "Navy", hex: "#1b2a4a" },
  ],
};

const PART_LABELS = {
  body: { name: "Body", icon: "🧳" },
  telinga: { name: "Telinga Tas", icon: "🤝" },
  tali: { name: "Tali Bahu", icon: "〰️" },
  hiasan: { name: "Hiasan Monster", icon: "👾" },
};

// Pastikan tipe data sesuai (opsional tapi baik untuk TypeScript)
type Part = keyof typeof COLOR_PALETTE;

const BagCustomizer = () => {
  // State untuk menyimpan pilihan warna masing-masing part
  const [selections, setSelections] = useState<Record<Part, string>>({
    body: "black",
    telinga: "black",
    tali: "black",
    hiasan: "black",
  });

  const handleColorSelect = (part: Part, colorKey: string) => {
    setSelections((prev) => ({
      ...prev,
      [part]: colorKey,
    }));
  };

  const handleAddToCart = () => {
    const summary = Object.entries(selections)
      .map(([part, colorKey]) => {
        const colorObj = COLOR_PALETTE[part as Part].find((c) => c.key === colorKey);
        return `${PART_LABELS[part as Part].name}: ${colorObj ? colorObj.label : colorKey}`;
      })
      .join("\n");

    alert(`🛍 Ditambahkan ke keranjang!\n\n${summary}\n\nIntegrasikan fungsi ini dengan backend-mu ya!`);
  };

  return (
    <>
      <Breadcrumb title={"Build Your Bag"} pages={["customizer"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Main Wrapper - Menggunakan styling card dari template kamu */}
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-1 overflow-hidden">
            
            {/* KIRI: PREVIEW AREA */}
            <div className="w-full lg:w-3/5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-3 relative flex flex-col items-center justify-center bg-[#f8f9fa] overflow-hidden">
              
              {/* Dekorasi background bulat (opsional, dari bawaan index.html) */}
              <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

              <div className="z-10 w-full max-w-[400px] aspect-[4/5] relative">
                {/* Next/Image digunakan agar optimal. 
                  Urutan menentukan z-index (bawah ke atas).
                  Perhatikan path sudah menggunakan /assets/ sesuai direktori Next.js public 
                */}
                <Image
                  src={`/assets/body_${selections.body}.png`}
                  alt="body layer"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
                <Image
                  src={`/assets/telinga_${selections.telinga}.png`}
                  alt="telinga layer"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
                <Image
                  src={`/assets/tali_${selections.tali}.png`}
                  alt="tali layer"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
                <Image
                  src={`/assets/hiasan_${selections.hiasan}.png`}
                  alt="hiasan layer"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                />
              </div>
              <p className="mt-8 text-sm text-gray-500 font-medium z-10">
                ↻ Klik warna di sebelah kanan untuk preview real-time
              </p>
            </div>

            {/* KANAN: CONTROL PANEL */}
            <div className="w-full lg:w-2/5 p-8 lg:p-10 flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-dark mb-2">Design Your Bag</h2>
                <p className="text-body-color text-sm">
                  Pilih warna untuk setiap bagian tas dan lihat hasilnya seketika.
                </p>
              </div>

              {/* Looping untuk semua part tas */}
              <div className="flex flex-col gap-6 flex-grow">
                {(Object.keys(COLOR_PALETTE) as Part[]).map((part) => {
                  const currentActiveLabel = COLOR_PALETTE[part].find(
                    (c) => c.key === selections[part]
                  )?.label;

                  return (
                    <div key={part} className="border-b border-gray-3 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 font-semibold text-dark text-sm uppercase tracking-wide">
                          <span>{PART_LABELS[part].icon}</span>
                          <span>{PART_LABELS[part].name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{currentActiveLabel}</span>
                      </div>

                      {/* Swatch Grid */}
                      <div className="flex flex-wrap gap-3">
                        {COLOR_PALETTE[part].map((color) => {
                          const isActive = selections[part] === color.key;
                          // Memastikan warna terang memiliki border agar terlihat (seperti di vanilla css)
                          const isLightColor = ["#e8e5de", "#e9c46a", "#c8c8c8"].includes(color.hex);

                          return (
                            <button
                              key={color.key}
                              onClick={() => handleColorSelect(part, color.key)}
                              aria-label={`Pilih warna ${color.label} untuk ${PART_LABELS[part].name}`}
                              className="group relative"
                            >
                              <div
                                style={{ backgroundColor: color.hex }}
                                className={`w-9 h-9 rounded-full transition-all duration-200 ease-in-out hover:scale-110 
                                  ${isLightColor ? "border border-gray-300" : ""}
                                  ${isActive ? "ring-2 ring-blue ring-offset-2 border-transparent scale-110" : "ring-0 ring-transparent outline-none"}
                                `}
                              />
                              {/* Tooltip khas bawaan yang di-convert ke Tailwind */}
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] font-medium tracking-wider px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                {color.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Add to Cart */}
              <div className="mt-8 pt-6 border-t border-gray-3">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-dark">Rp 1.250.000</span>
                  <span className="text-sm text-gray-500">Sudah termasuk kustomisasi</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 bg-blue text-white rounded-md font-medium tracking-wide uppercase transition-colors hover:bg-blue-dark active:scale-[0.98]"
                >
                  Tambah ke Keranjang
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BagCustomizer;