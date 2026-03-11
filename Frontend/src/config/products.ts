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
  colors?: ProductColor[];  // <-- HANYA DI SINI COLORS BERADA
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

export interface ProductConfig {
  id: string;
  name: string;
  basePrice: number;
  parts: ProductPart[];
  sizes?: ProductSize[];
  gallery?: string[];
  marketingBlocks?: MarketingBlock[];
  dimensionsImage?: string;
  specifications?: ProductSpecification[];
}

export interface MarketingFeature {
  title: string;
  icon?: string; 
}


// ==========================================
// DATA KONFIGURASI
// ==========================================
export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  
  // ================= TAS KELALAWAR =================
  tas_kelalawar: {
    id: "tas_kelalawar",
    name: "Bat Bag",
    basePrice: 0,
    gallery: [
      "/assets/products/tas_kelalawar/gallery/gallery-1.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-2.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-3.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-4.jpeg",
    ],
    dimensionsImage: "/assets/products/tas_kelalawar/dimension/dimension.png",
    specifications: [
      { label: "Product Style", value: "Bat Bag" },
      { label: "Total Volume (liters)", value: "16.00 L" },
      { label: "Weight (lbs)", value: "2.2 lb" },
      { label: "Avg. Laptop Fit (in)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Iconic Series",
        subtitle: "Modern Aesthetic",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-1.jpeg",
        featureStyle: "cards",
        features: [
          { title: "Smart Storage", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Water Proof", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Authentic Material",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-2.jpeg",
        imageQuote: "The texture of perfection",
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
        id: "S", title: "Small", desc: "Compact Essentials", price: 0, image: "/assets/products/tas_kelalawar/size-guide/small.png", dimensions: { width: 18, height: 12, depth: 6, unit: 'cm' }, description: "Ukuran terkecil, pas untuk smartphone, lipstik, dan dompet kartu"
      },
      { 
        id: "M", title: "Medium", desc: "Daily Essentials", price: 50000, image: "/assets/products/tas_kelalawar/size-guide/medium.png", dimensions: { width: 22, height: 15, depth: 8, unit: 'cm' }, description: "Bisa memuat dompet lipat, smartphone, powerbank, dan makeup pouch kecil."
      },
      { 
        id: "L", title: "Large", desc: "Maximum Capacity", price: 550000, image: "/assets/products/tas_kelalawar/size-guide/large.png", dimensions: { width: 26, height: 18, depth: 10, unit: 'cm' }, description: "Lebih lega, sanggup memuat tablet mini (8 inci) atau payung lipat kecil."
      },
      { 
        id: "XL", title: "Extra Large", desc: "Tablet Friendly", price: 120000, image: "/assets/products/tas_kelalawar/size-guide/xlarge.png", dimensions: { width: 30, height: 22, depth: 12, unit: 'cm' }, description: "Varian terbesar untuk kategori minibag. Muat untuk tablet 11 inci"
      },
    ],
    parts: [
      { 
        id: "body", 
        name: "BODY", 
        basePrice: 800000, 
        zIndex: 30,
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Light Beige", hex: "#EAD7C0" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" },
            ]
          },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Light Beige", hex: "#EAD7C0" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" },
            ]
          },
          { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Light Beige", hex: "#EAD7C0" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" },
            ]
          },
          { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Light Beige", hex: "#EAD7C0" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" },
            ]
          },
          { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Light Beige", hex: "#EAD7C0" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" },
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
            id: "telinga", name: "Telinga Tas", thumb: "/assets/thumb-kotak.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000, colors: [{ name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
              { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000, colors: [{ name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Soft Yellow", hex: "#F2D16B" }, { name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }] },
            ]
          },
          { 
            id: "telinga1", name: "Telinga Kucing", thumb: "/assets/thumb-kotak.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
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
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Light Grey", hex: "#D3D3D3" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Light Grey", hex: "#D3D3D3" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Light Grey", hex: "#D3D3D3" }, { name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
            ]
          },
          { 
            id: "tali1", name: "Tali Panjang", thumb: "/assets/thumb-bulat.jpg", price: 20000, priceLabel: "+ Rp 20.000",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000, colors: [{ name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000, colors: [{ name: "Peach", hex: "#F4A688" }, { name: "Soft Coral", hex: "#F08080" }, { name: "Light Grey", hex: "#D3D3D3" }, { name: "Baby Pink", hex: "#F4B6C2" }] },
            ]
          },
          { 
            id: "tali2", name: "Tali Rantai", thumb: "/assets/thumb-bulat.jpg", price: 20000, priceLabel: "+ Rp 20.000",
            textures: [
              { id: "base", name: "Metal Chain", thumb: "", price: 0, colors: [{ name: "Sky Blue", hex: "#7FB7E6" }, { name: "Mint", hex: "#8ED1B2" }, { name: "Soft Lavender", hex: "#C6B7E2" }, { name: "Peach", hex: "#F4A688" }] }
            ]
          }
        ]
      },
    ]
  },

  // ================= TOTEBAG =================
  totebag: {
    id: "totebag",
    name: "Classic Tote Bag",
    basePrice: 0,
    gallery: [
      "/assets/products/totebag/gallery/gallery-1.png",
      "/assets/products/totebag/gallery/gallery-3.jpg",
      "/assets/products/totebag/gallery/gallery-2.png", 
      "/assets/products/totebag/gallery/gallery-4.jpg",
    ],
    dimensionsImage: "/assets/products/totebag/dimension/dimension.png",
    specifications: [
      { label: "Product Style", value: "Bat Bag" },
      { label: "Total Volume (liters)", value: "16.00 L" },
      { label: "Weight (lbs)", value: "2.2 lb" },
      { label: "Avg. Laptop Fit (in)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Iconic Series",
        subtitle: "Modern Aesthetic",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/totebag/marketing/marketing-1.png",
        featureStyle: "cards",
        features: [
          { title: "Smart Storage", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Water Proof", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Authentic Material",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/totebag/marketing/marketing-2.png",
        imageQuote: "The texture of perfection",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan grade A" },
          { title: "Lapisan dalam polyester lembut" },
          { title: "Resleting YKK anti karat" }
        ]
      }
    ],
    sizes: [
      { id: "S", title: "Compact (S)", desc: "Tablet & Essentials", price: 0, image: "/assets/products/totebag/size-guide/small.png", dimensions: { width: 28, height: 22, depth: 8, unit: 'cm' }, description: "tablet 11 inci (iPad Air/Pro)." },
      { id: "M", title: "Standard (M)", desc: "Laptop 13\" Friendly", price: 50000, image: "/assets/products/totebag/size-guide/medium.png", dimensions: { width: 34, height: 26, depth: 10, unit: 'cm' }, description: "MacBook Air atau laptop 13 inci, dokumen A4." },
      { id: "L", title: "Pro (L)", desc: "Laptop 14-15\" Capacity", price: 85000, image: "/assets/products/totebag/size-guide/large.png", dimensions: { width: 38, height: 30, depth: 12, unit: 'cm' }, description: "laptop 14-15 inci. Dapat memuat binder besar, botol minum, dan payung lipat." },
      { id: "XL", title: "Grand (XL)", desc: "Workstation Mobile", price: 125000, image: "/assets/products/totebag/size-guide/xlarge.png", dimensions: { width: 42, height: 34, depth: 14, unit: 'cm' }, description: "laptop 16 inci dan perlengkapan gym atau baju ganti." },
    ],
    parts: [
      { 
        id: "body", 
        name: "BODY TAS", 
        basePrice: 150000, 
        zIndex: { Front: 40, Back: 40, Top: 10, "360": 40 },
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Creamy Bone", hex: "#F5F5DC" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }] },
          { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 25000, colors: [{ name: "Creamy Bone", hex: "#F5F5DC" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }] },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 75000, colors: [{ name: "Creamy Bone", hex: "#F5F5DC" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }] },
          { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 85000, colors: [{ name: "Creamy Bone", hex: "#F5F5DC" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }] },
          { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 100000, colors: [{ name: "Creamy Bone", hex: "#F5F5DC" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }] },
        ]
      },
      { 
        id: "inner", 
        name: "KAIN DALAM (INNER)", 
        basePrice: 40000, 
        zIndex: { Front: 20, Back: 20, Top: 20, "360": 20 },
        textures: [
          { id: "base", name: "Soft Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
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
            textures: [{ id: "base", name: "Satin Silk", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Cognac Leather", hex: "#9A6338" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] }]
          },
          {
            id: "pita", name: "Pita Standar", thumb: "/assets/thumb-pita-standar.jpg", price: 0, priceLabel: "",
            textures: [{ id: "base", name: "Satin Silk", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Cognac Leather", hex: "#9A6338" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] }]
          },
          {
            id: "pita_tebal", name: "Pita Tebal", thumb: "/assets/thumb-pita-tebal.jpg", price: 0, priceLabel: "",
            textures: [{ id: "base", name: "Satin Silk", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0, colors: [{ name: "Cognac Leather", hex: "#9A6338" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Sage Green", hex: "#7D8471" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] }]
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
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_katun_kanan", name: "Tali Katun", thumb: "/assets/thumb-tali-katun.jpg", price: 15000, priceLabel: "+ Rp 15.000",
            textures: [{ id: "base", name: "Woven Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] }]
          },
          { 
            id: "tali_bulat_kanan", name: "Tali Bulat", thumb: "/assets/thumb-tali-bulat.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_pendek_kanan", name: "Tali Pendek", thumb: "/assets/thumb-tali-pendek.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
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
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_katun_kiri", name: "Tali Katun", thumb: "/assets/thumb-tali-katun.jpg", price: 15000, priceLabel: "+ Rp 15.000",
            textures: [{ id: "base", name: "Woven Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] }]
          },
          { 
            id: "tali_bulat_kiri", name: "Tali Bulat", thumb: "/assets/thumb-tali-bulat.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
            ]
          },
          { 
            id: "tali_pendek_kiri", name: "Tali Pendek", thumb: "/assets/thumb-tali-pendek.jpg", price: 0, priceLabel: "",
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000, colors: [{ name: "Sage Green", hex: "#7D8471" }, { name: "Obsidian Black", hex: "#1A1A1A" }, { name: "Espresso", hex: "#3E2723" }, { name: "Cognac Leather", hex: "#9A6338" }, { name: "Caramel Tan", hex: "#C68E5F" }, { name: "Terracotta", hex: "#A45A52" }, { name: "Deep Navy", hex: "#1E293B" }, { name: "Creamy Bone", hex: "#F5F5DC" }] },
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
            id: "charm_kanan", name: "Charm Metal", thumb: "/assets/thumb-charm.jpg", price: 10000, priceLabel: "+ Rp 10.000",
            textures: [{ id: "base", name: "Metal Polish", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0, colors: [{ name: "Gold", hex: "#FFD700" }, { name: "Silver", hex: "#C0C0C0" }, { name: "Rose Gold", hex: "#B76E79" }, { name: "Black Metal", hex: "#2a2a2a" }] }]
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
            id: "charm_kiri", name: "Charm Metal", thumb: "/assets/thumb-charm.jpg", price: 10000, priceLabel: "+ Rp 10.000",
            textures: [{ id: "base", name: "Metal Polish", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0, colors: [{ name: "Gold", hex: "#FFD700" }, { name: "Silver", hex: "#C0C0C0" }, { name: "Rose Gold", hex: "#B76E79" }, { name: "Black Metal", hex: "#2a2a2a" }] }]
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
    gallery: [
      "/assets/products/tas_mini/gallery/gallery-1.png",
      "/assets/products/tas_mini/gallery/gallery-2.png",
      "/assets/products/tas_mini/gallery/gallery-3.png",
      "/assets/products/tas_mini/gallery/gallery-4.png",
    ],
    dimensionsImage: "/assets/products/tas_mini/dimension/dimension.png",
    specifications: [
      { label: "Product Style", value: "Bat Bag" },
      { label: "Total Volume (liters)", value: "16.00 L" },
      { label: "Weight (lbs)", value: "2.2 lb" },
      { label: "Avg. Laptop Fit (in)", value: '16"' },
    ],
    marketingBlocks: [
      {
        layout: "image-left",
        hasPattern: true, 
        badge: "Iconic Series",
        subtitle: "Modern Aesthetic",
        title: "Desain Elegan",
        titleHighlight: "& Fungsional",
        titleHighlightStyle: "gradient",
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan navigasi barang Anda.",
        image: "/assets/products/tas_mini/marketing/marketing-1.png",
        featureStyle: "cards",
        features: [
          { title: "Smart Storage", icon: "M3 7h18M3 12h18M3 17h18" },
          { title: "Water Proof", icon: "M20 16.24V19a2 2 0 01-2 2h-12a2 2 0 01-2-2v-2.76a2 2 0 01.44-1.24L8 10l.56-2.24A2 2 0 0110.51 6h2.98a2 2 0 011.95 1.76L16 10l3.56 5a2 2 0 01.44 1.24z" }
        ]
      },
      {
        layout: "image-right",
        hasPattern: false,
        badge: "Authentic Material",
        title: "Material Premium",
        titleHighlight: "& Nyaman",
        titleHighlightStyle: "amber",
        description: "Kami mengkurasi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_mini/marketing/marketing-2.png",
        imageQuote: "The texture of perfection",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan grade A" },
          { title: "Lapisan dalam polyester lembut" },
          { title: "Resleting YKK anti karat" }
        ]
      }
    ],
    sizes: [
      { id: "S", title: "Small", desc: "Arm & Belt Gear", price: 0, image: "/assets/products/tas_mini/size-guide/small.png", dimensions: { width: 10, height: 16, depth: 4, unit: 'cm' }, description: "smartphone, kunci, dan earbuds." },
      { id: "M", title: "Medium", desc: "Leg & Waist Pack", price: 35000, image: "/assets/products/tas_mini/size-guide/medium.png", dimensions: { width: 14, height: 20, depth: 6, unit: 'cm' }, description: "smartphone besar, powerbank, dan dompet." },
      { id: "L", title: "Large", desc: "Extended Capacity", price: 65000, image: "/assets/products/tas_mini/size-guide/large.png", dimensions: { width: 18, height: 24, depth: 8, unit: 'cm' }, description: "tablet 7-8 inci, toolkit kecil, atau sarung tangan motor." },
      { id: "XL", title: "Extra Large", desc: "Max Field Gear", price: 95000, image: "/assets/products/tas_mini/size-guide/xlarge.png", dimensions: { width: 22, height: 28, depth: 10, unit: 'cm' }, description: "Muat iPad Mini, botol minum kecil, dan EDC gear lengkap." },
    ],
    parts: [
      {
        id: "body", 
        name: "Badan Tas", 
        basePrice: 0, 
        zIndex: { Front: 10, Back: 10, Top: 20 },
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Leather", thumb: "", price: 150000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Leather", thumb: "", price: 150000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Leather", thumb: "", price: 150000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Leather", thumb: "", price: 150000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Leather", thumb: "", price: 150000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
        ]
      },
      {
        id: "trim-badan", 
        name: "Jahitan Badan", 
        basePrice: 0, 
        zIndex: { Front: 20, Back: 10, Top: 5 },
        textures: [
          { id: "base", name: "Standard Thread", thumb: "", price: 0, colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" }] }
        ]
      },
      {
        id: "penutup", 
        name: "Penutup", 
        basePrice: 100000, 
        zIndex: { Front: 30, Back: 20, Top: 30 },
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
        ]
      },
      {
        id: "trim-penutup", 
        name: "Jahitan Penutup", 
        basePrice: 0, 
        zIndex: { Front: 40, Back: 40, Top: 40 },
        textures: [
          { id: "base", name: "Standard Thread", thumb: "", price: 0, colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" }] }
        ]
      },
      {
        id: "pengait2", 
        name: "Tali Pengait", 
        basePrice: 0, 
        zIndex: 55,
        textures: [
          { id: "base", name: "Solid", thumb: "", price: 0, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather1", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather2", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather3", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] },
          { id: "leather4", name: "Leather", thumb: "", price: 75000, colors: [{ name: "Leather (Standard)", hex: "#AC7434" }, { name: "Brown Leather (Dulux)", hex: "#88572B" }, { name: "Espresso Brown", hex: "#612718" }, { name: "Dark Brown (Klasik)", hex: "#654321" }, { name: "Chestnut (Kastanye)", hex: "#954535" }, { name: "Khaki (Kulit Bumi)", hex: "#C4B289" }] }
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
              { id: "kancing2", url: "/assets/products/tas_mini/front/kancing2-base.png", zIndex: 50, name: "Kancing 2" },
              { id: "kancing3", url: "/assets/products/tas_mini/front/kancing3-base.png", zIndex: 50, name: "Kancing 3" }
            ]
          },
          {
            id: "pengait", name: "Pengait", price: 50000, priceLabel: "+ Rp 50.000",
            staticOverlays: [
              { id: "pengait1", url: "/assets/products/tas_mini/front/pengait1-base.png", zIndex: 50, name: "Pengait 1" },
              { id: "pengait3", url: "/assets/products/tas_mini/front/pengait3-base.png", zIndex: 60, name: "Pengait 3" }
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
          { id: "tali-back", url: "/assets/products/tas_mini/back/tali-base.png", zIndex: 30, name: "Tali Back" },
          { id: "tali-top", url: "/assets/products/tas_mini/top/tali-base.png", zIndex: 10, name: "Tali Top" }
        ]
      }
    ]
  },

  // ================= TOP HANDLE BAG =================
  top_handle_bag: {
    id: "top_handle_bag", 
    name: "Top Handle Bag",
    basePrice: 650000,
    gallery: [],
    dimensionsImage: "",
    specifications: [
      { label: "Product Style", value: "Top Handle Mini" },
      { label: "Material", value: "Premium Canvas & Leather" }
    ],
    marketingBlocks: [],
    sizes: [],
    parts: [
      {
        id: "badan", name: "Badan Tas", basePrice: 0, zIndex: { Front: 10, Back: 20, Top: 10 },
        textures: [
          { id: "base", name: "Original Canvas", thumb: "", price: 0 } // Tidak ada colors = TextureOnlyPart
        ]
      },
      {
        id: "kunci", name: "Kunci", basePrice: 0, zIndex: { Front: 50, Back: 50, Top: 50 },
        textures: [
          { id: "base", name: "Gold Hardware", thumb: "", price: 0 } // Tidak ada colors = TextureOnlyPart
        ]
      },
      {
        id: "lidah_kanan", name: "Lidah Kanan", basePrice: 0, zIndex: { Front: 30, Back: 30, Top: 30 },
        textures: [
          { 
            id: "base", name: "Premium Leather", thumb: "", price: 0,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Soft Beige", hex: "#EAD7C0" }, { name: "Navy Blue", hex: "#1E293B" }, { name: "Maroon", hex: "#800000" }, { name: "Black", hex: "#1A1A1A" },
            ] // Ada colors = DynamicPart
          }
        ]
      },
      {
        id: "lidah_kiri", name: "Lidah Kiri", basePrice: 0, zIndex: { Front: 30, Back: 30, Top: 30 },
        textures: [
          { 
            id: "base", name: "Premium Leather", thumb: "", price: 0,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Soft Beige", hex: "#EAD7C0" }, { name: "Navy Blue", hex: "#1E293B" }, { name: "Maroon", hex: "#800000" }, { name: "Black", hex: "#1A1A1A" },
            ]
          }
        ]
      },
      {
        id: "lidah_tengah", name: "Lidah Tengah", basePrice: 0, zIndex: { Front: 40, Back: 40, Top: 40 }, 
        textures: [
          { 
            id: "base", name: "Premium Leather", thumb: "", price: 0,
            colors: [
              { name: "Cream", hex: "#F3E9DC" }, { name: "Soft Beige", hex: "#EAD7C0" }, { name: "Navy Blue", hex: "#1E293B" }, { name: "Maroon", hex: "#800000" }, { name: "Black", hex: "#1A1A1A" },
            ]
          }
        ]
      },
      {
        id: "pita", name: "Pita Aksesoris", basePrice: 25000, zIndex: { Front: 60, Back: 10, Top: 60 },
        textures: [
          { id: "base", name: "Original Ribbon", thumb: "", price: 0 } // Tidak ada colors = TextureOnlyPart
        ]
      },
      {
        id: "tali", name: "Tali Tas", basePrice: 50000, zIndex: { Front: 20, Back: 70, Top: 70 },
        textures: [
          { id: "base", name: "Standard Strap", thumb: "", price: 0} // Tidak ada colors = TextureOnlyPart
        ]
      }
    ]
  }
};