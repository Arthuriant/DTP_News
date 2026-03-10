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
  colors?: ProductColor[];     
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
  colors?: ProductColor[];     
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



// 2. DATA KONFIGURASI
export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  tas_kelalawar: {
    id: "tas_kelalawar",
    name: "Tas Kelelawar",
    basePrice: 0,

    gallery: [
      "/assets/products/tas_kelalawar/gallery/gallery-1.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-2.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-3.jpeg",
      "/assets/products/tas_kelalawar/gallery/gallery-4.jpeg",
    ],

    dimensionsImage: "/assets/products/tas_kelalawar/dimension/dimension.png",
    specifications: [
      { label: "Gaya Produk", value: "Tas Kelelawar" },
      { label: "Volume Total (liter)", value: "16,00 L" },
      { label: "Berat (pon)", value: "2,2 lb" },
      { label: "Ukuran Laptop (inci)", value: '16"' },
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
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan pengaturan barang bawaan.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-1.jpeg",
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
        description: "Kami menyeleksi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_kelalawar/marketing/marketing-2.jpeg",
        imageQuote: "Tekstur yang Sempurna",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan kelas A" },
          { title: "Lapisan dalam poliester lembut" },
          { title: "Ritsleting YKK antikarat" }
        ]
      }
    ],

    sizes: [
      {
        id: "S",
        title: "Kecil",
        desc: "Esensial Ringkas",
        price: 0,
        image: "/assets/products/tas_kelalawar/size-guide/small.png",
        dimensions: { width: 18, height: 12, depth: 6, unit: 'cm' },
        description: "Ukuran terkecil, cocok untuk ponsel pintar, lipstik, dan dompet kartu."
      },
      {
        id: "M",
        title: "Sedang",
        desc: "Kebutuhan Harian",
        price: 50000,
        image: "/assets/products/tas_kelalawar/size-guide/medium.png",
        dimensions: { width: 22, height: 15, depth: 8, unit: 'cm' },
        description: "Dapat memuat dompet lipat, ponsel pintar, bank daya, dan pouch rias kecil."
      },
      {
        id: "L",
        title: "Besar",
        desc: "Kapasitas Maksimal",
        price: 550000,
        image: "/assets/products/tas_kelalawar/size-guide/large.png",
        dimensions: { width: 26, height: 18, depth: 10, unit: 'cm' },
        description: "Lebih lega, mampu memuat tablet mini (8 inci) atau payung lipat kecil."
      },
      {
        id: "XL",
        title: "Ekstra Besar",
        desc: "Kompatibel dengan Tablet",
        price: 120000,
        image: "/assets/products/tas_kelalawar/size-guide/xlarge.png",
        dimensions: { width: 30, height: 22, depth: 12, unit: 'cm' },
        description: "Varian terbesar untuk kategori tas mini. Muat untuk tablet 11 inci."
      },
    ],

    parts: [
      // --- PART 1: BADAN ---
      {
        id: "body",
        name: "BADAN",
        basePrice: 800000,
        zIndex: 30,
        colors: [
          { name: "Krem", hex: "#F3E9DC" },
          { name: "Krem Muda", hex: "#EAD7C0" },
          { name: "Kuning Lembut", hex: "#F2D16B" },
          { name: "Biru Langit", hex: "#7FB7E6" },
          { name: "Mint", hex: "#8ED1B2" },
          { name: "Lavender Lembut", hex: "#C6B7E2" },
          { name: "Persik", hex: "#F4A688" },
          { name: "Koral Lembut", hex: "#F08080" },
          { name: "Abu-abu Muda", hex: "#D3D3D3" },
          { name: "Merah Muda Muda", hex: "#F4B6C2" },
        ],
        
        textures: [
          {
            id: "base",
            name: "Kanvas Polos",
            thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg",
            price: 0,
            description: "Kanvas berkualitas tinggi dengan anyaman rapat dan kuat, memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
          },
          {
            id: "leather",
            name: "Kulit Premium",
            thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
            price: 150000,
            description: "Kulit asli pilihan dengan tekstur halus, serat alami, dan aroma khas kulit. Material ini akan semakin indah seiring waktu dan penggunaan."
          },
          {
            id: "leather1",
            name: "Kulit Premium 1",
            thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
            price: 160000,
            description: "Varian kulit premium dengan finishing semi-gloss yang memberikan kesan mewah namun tetap alami. Cocok untuk tampilan elegan."
          },
          {
            id: "leather2",
            name: "Kulit Premium 2",
            thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
            price: 170000,
            description: "Kulit pilihan dengan grain yang lebih terasa dan warna yang kaya. Memberikan karakter unik pada setiap produk."
          },
          {
            id: "leather3",
            name: "Kulit Premium 3",
            thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
            price: 180000,
            description: "Kulit premium dengan proses akhir yang halus dan lentur. Menawarkan kenyamanan maksimal serta tampilan yang sophisticated."
          }
        ]
      },

      // --- PART 2: TELINGA ---
      {
        id: "telinga",
        name: "TELINGA TAS",
        basePrice: 150000,
        zIndex: 20,
        variants: [
          {
            id: "telinga",
            name: "Telinga Tas",
            thumb: "/assets/thumb-kotak.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Lavender Lembut", hex: "#C6B7E2" },
              { name: "Kuning Lembut", hex: "#F2D16B" },
              { name: "Biru Langit", hex: "#7FB7E6" },
              { name: "Mint", hex: "#8ED1B2" },
            ],
            // Contoh pada produk tas_kelalawar bagian body
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas berkualitas tinggi dengan anyaman rapat dan kuat, memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 150000,
                description: "Kulit asli pilihan dengan tekstur halus, serat alami, dan aroma khas kulit. Material ini akan semakin indah seiring waktu dan penggunaan."
              },
              {
                id: "leather1",
                name: "Kulit Premium 1",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 160000,
                description: "Varian kulit premium dengan finishing semi-gloss yang memberikan kesan mewah namun tetap alami. Cocok untuk tampilan elegan."
              },
              {
                id: "leather2",
                name: "Kulit Premium 2",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 170000,
                description: "Kulit pilihan dengan grain yang lebih terasa dan warna yang kaya. Memberikan karakter unik pada setiap produk."
              },
              {
                id: "leather3",
                name: "Kulit Premium 3",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 180000,
                description: "Kulit premium dengan proses akhir yang halus dan lentur. Menawarkan kenyamanan maksimal serta tampilan yang sophisticated."
              }
            ]
          },
          {
            id: "telinga1",
            name: "Telinga Kucing",
            thumb: "/assets/thumb-kotak.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Biru Langit", hex: "#7FB7E6" },
              { name: "Mint", hex: "#8ED1B2" },
              { name: "Lavender Lembut", hex: "#C6B7E2" },
              { name: "Persik", hex: "#F4A688" },
              { name: "Koral Lembut", hex: "#F08080" },
              { name: "Abu-abu Muda", hex: "#D3D3D3" },
              { name: "Merah Muda Muda", hex: "#F4B6C2" },
            ],
            textures: [
              { id: "base", name: "Kanvas Polos", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
            ]
          },
        ]
      },

      // --- PART 3: TALI BAHU ---
      {
        id: "tali",
        name: "TALI BAHU",
        basePrice: 200000,
        zIndex: 10,
        variants: [
          {
            id: "tali",
            name: "Tali Kulit",
            thumb: "/assets/thumb-kotak.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Abu-abu Muda", hex: "#D3D3D3" },
              { name: "Persik", hex: "#F4A688" },
              { name: "Koral Lembut", hex: "#F08080" },
              { name: "Merah Muda Muda", hex: "#F4B6C2" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas berkualitas tinggi dengan anyaman rapat dan kuat, memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 150000,
                description: "Kulit asli pilihan dengan tekstur halus, serat alami, dan aroma khas kulit. Material ini akan semakin indah seiring waktu dan penggunaan."
              },
              {
                id: "leather1",
                name: "Kulit Premium 1",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 160000,
                description: "Varian kulit premium dengan finishing semi-gloss yang memberikan kesan mewah namun tetap alami. Cocok untuk tampilan elegan."
              },
            ]
          },
          {
            id: "tali1",
            name: "Tali Panjang",
            thumb: "/assets/thumb-bulat.jpg",
            price: 20000,
            priceLabel: "+ Rp 20.000",
            colors: [
              { name: "Persik", hex: "#F4A688" },
              { name: "Koral Lembut", hex: "#F08080" },
              { name: "Abu-abu Muda", hex: "#D3D3D3" },
              { name: "Merah Muda Muda", hex: "#F4B6C2" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas berkualitas tinggi dengan anyaman rapat dan kuat, memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 150000,
                description: "Kulit asli pilihan dengan tekstur halus, serat alami, dan aroma khas kulit. Material ini akan semakin indah seiring waktu dan penggunaan."
              },
              {
                id: "leather1",
                name: "Kulit Premium 1",
                thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg",
                price: 160000,
                description: "Varian kulit premium dengan finishing semi-gloss yang memberikan kesan mewah namun tetap alami. Cocok untuk tampilan elegan."
              },
            ]
          },
          {
            id: "tali2",
            name: "Tali Rantai",
            thumb: "/assets/thumb-bulat.jpg",
            price: 20000,
            priceLabel: "+ Rp 20.000",
            colors: [
              { name: "Biru Langit", hex: "#7FB7E6" },
              { name: "Mint", hex: "#8ED1B2" },
              { name: "Lavender Lembut", hex: "#C6B7E2" },
              { name: "Persik", hex: "#F4A688" },
            ],
          }
        ]
      },
    ]
  },

  totebag: {
    id: "totebag",
    name: "Totebag Klasik",
    basePrice: 0,

    gallery: [
      "/assets/products/totebag/gallery/gallery-1.png",
      "/assets/products/totebag/gallery/gallery-3.jpg",
      "/assets/products/totebag/gallery/gallery-2.png",
      "/assets/products/totebag/gallery/gallery-4.jpg",
    ],

    dimensionsImage: "/assets/products/totebag/dimension/dimension.png",
    specifications: [
      { label: "Gaya Produk", value: "Tas Kelelawar" },
      { label: "Volume Total (liter)", value: "16,00 L" },
      { label: "Berat (pon)", value: "2,2 lb" },
      { label: "Ukuran Laptop (inci)", value: '16"' },
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
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan pengaturan barang bawaan.",
        image: "/assets/products/totebag/marketing/marketing-1.png",
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
        description: "Kami menyeleksi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/totebag/marketing/marketing-2.png",
        imageQuote: "Tekstur yang Sempurna",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan kelas A" },
          { title: "Lapisan dalam poliester lembut" },
          { title: "Ritsleting YKK antikarat" }
        ]
      }
    ],

    sizes: [
      {
        id: "S",
        title: "Ringkas (S)",
        desc: "Tablet & Kebutuhan Pokok",
        price: 0,
        image: "/assets/products/totebag/size-guide/small.png",
        dimensions: { width: 28, height: 22, depth: 8, unit: 'cm' },
        description: "Cocok untuk tablet 11 inci (iPad Air/Pro)."
      },
      {
        id: "M",
        title: "Standar (M)",
        desc: "Ramah Laptop 13\"",
        price: 50000,
        image: "/assets/products/totebag/size-guide/medium.png",
        dimensions: { width: 34, height: 26, depth: 10, unit: 'cm' },
        description: "Dapat memuat MacBook Air atau laptop 13 inci, serta dokumen ukuran A4."
      },
      {
        id: "L",
        title: "Pro (L)",
        desc: "Kapasitas Laptop 14–15\"",
        price: 85000,
        image: "/assets/products/totebag/size-guide/large.png",
        dimensions: { width: 38, height: 30, depth: 12, unit: 'cm' },
        description: "Muat laptop 14–15 inci, binder besar, botol minum, dan payung lipat."
      },
      {
        id: "XL",
        title: "Grand (XL)",
        desc: "Stasiun Kerja Portabel",
        price: 125000,
        image: "/assets/products/totebag/size-guide/xlarge.png",
        dimensions: { width: 42, height: 34, depth: 14, unit: 'cm' },
        description: "Muat laptop 16 inci, perlengkapan olahraga, atau pakaian ganti."
      },
    ],

    parts: [
      // --- PART 1: BADAN ---
      {
        id: "body",
        name: "BADAN TAS",
        basePrice: 150000,
        zIndex: { Front: 40, Back: 40, Top: 10, "360": 40 },
        colors: [
          { name: "Krem Gading", hex: "#F5F5DC" },
          { name: "Hitam Obsidian", hex: "#1A1A1A" },
          { name: "Cokelat Espreso", hex: "#3E2723" },
          { name: "Kulit Cognac", hex: "#9A6338" },
          { name: "Karamel", hex: "#C68E5F" },
          { name: "Terakota", hex: "#A45A52" },
          { name: "Hijau Sage", hex: "#7D8471" },
          { name: "Biru Tua", hex: "#1E293B" },
        ],
        textures: [
          {
            id: "base",
            name: "Kanvas Polos",
            thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
            price: 0,
            description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
          },
          {
            id: "dino",
            name: "Motif Dinosaurus",
            thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
            price: 25000,
            description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
          },
          {
            id: "leather",
            name: "Kulit Premium",
            thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
            price: 75000,
            description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
          },
          {
            id: "leather2",
            name: "Kulit Mengilap",
            thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
            price: 85000,
            description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
          },
          {
            id: "snake",
            name: "Kulit Ular",
            thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
            price: 100000,
            description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
          }
        ]
      },

      // --- PART 2: KAIN DALAM ---
      {
        id: "inner",
        name: "KAIN DALAM (INNER)",
        basePrice: 40000,
        zIndex: { Front: 20, Back: 20, Top: 20, "360": 20 },
        colors: [
          { name: "Hitam Obsidian", hex: "#1A1A1A" },
          { name: "Cokelat Espreso", hex: "#3E2723" },
          { name: "Kulit Cognac", hex: "#9A6338" },
          { name: "Karamel", hex: "#C68E5F" },
          { name: "Terakota", hex: "#A45A52" },
          { name: "Hijau Sage", hex: "#7D8471" },
          { name: "Biru Tua", hex: "#1E293B" },
          { name: "Krem Gading", hex: "#F5F5DC" },
        ],
        textures: [
          { id: "base", name: "Katun Lembut", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
        ]
      },

      // --- PART 3: PITA ---
      {
        id: "pita",
        name: "PITA AKSESORIS",
        basePrice: 20000,
        zIndex: { Front: 30, Back: 30, Top: 30, "360": 30 },
        variants: [
          {
            id: "pita_tipis",
            name: "Pita Tipis",
            thumb: "/assets/thumb-pita-tipis.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0 },
            ]
          },
          {
            id: "pita",
            name: "Pita Standar",
            thumb: "/assets/thumb-pita-standar.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0 },
            ]
          },
          {
            id: "pita_tebal",
            name: "Pita Tebal",
            thumb: "/assets/thumb-pita-tebal.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Sutra Satin", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0 },
            ]
          }
        ]
      },

      // --- PART 4: TALI KANAN ---
      {
        id: "tali_kanan",
        name: "TALI KANAN",
        basePrice: 30000,
        zIndex: { Front: 50, Back: 10, Top: 40, "360": 50 },
        variants: [
          {
            id: "tali_kanan",
            name: "Tali Standar",
            thumb: "/assets/thumb-tali-standar.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          },
          {
            id: "tali_katun_kanan",
            name: "Tali Katun",
            thumb: "/assets/thumb-tali-katun.jpg",
            price: 15000,
            priceLabel: "+ Rp 15.000",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Katun Tenun", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
            ]
          },
          {
            id: "tali_bulat_kanan",
            name: "Tali Bulat",
            thumb: "/assets/thumb-tali-bulat.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          },
          {
            id: "tali_pendek_kanan",
            name: "Tali Pendek",
            thumb: "/assets/thumb-tali-pendek.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          }
        ]
      },

      // --- PART 5: TALI KIRI ---
      {
        id: "tali_kiri",
        name: "TALI KIRI",
        basePrice: 30000,
        zIndex: { Front: 10, Back: 50, Top: 50, "360": 10 },
        variants: [
          {
            id: "tali_kiri",
            name: "Tali Standar",
            thumb: "/assets/thumb-tali-standar.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          },
          {
            id: "tali_katun_kiri",
            name: "Tali Katun",
            thumb: "/assets/thumb-tali-katun.jpg",
            price: 15000,
            priceLabel: "+ Rp 15.000",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Katun Tenun", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
            ]
          },
          {
            id: "tali_bulat_kiri",
            name: "Tali Bulat",
            thumb: "/assets/thumb-tali-bulat.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          },
          {
            id: "tali_pendek_kiri",
            name: "Tali Pendek",
            thumb: "/assets/thumb-tali-pendek.jpg",
            price: 0,
            priceLabel: "",
            colors: [
              { name: "Hijau Sage", hex: "#7D8471" },
              { name: "Hitam Obsidian", hex: "#1A1A1A" },
              { name: "Cokelat Espreso", hex: "#3E2723" },
              { name: "Kulit Cognac", hex: "#9A6338" },
              { name: "Karamel", hex: "#C68E5F" },
              { name: "Terakota", hex: "#A45A52" },
              { name: "Biru Tua", hex: "#1E293B" },
              { name: "Krem Gading", hex: "#F5F5DC" },
            ],
            textures: [
              {
                id: "base",
                name: "Kanvas Polos",
                thumb: "/assets/products/totebag/textures/thumb-canvas.jpg",
                price: 0,
                description: "Kanvas polos berkualitas tinggi dengan anyaman rapat dan kuat. Material ini memberikan tampilan kasual yang elegan serta daya tahan optimal untuk penggunaan sehari-hari."
              },
              {
                id: "dino",
                name: "Motif Dinosaurus",
                thumb: "/assets/products/totebag/textures/thumb-dino.jpg",
                price: 25000,
                description: "Kanvas dengan motif dinosaurus yang unik dan playful. Cocok untuk mengekspresikan gaya ceria dan kreatif, tanpa mengurangi kualitas bahan."
              },
              {
                id: "leather",
                name: "Kulit Premium",
                thumb: "/assets/products/totebag/textures/thumb-leather.jpg",
                price: 75000,
                description: "Kulit asli pilihan dengan tekstur halus dan serat alami. Material premium ini memberikan kesan mewah dan akan semakin indah seiring waktu."
              },
              {
                id: "leather2",
                name: "Kulit Mengilap",
                thumb: "/assets/products/totebag/textures/thumb-leather2.jpg",
                price: 85000,
                description: "Kulit dengan finishing mengilap yang elegan, memberikan sentuhan glamor pada tas Anda. Tetap lentur dan nyaman digunakan."
              },
              {
                id: "snake",
                name: "Kulit Ular",
                thumb: "/assets/products/totebag/textures/thumb-snake.jpg",
                price: 100000,
                description: "Kulit ular eksotis dengan pola sisik alami yang unik. Material ini menawarkan tampilan eksklusif dan menjadi pusat perhatian."
              }
            ]
          }
        ]
      },

      // --- PART 6: CHARM KANAN ---
      {
        id: "charm_kanan",
        name: "CHARM KANAN",
        basePrice: 0,
        zIndex: { Front: 60, Back: 5, Top: 60, "360": 60 },
        variants: [
          {
            id: "charm_kanan",
            name: "Gantungan Logam",
            thumb: "/assets/thumb-charm.jpg",
            price: 10000,
            priceLabel: "+ Rp 10.000",
            colors: [
              { name: "Emas", hex: "#FFD700" },
              { name: "Perak", hex: "#C0C0C0" },
              { name: "Emas Mawar", hex: "#B76E79" },
              { name: "Hitam Metalik", hex: "#2a2a2a" }
            ],
            textures: [
              { id: "base", name: "Poles Logam", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0 }
            ]
          }
        ]
      },

      // --- PART 7: CHARM KIRI ---
      {
        id: "charm_kiri",
        name: "CHARM KIRI",
        basePrice: 0,
        zIndex: { Front: 60, Back: 5, Top: 60, "360": 60 },
        variants: [
          {
            id: "charm_kiri",
            name: "Gantungan Logam",
            thumb: "/assets/thumb-charm.jpg",
            price: 10000,
            priceLabel: "+ Rp 10.000",
            colors: [
              { name: "Emas", hex: "#FFD700" },
              { name: "Perak", hex: "#C0C0C0" },
              { name: "Emas Mawar", hex: "#B76E79" },
              { name: "Hitam Metalik", hex: "#2a2a2a" }
            ],
            textures: [
              { id: "base", name: "Poles Logam", thumb: "/assets/products/totebag/textures/thumb-metal.jpg", price: 0 }
            ]
          }
        ]
      }
    ]
  },

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
      { label: "Gaya Produk", value: "Tas Kelelawar" },
      { label: "Volume Total (liter)", value: "16,00 L" },
      { label: "Berat (pon)", value: "2,2 lb" },
      { label: "Ukuran Laptop (inci)", value: '16"' },
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
        description: "Tas ini dirancang untuk menemani aktivitas harian Anda dengan gaya. Material kulit memberikan kesan mewah, sementara kompartemennya memudahkan pengaturan barang bawaan.",
        image: "/assets/products/tas_mini/marketing/marketing-1.png",
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
        description: "Kami menyeleksi bahan dari penyamak kulit terbaik untuk memastikan kenyamanan maksimal di setiap sentuhan.",
        image: "/assets/products/tas_mini/marketing/marketing-2.png",
        imageQuote: "Tekstur yang Sempurna",
        featureStyle: "bullets",
        features: [
          { title: "Kulit sapi pilihan kelas A" },
          { title: "Lapisan dalam poliester lembut" },
          { title: "Ritsleting YKK antikarat" }
        ]
      }
    ],

    sizes: [
      {
        id: "S",
        title: "Kecil",
        desc: "Perlengkapan Lengan & Pinggang",
        price: 0,
        image: "/assets/products/tas_mini/size-guide/small.png",
        dimensions: { width: 10, height: 16, depth: 4, unit: 'cm' },
        description: "Cocok untuk ponsel pintar, kunci, dan earphone nirkabel."
      },
      {
        id: "M",
        title: "Sedang",
        desc: "Tas Pinggang & Paha",
        price: 35000,
        image: "/assets/products/tas_mini/size-guide/medium.png",
        dimensions: { width: 14, height: 20, depth: 6, unit: 'cm' },
        description: "Dapat memuat ponsel pintar besar, bank daya, dan dompet."
      },
      {
        id: "L",
        title: "Besar",
        desc: "Kapasitas Diperluas",
        price: 65000,
        image: "/assets/products/tas_mini/size-guide/large.png",
        dimensions: { width: 18, height: 24, depth: 8, unit: 'cm' },
        description: "Muat tablet 7–8 inci, perkakas kecil, atau sarung tangan motor."
      },
      {
        id: "XL",
        title: "Ekstra Besar",
        desc: "Perlengkapan Lapangan Maksimal",
        price: 95000,
        image: "/assets/products/tas_mini/size-guide/xlarge.png",
        dimensions: { width: 22, height: 28, depth: 10, unit: 'cm' },
        description: "Muat iPad Mini, botol minum kecil, dan perlengkapan EDC (Everyday Carry) lengkap."
      },
    ],

    parts: [
      // ======================
      // 1. BADAN
      // ======================
      {
        id: "body",
        name: "Badan Tas",
        basePrice: 0,
        zIndex: { Front: 10, Back: 10, Top: 20 },
        colors: [
          { name: "Kulit Standar", hex: "#AC7434" },
          { name: "Kulit Cokelat (Dulux)", hex: "#88572B" },
          { name: "Cokelat Espreso", hex: "#612718" },
          { name: "Cokelat Tua (Klasik)", hex: "#654321" },
          { name: "Kastanye", hex: "#954535" },
          { name: "Khaki (Warna Bumi)", hex: "#C4B289" }
        ],
        textures: [
          { id: "base", name: "Polos", thumb: "", price: 0 },
          { id: "leather", name: "Kulit", thumb: "", price: 150000 },
          { id: "leather1", name: "Kulit", thumb: "", price: 150000 },
          { id: "leather2", name: "Kulit", thumb: "", price: 150000 },
          { id: "leather3", name: "Kulit", thumb: "", price: 150000 },
          { id: "leather4", name: "Kulit", thumb: "", price: 150000 }
        ]
      },

      // ======================
      // 2. TRIM BADAN
      // ======================
      {
        id: "trim-badan",
        name: "Trim Badan",
        basePrice: 0,
        zIndex: { Front: 20, Back: 10, Top: 5 },
        colors: [
          { name: "Putih", hex: "#FFFFFF" },
          { name: "Hitam", hex: "#000000" }
        ]
      },

      // ======================
      // 3. PENUTUP
      // ======================
      {
        id: "penutup",
        name: "Penutup",
        basePrice: 100000,
        zIndex: { Front: 30, Back: 20, Top: 30 },
        colors: [
          { name: "Kulit Standar", hex: "#AC7434" },
          { name: "Kulit Cokelat (Dulux)", hex: "#88572B" },
          { name: "Cokelat Espreso", hex: "#612718" },
          { name: "Cokelat Tua (Klasik)", hex: "#654321" },
          { name: "Kastanye", hex: "#954535" },
          { name: "Khaki (Warna Bumi)", hex: "#C4B289" }
        ],
        textures: [
          { id: "base", name: "Polos", thumb: "", price: 0 },
          { id: "leather", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather1", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather2", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather3", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather4", name: "Kulit", thumb: "", price: 75000 }
        ]
      },

      // ======================
      // 4. TRIM PENUTUP
      // ======================
      {
        id: "trim-penutup",
        name: "Trim Penutup",
        basePrice: 0,
        zIndex: { Front: 40, Back: 40, Top: 40 },
        colors: [
          { name: "Putih", hex: "#FFFFFF" },
          { name: "Hitam", hex: "#000000" }
        ]
      },

      // ======================
      // 5. PENGAIT 2 (DYNAMIC)
      // ======================
      {
        id: "pengait2",
        name: "Tali Pengait",
        basePrice: 0,
        zIndex: 55,
        colors: [
          { name: "Kulit Standar", hex: "#AC7434" },
          { name: "Kulit Cokelat (Dulux)", hex: "#88572B" },
          { name: "Cokelat Espreso", hex: "#612718" },
          { name: "Cokelat Tua (Klasik)", hex: "#654321" },
          { name: "Kastanye", hex: "#954535" },
          { name: "Khaki (Warna Bumi)", hex: "#C4B289" }
        ],
        textures: [
          { id: "base", name: "Polos", thumb: "", price: 0 },
          { id: "leather", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather1", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather2", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather3", name: "Kulit", thumb: "", price: 75000 },
          { id: "leather4", name: "Kulit", thumb: "", price: 75000 }
        ]
      },

      // ======================
      // 6. KOMPARTEMEN (STATIC ONLY)
      // ======================
      {
        id: "kompartemen",
        name: "Tipe Kompartemen",
        basePrice: 0,
        zIndex: 60,
        variants: [
          {
            id: "kancing",
            name: "Kancing",
            price: 0,
            priceLabel: "",
            staticOverlays: [
              {
                id: "kancing1",
                url: "/assets/products/tas_mini/front/kancing1-base.png",
                zIndex: 50,
                name: "Kancing 1"
              },
              {
                id: "kancing2",
                url: "/assets/products/tas_mini/front/kancing2-base.png",
                zIndex: 50,
                name: "Kancing 2"
              },
              {
                id: "kancing3",
                url: "/assets/products/tas_mini/front/kancing3-base.png",
                zIndex: 50,
                name: "Kancing 3"
              }
            ]
          },
          {
            id: "pengait",
            name: "Pengait",
            price: 50000,
            priceLabel: "+ Rp 50.000",
            staticOverlays: [
              {
                id: "pengait1",
                url: "/assets/products/tas_mini/front/pengait1-base.png",
                zIndex: 50,
                name: "Pengait 1"
              },
              {
                id: "pengait3",
                url: "/assets/products/tas_mini/front/pengait3-base.png",
                zIndex: 60,
                name: "Pengait 3"
              }
            ]
          }
        ]
      },
      {
        id: "tali",
        name: "Tali",
        basePrice: 0,
        zIndex: {
          Front: 5,
          Back: 30,
          Top: 10,
          "360": 50
        },
        staticOverlays: [
          {
            id: "tali-back",
            url: "/assets/products/tas_mini/back/tali-base.png",
            zIndex: 30,
            name: "Tali Belakang"
          },
          {
            id: "tali-top",
            url: "/assets/products/tas_mini/top/tali-base.png",
            zIndex: 10,
            name: "Tali Atas"
          }
        ]
      }
    ]
  }
};