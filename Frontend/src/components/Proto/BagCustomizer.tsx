"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DynamicPart from "./DynamicPart";
import StaticPart from "./StaticPart";
import Breadcrumb from "../Common/Breadcrumb";
import SpritePart from "./SpritePart";
import StaticSpritePart from "./StaticSpritePart";
import { useSearchParams } from "next/navigation";
import { PRODUCTS_CONFIG, ProductConfig } from "@/config/products";
import ProductGallery from "./ProductGallery"; 
import ProductMarketing from "./ProductMarketing";
import ProductDimensions from "./ProductDimensions"; 
import RecentlyViewdItems from "../ShopDetails/RecentlyViewd";
import Newsletter from "../Common/Newsletter";
import TextureOnlyPart from "./TextureOnlyPart";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import html2canvas from "html2canvas";
import { CartService } from '@/services/CartService';
import { flushSync } from "react-dom";
import { AlertService } from "@/services/AlertService";

    export default function BagCustomizer() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  
  const [product, setProduct] = useState<ProductConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    
      const fetchProduct = async () => {
    try {
      // ── Cek login dulu ──────────────────────────────
      const userRes = await fetch('/api-fe/proxy/user', {
        credentials: 'include',
      });


      // ── Fetch produk ────────────────────────────────
      const res = await fetch(`/api-fe/proxy/products/${productId}`);
      if (res.ok) {
        const json = await res.json();
        const raw = json.data;
        const slug = raw.slug;
        const localConfig = PRODUCTS_CONFIG[slug];

        // ── Mapping parts ──────────────────────────────────
        const mappedParts = (raw.parts || []).map((part: any) => ({
          id:        part.id,
          name:      part.name,
          part_code: part.part_code || "",
          basePrice: 0,
          zIndex:    part.z_index,
          variants:  (part.variants || []).map((variant: any) => ({
            id:         variant.id,
            name:       variant.name,
            variant_code: variant.variant_code || "",
            price:      parseFloat(variant.price),
            priceLabel: variant.price > 0
              ? `+ Rp ${parseInt(variant.price).toLocaleString('id-ID')}`
              : "",
            textures: (variant.textures || []).map((texture: any) => ({
              id:        texture.id,
              name:      texture.name,
              texture_code: texture.texture_code || "",
              price:     parseFloat(texture.price),
              thumb:     texture.img_thumb ? `http://127.0.0.1:8000/storage/${texture.img_thumb}` : "",
              image:     texture.img_front ? `http://127.0.0.1:8000/storage/${texture.img_front}` : "",
              img_front: texture.img_front ? `http://127.0.0.1:8000/storage/${texture.img_front}` : "",
              img_back:  texture.img_back  ? `http://127.0.0.1:8000/storage/${texture.img_back}`  : "",
              img_top:   texture.img_top   ? `http://127.0.0.1:8000/storage/${texture.img_top}`   : "",
            })),
          })),
          textures: part.variants?.length === 0 ? [] : undefined,
        }));

        // ── Mapping sizes ──────────────────────────────────
        const mappedSizes = (raw.sizes || []).map((s: any) => ({
          id:          s.id,
          title:       s.title,
          desc:        s.short_desc,
          description: s.description,
          price:       s.price,
          image:       s.img || "",
          dimensions: {
            width:  s.width,
            height: s.height,
            depth:  s.depth,
            unit:   s.unit,
          },
        }));

        // ── Base data dari API ─────────────────────────────
        const baseData = {
          id:              raw.id,
          name:            raw.name,
          basePrice:       parseFloat(raw.base_price),
          numericId:       0,
          catalogTitle:    raw.name,
          reviews:         0,
          catalogPrice:    parseFloat(raw.base_price),
          discountedPrice: parseFloat(raw.base_price),
          thumbnails:      raw.img ? [`http://127.0.0.1:8000/storage/${raw.img}`] : [],
          previews:        raw.img ? [`http://127.0.0.1:8000/storage/${raw.img}`] : [],
          gallery:         (raw.gallery || []).map((g: any) => g.img),
          dimensionsImage: raw.dimension?.img || "",
          specifications:  [
            raw.dimension?.product_style ? { label: "Gaya Produk",         value: raw.dimension.product_style           } : null,
            raw.dimension?.total_volumes ? { label: "Total Volume (liter)", value: `${raw.dimension.total_volumes}.00 L` } : null,
            raw.dimension?.weight        ? { label: "Berat (lbs)",          value: `${raw.dimension.weight}.2 Lb`        } : null,
          ].filter(Boolean) as { label: string; value: string }[],
          marketingBlocks: (raw.marketing_blocks || []).map((block: any, index: number) => ({
          title:        block.title,
          subtitle:     block.subtitle || "",
          description:  block.description || "",
          image:        block.image || "",
          layout:       index % 2 === 0 ? "image-left" : "image-right", // ← alternating
          featureStyle: block.feature_style || "cards",
          features:     (block.features || []).map((f: any) => ({
            title: f.title,
            icon:  f.icon || "",
          })),
        })),
          sizes:           mappedSizes,
          parts:           mappedParts,
        };

        // ── Gabungkan dengan localConfig kalau ada ─────────
        const mapped: ProductConfig = localConfig
          ? { ...localConfig, ...baseData }
          : baseData;

        setProduct(mapped);
        }
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F8F3E9]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C5A059]"></div>
    </div>
  );

  if (!product) {
    return (
      <div className="p-20 text-center font-serif text-3xl text-[#2D1A11] bg-[#F8F3E9] h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-color-dodge"
          style={{ 
            backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`,
            backgroundSize: '400px',
            backgroundRepeat: 'repeat'
          }}
        ></div>
        <span className="relative z-10">Produk tidak ditemukan.</span>
      </div>
    );
  }

  return <BagCustomizerInner key={product.id} product={product} />;
}

function BagCustomizerInner({ product }: { product: ProductConfig }) {
  const dispatch = useDispatch();
  const { openCartModal } = useCartModalContext();

  const screenshotRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const bagSizes = product.sizes || [];
  const hasSizes = bagSizes.length > 0;

  // --- BUILD STEPS ARRAY ---
  const steps = [];
  if (hasSizes) steps.push({ id: 'size', type: 'size', title: 'Ukuran' });
  product.parts.forEach((part) => steps.push({ id: part.id, type: 'part', title: part.name, partData: part }));

  // --- SEMUA STATE ---
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = steps[activeStepIndex];
  const [highlightedPartId, setHighlightedPartId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSize, setActiveSize] = useState<string>("");
  const [shapeSelections, setShapeSelections] = useState<Record<string, string>>({});
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [textureSelections, setTextureSelections] = useState<Record<string, string>>({});
  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<string>("front");
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [showFabricGuideModal, setShowFabricGuideModal] = useState(false);
  const [selectedFabricPartId, setSelectedFabricPartId] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [frame360, setFrame360] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [startX, setStartX] = useState(0);

  // --- SEMUA USEEFFECT ---

  // 1. Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`customization_${product.id}`);
    const savedData = saved ? JSON.parse(saved) : null;

    setActiveSize(savedData?.activeSize || (bagSizes.length > 0 ? bagSizes[0].id : ""));

    setShapeSelections(savedData?.shapeSelections || (() => {
      const init: Record<string, string> = {};
      product.parts.forEach((p) => {
        init[p.id] = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
      });
      return init;
    })());

    setSelections(savedData?.selections || (() => {
      const init: Record<string, string> = {};
      product.parts.forEach((p) => {
        const activeShapeId = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
        const variant = p.variants?.find((v) => v.id === activeShapeId);
        const textures = variant?.textures || p.textures || [];
        const colors = textures[0]?.colors || [];
        init[p.id] = colors.length > 0 ? colors[0].hex : "#FFFFFF";
      });
      return init;
    })());

    setTextureSelections(savedData?.textureSelections || (() => {
      const init: Record<string, string> = {};
      product.parts.forEach((p) => {
        const activeShapeId = p.variants && p.variants.length > 0 ? p.variants[0].id : p.id;
        const variant = p.variants?.find((v) => v.id === activeShapeId);
        const textures = variant?.textures || p.textures || [];
        init[p.id] = textures[0]?.id || "base";
      });
      return init;
    })());

    setVisibleParts(savedData?.visibleParts || (() => {
      const init: Record<string, boolean> = {};
      product.parts.forEach((p) => (init[p.id] = true));
      return init;
    })());

    setActiveView(savedData?.activeView || "front");
    setIsHydrated(true);
  }, []);

  // 2. Save ke localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(`customization_${product.id}`, JSON.stringify({
      productId: product.id,
      activeSize,
      shapeSelections,
      selections,
      textureSelections,
      visibleParts,
      activeView,
    }));
  }, [activeSize, shapeSelections, selections, textureSelections, visibleParts, activeView, isHydrated]);

  // 3. Highlight part
  useEffect(() => {
    if (currentStep && currentStep.type === 'part') {
      setHighlightedPartId(currentStep.id);
    } else {
      setHighlightedPartId(null);
    }
  }, [activeStepIndex, currentStep]);

   useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch(`/api-fe/proxy/wishlist/check/${product.id}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setIsWishlisted(json.is_wishlisted);
        }
      } catch (err) {
        console.error("Gagal cek wishlist:", err);
      }
    };
    checkWishlist();
  }, [product.id]);

  // Toggle wishlist
  const handleToggleWishlist = async () => {
  setWishlistLoading(true);
  try {
    if (isWishlisted) {
      await fetch(`/api-fe/proxy/wishlist/${product.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setIsWishlisted(false);
      AlertService.success("Dihapus", "Desain dihapus dari daftar impian Anda."); // ✅
    } else {
      await fetch(`/api-fe/proxy/wishlist`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          customizations: {
            size:         activeSize,
            shapes:       shapeSelections,
            textures:     textureSelections,
            colors:       selections,
            visibleParts: visibleParts,
          },
          total_price: calculateTotalPrice(),
        }),
      });
      setIsWishlisted(true);
      AlertService.success("Tersimpan!", "Desain berhasil ditambahkan ke daftar impian."); // ✅
    }
  } catch (err) {
    console.error("Gagal toggle wishlist:", err);
    AlertService.error("Gagal", "Terjadi kesalahan, coba lagi."); // ✅ tambah error alert
  } finally {
    setWishlistLoading(false);
  }
};

  if (!isHydrated) return null;
  // 360 ROTATION
  const TOTAL_FRAMES = 17;

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

  const handleTextureSelect = (partId: string, textureId: string) => {
    setTextureSelections((p) => ({ ...p, [partId]: textureId }));

    const part = product.parts.find((p) => p.id === partId);
    if (part) {
      const activeShapeId = shapeSelections[partId] || partId;
      const variant = part.variants?.find((v) => v.id === activeShapeId);
      const textures = variant?.textures || part.textures || [];
      
      const selectedTextureObj = textures.find((t) => t.id === textureId);
      const newColors = selectedTextureObj?.colors || [];

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
    setIsCapturing(true);

    const finalPrice = calculateTotalPrice();
    const selectedSizeObj = product?.sizes?.find((s: any) => s.id === activeSize);
    const sizeLabel = selectedSizeObj ? selectedSizeObj.title : activeSize;

    const mappedPartsPayload = product.parts.map((part: any) => {
      const activeShapeId = shapeSelections[part.id] || part.id;
      const activeVariant = part.variants?.find((v: any) => v.id === activeShapeId);
      
      const currentTextures = activeVariant?.textures || part.textures || [];
      const activeTextureId = textureSelections[part.id] || currentTextures[0]?.id;
      const activeTexture = currentTextures.find((t: any) => t.id === activeTextureId) || currentTextures[0];

      return {
        id: part.id,
        name: part.name,
        part_code: part.part_code || "",
        variants: activeVariant ? [
          {
            id: activeVariant.id,
            name: activeVariant.name,
            price: activeVariant.price || 0,
            variant_code: activeVariant.variant_code || "",
            textures: activeTexture ? [
              {
                id: activeTexture.id,
                name: activeTexture.name,
                price: activeTexture.price || 0,
                img_top: activeTexture.img_top || "",
                img_back: activeTexture.img_back || "",
                img_front: activeTexture.img_front || "",
                img_thumb: activeTexture.thumb || activeTexture.img_thumb || "", 
                texture_code: activeTexture.texture_code || ""
              }
            ] : []
          }
        ] : []
      };
    });

    const fullImageUrl = product?.thumbnails?.[0] || product?.gallery?.[0] || "";
    
    let dbFormattedImage = fullImageUrl;
    if (fullImageUrl.includes("/storage/")) {
      dbFormattedImage = fullImageUrl.split("/storage/")[1]; 
    }

    const customizationsData: any = {
      size: sizeLabel,
      parts: mappedPartsPayload,
      colors: selections,
      visibleParts: visibleParts,
      image_preview: dbFormattedImage 
    };

    try {
      const res = await CartService.addToCart({
        product_id: product.id,
        price: finalPrice,
        custom_configuration: customizationsData,
        image_preview: dbFormattedImage 
      });

      const realDbId = res?.id || res?.data?.id || res?.item?.id || res?.cart_item?.id;

      dispatch(
        addItemToCart({
          id: realDbId,
          title: `Kustom ${product.name}`,
          price: finalPrice,
          discountedPrice: finalPrice,
          quantity: 1,
          imgs: {
            previews: [fullImageUrl], 
            thumbnails: [fullImageUrl]
          },
          customizations: customizationsData
        } as any)
      );

      setIsCapturing(false);
      openCartModal();

    } catch (error) {
      console.error("Terjadi kesalahan jaringan", error);
      setIsCapturing(false);
    }
  };


  const nextStep = () => setActiveStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStepIndex((prev) => Math.max(prev - 1, 0));
  // --- RENDERER ---
  const renderProductParts = (pov: string) => {
    return product.parts.map((part) => {
      if (!visibleParts[part.id]) return null;

      // const activeKompartemen = shapeSelections["kompartemen"];
      // if (part.id === "pengait2" && activeKompartemen !== "pengait") {
      //   return null;
      // }

      const activeShape = shapeSelections[part.id] || part.id;
      const activeVariant = part.variants?.find((v) => v.id === activeShape);
      
      const currentTextures = activeVariant?.textures || part.textures || [];
            const activeTextureObj = currentTextures.find(t => t.id === textureSelections[part.id]) || currentTextures[0];

      // Pilih URL gambar sesuai POV
      const getTextureImageUrl = (textureObj: any, pov: string) => {
    // 1. Tampung dulu URL aslinya ke dalam variabel rawUrl
    let rawUrl = "";
    switch(pov.toLowerCase()) {
      case 'front': rawUrl = textureObj?.img_front || ""; break;
      case 'back':  rawUrl = textureObj?.img_back  || ""; break;
      case 'top':   rawUrl = textureObj?.img_top   || ""; break;
      default:      rawUrl = textureObj?.img_front || ""; break;
    }

    // 2. Jika rawUrl ada isinya, potong domain Laravel-nya
    if (rawUrl) {
      return rawUrl.replace("http://127.0.0.1:8000", "");
      
    }

    return "";
  };

      const isColorable = activeTextureObj?.colors && activeTextureObj.colors.length > 0;

      const activeColor = isColorable ? selections[part.id] : "#FFFFFF";
      const activeTexture = textureSelections[part.id];

      const partZIndex = typeof part.zIndex === "number" ? part.zIndex : part.zIndex[pov as keyof typeof part.zIndex] ?? part.zIndex["Front" as keyof typeof part.zIndex] ?? 10;
      
      // TAMBAHAN: Logika Highlight Baru yang dipengaruhi showFullPreview
      const activeHighlight = showFullPreview ? null : highlightedPartId;
      const isHighlighted = activeHighlight === part.id;
      const isOtherPartHighlighted = activeHighlight !== null && activeHighlight !== part.id;

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

      return (
        <div
          key={`${pov}-${part.id}-${activeShape}`}
          className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out ${
            isHighlighted ? "scale-[1.05] drop-shadow-2xl brightness-110 z-50" : ""
          } ${isOtherPartHighlighted ? "opacity-40 grayscale-[40%]" : "opacity-100"}`}
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
            <DynamicPart
              productId={product.id}
              pov={pov}
              partName={activeShape}
              color={activeColor}
              texture={activeTexture}
              textureImageUrl={getTextureImageUrl(activeTextureObj, pov)} // ← tambah ini
              zIndex={partZIndex}
                      />
          ) : (
            <TextureOnlyPart
              productId={product.id}
              pov={pov}
              partName={activeShape}
              texture={activeTexture}
              textureImageUrl={getTextureImageUrl(activeTextureObj, pov)} // ← tambah ini
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

  // ================= RENDER UTAMA =================
  return (
    <div className="relative bg-[#F8F3E9] text-[#2D1A11] min-h-screen overflow-hidden selection:bg-[#C5A059] selection:text-white pb-20" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* --- ORNAMEN SAMPING & BAWAH --- */}
      <div 
        className="absolute left-[-5%] top-[10%] w-[350px] h-[700px] pointer-events-none z-0 opacity-5 mix-blend-multiply grayscale contrast-125"
        style={{ backgroundImage: `url('https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>

      <div 
        className="absolute right-[-5%] top-[10%] w-[450px] h-[800px] pointer-events-none z-0 opacity-10 mix-blend-multiply grayscale contrast-125"
        style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      ></div>

      <Breadcrumb title={`Kustomisasi Produk`} pages={["Kustomisasi"]} />

      <section className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-4xl lg:text-5xl text-[#2D1A11] tracking-[0.2em] mb-12 text-center uppercase drop-shadow-sm font-light">
          Mahakarya <span className="text-[#C5A059]">Nusantara</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
        
          {/* ================= KIRI: PREVIEW ================= */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-24 flex flex-col bg-[#2D1A11] rounded-2xl p-1 relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#C5A059]/40">
            <div className="bg-[#2D1A11] p-3 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`, backgroundSize: '300px' }}></div>
                <div className="bg-[#BFA690] rounded-xl p-4 lg:p-10 flex flex-col justify-center items-center relative overflow-hidden shadow-inner border border-[#9A7A5D]/50">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/60"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/60"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]/60"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/60"></div>

                  {/* TAMBAHAN: Tombol Shortcut Fokus Detail / Keseluruhan */}
                  <button
                    onClick={() => setShowFullPreview(!showFullPreview)}
                    className={`absolute top-6 right-6 z-[100] px-4 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl border backdrop-blur-md flex items-center gap-2 ${
                      showFullPreview 
                        ? "bg-[#C5A059] text-[#2D1A11] border-[#C5A059]" 
                        : "bg-[#2D1A11]/90 text-[#C5A059] border-[#C5A059]/50 hover:bg-[#2D1A11] hover:scale-105"
                    }`}
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {showFullPreview ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                        Fokus Detail
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Lihat Keseluruhan
                      </>
                    )}
                  </button>

                  <div className="w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center relative z-10">
                    {isCapturing && (
                      <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#2D1A11]/70 backdrop-blur-3xl rounded-xl transition-all">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059] mb-4 shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
                        <p className="text-[#C5A059] font-bold tracking-[0.2em] text-xs uppercase animate-pulse">
                          Menyimpan Desain...
                        </p>
                      </div>
                    )}
                    
                    {activeView !== "360" ? (
                      <div 
                      key={globalAnimationKey} 
                      ref={screenshotRef}
                      className="animate-soft-fade w-full h-full max-w-[500px] flex items-center justify-center relative drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]">
                        <div className="relative w-full aspect-[6/5]">
                          {renderProductParts(activeView.charAt(0).toUpperCase() + activeView.slice(1))}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={globalAnimationKey}
                        className="animate-soft-fade w-full h-full max-w-[500px] flex items-center justify-center relative cursor-grab active:cursor-grabbing touch-none drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                      >
                        <div className="relative w-full aspect-[6/5] pointer-events-none">
                          {renderProductParts("360")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 mb-4 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4 w-full px-6">
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent"></div>
                    <span className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase font-sans font-bold">Sudut Pandang</span>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent"></div>
                  </div>
                  <div className="flex gap-3">
                    {PREVIEW_VIEWS.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        // TAMBAHAN: Update class name untuk mempertegas kontras tombol view saat inaktif
                        className={`px-6 py-2.5 rounded-full text-[11px] tracking-widest transition-all duration-300 uppercase border backdrop-blur-sm ${
                          activeView === view.id
                            ? "bg-[#C5A059] text-[#2D1A11] border-[#C5A059] font-bold shadow-[0_0_15px_rgba(197,160,89,0.4)]"
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-[#C5A059] hover:text-[#C5A059] shadow-sm"
                        }`}
                        style={{ fontFamily: "sans-serif" }}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>
                
            </div>
          </div>

          {/* ================= KANAN: WIZARD CONTROLS ================= */}
          <div className="w-full lg:w-[45%] flex flex-col relative z-10">
            <div className="bg-[#2D1A11] rounded-2xl p-7 shadow-2xl h-full flex flex-col min-h-[550px] border border-[#C5A059]/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-16 opacity-10 mix-blend-screen pointer-events-none" style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`, backgroundSize: '200px' }}></div>
              
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-5 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-[#2D1A11] font-bold text-sm shadow-inner">
                    {activeStepIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-sans font-bold">Langkah Konfigurasi</h2>
                    <p className="text-lg text-[#F8F3E9] uppercase tracking-widest">{currentStep.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* ✅ Tombol Wishlist */}
                  <button
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                      ${isWishlisted
                        ? "bg-[#C5A059] border-[#C5A059] text-[#2D1A11]"
                        : "bg-transparent border-[#C5A059]/50 text-[#C5A059] hover:border-[#C5A059]"
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      fill={isWishlisted ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth={2}
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>

                  {/* Tombol Prev */}
                  <button onClick={prevStep} disabled={activeStepIndex === 0} className="w-10 h-10 rounded-full border border-[#C5A059]/50 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059] hover:text-[#2D1A11] disabled:opacity-20 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {/* Tombol Next */}
                  <button onClick={nextStep} disabled={activeStepIndex === steps.length - 1} className="w-10 h-10 rounded-full border border-[#C5A059]/50 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059] hover:text-[#2D1A11] disabled:opacity-20 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div key={currentStep.id} className="bg-[#F8F3E9] rounded-2xl p-7 relative flex-grow animate-soft-fade flex flex-col shadow-inner border border-[#E5D7C1] z-10">
                
                {/* UKURAN */}
                {currentStep.type === 'size' && (
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-end mb-8 border-b border-[#C5A059]/20 pb-4">
                      <h3 className="text-[#2D1A11] uppercase tracking-widest text-sm font-bold font-sans">Pilih Siluet</h3>
                      <div className="text-right">
                        <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest block mb-1">Estimasi Dasar</span>
                        <div className="text-[#2D1A11] font-bold text-xl">Rp {(product.basePrice || 0).toLocaleString("id-ID")}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {bagSizes.map((size) => {
                        const isActive = activeSize === size.id;
                        return (
                          <button key={size.id} onClick={() => setActiveSize(size.id)} className={`flex flex-col p-4 rounded-xl transition-all duration-300 text-left border ${ isActive ? "bg-[#EFE8DC] border-[#2D1A11] shadow-md ring-1 ring-[#2D1A11]" : "bg-white border-[#E5D7C1] hover:border-[#2D1A11]" }`}>
                            <span className={`font-bold text-lg ${isActive ? 'text-[#2D1A11]' : 'text-[#6B442A]'}`}>{size.title}</span>
                            <span className="text-[10px] text-[#6B442A] mt-1" style={{fontFamily: "sans-serif"}}>{size.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowSizeGuideModal(true); }} className="mt-auto self-start text-[10px] font-bold tracking-widest uppercase text-[#C5A059] hover:text-[#2D1A11] transition-colors underline" style={{fontFamily: "sans-serif"}}>
                      Lihat Panduan Detail
                    </button>
                  </div>
                )}

                {/* PARTS */}
                {currentStep.type === 'part' && (
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-6 border-b border-[#E5D7C1] pb-3">
                      <h3 className="text-[#2D1A11] uppercase tracking-widest text-base font-bold">Bag Details</h3>
                    </div>
                    {(() => {
                      const part = currentStep.partData as NonNullable<ProductConfig['parts'][number]>;
                      const activeShapeId = shapeSelections[part.id] || part.id;
                      const variant = part.variants?.find((v) => v.id === activeShapeId);
                      const currentTextures = variant?.textures || part.textures || [];
                      const activeTextureId = textureSelections[part.id] || currentTextures[0]?.id;
                      const activeTextureObj = currentTextures.find(t => t.id === activeTextureId) || currentTextures[0];
                      const currentColors = activeTextureObj?.colors || [];
                      const isColorable = currentColors.length > 0;

                      return (
                        <div className="space-y-6" style={{fontFamily: "sans-serif"}}>
                          {part.variants && (
                            <div>
                              <p className="text-[11px] text-[#2D1A11] font-semibold mb-2 uppercase tracking-wide">Pilih Bentuk</p>
                              <div className="flex flex-wrap gap-2">
                                {part.variants.map((v) => {
                                  const isSelected = activeShapeId === v.id;
                                  return (
                                    <button key={v.id} onClick={() => handleShapeSelect(part.id, v.id)} className={`px-4 py-2 text-[12px] font-semibold rounded-[4px] transition-all duration-300 uppercase ${isSelected ? "bg-[#2D1A11] text-[#F8F3E9] shadow-md" : "bg-white text-[#6B442A] border border-[#E5D7C1] hover:border-[#2D1A11]"}`}>
                                      {v.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {currentTextures.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[11px] text-[#2D1A11] font-semibold uppercase tracking-wide">Material Motif</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedFabricPartId(part.id); setShowFabricGuideModal(true); }} className="text-[10px] font-bold tracking-widest uppercase text-[#C5A059] hover:text-[#2D1A11] underline">
                                  Lihat Pustaka
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {currentTextures.map((tex) => {
                                  const isSelected = textureSelections[part.id] === tex.id;
                                  return (
                                    <button key={tex.id} onClick={() => handleTextureSelect(part.id, tex.id)} className={`px-4 py-2 text-[12px] font-semibold rounded-[4px] transition-all duration-300 uppercase ${isSelected ? "bg-[#2D1A11] text-[#F8F3E9] shadow-md" : "bg-white text-[#6B442A] border border-[#E5D7C1] hover:border-[#2D1A11]"}`}>
                                      {tex.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {currentColors.length > 0 && (
                            <div>
                              <p className="text-[11px] text-[#2D1A11] font-semibold mb-3 uppercase tracking-wide">Warna Solid</p>
                              <div className="flex flex-wrap gap-3">
                                {isColorable ? (
                                  currentColors.map((color) => {
                                    const isSelected = selections[part.id] === color.hex;
                                    return (
                                      <button key={color.hex} onClick={() => handleColorSelect(part.id, color.hex)} className={`w-10 h-10 rounded-[4px] transition-all duration-300 border-[3px] ${isSelected ? "border-[#2D1A11] scale-110 shadow-sm" : "border-transparent hover:scale-105 outline outline-1 outline-[#E5D7C1]"}`} style={{ backgroundColor: color.hex }} title={color.name} />
                                    );
                                  })
                                ) : (
                                  <div className="text-[12px] text-[#6B442A] italic py-2">
                                    Material ini menggunakan corak natural.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* BOTTOM: Total Investasi */}
              <div className="pt-6 mt-6 border-t border-[#C5A059]/30 relative z-10">
                <div className="flex justify-between items-center text-[#F8F3E9] mb-2">
                  <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#C5A059] font-sans">Total Investasi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-3xl tracking-tighter font-light text-[#F8F3E9]">
                    Rp <span className="font-bold text-[#C5A059]">{calculateTotalPrice().toLocaleString("id-ID")}</span>
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="bg-[#C5A059] text-[#2D1A11] px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white transition-all duration-500 shadow-xl"
                  >
                    Simpan Desain
                  </button>
                </div>
              </div>

            </div>
          </div>

          
        </div>
      </section>

      {/* ================= BAGIAN BAWAH: DIMENSI, GALERI, DLL ================= */}
      <div className="relative z-10 bg-[#F8F3E9] pt-8">
        
        <div className="w-full max-w-[1200px] mx-auto px-4 mb-4">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"></div>
        </div>

        <ProductGallery images={product.gallery} productName={product.name} />
        <ProductMarketing blocks={(product as any).marketingBlocks || []} />
        <ProductDimensions productName={product.name} image={product.dimensionsImage} specifications={product.specifications} />
        <RecentlyViewdItems />
        <Newsletter />
      </div>

      {/* ================= MODALS ================= */} 
      
      {/* 1. MODAL PANDUAN UKURAN */}
      {showSizeGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1A0F0A]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowSizeGuideModal(false)}>
          <div className="bg-[#2D1A11] rounded-[2.5rem] p-1 max-w-7xl w-full max-h-[90vh] flex flex-col scale-in-center shadow-[0_30px_60px_rgba(197,160,89,0.15)] border border-[#C5A059]/40 relative" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#F8F3E9] rounded-[2.3rem] flex flex-col h-full overflow-hidden relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, backgroundSize: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
              <div className="px-10 py-8 flex justify-between items-center bg-[#2D1A11] z-10 border-b-4 border-[#C5A059]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#C5A059]/50 text-[#C5A059]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl text-[#F8F3E9] tracking-[0.1em] font-light">Panduan <span className="text-[#C5A059] font-bold">Proporsi</span></h3>
                    <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mt-1 font-sans">Sesuaikan Dengan Kebutuhan Esensial Anda</p>
                  </div>
                </div>
                <button onClick={() => setShowSizeGuideModal(false)} className="group p-3 bg-transparent hover:bg-[#C5A059] rounded-full transition-all duration-300 border border-[#C5A059]/40">
                  <svg className="w-6 h-6 text-[#C5A059] group-hover:text-[#2D1A11] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 pt-10 custom-scrollbar relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-4">
                  {bagSizes.map((size) => (
                    <div key={size.id} className="group flex flex-col bg-white border border-[#E5D7C1] rounded-[2rem] p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.3)] hover:border-[#C5A059]/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-2 border border-[#C5A059]/0 group-hover:border-[#C5A059]/20 rounded-[1.5rem] transition-colors duration-500 pointer-events-none"></div>
                      <div className="relative aspect-[3/2] rounded-[1.5rem] overflow-hidden bg-[#2D1A11] mb-6 border border-[#E5D7C1] flex items-center justify-center group-hover:border-[#C5A059]/50 transition-colors">
                        {size.image ? (
                          <img src={size.image} alt={size.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] tracking-widest text-[#C5A059] uppercase font-sans">Visualisasi Emas</div>
                        )}
                        <div className="absolute top-3 left-3 bg-[#2D1A11]/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-lg text-[#C5A059] border border-[#C5A059]/30 font-sans">Edisi {size.title}</div>
                      </div>
                      <div className="space-y-2 mb-6 flex-grow text-center">
                        <h4 className="text-2xl text-[#2D1A11] font-bold">{size.title}</h4>
                        <div className="w-8 h-[1px] bg-[#C5A059] mx-auto my-2"></div>
                        <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] font-sans">{size.desc}</p>
                        <p className="text-xs text-[#6B442A] leading-relaxed pt-3 font-sans">{size.description}</p>
                      </div>
                      {size.dimensions && (
                        <div className="grid grid-cols-3 gap-2 pt-5 border-t border-[#C5A059]/20 font-sans">
                          <div className="bg-[#F8F3E9] rounded-xl p-2 text-center border border-[#E5D7C1]/60">
                            <span className="block text-[8px] text-[#C5A059] font-bold uppercase tracking-widest mb-1">Lebar</span>
                            <span className="text-xs font-bold text-[#2D1A11]">{size.dimensions.width}<span className="text-[8px] ml-0.5 text-[#6B442A] font-normal">cm</span></span>
                          </div>
                          <div className="bg-[#F8F3E9] rounded-xl p-2 text-center border border-[#E5D7C1]/60">
                            <span className="block text-[8px] text-[#C5A059] font-bold uppercase tracking-widest mb-1">Tinggi</span>
                            <span className="text-xs font-bold text-[#2D1A11]">{size.dimensions.height}<span className="text-[8px] ml-0.5 text-[#6B442A] font-normal">cm</span></span>
                          </div>
                          <div className="bg-[#F8F3E9] rounded-xl p-2 text-center border border-[#E5D7C1]/60">
                            <span className="block text-[8px] text-[#C5A059] font-bold uppercase tracking-widest mb-1">Dimensi</span>
                            <span className="text-xs font-bold text-[#2D1A11]">{size.dimensions.depth}<span className="text-[8px] ml-0.5 text-[#6B442A] font-normal">cm</span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL PANDUAN BAHAN */}
      {showFabricGuideModal && selectedFabricPartId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1A0F0A]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowFabricGuideModal(false)}>
          <div className="bg-[#2D1A11] rounded-[2.5rem] p-1 max-w-5xl w-full max-h-[90vh] flex flex-col scale-in-center shadow-[0_30px_60px_rgba(197,160,89,0.15)] border border-[#C5A059]/40 relative" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#F8F3E9] rounded-[2.3rem] flex flex-col h-full overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`, backgroundSize: '300px' }}></div>
              <div className="px-10 py-8 flex justify-between items-center bg-[#2D1A11] z-10 border-b-4 border-[#C5A059] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, backgroundSize: 'contain', backgroundPosition: 'right' }}></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 flex items-center justify-center border border-[#C5A059] rounded-full text-[#C5A059]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl text-[#F8F3E9] tracking-[0.1em] font-light">Pustaka <span className="text-[#C5A059] font-bold">Material</span></h3>
                    <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mt-1 font-sans">Koleksi Tekstur Khas Nusantara</p>
                  </div>
                </div>
                <button onClick={() => setShowFabricGuideModal(false)} className="relative z-10 group p-3 bg-transparent hover:bg-[#C5A059] rounded-full transition-all duration-300 border border-[#C5A059]/40">
                  <svg className="w-6 h-6 text-[#C5A059] group-hover:text-[#2D1A11] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 pt-8 custom-scrollbar relative z-10">
                <div className="space-y-6 pb-6">
                  {(() => {
                    const part = product.parts.find((p) => p.id === selectedFabricPartId);
                    if (!part) return null;
                    const textures = part.variants?.find((v) => v.id === (shapeSelections[part.id] || part.id))?.textures || part.textures || [];
                    
                    return textures.map((tex) => (
                      <div key={tex.id} className="flex flex-col md:flex-row gap-8 group items-center bg-white border border-[#E5D7C1] p-6 rounded-[2rem] shadow-sm transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.2)] hover:border-[#C5A059]/50 hover:-translate-y-1">
                        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-[1.5rem] overflow-hidden shadow-inner border-[3px] border-[#F8F3E9] group-hover:border-[#C5A059]/20 transition-colors">
                          {tex.thumb ? (
                            <img src={tex.thumb} alt={tex.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out" />
                          ) : (
                            <div className="w-full h-full bg-[#2D1A11] flex items-center justify-center text-[10px] tracking-widest text-[#C5A059] uppercase font-sans">Serat Material</div>
                          )}
                          {tex.price > 0 && (
                            <div className="absolute bottom-3 right-3 bg-[#2D1A11]/90 text-[#C5A059] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] backdrop-blur-md border border-[#C5A059]/30 font-sans shadow-lg">
                              +Rp {tex.price.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center flex-1 space-y-3">
                          <h4 className="text-3xl text-[#2D1A11] font-bold">{tex.name}</h4>
                          <div className="w-12 h-[2px] bg-[#C5A059] rounded-full"></div>
                          <p className="text-[#6B442A] text-sm leading-relaxed tracking-wide font-sans mt-2">
                            {tex.description || "Sebuah mahakarya yang ditenun dengan presisi. Dipilih secara khusus untuk memberikan kesan elegan, autentik, dan menua dengan indah seiring perjalanan Anda."}
                          </p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={screenshotRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "500px",
          height: "417px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div className="relative w-full h-full">
          {renderProductParts("Front")}
        </div>
      </div>

    </div>
  );
}