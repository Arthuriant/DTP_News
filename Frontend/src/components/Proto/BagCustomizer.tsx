"use client";

import { useState } from "react";
import DynamicPart from "./DynamicPart";
import StaticPart from "./StaticPart";
import Breadcrumb from "../Common/Breadcrumb";
import SpritePart from "./SpritePart";
import { useSearchParams } from "next/navigation";
import { PRODUCTS_CONFIG, ProductConfig } from "@/config/products";

export default function BagCustomizer() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const product = PRODUCTS_CONFIG[productId];
  if (!product) {
    return (
      <div className="p-20 text-center font-bold text-gray-500">
        Produk tidak ditemukan.
      </div>
    );
  }
  return <BagCustomizerInner key={product.id} product={product} />;
}

function BagCustomizerInner({ product }: { product: ProductConfig }) {
  const bagSizes = product.sizes || [];
  const [activeSize, setActiveSize] = useState<string>(
    bagSizes.length > 0 ? bagSizes[0].id : ""
  );
  const [shapeSelections, setShapeSelections] = useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      init[p.id] =
        p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
    });
    return init;
  });

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      const activeShapeId =
        p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
      const variant = p.variants?.find((v) => v.id === activeShapeId);
      const colors = variant?.colors || p.colors || [];
      init[p.id] = colors[0]?.hex || "#000";
    });
    return init;
  });

  const [textureSelections, setTextureSelections] = useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      const activeShapeId =
        p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
      const variant = p.variants?.find((v) => v.id === activeShapeId);
      const textures = variant?.textures || p.textures || [];
      init[p.id] = textures[0]?.id || "base";
    });
    return init;
  });

  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      product.parts.forEach((p) => (init[p.id] = true));
      return init;
    },
  );

  const [activeView, setActiveView] = useState<string>("front");

  // LOGIKA 360 ROTATION
  const TOTAL_FRAMES = 17;
  const [frame360, setFrame360] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;

    if (Math.abs(diff) > 3) {
      setFrame360((prev) => {
        let newFrame = prev + (diff > 0 ? -1 : 1);
        if (newFrame < 0) newFrame = TOTAL_FRAMES - 1;
        if (newFrame >= TOTAL_FRAMES) newFrame = 0;
        return newFrame;
      });
      setStartX(clientX);
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleColorSelect = (partId: string, hexColor: string) =>
    setSelections((p) => ({ ...p, [partId]: hexColor }));
  const handleTextureSelect = (partId: string, textureId: string) =>
    setTextureSelections((p) => ({ ...p, [partId]: textureId }));
  const handleVisibilityToggle = (partId: string) =>
    setVisibleParts((p) => ({ ...p, [partId]: !p[partId] }));
  const handleShapeSelect = (partId: string, shapeId: string) => {
    setShapeSelections((p) => ({ ...p, [partId]: shapeId }));

    const part = product.parts.find((p) => p.id === partId);
    if (part) {
      const variant = part.variants?.find((v) => v.id === shapeId);
      const newColors = variant?.colors || part.colors || [];
      const newTextures = variant?.textures || part.textures || [];

      setSelections((prev) => {
        const currentColor = prev[partId];
        if (!newColors.find((c) => c.hex === currentColor)) {
          return { ...prev, [partId]: newColors[0]?.hex || "#000" };
        }
        return prev;
      });

      setTextureSelections((prev) => {
        const currentTexture = prev[partId];
        if (!newTextures.find((t) => t.id === currentTexture)) {
          return { ...prev, [partId]: newTextures[0]?.id || "base" };
        }
        return prev;
      });
    }
  };

  const calculateTotalPrice = () => {
    let total = product.basePrice || 0;

    product.parts.forEach((part) => {
      if (visibleParts[part.id]) {
        total += part.basePrice || 0;

        const activeShapeId = shapeSelections[part.id] || part.id;
        const variant = part.variants?.find((v) => v.id === activeShapeId);

        if (variant) {
          total += variant.price || 0;
        }

        const currentTextures = variant?.textures || part.textures || [];
        const activeTexture = currentTextures.find(
          (t) => t.id === textureSelections[part.id],
        );
        if (activeTexture) {
          total += activeTexture.price || 0;
        }
      }
    });
    return total;
  };

  const renderProductParts = (pov: string) => {
    return product.parts.map((part) => {
      if (!visibleParts[part.id]) return null;

      const activeShape = shapeSelections[part.id] || part.id;
      const activeColor = selections[part.id];
      const activeTexture = textureSelections[part.id];

      const partZIndex =
        typeof part.zIndex === "number"
          ? part.zIndex
          : (part.zIndex[pov] ?? part.zIndex["Front"] ?? 10);

      if (part.variants?.some((v) => v.staticOverlays)) {
        const activeVariant = part.variants?.find((v) => v.id === activeShape);
        const isPenutupVisible = visibleParts["penutup"] !== false;


        return (
          <div
            key={`${pov}-${part.id}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: partZIndex }}
          >
            {pov === "Front" &&
              activeVariant?.staticOverlays?.map((overlay) => (
                <StaticPart
                  key={overlay.id}
                  imageUrl={overlay.url}
                  zIndex={overlay.zIndex}
                  altText={overlay.name}
                />
              ))}
          </div>
        );
      }

      return (
        <div
          key={`${pov}-${part.id}-${activeShape}`}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: partZIndex }}
        >
          {pov === "360" ? (
            <SpritePart
              productId={product.id}
              partName={activeShape}
              color={activeColor}
              texture={activeTexture}
              zIndex={partZIndex}
              currentFrame={frame360}
              totalFrames={TOTAL_FRAMES}
            />
          ) : (
            <DynamicPart
              productId={product.id}
              pov={pov}
              partName={activeShape}
              color={activeColor}
              texture={activeTexture}
              zIndex={partZIndex}
            />
          )}

          {pov === "Front" &&
            part.staticOverlays?.map((overlay) => (
              <StaticPart
                key={overlay.id}
                imageUrl={overlay.url}
                zIndex={overlay.zIndex}
                altText={overlay.name}
              />
            ))}
        </div>
      );
    });
  };

  const PREVIEW_VIEWS = [
    { id: "360", label: "360°", type: "icon" },
    { id: "front", label: "Depan", type: "image" },
    { id: "back", label: "Belakang", type: "image" },
    { id: "top", label: "Atas", type: "image" },
  ];

  const globalAnimationKey = `${activeView}-${JSON.stringify(selections)}-${JSON.stringify(textureSelections)}-${JSON.stringify(shapeSelections)}-${JSON.stringify(visibleParts)}`;

  return (
    <>
      <style>{`
        @keyframes softFade {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-soft-fade {
          animation: softFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <Breadcrumb title={`Build Your ${product.name}`} pages={["customizer"]} />

      <section className="bg-[#f4f7fa] py-12">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden lg:h-[750px]">
            <div className="w-full lg:w-[55%] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 relative flex flex-col bg-[#f8f9fa] overflow-hidden">
              <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.04)_0%,transparent_70%)] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>

              <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pt-4">
                {activeView !== "360" ? (
                  <div
                    key={globalAnimationKey}
                    className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative"
                  >
                    {renderProductParts(
                      activeView.charAt(0).toUpperCase() + activeView.slice(1),
                    )}
                  </div>
                ) : (
                  <div
                    key={globalAnimationKey}
                    className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      {renderProductParts("360")}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-[11px] font-bold text-gray-600 shadow-sm pointer-events-none flex items-center gap-2 border border-gray-100 z-50">
                      <span className="text-lg leading-none pb-0.5">↔</span>{" "}
                      Geser untuk memutar
                    </div>
                  </div>
                )}
                <p className="mt-8 text-[13px] text-gray-500 font-medium flex items-center gap-1.5">
                  <span className="text-lg leading-none">↻</span> Klik warna di
                  sebelah kanan untuk preview real-time
                </p>
              </div>

              {/* AREA THUMBNAILS BAWAH */}
              <div className="mt-6 flex justify-center z-20 pb-2">
                <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2.5 rounded-2xl border border-[#cbd5e1] shadow-sm">
                  {PREVIEW_VIEWS.map((view) => {
                    const isActive = activeView === view.id;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`relative w-[65px] h-[65px] rounded-xl flex flex-col items-center justify-center transition-all bg-[#f8f9fa] ${isActive ? "border-2 border-[#4154f1] ring-[3.5px] ring-[#e0e7ff] text-[#4154f1]" : "border border-[#cbd5e1] text-[#64748b] hover:border-[#94a3b8]"}`}
                      >
                        {view.type === "icon" ? (
                          <div className="flex flex-col items-center">
                            <svg
                              className="w-6 h-6 mb-0.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span className="text-[10px] font-bold tracking-widest">
                              360°
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold uppercase tracking-widest">
                            {view.label}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* KANAN: CONTROL PANEL */}
            <div className="w-full lg:w-[45%] flex flex-col h-full bg-white">
              <div className="px-8 lg:px-12 pt-10 pb-6 border-b border-gray-100">
                <h2 className="text-[32px] font-extrabold text-[#111827] mb-2 tracking-tight">
                  Kustomisasi {product.name} Anda
                </h2>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">
                  Pilih material terbaik dengan warna yang cocok
                </p>
              </div>

              <div className="flex-grow overflow-y-auto px-8 lg:px-12 py-6 flex flex-col gap-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {bagSizes.length > 0 && (
                  <div className="pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-3 font-bold text-[#111827] text-[13px] uppercase tracking-wider mb-4">
                      <span>Pilih Ukuran</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {bagSizes.map((size) => {
                        const isActive = activeSize === size.id;
                        return (
                          <button
                            key={size.id}
                            onClick={() => setActiveSize(size.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all duration-200 focus:outline-none
                              ${isActive
                                ? "border-[#4154f1] ring-1 ring-[#4154f1] bg-[#eff2ff]"
                                : "border-gray-300 bg-white hover:border-[#4154f1]"
                              }`}
                          >
                            <span className={`text-[15px] font-bold mb-0.5 ${isActive ? "text-[#4154f1]" : "text-gray-900"}`}>
                              {size.title}
                            </span>
                            <span className={`text-[12px] ${isActive ? "text-[#4154f1]/80" : "text-gray-500"}`}>
                              {size.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {product.parts.map((part) => {
                  const isVisible = visibleParts[part.id];

                  const activeShapeId = shapeSelections[part.id] || part.id;
                  const variant = part.variants?.find(
                    (v) => v.id === activeShapeId,
                  );

                  const currentColors = variant?.colors || part.colors || [];

                  
                  const currentTextures =
                    variant?.textures || part.textures || [];

                  const activeColor = currentColors.find(
                    (c) => c.hex === selections[part.id],
                  );
                  const activeTexture = currentTextures.find(
                    (t) => t.id === textureSelections[part.id],
                  );

                  return (
                    <div
                      key={part.id}
                      className="pb-8 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 font-bold text-[#111827] text-[13px] uppercase tracking-wider">
                          <span>{part.name}</span>
                          <button
                            onClick={() => handleVisibilityToggle(part.id)}
                            className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none ${isVisible ? "bg-[#4154f1]" : "bg-[#cbd5e1] border border-gray-300 shadow-inner"}`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-300 ${isVisible ? "translate-x-[22px]" : "translate-x-[2px]"}`}
                            />
                          </button>
                        </div>
                        <span
                          className={`text-[12px] font-medium ${isVisible ? "text-gray-500" : "text-red-400"}`}
                        >
                          {isVisible
                            ? `${activeTexture?.name || ""}, ${activeColor?.name || ""}`
                            : "Dilepas"}
                        </span>
                      </div>

                      <div
                        className={`transition-all duration-300 ${!isVisible ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}
                      >
                        {/* PILIHAN Variant */}
                        {part.variants && (
                          <div className="mb-6">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5">
                              Model {part.name}:
                            </span>

                            <div className="flex flex-wrap gap-2.5">
                              {part.variants.map((v) => {
                                const isShapeActive = activeShapeId === v.id;
                                return (
                                  <button
                                    key={v.id}
                                    onClick={() =>
                                      handleShapeSelect(part.id, v.id)
                                    }
                                    className={`px-4 py-2.5 text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 border
                                      ${
                                        isShapeActive
                                          ? "bg-[#eff2ff] border-[#4154f1] text-[#4154f1] shadow-[0_2px_10px_rgba(65,84,241,0.15)] ring-1 ring-[#4154f1]" // Biru terang saat aktif
                                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 shadow-sm" // Putih abu-abu saat tidak aktif
                                      }
                                    `}
                                  >
                                    <span>{v.name}</span>

                                    {v.priceLabel && (
                                      <span
                                        className={`text-[10px] ${isShapeActive ? "text-[#4154f1]/80" : "text-gray-400 font-medium"}`}
                                      >
                                        ({v.priceLabel})
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* PILIHAN MATERIAL */}
                        {currentTextures.length > 0 && (
                          <div className="mb-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5">
                              Material Kulit:
                            </span>
                            <div className="flex flex-wrap gap-3.5">
                              {currentTextures.map((tex, index) => {
                                const isTextureActive =
                                  textureSelections[part.id] === tex.id;
                                const labelLetter = String.fromCharCode(
                                  65 + index,
                                );

                                return (
                                  <button
                                    key={tex.id}
                                    onClick={() =>
                                      handleTextureSelect(part.id, tex.id)
                                    }
                                    className="group relative focus:outline-none flex flex-col items-center gap-1.5"
                                    title={tex.name}
                                  >
                                    <div
                                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ease-in-out shadow-sm border border-gray-200 
                                      ${
                                        isTextureActive
                                          ? "ring-2 ring-[#4154f1] ring-offset-2 scale-110 bg-[#eff2ff] text-[#4154f1]"
                                          : "bg-gray-50 text-gray-600 hover:scale-105 hover:shadow-md"
                                      }`}
                                    >
                                      {labelLetter}
                                    </div>

                                    {tex.price > 0 && (
                                      <span className="text-[9px] font-bold text-gray-400">
                                        +{tex.price / 1000}k
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* PILIHAN WARNA */}
                        {currentColors.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5">
                              Warna Polesan:
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                              {currentColors.map((color) => {
                                const isColorActive =
                                  selections[part.id] === color.hex;
                                const isLightColor =
                                  color.hex === "#d1d5db" ||
                                  color.hex === "#8a8a8a" ||
                                  color.hex === "#ffffff";
                                return (
                                  <button
                                    key={color.hex}
                                    onClick={() =>
                                      handleColorSelect(part.id, color.hex)
                                    }
                                    className="group relative focus:outline-none"
                                    title={color.name}
                                  >
                                    <div
                                      style={{ backgroundColor: color.hex }}
                                      className={`w-7 h-7 rounded-full transition-all duration-200 ease-in-out ${isLightColor ? "border border-gray-300" : "border border-transparent shadow-sm"} ${isColorActive ? "ring-[2.5px] ring-[#4154f1] ring-offset-2 scale-110" : "hover:scale-110"}`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* HARGA TOTAL */}
              <div className="px-8 lg:px-12 py-8 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] mt-auto transition-all">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[34px] font-extrabold text-[#111827] tracking-tight leading-none transition-all duration-300">
                    Rp {calculateTotalPrice().toLocaleString("id-ID")}
                  </span>
                  <span className="text-[14px] text-gray-500 font-medium">
                    Total kustomisasi
                  </span>
                </div>

                <button className="w-full py-4 px-6 bg-[#4154f1] text-white rounded-md font-bold text-[15px] tracking-wide uppercase transition-colors hover:bg-[#3444c4] active:scale-[0.99] shadow-md shadow-blue-500/20">
                  TAMBAH KE KERANJANG
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
