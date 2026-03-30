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
import TextureOnlyPart from "./TextureOnlyPart";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

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
  const dispatch = useDispatch();
  const { openCartModal } = useCartModalContext();
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
        
        // Mengambil tekstur pertama sebagai default
        const textures = variant?.textures || p.textures || [];
        const defaultTexture = textures[0];
        const colors = defaultTexture?.colors || [];

        init[p.id] = colors.length > 0 ? colors[0].hex : "#FFFFFF";
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
  const handleVisibilityToggle = (partId: string) =>
    setVisibleParts((p) => ({ ...p, [partId]: !p[partId] }));

  const handleShapeSelect = (partId: string, shapeId: string) => {
    setShapeSelections((p) => ({ ...p, [partId]: shapeId }));

    const part = product.parts.find((p) => p.id === partId);
    if (part) {
      const variant = part.variants?.find((v) => v.id === shapeId);
      const newTextures = variant?.textures || part.textures || [];
      const defaultTexture = newTextures[0];
      const newColors = defaultTexture?.colors || [];

      setTextureSelections((prev) => {
        const currentTexture = prev[partId];
        if (!newTextures.find((t) => t.id === currentTexture)) {
          return { ...prev, [partId]: newTextures[0]?.id || "base" };
        }
        return prev;
      });

      setSelections((prev) => {
        const currentColor = prev[partId];
        if (newColors.length > 0 && !newColors.find((c) => c.hex === currentColor)) {
          return { ...prev, [partId]: newColors[0].hex };
        }
        return prev;
      });
    }
  };

  // Menggantikan handleTextureSelect lama yang hanya sebaris
  const handleTextureSelect = (partId: string, textureId: string) => {
    setTextureSelections((p) => ({ ...p, [partId]: textureId }));

    const part = product.parts.find((p) => p.id === partId);
    if (part) {
      const activeShapeId = shapeSelections[partId] || partId;
      const variant = part.variants?.find((v) => v.id === activeShapeId);
      const textures = variant?.textures || part.textures || [];
      
      // Cari tekstur yang baru saja dipilih
      const selectedTextureObj = textures.find((t) => t.id === textureId);
      const newColors = selectedTextureObj?.colors || [];

      // Perbarui pilihan warna jika tekstur baru ini punya array warnanya sendiri
      setSelections((prev) => {
        const currentColor = prev[partId];
        if (newColors.length > 0 && !newColors.find((c) => c.hex === currentColor)) {
          return { ...prev, [partId]: newColors[0].hex };
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

  const handleAddToCart = async () => {
    // 1. Kumpulkan semua data desain user
    const finalPrice = calculateTotalPrice();
    const customizationsData = {
      size: activeSize,
      shapes: shapeSelections,
      textures: textureSelections,
      colors: selections,
      visibleParts: visibleParts
    };

    try {
      // 2. Kirim ke Laravel
      const res = await fetch("http://127.0.0.1:8000/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          price: finalPrice,
          customizations: customizationsData
        }),
      });

      // 3. Jika belum login, lempar ke Sign In
      if (res.status === 401) {
        window.location.href = "/signin";
        return;
      }

      if (res.ok) {
        // 4. Jika berhasil masuk database, masukkan juga ke Redux biar Sidebar langsung update!
        // 4. Jika berhasil masuk database, masukkan juga ke Redux biar Sidebar langsung update!
        // 4. Masukkan ke Redux
        dispatch(
          addItemToCart({
            id: Date.now(), 
            title: `Kustom ${product.name}`,
            price: finalPrice,
            
            // 👇 Tambahkan baris ini agar TypeScript puas 👇
            discountedPrice: finalPrice, 
            
            quantity: 1,
            imgs: { 
              previews: [product.gallery?.[0] || ""],
              thumbnails: [product.gallery?.[0] || ""] 
            },
            customizations: customizationsData
          })
        );

        openCartModal(); // Buka sidebar keranjang dengan cantik
      }
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang", error);
    }
  };

  // --- RENDERER ---
  // --- RENDERER ---
  const renderProductParts = (pov: string) => {
    return product.parts.map((part) => {
      if (!visibleParts[part.id]) return null;

      const activeKompartemen = shapeSelections["kompartemen"];
      if (part.id === "pengait2" && activeKompartemen !== "pengait") {
        return null;
      }

      const activeShape = shapeSelections[part.id] || part.id;
      const activeVariant = part.variants?.find((v) => v.id === activeShape);
      
      // 1. Ambil objek tekstur yang sedang aktif
      const currentTextures = activeVariant?.textures || part.textures || [];
      const activeTextureObj = currentTextures.find(t => t.id === textureSelections[part.id]) || currentTextures[0];

      // 2. LOGIKA DATA-DRIVEN: Cek apakah objek tekstur ini memiliki properti 'colors'?
      const isColorable = activeTextureObj?.colors && activeTextureObj.colors.length > 0;

      const activeColor = isColorable ? selections[part.id] : "#FFFFFF";
      const activeTexture = textureSelections[part.id];

      const partZIndex = typeof part.zIndex === "number" ? part.zIndex : part.zIndex[pov as keyof typeof part.zIndex] ?? part.zIndex["Front" as keyof typeof part.zIndex] ?? 10;
      const isHighlighted = highlightedPartId === part.id;
      const isOtherPartHighlighted = highlightedPartId !== null && highlightedPartId !== part.id;

      // ========================================================
      // BLOK 1: KHUSUS PART STATIS (Misal: Kancing, Pengait fix)
      // ========================================================
      if (part.variants?.some((v) => v.staticOverlays)) {
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
                  imageUrl={`/assets/products/${product.id}/360/${overlay.id}-base-sprite.webp`}
                  zIndex={overlay.zIndex}
                  currentFrame={frame360}
                  totalFrames={TOTAL_FRAMES}
                />
              ))}
          </div>
        );
      }

      // ========================================================
      // BLOK 2: PART DINAMIS & TEXTURE (Body, Lidah, Pita, Tali)
      // ========================================================
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
          ) : isColorable ? (
            // JIKA ADA WARNA -> Panggil DynamicPart (Butuh base-base & mask)
            <DynamicPart
              productId={product.id}
              pov={pov}
              partName={activeShape}
              color={activeColor}
              texture={activeTexture}
              zIndex={partZIndex}
            />
          ) : (
            // JIKA TIDAK ADA WARNA -> Panggil TextureOnlyPart (Hanya butuh -base biasa)
            <TextureOnlyPart
              productId={product.id}
              pov={pov}
              partName={activeShape}
              texture={activeTexture}
              zIndex={partZIndex}
            />
          )}
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
      <Breadcrumb title={`Kustomisasi Produk`} pages={["Kustomisasi"]} />

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
              Kustom {product.name}
            </h1>
            <p className="text-slate-500 mb-4">Didesain oleh Anda, dibuat khusus untuk Anda.</p>
            <div className="text-2xl font-semibold text-slate-900">
              Rp {calculateTotalPrice().toLocaleString("id-ID")}
            </div>
          </div>

          <button
              onClick={handleAddToCart}
              className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Tambah ke Keranjang
            </button>
            {/* 👆 BATAS TAMBAHAN 👆 */}

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
                  Pilih Ukuran
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSizeGuideModal(true);
                    }}
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    Panduan Ukuran
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
            const currentTextures = variant?.textures || part.textures || [];
            const isOpen = openSections[part.id];
            
            // --- 1. TAMBAHKAN LOGIKA INI ---
            const activeTextureId = textureSelections[part.id] || currentTextures[0]?.id;
            const activeTextureObj = currentTextures.find(t => t.id === activeTextureId) || currentTextures[0];
            const currentColors = activeTextureObj?.colors || [];
            const isColorable = currentColors.length > 0;
            

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
                    Kustom {part.name}
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
                          Panduan Bahan
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

                    {/* Textures / Material */}
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
                          {isColorable ? (
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
                          ) : (
                            // Tampilkan pesan elegan jika material ini tidak punya warna
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 text-slate-600 text-sm">
                              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Material <strong>{activeTextureObj?.name}</strong> memiliki corak/warna natural bawaan yang tidak dapat diubah.</span>
                            </div>
                          )}
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

      {/* 1. MODAL PANDUAN UKURAN */}
      {showSizeGuideModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div 
            className="bg-white rounded-[2.5rem] max-w-7xl w-full max-h-[85vh] flex flex-col scale-in-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-10 py-8 flex justify-between items-center bg-white rounded-t-[2.5rem] z-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Panduan Ukuran</h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Sesuaikan dengan kebutuhan Anda</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSizeGuideModal(false)}
                className="group p-3 bg-slate-50 hover:bg-slate-900 rounded-full transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 pt-2 custom-scrollbar bg-slate-50/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
                {bagSizes.map((size) => (
                  <div key={size.id} className="group flex flex-col bg-white rounded-3xl p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-1">

                    <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-slate-100 mb-6">
                      {size.image ? (
                        <img 
                          src={size.image} 
                          alt={size.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 italic text-slate-300">Tidak Ada Gambar</div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm">
                        {size.id} Edition
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-5 flex-grow">
                      <h4 className="text-xl font-bold text-slate-900">{size.title}</h4>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{size.desc}</p>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium opacity-80 pt-2">{size.description}</p>
                    </div>
                    
                    {size.dimensions && (
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50/50 rounded-xl p-2 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100/50">
                          <span className="block text-[7px] text-slate-400 font-bold uppercase tracking-widest">Lebar</span>
                          <span className="text-xs font-black text-slate-800">{size.dimensions.width}<span className="text-[10px] font-medium opacity-50 ml-0.5">cm</span></span>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-2 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100/50">
                          <span className="block text-[7px] text-slate-400 font-bold uppercase tracking-widest">Tinggi</span>
                          <span className="text-xs font-black text-slate-800">{size.dimensions.height}<span className="text-[10px] font-medium opacity-50 ml-0.5">cm</span></span>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-2 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100/50">
                          <span className="block text-[7px] text-slate-400 font-bold uppercase tracking-widest">Kedalaman</span>
                          <span className="text-xs font-black text-slate-800">{size.dimensions.depth}<span className="text-[10px] font-medium opacity-50 ml-0.5">cm</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL PANDUAN BAHAN */}
      {showFabricGuideModal && selectedFabricPartId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-lg animate-in fade-in duration-300"
          onClick={() => setShowFabricGuideModal(false)}
        >
          <div 
            className="bg-white rounded-[3rem] max-w-3xl w-full max-h-[80vh] flex flex-col scale-in-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 pb-6 flex items-center justify-between bg-white rounded-t-[3rem] z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3 italic">M</div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Pustaka Bahan</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tekstur & Sentuhan</p>
                </div>
              </div>
              <button onClick={() => setShowFabricGuideModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 pt-0 custom-scrollbar bg-slate-50/20">
              <div className="space-y-6 pb-6 pt-4">
                {(() => {
                  const part = product.parts.find((p) => p.id === selectedFabricPartId);
                  if (!part) return null;
                  const textures = part.variants?.find((v) => v.id === (shapeSelections[part.id] || part.id))?.textures || part.textures || [];
                  
                  return textures.map((tex) => (
                    <div key={tex.id} className="flex flex-col md:flex-row gap-8 group items-center bg-white p-6 rounded-[2.5rem] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                      
                      <div className="relative w-40 h-40 shrink-0 rounded-[2rem] overflow-hidden shadow-md border-4 border-white">
                        {tex.thumb ? (
                          <img 
                            src={tex.thumb} 
                            alt={tex.name} 
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2.5s]" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center italic text-slate-300">Tekstur</div>
                        )}

                        {tex.price > 0 && (
                          <div className="absolute top-2 right-2 bg-slate-900/90 text-white px-3 py-1 rounded-full text-[9px] font-black backdrop-blur-sm">
                            +Rp {tex.price.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col justify-center flex-1 space-y-3">
                        <h4 className="text-2xl font-bold text-slate-900">{tex.name}</h4>
                        <p className="text-slate-500 text-sm leading-loose font-medium opacity-80 border-l-2 border-slate-100 pl-5">
                          {tex.description || "Perpaduan sempurna antara ketahanan dan kemewahan. Dipilih secara khusus untuk menua dengan indah seiring pemakaian, material ini mewujudkan keahlian yang tahan lama."}
                        </p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}