"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DynamicPart from "./DynamicPart";
import StaticPart from "./StaticPart";
import Breadcrumb from "../Common/Breadcrumb";
import SpritePart from "./SpritePart";
import StaticSpritePart from "./StaticSpritePart";
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

  // STEPPER (multi-step panel)
  const hasSizes = bagSizes.length > 0;
  const totalSteps = (hasSizes ? 1 : 0) + product.parts.length;
  const steps = hasSizes
    ? (['size'] as const).concat(product.parts.map(p => p.id))
    : product.parts.map(p => p.id);
  const [currentStep, setCurrentStep] = useState(0);
  const activeStepPartId = steps[currentStep] !== 'size' ? steps[currentStep] : null;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Render preview (highlight part yang sedang aktif di step)
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

      const isActivePart = activeStepPartId === part.id;

      if (part.variants?.some((v) => v.staticOverlays)) {
        const activeVariant = part.variants?.find((v) => v.id === activeShape);

        return (
          <div
            key={`${pov}-${part.id}`}
            className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
              isActivePart ? "ring-4 ring-blue-400 ring-opacity-70 animate-pulse" : ""
            }`}
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
            {pov === "360" &&
              activeVariant?.staticOverlays?.map((overlay) => (
                <StaticSpritePart
                  key={overlay.id}
                  imageUrl={`/assets/products/${product.id}/360/${overlay.id}-base-sprite.png`}
                  zIndex={overlay.zIndex}
                  currentFrame={frame360}
                  totalFrames={TOTAL_FRAMES}
                />
              ))}
          </div>
        );
      }

      return (
        <div
          key={`${pov}-${part.id}-${activeShape}`}
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isActivePart ? "animate-pulse" : ""
          }`}
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

  // State untuk modal
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [showFabricGuideModal, setShowFabricGuideModal] = useState(false);
  const [selectedFabricPartId, setSelectedFabricPartId] = useState<string | null>(null);

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
        /* Animasi pulse untuk highlight */
        @keyframes soft-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: soft-pulse 1.5s ease-in-out infinite;
        }
        /* Scrollbar khusus untuk panel step */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>

      <Breadcrumb title={`Build Your ${product.name}`} pages={["customizer"]} />

      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="flex flex-col lg:flex-row bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden lg:h-[550px] transition-all duration-300 hover:shadow-3xl">
            
            {/* KIRI: PREVIEW */}
            <div className="w-full lg:w-[55%] p-6 lg:p-10 relative flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,84,241,0.08),transparent_70%)] pointer-events-none"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.6),transparent_60%)] pointer-events-none"></div>

              <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pt-4">
                {activeView !== "360" ? (
                  <div
                    key={globalAnimationKey}
                    className="animate-soft-fade w-full max-w-[350px] aspect-[6/5] relative drop-shadow-2xl"
                  >
                    {renderProductParts(
                      activeView.charAt(0).toUpperCase() + activeView.slice(1),
                    )}
                  </div>
                ) : (
                  <div
                    key={globalAnimationKey}
                    className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center drop-shadow-2xl"
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
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-2 border border-white/20 z-50">
                      <span className="text-lg leading-none pb-0.5">↔</span> Geser untuk memutar 360°
                    </div>
                  </div>
                )}
                <p className="mt-8 text-sm text-gray-500 font-medium flex items-center gap-1.5 bg-white/90 px-4 py-2 rounded-full shadow-md border border-gray-100/30 backdrop-blur-sm">
                  <span className="text-blue-500 text-lg">↻</span> Klik warna di sebelah kanan untuk preview real-time
                </p>
              </div>

              {/* THUMBNAILS BAWAH */}
              <div className="mt-6 flex justify-center z-20 pb-2">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-gray-200/30">
                  {PREVIEW_VIEWS.map((view) => {
                    const isActive = activeView === view.id;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`relative w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-[#4154f1] to-[#6374f5] text-white shadow-lg scale-105 ring-4 ring-blue-100/50"
                            : "bg-white text-gray-600 hover:bg-gray-50 hover:text-[#4154f1] hover:shadow-md border border-gray-200/30 hover:border-[#4154f1]/30"
                        }`}
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
                            <span className="text-[10px] font-bold tracking-widest">360°</span>
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

            {/* ========== KANAN: CONTROL PANEL MULTI-STEP ========== */}
            <div className="w-full lg:w-[45%] flex flex-col h-full bg-white/80 backdrop-blur-sm">
              
              {/* HEADER */}
              <div className="px-4 lg:px-6 pt-4 pb-3 border-b border-gray-100/20">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">
                  Kustomisasi {product.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Pilih material dan warna sesuai keinginan
                </p>
              </div>

              {/* NAVIGASI STEP (indikator & tombol) + PROGRESS BAR */}
              <div className="px-4 lg:px-6 py-2 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Step {currentStep + 1}/{totalSteps}
                  </span>
                  <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4154f1] transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep === totalSteps - 1}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* BODY: Sliding Container dengan overflow-hidden */}
              <div className="flex-grow relative min-h-0 overflow-hidden"> {/* PERBAIKAN: overflow-hidden */}
                <div 
                  className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                  
                  {/* STEP UKURAN (jika ada) */}
                  {hasSizes && (
                    <div className="w-full h-full flex-shrink-0 px-4 lg:px-6 py-4 min-h-0">
                      <div className="h-full bg-white rounded-xl p-4 shadow-md flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-3 flex-shrink-0">
                          <h3 className="font-semibold text-gray-700">Pilih Ukuran</h3>
                          <button
                            onClick={() => setShowSizeGuideModal(true)}
                            className="text-xs text-blue-600 underline"
                          >
                            Panduan Ukuran
                          </button>
                        </div>
                        <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                          {bagSizes.map((size) => {
                            const isActive = activeSize === size.id;
                            return (
                              <button
                                key={size.id}
                                onClick={() => setActiveSize(size.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                                  isActive
                                    ? "bg-blue-50 border border-blue-200 shadow-sm"
                                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                                }`}
                              >
                                <div className="text-left">
                                  <p className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {size.title}
                                  </p>
                                  <p className="text-xs text-gray-500">{size.desc}</p>
                                </div>
                                {isActive && (
                                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP UNTUK SETIAP PART */}
                  {product.parts.map((part, index) => {
                    const isVisible = visibleParts[part.id];
                    const activeShapeId = shapeSelections[part.id] || part.id;
                    const variant = part.variants?.find(v => v.id === activeShapeId);
                    const currentColors = variant?.colors || part.colors || [];
                    const currentTextures = variant?.textures || part.textures || [];

                    return (
                      <div key={part.id} className="w-full h-full flex-shrink-0 px-4 lg:px-6 py-4 min-h-0">
                        <div className={`h-full bg-white rounded-xl p-4 shadow-md flex flex-col transition-all duration-300 ${!isVisible ? 'opacity-40' : ''} min-h-0`}>
                          
                          {/* Part Header */}
                          <div className="flex items-center justify-between mb-3 flex-shrink-0">
                            <h3 className="font-semibold text-gray-700">{part.name}</h3>
                            <button
                              onClick={() => handleVisibilityToggle(part.id)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                isVisible ? 'bg-[#4154f1]' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                  isVisible ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>

                          {isVisible ? (
                            <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                              {/* Variants / Model */}
                              {part.variants && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2">Model</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {part.variants.map((v) => (
                                      <button
                                        key={v.id}
                                        onClick={() => handleShapeSelect(part.id, v.id)}
                                        className={`px-3 py-1.5 text-xs rounded-md transition ${
                                          activeShapeId === v.id
                                            ? 'bg-[#4154f1] text-white' // BIRU saat aktif
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {v.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Material (Textures) */}
                              {currentTextures.length > 0 && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-gray-500">Material</p>
                                    <button
                                      onClick={() => {
                                        setSelectedFabricPartId(part.id);
                                        setShowFabricGuideModal(true);
                                      }}
                                      className="text-xs text-blue-600 underline"
                                    >
                                      Panduan Bahan
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {currentTextures.map((tex) => (
                                      <button
                                        key={tex.id}
                                        onClick={() => handleTextureSelect(part.id, tex.id)}
                                        className={`px-3 py-1.5 text-xs rounded-md transition ${
                                          textureSelections[part.id] === tex.id
                                            ? 'bg-[#4154f1] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {tex.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Colors */}
                              {currentColors.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2">Warna</p>
                                  <div className="grid grid-cols-5 gap-2">
                                    {currentColors.map((color) => (
                                      <button
                                        key={color.hex}
                                        onClick={() => handleColorSelect(part.id, color.hex)}
                                        className="group flex flex-col items-center"
                                        title={color.name}
                                      >
                                        <div
                                          style={{ backgroundColor: color.hex }}
                                          className={`w-8 h-8 rounded-full border transition-all ${
                                            selections[part.id] === color.hex
                                              ? 'ring-2 ring-[#4154f1] ring-offset-1 scale-110'
                                              : 'group-hover:scale-105'
                                          }`}
                                        />
                                        <span className="text-[8px] mt-1 text-gray-500 truncate w-full text-center">
                                          {color.name}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                              Bagian disembunyikan
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER: Total Price & Add to Cart */}
              <div className="px-4 lg:px-6 py-3 bg-white/80 border-t border-gray-100/20 shadow-inner flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="text-base font-bold text-gray-900">
                    Rp {calculateTotalPrice().toLocaleString("id-ID")}
                  </span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-[#4154f1] to-[#6374f5] text-white rounded-lg text-xs font-medium tracking-wide hover:from-[#3444c4] hover:to-[#4154f1] transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: DESAIN ELEGAN & FUNGSIONAL */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4154f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-[1100px] w-full mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex lg:justify-start">
              <div className="relative w-full max-w-[320px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                  <img
                    src={`/aset/product/${product.id}/elegan-left.jpg`}
                    alt="Desain elegan"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-white/70 px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Iconic Series</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase block mb-3">Modern Aesthetic</span>
                <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  Desain Elegan <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">& Fungsional</span>
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. 
                  Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "Smart Storage", icon: "M3 7h18M3 12h18M3 17h18" },
                  { title: "Water Proof", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MATERIAL PREMIUM & NYAMAN */}
      <section className="py-24 bg-gray-50/50 relative">
        <div className="max-w-[1100px] w-full mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8 text-right lg:text-left">
              <div className="flex flex-col items-end lg:items-start">
                <div className="inline-block px-3 py-1 mb-4 text-[11px] font-bold tracking-[0.2em] uppercase bg-amber-100 text-amber-700 rounded-lg shadow-sm">
                  Authentic Material
                </div>
                <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  Material Premium <br />
                  <span className="text-amber-600">& Nyaman</span>
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md ml-auto lg:ml-0">
                  Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Kulit sapi pilihan grade A",
                  "Lapisan dalam polyester lembut",
                  "Resleting YKK anti karat"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-end lg:justify-start gap-3 group">
                    <span className="text-gray-700 text-sm font-semibold group-hover:text-amber-600 transition-colors">{item}</span>
                    <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 flex lg:justify-end">
              <div className="relative w-full max-w-[320px] group">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white bg-white">
                  <img
                    src={`/aset/product/${product.id}/premium-right.jpg`}
                    alt="Material premium"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-sm font-medium italic opacity-90">"The texture of perfection"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PANDUAN UKURAN (Grid 4 Kolom) */}
      <section className="py-20 bg-[#f8f9fa] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-[0.2em] text-[10px] uppercase block mb-2">Size Guide</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pilih Proporsi Anda</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
              Pilih berdasarkan dimensi dan kapasitas yang sesuai kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bagSizes.map((size, idx) => (
              <div 
                key={size.id} 
                className={`group bg-white rounded-2xl p-5 border transition-all duration-300 ${
                  activeSize === size.id 
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20" 
                    : "border-gray-100 hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded-full ${
                    activeSize === size.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {size.id}
                  </span>
                  {idx === 1 && (
                    <span className="text-[7px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{size.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="font-mono font-medium text-gray-700">{size.dimensions || '25x15x10 cm'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <span className="text-[8px] text-gray-400 uppercase block">Kapasitas</span>
                    <span className="text-xs font-bold text-gray-800">{size.capacity || '10L'}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <span className="text-[8px] text-gray-400 uppercase block">Berat</span>
                    <span className="text-xs font-bold text-gray-800">{size.weight || '0.8kg'}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4 line-clamp-2 h-8">
                  {size.desc}
                </p>
                <button 
                  onClick={() => setActiveSize(size.id)}
                  className={`w-full py-2.5 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-all ${
                    activeSize === size.id 
                      ? "bg-black text-white shadow-md" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  {activeSize === size.id ? '✓ Terpilih' : `Pilih ${size.title}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIAL */}
      <section className="pb-20 bg-white">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xl font-semibold text-gray-700">Garansi 2 Tahun</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span className="text-xl font-semibold text-gray-700">+1000 Pengguna</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xl font-semibold text-gray-700">Rating 4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL PANDUAN UKURAN */}
      {showSizeGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Panduan Ukuran</h3>
              <button
                onClick={() => setShowSizeGuideModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bagSizes.map((size) => (
                <div
                  key={size.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="w-full h-32 bg-white rounded-xl mb-3 flex items-center justify-center text-gray-400">
                    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="4" y="7" width="16" height="14" rx="2" />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">{size.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{size.description || 'Fits up to 11" tablet'}</p>
                  <div className="mt-3 text-xs text-gray-500">
                    <div>
                      Volume: <span className="font-medium text-gray-700">{size.volume || '6L'}</span>
                    </div>
                    <div>
                      Dimensi: <span className="font-medium text-gray-700">{size.dimensions || '12.2"w x 10"h x 4"d'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

{/* MODAL PANDUAN BAHAN */}
      {showFabricGuideModal && selectedFabricPartId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
          onClick={() => setShowFabricGuideModal(false)}
        >
          <div
            className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan Aksen */}
            <div className="relative flex justify-between items-center p-8 border-b border-gray-50">
              <div className="absolute top-0 left-8 h-1 w-16 bg-indigo-600 rounded-b-full"></div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Panduan Bahan</h3>
                <p className="text-sm text-gray-500 mt-1">Pilih karakter bahan yang sesuai dengan gayamu</p>
              </div>
              <button
                onClick={() => setShowFabricGuideModal(false)}
                className="group p-2 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-8 space-y-4 custom-scrollbar">
              {(() => {
                const part = product.parts.find((p) => p.id === selectedFabricPartId);
                if (!part) return null;
                const activeShapeId = shapeSelections[part.id] || part.id;
                const variant = part.variants?.find((v) => v.id === activeShapeId);
                const textures = variant?.textures || part.textures || [];
                
                return (
                  <div className="grid gap-5">
                    {textures.map((tex) => (
                      <div
                        key={tex.id}
                        className="group flex flex-col md:flex-row gap-6 p-5 bg-white border border-gray-100 rounded-3xl hover:border-indigo-200 hover:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.2)] transition-all duration-300 cursor-default"
                      >
                        {/* Thumbnail dengan Shadow & Overlay */}
                        <div className="relative w-full md:w-40 h-40 shrink-0 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-50 shadow-inner">
                           {/* Jika ada image: <img src={tex.image} className="..." /> */}
                          <svg className="w-12 h-12 text-gray-200 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100">Premium</div>
                        </div>

                        <div className="flex flex-col justify-center flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">{tex.name}</h4>
                            {tex.price > 0 && (
                              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                                + Rp {tex.price.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            {tex.description || 'Karakteristik bahan yang lembut, tahan lama, dan memberikan kenyamanan maksimal untuk penggunaan jangka panjang.'}
                          </p>
                          
                          <div className="mt-4 flex gap-2">
                             <div className="h-1.5 w-1/3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-full opacity-60"></div>
                             </div>
                             <div className="h-1.5 w-1/4 bg-gray-100 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}