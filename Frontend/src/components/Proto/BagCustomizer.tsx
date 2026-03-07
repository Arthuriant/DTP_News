"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DynamicPart from "./DynamicPart";
import StaticPart from "./StaticPart";
import Breadcrumb from "../Common/Breadcrumb";
import SpritePart from "./SpritePart";
import StaticSpritePart from "./StaticSpritePart";
import { useSearchParams } from "next/navigation";
import { PRODUCTS_CONFIG, ProductConfig } from "@/config/products";
import { Product } from '../../types/product';
import ProductGallery from "./ProductGallert";
import ProductMarketing from "./ProductMarketing";
import ProductDimensions from "./ProductDimensions";
import RecentlyViewdItems from "../ShopDetails/RecentlyViewd";
import Newsletter from "../Common/Newsletter";

export default function BagCustomizer() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const product = PRODUCTS_CONFIG[productId as string];

  if (!product) {
    return (
      <div className="p-20 text-center font-bold text-slate-500">
        Produk tidak ditemukan.
      </div>
    );
  }
  return <BagCustomizerInner key={product.id} product={product} />;
}

function BagCustomizerInner({ product }: { product: ProductConfig }) {
  const [highlightedPartId, setHighlightedPartId] = useState<string | null>(null);
  const bagSizes = product.sizes || [];
  const hasSizes = bagSizes.length > 0;

  // --- STATES ---
  const [activeSize, setActiveSize] = useState<string>(
    bagSizes.length > 0 ? bagSizes[0].id : ""
  );
  const [shapeSelections, setShapeSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      init[p.id] = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
    });
    return init;
  });

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      const activeShapeId = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
      const variant = p.variants?.find((v) => v.id === activeShapeId);
      const colors = variant?.colors || p.colors || [];
      init[p.id] = colors[0]?.hex || "#000";
    });
    return init;
  });

  const [textureSelections, setTextureSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.parts.forEach((p) => {
      const activeShapeId = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
      const variant = p.variants?.find((v) => v.id === activeShapeId);
      const textures = variant?.textures || p.textures || [];
      init[p.id] = textures[0]?.id || "base";
    });
    return init;
  });

  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    product.parts.forEach((p) => (init[p.id] = true));
    return init;
  });

  const [activeView, setActiveView] = useState<string>("front");

  // Accordion State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { size: true };
    product.parts.forEach((p) => (init[p.id] = true)); 
    return init;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // LOGIKA 360 ROTATION
  const TOTAL_FRAMES = 17;
  const [frame360, setFrame360] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
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

  // --- HANDLERS ---
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

        if (variant) total += variant.price || 0;

        const currentTextures = variant?.textures || part.textures || [];
        const activeTexture = currentTextures.find((t) => t.id === textureSelections[part.id]);
        if (activeTexture) total += activeTexture.price || 0;
      }
    });
    return total;
  };

  // --- RENDERER ---
  const renderProductParts = (pov: string) => {
    return product.parts.map((part) => {
      if (!visibleParts[part.id]) return null;

      const activeShape = shapeSelections[part.id] || part.id;
      const activeColor = selections[part.id];
      const activeTexture = textureSelections[part.id];

      const partZIndex =
        typeof part.zIndex === "number"
          ? part.zIndex
          : part.zIndex[pov as keyof typeof part.zIndex] ?? part.zIndex["Front" as keyof typeof part.zIndex] ?? 10;

      const isHighlighted = highlightedPartId === part.id;
      const isOtherPartHighlighted = highlightedPartId !== null && highlightedPartId !== part.id;

      if (part.variants?.some((v) => v.staticOverlays)) {
        const activeVariant = part.variants?.find((v) => v.id === activeShape);
        return (
          <div
            key={`${pov}-${part.id}`}
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{ zIndex: partZIndex }}
          >
            {pov === "Front" &&
              activeVariant?.staticOverlays?.map((overlay) => (
                <StaticPart key={overlay.id} imageUrl={overlay.url} zIndex={overlay.zIndex} altText={overlay.name} />
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
            className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out ${
              isHighlighted ? "scale-[1.02] drop-shadow-2xl brightness-110 z-50" : ""
            } ${isOtherPartHighlighted ? "opacity-50 grayscale-[30%]" : "opacity-100"}`}
            style={{ zIndex: isHighlighted ? 999 : partZIndex }} 
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
              <StaticPart key={overlay.id} imageUrl={overlay.url} zIndex={overlay.zIndex} altText={overlay.name} />
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

  // Modals
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [showFabricGuideModal, setShowFabricGuideModal] = useState(false);
  const [selectedFabricPartId, setSelectedFabricPartId] = useState<string | null>(null);

  return (
    <>
      <Breadcrumb title={`Kustomisasi Produk`} pages={["customizer"]} />

      {/* ================= 1. MAIN LAYOUT CUSTOMIZER ================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        
        {/* KIRI: PREVIEW STICKY */}
        <div className="w-full lg:w-[55%] lg:sticky lg:top-24 flex flex-col bg-[#f4f4f4] rounded-2xl p-6 lg:p-12 relative">
          <div className="flex-grow flex items-center justify-center w-full min-h-[300px] lg:min-h-[450px] relative z-10">
            {activeView !== "360" ? (
              <div
                key={globalAnimationKey}
                className="animate-soft-fade w-full max-w-[450px] aspect-[6/5] relative drop-shadow-xl"
              >
                {renderProductParts(activeView.charAt(0).toUpperCase() + activeView.slice(1))}
              </div>
            ) : (
              <div
                key={globalAnimationKey}
                className="animate-soft-fade w-full max-w-[450px] aspect-[4/5] relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center drop-shadow-xl"
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 border border-slate-200 z-50">
                  <span className="text-lg leading-none pb-0.5">↔</span> Geser untuk 360°
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails POV */}
          <div className="mt-8 flex justify-center z-20">
            <div className="flex items-center gap-3">
              {PREVIEW_VIEWS.map((view) => {
                const isActive = activeView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`relative w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white border-2 border-slate-900 shadow-md"
                        : "bg-white/50 border border-transparent hover:bg-white hover:border-slate-300 text-slate-500"
                    }`}
                  >
                    {view.type === "icon" ? (
                      <span className="text-[10px] font-bold tracking-wider text-slate-700">360°</span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">{view.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* KANAN: ACCORDION CONTROLS */}
        <div className="w-full lg:w-[45%] flex flex-col pb-12 lg:pb-16">
          
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Custom {product.name}
            </h1>
            <p className="text-slate-500 mb-4">Didesain oleh Anda, dibuat khusus untuk Anda.</p>
            <div className="text-2xl font-semibold text-slate-900">
              Rp {calculateTotalPrice().toLocaleString("id-ID")}
            </div>
          </div>

          <hr className="border-slate-200 mb-4" />

          {/* STEP 1: UKURAN */}
          {hasSizes && (
            <div className="border-b border-slate-200 py-4">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => toggleSection('size')}
              >
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <span className="bg-blue text-white min-w-[24px] h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md shadow-blue-600/30">1</span>
                  Choose Your Size
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSizeGuideModal(true);
                    }}
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    Size guide
                  </button>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openSections['size'] ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {openSections['size'] && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 animate-soft-fade">
                  {bagSizes.map((size) => {
                    const isActive = activeSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => setActiveSize(size.id)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                          isActive
                            ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900 shadow-sm"
                            : "border-slate-200 hover:border-slate-400 bg-white"
                        }`}
                      >
                        <span className={`font-bold text-sm ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {size.title}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">{size.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2++: CUSTOMIZATION PARTS */}
          {product.parts.map((part, index) => {
            const stepNumber = hasSizes ? index + 2 : index + 1;
            const activeShapeId = shapeSelections[part.id] || part.id;
            const variant = part.variants?.find((v) => v.id === activeShapeId);
            const currentColors = variant?.colors || part.colors || [];
            const currentTextures = variant?.textures || part.textures || [];
            const isOpen = openSections[part.id];

            return (
              <div key={part.id} 
                   className="border-b border-slate-200 py-4"
                   onMouseEnter={() => setHighlightedPartId(part.id)}
                   onMouseLeave={() => setHighlightedPartId(null)}>
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleSection(part.id)}
                >
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <span className="bg-blue text-white min-w-[24px] h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md shadow-blue-600/30">
                      {stepNumber}
                    </span>
                    Customize {part.name}
                  </h2>
                  <div className="flex items-center gap-4">
                     {currentTextures.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFabricPartId(part.id);
                            setShowFabricGuideModal(true);
                          }}
                          className="text-xs text-blue-600 underline hover:text-blue-800"
                        >
                          Fabric guide
                        </button>
                     )}
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-6 space-y-6 animate-soft-fade">
                    
                    {/* Variants / Model */}
                    {part.variants && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Pilih Model</p>
                        <div className="flex flex-wrap gap-2">
                          {part.variants.map((v) => {
                            const isSelected = activeShapeId === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => handleShapeSelect(part.id, v.id)}
                                className={`px-5 py-2.5 text-xs font-bold border rounded-md transition-all duration-200 ${
                                  isSelected
                                    ? "bg-slate-900 text-slate-700 border-slate-900 ring-2 ring-slate-900 ring-offset-2 shadow-md"
                                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {v.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Textures / Material - REVISI 1: Kontras sangat tinggi */}
                    {currentTextures.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Pilih Material</p>
                        <div className="flex flex-wrap gap-2">
                          {currentTextures.map((tex) => {
                            const isSelected = textureSelections[part.id] === tex.id;
                            return (
                              <button
                                key={tex.id}
                                onClick={() => handleTextureSelect(part.id, tex.id)}
                                className={`px-5 py-2.5 text-xs font-bold border rounded-md transition-all duration-200 ${
                                  isSelected
                                    ? "bg-slate-900  text-slate-700 border-slate-900 ring-2 ring-slate-900 ring-offset-2 shadow-md"
                                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {tex.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {currentColors.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Pilih Warna</p>
                        <div className="flex flex-wrap gap-3">
                          {currentColors.map((color) => {
                            const isSelected = selections[part.id] === color.hex;
                            return (
                              <button
                                key={color.hex}
                                onClick={() => handleColorSelect(part.id, color.hex)}
                                className="group flex flex-col items-center gap-1.5"
                                title={color.name}
                              >
                                <div
                                  style={{ backgroundColor: color.hex }}
                                  className={`w-10 h-10 rounded-full border border-slate-300 transition-all ${
                                    isSelected
                                      ? "ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-md"
                                      : "hover:scale-105"
                                  }`}
                                />
                                <span className="text-[9px] font-medium text-slate-500 text-center max-w-[50px] truncate">
                                  {color.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </section>


     <ProductGallery images={product.gallery} productName={product.name} />
     <ProductMarketing blocks={product.marketingBlocks} />
     <ProductDimensions
        productName={product.name} 
        image={product.dimensionsImage} 
        specifications={product.specifications} 
      />
      <RecentlyViewdItems />
      <Newsletter />

      {/* ================= MODALS ================= */}
      {showSizeGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSizeGuideModal(false)}>
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Panduan Ukuran</h3>
              <button onClick={() => setShowSizeGuideModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bagSizes.map((size) => (
                <div key={size.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition">
                  <div className="w-full h-32 bg-white rounded-xl mb-3 flex items-center justify-center text-gray-400">
                    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="7" width="16" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">{size.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{'Fits up to 11" tablet'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFabricGuideModal && selectedFabricPartId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowFabricGuideModal(false)}>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex justify-between items-center p-8 border-b border-gray-50">
              <div className="absolute top-0 left-8 h-1 w-16 bg-slate-900 rounded-b-full"></div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Panduan Bahan</h3>
                <p className="text-sm text-gray-500 mt-1">Pilih karakter bahan yang sesuai dengan gayamu</p>
              </div>
              <button onClick={() => setShowFabricGuideModal(false)} className="group p-2 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-8 space-y-4 custom-scrollbar">
              {(() => {
                const part = product.parts.find((p) => p.id === selectedFabricPartId);
                if (!part) return null;
                const activeShapeId = shapeSelections[part.id] || part.id;
                const variant = part.variants?.find((v) => v.id === activeShapeId);
                const textures = variant?.textures || part.textures || [];
                
                return textures.map((tex) => (
                  <div key={tex.id} className="group flex flex-col md:flex-row gap-6 p-5 bg-white border border-gray-100 rounded-3xl hover:border-slate-300 hover:shadow-lg transition-all cursor-default">
                    <div className="relative w-full md:w-40 h-40 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border shadow-inner">
                      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xl text-gray-800">{tex.name}</h4>
                        {tex.price > 0 && <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">+ Rp {tex.price.toLocaleString('id-ID')}</span>}
                      </div>
                      <p className="text-gray-500 mt-3 text-sm leading-relaxed">{'Karakteristik bahan yang lembut, tahan lama, dan memberikan kenyamanan maksimal.'}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}