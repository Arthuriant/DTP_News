// src/config/products.ts

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductTexture {
  id: string;
  name: string;
  thumb: string;
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  thumb: string;
  price: number;
  priceLabel: string;
  // Tambahan: Variant bisa punya warna dan tekstur sendiri (Mengesampingkan setingan part)
  colors?: ProductColor[];     
  textures?: ProductTexture[]; 
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
  zIndex: number;
  // Tambahan: Part punya default warna dan teksturnya sendiri
  colors?: ProductColor[];     
  textures?: ProductTexture[]; 
  variants?: ProductVariant[];
  staticOverlays?: ProductStaticOverlay[];
}

export interface ProductConfig {
  id: string;
  name: string;
  basePrice: number;
  // colors dan textures DIHAPUS dari sini karena sudah dipindah ke bawah
  parts: ProductPart[];
}

// 2. DATA KONFIGURASI
export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  tas_kelalawar: {
    id: "tas_kelalawar",
    name: "Bat Bag",
    basePrice: 0,
    parts: [
      // --- PART 1: BODY ---
      { 
        id: "body", 
        name: "BODY", 
        basePrice: 800000, 
        zIndex: 30,
        // Body punya banyak warna dan bisa Canvas/Leather
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "Pink", hex: "#e8729a" },
          { name: "Blue", hex: "#2563eb" },
        ],
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
        ]
      },

      // --- PART 2: TELINGA ---
      { 
        id: "telinga", 
        name: "TELINGA TAS", 
        basePrice: 150000, 
        zIndex: 20,
        // Telinga misalnya HANYA tersedia dalam bahan Leather dan warna gelap
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "Charcoal", hex: "#3a3a3a" },
        ],
        textures: [
           { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
        ]
      },

      // --- PART 3: TALI BAHU (Dengan Varian yang sangat berbeda) ---
      { 
        id: "tali", 
        name: "TALI BAHU",
        basePrice: 200000,
        zIndex: 10,
        variants: [
          { 
            id: "tali", 
            name: "Tali Kulit", 
            thumb: "/assets/thumb-kotak.jpg", // Untuk pengembandgan selanjutnya
            price: 0, 
            priceLabel: "",
            // Tali biasa ikut bahan tas (Leather/Canvas)
            colors: [
              { name: "Black", hex: "#111111" },
              { name: "Pink", hex: "#e8729a" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 50000 },
            ]
          },
          { 
            id: "tali_rantai", 
            name: "Tali Rantai", 
            thumb: "/assets/thumb-bulat.jpg", 
            price: 20000, 
            priceLabel: "+ Rp 20.000",
            // Tali rantai SANGAT BERBEDA (Hanya Metal, warna Emas/Perak)
            colors: [
              { name: "Gold", hex: "#ffd700" },
              { name: "Silver", hex: "#c0c0c0" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
            ]
          }
        ]
      },
    ]
  }
};