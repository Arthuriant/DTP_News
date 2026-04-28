// ==========================================
// INTERFACES
// ==========================================
export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductTexture {
  id: string;
  name: string;
  thumb: string;
  image?: string;
  description?: string;
  price: number;
  colors?: ProductColor[];  
  img_front?: string;
  img_back?: string;
  img_top?: string;
}

export interface ProductSize {
  id: string;
  title: string;
  desc: string;
  price: number;
  image?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit?: string;       // default 'cm'
  };
  description?: string;  // deskripsi panjang (opsional)
}

export interface ProductVariant {
  id: string;
  name: string;
  thumb?: string;
  price: number;
  priceLabel?: string;
  textures?: ProductTexture[]; 
  staticOverlays?: ProductStaticOverlay[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductStaticOverlay {
  id: string;
  url: string;
  zIndex: number;
  name: string;
}

export interface ProductPart {
  id: string;
  name: string;
  basePrice: number;
  zIndex: number | Record<string, number>;
  textures?: ProductTexture[]; 
  variants?: ProductVariant[];
  staticOverlays?: ProductStaticOverlay[];
}

export interface MarketingBlock {
  layout: "image-left" | "image-right";
  hasPattern?: boolean;
  badge?: string;
  subtitle?: string;
  title: string;
  titleHighlight?: string;
  titleHighlightStyle?: "gradient" | "amber";
  description: string;
  image: string;
  imageQuote?: string;
  featureStyle: "cards" | "bullets";
  features: MarketingFeature[];
}

export interface MarketingFeature {
  title: string;
  icon?: string; 
}

export interface ProductConfig {
  id: string;
  name: string;
  basePrice: number;
  
  // --- DATA KATALOG (Pengganti shopData) ---
  numericId: number;
  catalogTitle: string;
  reviews: number;
  catalogPrice: number;
  discountedPrice: number;
  thumbnails: string[];
  previews: string[];
  // ------------------------------------------

  parts: ProductPart[];
  sizes?: ProductSize[];
  gallery?: string[];
  marketingBlocks?: MarketingBlock[];
  dimensionsImage?: string;
  specifications?: ProductSpecification[];
}


// ==========================================
// DATA KONFIGURASI
// ==========================================
export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  
  // ================= TAS KELALAWAR =================
  tas_kelalawar: {
    id: "tas_kelalawar",
    name: "Tas Kelalawar",
    basePrice: 0,
    
    // Data Katalog
    numericId: 1,
    catalogTitle: "Bag Bat Kulit Premium",
    reviews: 15,
    catalogPrice: 1150000,
    discountedPrice: 2220000,
    thumbnails: [
      "/images/products/product-tasKelalawar.webp",
      "/images/products/product-tasKelalawar.webp",
    ],
    previews: [
      "/images/products/product-tasKelalawar.webp",
      "/images/products/product-tasKelalawar.webp",
    ],

    gallery: [
      "/assets/products/tas_kelalawar/gallery/gallery-1.webp",
      "/assets/products/tas_kelalawar/gallery/gallery-2.webp",
      "/assets/products/tas_kelalawar/gallery/gallery-3.webp",
      "/assets/products/tas_kelalawar/gallery/gallery-4.webp",
    ],
    dimensionsImage: "/assets/products/tas_kelalawar/dimension/dimension.webp",
    specifications: [
      { label: "Gaya Produk", value: "Tas Kelalawar" },
      { label: "Total Volume (liter)", value: "16.00 L" },
      { label: "Berat (lbs)", value: "2.2 lb" },
      { label: "Kecocokan Laptop Rata-rata (inci)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Seri Ikonik",
        subtitle: "Estetika Modern",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-1.webp",
        featureStyle: "cards",
        features: [
          { title: "Penyimpanan Cerdas", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Tahan Air", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Material Autentik",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-2.webp",
        imageQuote: "Tekstur kesempurnaan",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan grade A" },
          { title: "Lapisan dalam polyester lembut" },
          { title: "Resleting YKK anti karat" }
        ]
      }
    ],
    sizes: [
      { 
        id: "S", title: "Kecil (S)", desc: "Barang Bawaan Esensial", price: 0, image: "/assets/products/tas_kelalawar/size-guide/small.webp", dimensions: { width: 18, height: 12, depth: 6, unit: 'cm' }, description: "Ukuran terkecil, pas untuk smartphone, lipstik, dan dompet kartu"
      },
      { 
        id: "M", title: "Sedang (M)", desc: "Kebutuhan Harian", price: 50000, image: "/assets/products/tas_kelalawar/size-guide/medium.webp", dimensions: { width: 22, height: 15, depth: 8, unit: 'cm' }, description: "Bisa memuat dompet lipat, smartphone, powerbank, dan makeup pouch kecil."
      },
      { 
        id: "L", title: "Besar (L)", desc: "Kapasitas Maksimal", price: 550000, image: "/assets/products/tas_kelalawar/size-guide/large.webp", dimensions: { width: 26, height: 18, depth: 10, unit: 'cm' }, description: "Lebih lega, sanggup memuat tablet mini (8 inci) atau payung lipat kecil."
      },
      { 
        id: "XL", title: "Ekstra Besar (XL)", desc: "Muat Tablet", price: 120000, image: "/assets/products/tas_kelalawar/size-guide/xlarge.webp", dimensions: { width: 30, height: 22, depth: 12, unit: 'cm' }, description: "Varian terbesar untuk kategori minibag. Muat untuk tablet 11 inci"
      },
    ],
    parts: [
      { 
        id: "body", 
        name: "BADAN TAS", 
        basePrice: 800000, 
        zIndex: 30,
        textures: [
          { id: "base", name: "Kanvas Solid", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0,
            colors: [
              { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Terang", hex: "#EAD7C0" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" },
            ]
          },
          { id: "leather", name: "Kulit Premium", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000,
            colors: [
              { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Terang", hex: "#EAD7C0" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" },
            ]
          },
          { id: "leather1", name: "Kulit Premium 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000,
            colors: [
              { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Terang", hex: "#EAD7C0" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" },
            ]
          },
          { id: "leather2", name: "Kulit Premium 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000,
            colors: [
              { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Terang", hex: "#EAD7C0" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" },
            ]
          },
          { id: "leather3", name: "Kulit Premium 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000,
            colors: [
              { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Terang", hex: "#EAD7C0" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" },
            ]
          },
        ]
      },
      { 
        id: "telinga", 
        name: "TELINGA TAS", 
        basePrice: 150000, 
        zIndex: 20,
        variants: [
          { 
            id: "telinga", name: "Telinga Tas Klasik", thumb: "/assets/thumb-kotak.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather1", name: "Kulit Premium 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather2", name: "Kulit Premium 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000, colors: [{ name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather3", name: "Kulit Premium 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000, colors: [{ name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Kuning Lembut", hex: "#F2D16B" }, { name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
            ]
          },
          { 
            id: "telinga1", name: "Telinga Kucing", thumb: "/assets/thumb-kotak.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
            ]
          },
        ]
      },
      { 
        id: "tali", 
        name: "TALI BAHU",
        basePrice: 200000,
        zIndex: 10,
        variants: [
          { 
            id: "tali", name: "Tali Kulit", thumb: "/assets/thumb-kotak.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
              { id: "leather1", name: "Kulit Premium 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
            ]
          },
          { 
            id: "tali1", name: "Tali Panjang", thumb: "/assets/thumb-bulat.jpg", price: 20000, priceLabel: "+ Rp 20.000",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
              { id: "leather1", name: "Kulit Premium 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Persik", hex: "#F4A688" }, { name: "Coral Lembut", hex: "#F08080" }, { name: "Abu-abu Terang", hex: "#D3D3D3" }, { name: "Merah Muda Pastel", hex: "#F4B6C2" }] },
            ]
          },
          { 
            id: "tali2", name: "Tali Rantai", thumb: "/assets/thumb-bulat.jpg", price: 20000, priceLabel: "+ Rp 20.000",
            textures: [
              { id: "base", name: "Rantai Logam", thumb: "", price: 0, colors: [{ name: "Biru Langit", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Lavender Lembut", hex: "#C6B7E2" }, { name: "Persik", hex: "#F4A688" }] }
            ]
          }
        ]
      },
    ]
  },

  // ================= TOTEBAG =================
  totebag: {
    id: "totebag",
    name: "Tas Tote Klasik",
    basePrice: 0,
    
    // Data Katalog
    numericId: 2,
    catalogTitle: "Totebag Kulit Premium",
    reviews: 5,
    catalogPrice: 555555,
    discountedPrice: 249000,
    thumbnails: [
      "/images/products/product-totebag.webp",
      "/images/products/product-totebag.webp",
    ],
    previews: [
      "/images/products/product-totebag.webp",
      "/images/products/product-totebag.webp",
    ],

    gallery: [
      "/assets/products/totebag/gallery/gallery-1.webp",
      "/assets/products/totebag/gallery/gallery-3.jpg",
      "/assets/products/totebag/gallery/gallery-2.webp", 
      "/assets/products/totebag/gallery/gallery-4.jpg",
    ],
    dimensionsImage: "/assets/products/totebag/dimension/dimension.webp",
    specifications: [
      { label: "Gaya Produk", value: "Tas Tote Klasik" },
      { label: "Total Volume (liter)", value: "16.00 L" },
      { label: "Berat (lbs)", value: "2.2 lb" },
      { label: "Kecocokan Laptop Rata-rata (inci)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Seri Ikonik",
        subtitle: "Estetika Modern",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/totebag/marketing/marketing-1.webp",
        featureStyle: "cards",
        features: [
          { title: "Penyimpanan Cerdas", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Tahan Air", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Material Autentik",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/totebag/marketing/marketing-2.webp",
        imageQuote: "Tekstur kesempurnaan",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan grade A" },
          { title: "Lapisan dalam polyester lembut" },
          { title: "Resleting YKK anti karat" }
        ]
      }
    ],
    sizes: [
      { id: "S", title: "Kompak (S)", desc: "Tablet & Kebutuhan", price: 0, image: "/assets/products/totebag/size-guide/small.webp", dimensions: { width: 28, height: 22, depth: 8, unit: 'cm' }, description: "Cocok untuk tablet 11 inci (iPad Air/Pro)." },
      { id: "M", title: "Standar (M)", desc: "Muat Laptop 13\"", price: 50000, image: "/assets/products/totebag/size-guide/medium.webp", dimensions: { width: 34, height: 26, depth: 10, unit: 'cm' }, description: "Pas untuk MacBook Air atau laptop 13 inci, dan dokumen A4." },
      { id: "L", title: "Pro (L)", desc: "Kapasitas Laptop 14-15\"", price: 85000, image: "/assets/products/totebag/size-guide/large.webp", dimensions: { width: 38, height: 30, depth: 12, unit: 'cm' }, description: "Muat laptop 14-15 inci. Dapat memuat binder besar, botol minum, dan payung lipat." },
      { id: "XL", title: "Grand (XL)", desc: "Ruang Kerja Portabel", price: 125000, image: "/assets/products/totebag/size-guide/xlarge.webp", dimensions: { width: 42, height: 34, depth: 14, unit: 'cm' }, description: "Muat laptop 16 inci dan perlengkapan gym atau baju ganti." },
    ],
    parts: [
      { 
        id: "body", 
        name: "BADAN TAS", 
        basePrice: 150000, 
        zIndex: { Front: 40, Back: 40, Top: 10, "360": 40 },
        textures: [
          { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Krem Tulang", hex: "#F5F5DC" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }] },
          { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 25000, colors: [{ name: "Krem Tulang", hex: "#F5F5DC" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }] },
          { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 75000, colors: [{ name: "Krem Tulang", hex: "#F5F5DC" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }] },
          { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 85000, colors: [{ name: "Krem Tulang", hex: "#F5F5DC" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }] },
          { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 100000, colors: [{ name: "Krem Tulang", hex: "#F5F5DC" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }] },
        ]
      },
      { 
        id: "inner", 
        name: "KAIN DALAM (INNER)", 
        basePrice: 40000, 
        zIndex: { Front: 20, Back: 20, Top: 20, "360": 20 },
        textures: [
          { id: "base", name: "Katun Lembut", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
        ]
      },
      { 
        id: "pita", 
        name: "PITA AKSESORIS", 
        basePrice: 20000, 
        zIndex: { Front: 30, Back: 30, Top: 30, "360": 30 },
        variants: [
          {
            id: "pita_tipis", name: "Pita Tipis", thumb: "/assets/thumb-pita-tipis.jpg", price: 0, priceLabel: "",
            textures: [{ id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Kulit Konyak", hex: "#9A6338" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] }]
          },
          {
            id: "pita", name: "Pita Standar", thumb: "/assets/thumb-pita-standar.jpg", price: 0, priceLabel: "",
            textures: [{ id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Kulit Konyak", hex: "#9A6338" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] }]
          },
          {
            id: "pita_tebal", name: "Pita Tebal", thumb: "/assets/thumb-pita-tebal.jpg", price: 0, priceLabel: "",
            textures: [{ id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Kulit Konyak", hex: "#9A6338" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Hijau Sage", hex: "#7D8471" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] }]
          }
        ]
      },
      { 
        id: "tali_kanan", 
        name: "TALI KANAN",
        basePrice: 30000,
        zIndex: { Front: 50, Back: 10, Top: 40, "360": 50 },
        variants: [
          { 
            id: "tali_kanan", name: "Tali Standar", thumb: "/assets/thumb-tali-standar.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_katun_kanan", name: "Tali Katun", thumb: "/assets/thumb-tali-katun.jpg", price: 15000, priceLabel: "+ Rp 15.000",
            textures: [{ id: "base", name: "Katun Tenun", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] }]
          },
          { 
            id: "tali_bulat_kanan", name: "Tali Bulat", thumb: "/assets/thumb-tali-bulat.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_pendek_kanan", name: "Tali Pendek", thumb: "/assets/thumb-tali-pendek.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          }
        ]
      },
      { 
        id: "tali_kiri", 
        name: "TALI KIRI",
        basePrice: 30000,
        zIndex: { Front: 10, Back: 50, Top: 50, "360": 10 },
        variants: [
          { 
            id: "tali_kiri", name: "Tali Standar", thumb: "/assets/thumb-tali-standar.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_katun_kiri", name: "Tali Katun", thumb: "/assets/thumb-tali-katun.jpg", price: 15000, priceLabel: "+ Rp 15.000",
            textures: [{ id: "base", name: "Katun Tenun", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] }]
          },
          { 
            id: "tali_bulat_kiri", name: "Tali Bulat", thumb: "/assets/thumb-tali-bulat.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_pendek_kiri", name: "Tali Pendek", thumb: "/assets/thumb-tali-pendek.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Kanvas Solid", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "dino", name: "Pola Dino", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather", name: "Kulit Premium", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Kulit Glossy", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
              { id: "snake", name: "Kulit Ular", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Hijau Sage", hex: "#7D8471" }, { name: "Hitam Obsidian", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Kulit Konyak", hex: "#9A6338" }, { name: "Cokelat Karamel", hex: "#C68E5F" }, { name: "Terakota", hex: "#A45A52" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Krem Tulang", hex: "#F5F5DC" }] },
            ]
          }
        ]
      },
      {
        id: "charm_kanan",
        name: "CHARM KANAN",
        basePrice: 0,
        zIndex: { Front: 60, Back: 5, Top: 60, "360": 60 },
        variants: [
          {
            id: "charm_kanan", name: "Gantungan Logam", thumb: "/assets/thumb-charm.jpg", price: 10000, priceLabel: "+ Rp 10.000",
            textures: [{ id: "base", name: "Logam Poles", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0, colors: [{ name: "Emas", hex: "#FFD700" }, { name: "Perak", hex: "#C0C0C0" }, { name: "Emas Mawar", hex: "#B76E79" }, { name: "Logam Hitam", hex: "#2a2a2a" }] }]
          }
        ]
      },
      {
        id: "charm_kiri",
        name: "CHARM KIRI",
        basePrice: 0,
        zIndex: { Front: 60, Back: 5, Top: 60, "360": 60 },
        variants: [
          {
            id: "charm_kiri", name: "Gantungan Logam", thumb: "/assets/thumb-charm.jpg", price: 10000, priceLabel: "+ Rp 10.000",
            textures: [{ id: "base", name: "Logam Poles", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0, colors: [{ name: "Emas", hex: "#FFD700" }, { name: "Perak", hex: "#C0C0C0" }, { name: "Emas Mawar", hex: "#B76E79" }, { name: "Logam Hitam", hex: "#2a2a2a" }] }]
          }
        ]
      }
    ]
  },

  // ================= TAS MINI =================
  tas_mini: {
    id: "tas_mini",
    name: "Tas Mini",
    basePrice: 850000,
    
    // Data Katalog
    numericId: 3,
    catalogTitle: "thighBag",
    reviews: 5,
    catalogPrice: 1250000,
    discountedPrice: 950000,
    thumbnails: [
      "/images/products/product-thighBag.webp",
      "/images/products/product-thighBag.webp",
    ],
    previews: [
      "/images/products/product-thighBag.webp",
      "/images/products/product-thighBag.webp",
    ],

    gallery: [
      "/assets/products/tas_mini/gallery/gallery-1.webp",
      "/assets/products/tas_mini/gallery/gallery-2.webp",
      "/assets/products/tas_mini/gallery/gallery-3.webp",
      "/assets/products/tas_mini/gallery/gallery-4.webp",
    ],
    dimensionsImage: "/assets/products/tas_mini/dimension/dimension.webp",
    specifications: [
      { label: "Gaya Produk", value: "Tas Mini" }, 
      { label: "Total Volume (liter)", value: "16.00 L" },
      { label: "Berat (lbs)", value: "2.2 lb" },
      { label: "Kecocokan Laptop Rata-rata (inci)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Seri Ikonik",
        subtitle: "Estetika Modern",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/tas_mini/marketing/marketing-1.webp",
        featureStyle: "cards",
        features: [
          { title: "Penyimpanan Cerdas", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Tahan Air", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Material Autentik",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_mini/marketing/marketing-2.webp",
        imageQuote: "Tekstur kesempurnaan",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan grade A" },
          { title: "Lapisan dalam polyester lembut" },
          { title: "Resleting YKK anti karat" }
        ]
      }
    ],
    sizes: [
      { id: "S", title: "Kecil (S)", desc: "Aksesoris Lengan & Sabuk", price: 0, image: "/assets/products/tas_mini/size-guide/small.webp", dimensions: { width: 10, height: 16, depth: 4, unit: 'cm' }, description: "Pas untuk smartphone, kunci, dan earbuds." },
      { id: "M", title: "Sedang (M)", desc: "Tas Paha & Pinggang", price: 35000, image: "/assets/products/tas_mini/size-guide/medium.webp", dimensions: { width: 14, height: 20, depth: 6, unit: 'cm' }, description: "Bisa memuat smartphone besar, powerbank, dan dompet." },
      { id: "L", title: "Besar (L)", desc: "Kapasitas Ekstra", price: 65000, image: "/assets/products/tas_mini/size-guide/large.webp", dimensions: { width: 18, height: 24, depth: 8, unit: 'cm' }, description: "Cukup untuk tablet 7-8 inci, toolkit kecil, atau sarung tangan motor." },
      { id: "XL", title: "Ekstra Besar (XL)", desc: "Kapasitas Lapangan Maksimal", price: 95000, image: "/assets/products/tas_mini/size-guide/xlarge.webp", dimensions: { width: 22, height: 28, depth: 10, unit: 'cm' }, description: "Muat iPad Mini, botol minum kecil, dan peralatan harian lengkap." },
    ],
    parts: [
      {
        id: "body", 
        name: "Badan Tas", 
        basePrice: 0, 
        zIndex: { Front: 10, Back: 10, Top: 20 },
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Kulit", thumb: "", price: 150000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Kulit 1", thumb: "", price: 150000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Kulit 2", thumb: "", price: 150000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Kulit 3", thumb: "", price: 150000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Kulit 4", thumb: "", price: 150000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
        ]
      },
      {
        id: "trim-badan", 
        name: "Jahitan Badan", 
        basePrice: 0, 
        zIndex: { Front: 20, Back: 10, Top: 5 },
        textures: [
          { id: "base", name: "Benang Standar", thumb: "", price: 0, colors: [{ name: "Putih", hex: "#FFFFFF" }, { name: "Hitam", hex: "#000000" }] }
        ]
      },
      {
        id: "penutup", 
        name: "Penutup", 
        basePrice: 100000, 
        zIndex: { Front: 30, Back: 20, Top: 30 },
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Kulit", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Kulit 1", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Kulit 2", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Kulit 3", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Kulit 4", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
        ]
      },
      {
        id: "trim-penutup", 
        name: "Jahitan Penutup", 
        basePrice: 0, 
        zIndex: { Front: 40, Back: 40, Top: 40 },
        textures: [
          { id: "base", name: "Benang Standar", thumb: "", price: 0, colors: [{ name: "Putih", hex: "#FFFFFF" }, { name: "Hitam", hex: "#000000" }] }
        ]
      },
      {
        id: "pengait2", 
        name: "Tali Pengait", 
        basePrice: 0, 
        zIndex: 55,
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Kulit", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Kulit 1", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Kulit 2", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Kulit 3", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Kulit 4", thumb: "", price: 75000, colors: [{ name: "Kulit (Standar)", hex: "#AC7434" }, { name: "Kulit Cokelat (Dulux)", hex: "#88572B" }, { name: "Cokelat Espresso", hex: "#612718" }, { name: "Cokelat Tua (Klasik)", hex: "#654321" }, { name: "Kastanye", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
        ]
      },
      {
        id: "kompartemen", 
        name: "Tipe Kompartemen", 
        basePrice: 0, 
        zIndex: 60,
        variants: [
          {
            id: "kancing", name: "Kancing", price: 0, priceLabel: "",
            staticOverlays: [
              { id: "kancing2", url: "/assets/products/tas_mini/front/kancing2-base.webp", zIndex: 50, name: "Kancing 2" },
              { id: "kancing3", url: "/assets/products/tas_mini/front/kancing3-base.webp", zIndex: 50, name: "Kancing 3" }
            ]
          },
          {
            id: "pengait", name: "Pengait", price: 50000, priceLabel: "+ Rp 50.000",
            staticOverlays: [
              { id: "pengait1", url: "/assets/products/tas_mini/front/pengait1-base.webp", zIndex: 50, name: "Pengait 1" },
              { id: "pengait3", url: "/assets/products/tas_mini/front/pengait3-base.webp", zIndex: 60, name: "Pengait 3" }
            ]
          }
        ]
      },
      {
        id: "tali", 
        name: "Tali", 
        basePrice: 0, 
        zIndex: { Front: 5, Back: 30, Top: 10, "360": 50 },
        staticOverlays: [
          { id: "tali-back", url: "/assets/products/tas_mini/back/tali-base.webp", zIndex: 30, name: "Tali Belakang" },
          { id: "tali-top", url: "/assets/products/tas_mini/top/tali-base.webp", zIndex: 10, name: "Tali Atas" }
        ]
      }
    ]
  },

  // ================= TOP HANDLE BAG =================
  top_handle_bag: {
    id: "top_handle_bag", 
    name: "Tas Jinjing Klasik",
    basePrice: 650000,
    
    // Data Katalog
    numericId: 4,
    catalogTitle: "Top Handle Bag",
    reviews: 5,
    catalogPrice: 1250000,
    discountedPrice: 725000,
    thumbnails: [
      "/images/products/product-topHandleBag.webp",
      "/images/products/product-topHandleBag.webp",
    ],
    previews: [
      "/images/products/product-topHandleBag.webp",
      "/images/products/product-topHandleBag.webp",
    ],

    gallery: [
      "/assets/products/top_handle_bag/gallery/gallery-1.webp",
      "/assets/products/top_handle_bag/gallery/gallery-2.webp",
      "/assets/products/top_handle_bag/gallery/gallery-3.webp",
      "/assets/products/top_handle_bag/gallery/gallery-4.webp",
    ],
    dimensionsImage: "/assets/products/top_handle_bag/dimensions/dimension.webp",
    specifications: [
      { label: "Gaya Produk", value: "Tas Jinjing" },
      { label: "Total Volume (liter)", value: "16.00 L" },
      { label: "Berat (lbs)", value: "2.2 lb" },
      { label: "Kecocokan Laptop Rata-rata (inci)", value: '16"' },
    ],
    marketingBlocks: [
      {
        "layout": "image-left",
        "hasPattern": true, 
        "badge": "Keahlian Tangan", 
        "subtitle": "Tekstur yang Menyihir", 
        "title": "Detail Kepangan", 
        "titleHighlight": "& Keahlian", 
        "titleHighlightStyle": "gradient",
        "description": "Rasakan sentuhan kulit berkerikil yang halus yang dipadukan dengan detail kepangan kulit cokelat yang kaya, dibuat dengan tangan oleh pengrajin ahli kami untuk keunikan yang tak tertandingi.",
        "image": "/assets/products/top_handle_bag/marketing/marketing-2.webp",
        "featureStyle": "cards",
        "features": [
          { "title": "Anyaman Tangan", "icon": "M10 10l5 5M10 20l10-10M5 5l5 5" }, 
          { "title": "Tekstur Mewah", "icon": "M4 4h16v16H4V4z M10 10l4 4" } 
        ]
      },
      {
        "layout": "image-right",
        "hasPattern": false,
        "badge": "Penyimpanan Cerdas", 
        "title": "Navigasi Internal", 
        "titleHighlight": "& Mewah",
        "titleHighlightStyle": "amber",
        "description": "Lapisan dalam burgundy yang kaya menampung kompartemen ganda berritsleting dan saku slip untuk menjaga barang berharga Anda tetap terorganisir, aman, dan mudah diakses sepanjang hari.", 
        "image": "/assets/products/top_handle_bag/marketing/marketing-1.webp", 
        "imageQuote": "Keindahan yang tersembunyi", 
        "featureStyle": "bullets",
        "features": [
          { "title": "Lapisan burgundy lembut" },
          { "title": "Kompartemen berritsleting ganda" }, 
          { "title": "Ritsleting emas berlogo" } 
        ]
      }
    ],
    sizes: [
      { 
        id: "S", 
        title: "Mini (S)", 
        desc: "Gaya Elegan Ringkas", 
        price: 0, 
        image: "/assets/products/top_handle_bag/size-guide/small.webp", 
        dimensions: { width: 20, height: 14, depth: 8, unit: 'cm' }, 
        description: "Ukuran mungil yang memikat. Sempurna untuk acara malam atau pesta, muat untuk smartphone, dompet kartu, dan lipstik."
      },
      { 
        id: "M", 
        title: "Standar (M)", 
        desc: "Esensial Sehari-hari", 
        price: 150000, 
        image: "/assets/products/top_handle_bag/size-guide/medium.webp", 
        dimensions: { width: 25, height: 18, depth: 10, unit: 'cm' }, 
        description: "Ukuran paling populer dan proporsional. Pas untuk menemani aktivitas harian, memuat dompet panjang, smartphone, dan pouch kosmetik kecil."
      },
      { 
        id: "L", 
        title: "Besar (L)", 
        desc: "Kapasitas Ekstra", 
        price: 350000, 
        image: "/assets/products/top_handle_bag/size-guide/large.webp", 
        dimensions: { width: 30, height: 22, depth: 12, unit: 'cm' }, 
        description: "Lebih leluasa untuk wanita aktif tanpa kehilangan siluet elegannya. Sanggup memuat tablet 8 inci (iPad Mini), buku catatan, dan payung lipat kecil."
      },
      { 
        id: "XL", 
        title: "Maksimal (XL)", 
        desc: "Profesional & Elegan", 
        price: 550000, 
        image: "/assets/products/top_handle_bag/size-guide/xlarge.webp", 
        dimensions: { width: 35, height: 25, depth: 14, unit: 'cm' }, 
        description: "Varian terbesar, sangat cocok untuk wanita karir. Memiliki ruang ekstra untuk dokumen berukuran A4 atau laptop tipis 13 inci."
      },
    ],
    parts: [
      {
        id: "badan", name: "Badan Tas", basePrice: 0, zIndex: { Front: 10, Back: 20, Top: 10 },
        textures: [
          { id: "base", name: "Original", thumb: "/assets/products/top_handle_bag/textures/thumb-original.webp", price: 0 },
          { id: "leather1", name: "Hitam Klasik", thumb: "/assets/products/top_handle_bag/textures/thumb-leather1.webp", price: 1000000 },
          { id: "leather2", name: "Cokelat Kastanye", thumb: "/assets/products/top_handle_bag/textures/thumb-leather2.webp", price: 2000000 },
          { id: "leather3", name: "Cokelat Espresso", thumb: "/assets/products/top_handle_bag/textures/thumb-leather3.webp", price: 3000000 },
          { id: "leather4", name: "Kulit Buaya Gelap", thumb: "/assets/products/top_handle_bag/textures/thumb-leather4.webp", price: 4000000 },
          { id: "leather5", name: "Cokelat Karamel", thumb: "/assets/products/top_handle_bag/textures/thumb-leather5.webp", price: 5000000 },
        ]
      },
      {
        id: 'tali_kunci', name : 'Tali Kunci', basePrice : 0 , zIndex: {Front: 50, Back:50, Top:50},
        textures: [
          { id: "base", name: "Original", thumb: "", price: 0 },
        ]
      },
      {
        id: "kunci", name: "Kunci", basePrice: 0, zIndex: { Front: 60, Back: 60, Top: 60 },
        variants: [
          {
            id: "kunci", 
            name: "Gesper Kulit Klasik", 
            price: 0, 
            priceLabel: "",
          },
          {
            id: "kunci1", 
            name: "Kunci Emblem Vintage", 
            price: 35000, 
            priceLabel: "+ Rp 35.000",
          },
          {
            id: "kunci2", 
            name: "Kunci Emas Menyilang", 
            price: 50000, 
            priceLabel: "+ Rp 50.000",
          },
          {
            id: "kunci3", 
            name: "Kunci Perak Minimalis", 
            price: 25000, 
            priceLabel: "+ Rp 25.000",
          },
        ]
      },
      {
        id: "lidah_kanan", name: "Lidah Kanan", basePrice: 0, zIndex: { Front: 30, Back: 30, Top: 30 },
        textures: [
          { 
            id: "base", name: "Kulit Premium", thumb: "", price: 0,
            colors: [
              { name: "Biru Dongker", hex: "#1E293B" },{ name: "Krem", hex: "#F3E9DC" }, { name: "Beige Lembut", hex: "#EAD7C0" }, { name: "Merah Marun", hex: "#800000" }, { name: "Hitam", hex: "#1A1A1A" },
            ] 
          }
        ]
      },
      {
        id: "lidah_kiri", name: "Lidah Kiri", basePrice: 0, zIndex: { Front: 30, Back: 30, Top: 30 },
        textures: [
          { 
            id: "base", name: "Kulit Premium", thumb: "", price: 0,
            colors: [
              { name: "Biru Dongker", hex: "#1E293B" },{ name: "Krem", hex: "#F3E9DC" }, { name: "Beige Lembut", hex: "#EAD7C0" }, { name: "Merah Marun", hex: "#800000" }, { name: "Hitam", hex: "#1A1A1A" },
            ]
          }
        ]
      },
      {
        id: "lidah_tengah", name: "Lidah Tengah", basePrice: 0, zIndex: { Front: 40, Back: 40, Top: 40 }, 
        textures: [
          { 
            id: "base", name: "Kulit Premium", thumb: "", price: 0,
            colors: [
               { name: "Merah Marun", hex: "#800000" }, { name: "Krem", hex: "#F3E9DC" }, { name: "Beige Lembut", hex: "#EAD7C0" }, { name: "Biru Dongker", hex: "#1E293B" }, { name: "Hitam", hex: "#1A1A1A" },
            ]
          }
        ]
      },
      {
        id: "pita", name: "Pita Aksesoris", basePrice: 25000, zIndex: { Front: 20, Back: 10, Top: 60 },
        variants: [
          {
            id: "pita", 
            name: "Gesper Kulit Klasik", 
            price: 0, 
            priceLabel: "",
          },
          {
            id: "pita1", 
            name: "Kunci Emblem Vintage", 
            price: 35000, 
            priceLabel: "+ Rp 35.000",
          },
          {
            id: "pita2", 
            name: "Kunci Emas Menyilang", 
            price: 50000, 
            priceLabel: "+ Rp 50.000",
          },
          {
            id: "pita3", 
            name: "Kunci Perak Minimalis", 
            price: 25000, 
            priceLabel: "+ Rp 25.000",
          },
        ]
      },
      {
        id: "tali", name: "Tali Tas", basePrice: 50000, zIndex: { Front: 20, Back: 70, Top: 70 },
        textures: [
          { id: "base", name: "Tali Standar", thumb: "", price: 0} 
        ]
      }
    ]
  },

  // ================= CLASSIC MESSENGER BAG =================
  classic_messenger_bag: {
    id: "classic_messenger_bag", 
    name: "Classic Messenger Bag",
    basePrice: 650000,

    // Data Katalog
    numericId: 5,
    catalogTitle: "Classic Messenger Bag",
    reviews: 0,
    catalogPrice: 750000, 
    discountedPrice: 550000, 
    thumbnails: [
      "/images/products/product-classicMessengerBag.webp",
      "/images/products/product-classicMessengerBag.webp",
    ],
    previews: [
      "/images/products/product-classicMessengerBag.webp",
      "/images/products/product-classicMessengerBag.webp",
    ],

    gallery: [
      "/assets/products/classic_messenger_bag/gallery/gallery-1.webp",
      "/assets/products/classic_messenger_bag/gallery/gallery-2.webp",
      "/assets/products/classic_messenger_bag/gallery/gallery-3.webp",
      "/assets/products/classic_messenger_bag/gallery/gallery-4.webp",
    ],
    dimensionsImage: "",
    specifications: [
      { label: "Product Style", value: "Classic Messenger Bag" },
      { label: "Material", value: "Premium Canvas & Leather" }
    ],
    marketingBlocks: [
        {
          "layout": "image-right", 
          "hasPattern": false, 
          "badge": "Organisasi Cerdas", 
          "subtitle": "Kejelasan Tanpa Kompromi", 
          "title": "Interior Terorganisir", 
          "titleHighlight": "& Jelas", 
          "titleHighlightStyle": "amber", 
          "description": "Lapisan dalam hitam pekat yang bersih memberikan kejelasan visual. Menampilkan kompartemen utama yang luas yang menampung barang-barang penting Anda, termasuk saku slip khusus untuk buku catatan dan dua smartphone, menjaga semuanya dalam jangkauan.", 
          "image": "/assets/products/classic_messenger_bag/marketing/marketing-1.webp", 
          "featureStyle": "bullets", 
          "features": [
            { "title": "Lapisan hitam pekat yang bersih" }, 
            { "title": "Kompartemen utama yang luas" }, 
            { "title": "Saku slip khusus untuk dua smartphone dan buku catatan" } 
          ]
        },
        {
          "layout": "image-left", 
          "hasPattern": true, 
          "badge": "Desain Berani", 
          "subtitle": "Harmoni Blok Warna", 
          "title": "Retro Modern", 
          "titleHighlight": "& Ikonik", 
          "titleHighlightStyle": "gradient", 
          "description": "Rasakan pernyataan desain yang kuat dengan panel blok warna vertikal ikonik kami. Abu-abu muda, merah cerah, dan kuning cerah bersatu dalam harmoni minimalis. Terbuat dari kulit halus yang premium untuk tampilan yang bersih dan canggih.", 
          "image": "/assets/products/classic_messenger_bag/marketing/marketing-2.webp",
          "featureStyle": "cards", 
          "features": [
            { "title": "Panel blok warna tiga nada", "icon": "M10 10l5 5M10 20l10-10M5 5l5 5" }, 
            { "title": "Kulit halus yang premium", "icon": "M4 4h16v16H4V4z M10 10l4 4" } 
          ]
        }
      ],
    sizes: [
      { 
        id: "S", 
        title: "Kompak (S)", 
        desc: "Gaya Kasual Ringkas", 
        price: 0, 
        image: "/assets/products/classic_messenger_bag/size-guide/small.webp", 
        dimensions: { width: 20, height: 14, depth: 8, unit: 'cm' }, 
        description: "Versi mungil dari desain ikonik kami. Sempurna untuk jalan santai, pas untuk menyimpan satu smartphone, dompet kartu, dan kunci mobil tanpa kehilangan gaya color-block yang khas."
      },
      { 
        id: "M", 
        title: "Standar (M)", 
        desc: "Esensial Sehari-hari", 
        price: 150000, 
        image: "/assets/products/classic_messenger_bag/size-guide/medium.webp", 
        dimensions: { width: 25, height: 18, depth: 10, unit: 'cm' }, 
        description: "Ukuran paling ideal dan proporsional. Sesuai dengan desain interior yang luas, ukuran ini dengan mudah memuat dua smartphone, buku catatan kecil, pena, dan dompet harian Anda."
      },
      { 
        id: "L", 
        title: "Besar (L)", 
        desc: "Kapasitas Ekstra", 
        price: 350000, 
        image: "/assets/products/classic_messenger_bag/size-guide/large.webp", 
        dimensions: { width: 30, height: 22, depth: 12, unit: 'cm' }, 
        description: "Ruang lebih leluasa untuk mobilitas tinggi. Sanggup memuat tablet (seperti iPad), buku agenda, serta membawa semua perlengkapan esensial harian Anda dengan tetap mempertahankan struktur minimalisnya."
      },
      { 
        id: "XL", 
        title: "Maksimal (XL)", 
        desc: "Profesional & Modern", 
        price: 550000, 
        image: "/assets/products/classic_messenger_bag/size-guide/xlarge.webp", 
        dimensions: { width: 35, height: 25, depth: 14, unit: 'cm' }, 
        description: "Varian terbesar yang cocok untuk bekerja atau kuliah. Memiliki ruang ekstra untuk membawa dokumen, buku berukuran A4, atau laptop tipis 13 inci dengan gaya retro yang berani."
      },
    ],
    parts: [
      {
        id: "body_kiri", name: "Badan Tas Kiri", basePrice: 0, zIndex: { Front: 20, Back: 10, Top: 10 },
        textures: [
            { id: "base", name: "Original", thumb: "assets/products/classic_messenger_bag/textures/thumb-original.webp", price: 0 },
        ]
      },
      {
        id: "body_tengah", name: "Badan Tas Tengah", basePrice: 0, zIndex: { Front: 30, Back: 20, Top: 20 },
        textures: [
            { id: "base", name: "Original", thumb: "assets/products/classic_messenger_bag/textures/thumb-original3.webp", price: 0 },
        ]
      },
      {
        id: "body_kanan", name: "Badan Tas Kanan", basePrice: 0, zIndex: { Front: 20, Back: 10, Top: 10 },
        textures: [
            { id: "base", name: "Original", thumb: "assets/products/classic_messenger_bag/textures/thumb-original2.webp", price: 0 },
        ]
      },
      {
        id: "tali", name: "Tali", basePrice: 0, zIndex: { Front: 10, Back: 30, Top: 20 },
        variants: [
          {
            id: "tali", 
            name: "Tali Selempang Klasik", 
            price: 0, 
            priceLabel: "",
          },
          {
            id: "tali2", 
            name: "Tali Pinggang Klasik", 
            price: 35000, 
            priceLabel: "+ Rp 35.000",
          },
          {
            id: "tali3", 
            name: "Tali Rantai", 
            price: 50000, 
            priceLabel: "+ Rp 50.000",
          },
        ]
      },
      {
        id: "pengunci", name: "Pengunci", basePrice: 0, zIndex: { Front: 40, Back: 10, Top: 20 },
        variants: [
          {
            id: "pengunci", 
            name: "Pengunci Klasik", 
            price: 0, 
            priceLabel: "",
          },
        ]
      },
    ]
  }
};

// ==========================================
// HELPER METHODS UNTUK FRONTEND
// ==========================================

export const getShopCatalogList = () => {
  return Object.values(PRODUCTS_CONFIG).map((product) => ({
    id: product.numericId,
    idProduct: product.id,
    title: product.catalogTitle,
    reviews: product.reviews,
    price: product.catalogPrice,
    discountedPrice: product.discountedPrice,
    imgs: {
      thumbnails: product.thumbnails,
      previews: product.previews,
    }
  }));
};