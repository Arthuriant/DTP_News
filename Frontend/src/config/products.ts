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
  zIndex: number | Record<string, number>;
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
        // Palet warna pewarna kulit premium (Leather Dye)
        colors: [
          { name: "Saddle Tan", hex: "#b87333" },       // Cokelat muda klasik tas kulit
          { name: "Chestnut", hex: "#5c3a21" },         // Cokelat kemerahan
          { name: "Espresso", hex: "#362511" },         // Pengganti hitam (Cokelat sangat tua, tekstur tetap terlihat)
          { name: "Burgundy", hex: "#6a2e2a" },         // Merah marun elegan
          { name: "Midnight Navy", hex: "#1f3050" },    // Biru dongker yang tidak mematikan tekstur
          { name: "Olive Green", hex: "#4a543f" },      // Hijau tentara khas kanvas/kulit
        ],
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
          { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
          { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
          { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000 },
          { id: "leather5", name: "Premium Leather 5", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 200000 },
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
              { name: "Espresso", hex: "#362511" },
              { name: "Chestnut", hex: "#5c3a21" },
              { name: "Burgundy", hex: "#6a2e2a" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
              { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000 },
            ]
          },
          { 
            id: "telinga1", 
            name: "Telinga Kucing", 
            thumb: "/assets/thumb-kotak.jpg", 
            price: 0, 
            priceLabel: "",
            colors: [
              { name: "Dusty Rose", hex: "#c28e8e" }, // Pengganti Pink ngejreng, lebih masuk ke tone kulit/suede
              { name: "Taupe", hex: "#c9bca7" },      // Warna krem/abu-abu netral
              { name: "Saddle Tan", hex: "#b87333" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
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
              { name: "Saddle Tan", hex: "#b87333" },
              { name: "Dusty Rose", hex: "#c28e8e" },
              { name: "Chestnut", hex: "#5c3a21" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
            ]
          },
          { 
            id: "tali1",
            name: "Tali Panjang", 
            thumb: "/assets/thumb-bulat.jpg", 
            price: 20000, 
            priceLabel: "+ Rp 20.000",
            colors: [
              { name: "Espresso", hex: "#362511" },
              { name: "Midnight Navy", hex: "#1f3050" },
              { name: "Olive Green", hex: "#4a543f" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
            ]
          },
          { 
            id: "tali2",
            name: "Tali Rantai", 
            thumb: "/assets/thumb-bulat.jpg", 
            price: 20000, 
            priceLabel: "+ Rp 20.000",
            colors: [
              { name: "Gold", hex: "#d4af37" },           // Emas elegan
              { name: "Silver", hex: "#b0b0b0" },         // Perak abu-abu
              { name: "Rose Gold", hex: "#b76e79" },      // Emas merah muda
              { name: "Antique Brass", hex: "#b5a642" },  // Kuningan antik (cokelat kehijauan logam)
            ],
          }
        ]
      },
    ]
  },
  // 👇 UPDATE PRODUK TOTEBAG 👇
  totebag: {
    id: "totebag",
    name: "Classic Tote Bag",
    basePrice: 0,
    parts: [
      // --- PART 1: BODY ---
      { 
        id: "body", 
        name: "BODY TAS", 
        basePrice: 150000, 
        zIndex: { Front: 40, Back: 40, Top: 10, "360": 20 },
        colors: [

          { name: "Midnight Charcoal", hex: "#2C2C2E" }, 
          { name: "Espresso", hex: "#3E2723" },      
          { name: "Cognac Leather", hex: "#9A6338" },
          { name: "Caramel Tan", hex: "#C68E5F" },   
          { name: "Terracotta", hex: "#A45A52" },    
          { name: "Sage Green", hex: "#7D8471" },   
          { name: "Deep Navy", hex: "#1E293B" },   
          { name: "Creamy Bone", hex: "#F5F5DC" },     
        ],
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0 },
          { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 25000 },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 75000 },
          { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 85000 },
          { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 100000 },
        ]
      },

      // --- PART 2: INNER (BAGIAN DALAM) ---
      { 
        id: "inner", 
        name: "KAIN DALAM (INNER)", 
        basePrice: 40000, 
        zIndex: { Front: 20, Back: 20, Top: 20, "360": 20 },

        colors: [
          { name: "Creamy Beige", hex: "#EADDCB" }, 
          { name: "Dusty Rose", hex: "#C28E8E" },
          { name: "Burgundy Lining", hex: "#6A2E2A" },
          { name: "Light Grey", hex: "#D1D5DB" },
          { name: "Midnight Navy", hex: "#1F3050" },
        ],
        textures: [
          { id: "base", name: "Soft Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
        ]
      },

      // --- PART 3: PITA ---
      { 
        id: "pita", 
        name: "PITA AKSESORIS", 
        basePrice: 20000, 
        zIndex: { Front: 30, Back: 30, Top: 30, "360": 20 },
        colors: [
          { name: "Champagne Gold", hex: "#F7E7CE" },
          { name: "Dusty Pink", hex: "#D8A7B1" },
          { name: "Emerald", hex: "#2E5844" },
          { name: "Sapphire Blue", hex: "#1D3A5F" },
          { name: "Maroon Silk", hex: "#6B2737" },
        ],
        textures: [
          { id: "base", name: "Satin Silk", thumb: "/assets/products/totebag/textures/thumb-satin.jpg", price: 0 },
        ]
      },

      // --- PART 4: TALI KANAN ---
      { 
        id: "tali_kanan", 
        name: "TALI KANAN",
        basePrice: 30000,
        zIndex: { Front: 50, Back: 10, Top: 40, "360": 20 },
        variants: [
          { 
            id: "tali_kanan", 
            name: "Tali Standar", 
            thumb: "/assets/thumb-tali-standar.jpg", 
            price: 0, 
            priceLabel: "",
            colors: [
              { name: "Midnight Charcoal", hex: "#2C2C2E" }, 
              { name: "Espresso", hex: "#3E2723" },
              { name: "Cognac Leather", hex: "#9A6338" },
              { name: "Caramel Tan", hex: "#C68E5F" },
              { name: "Terracotta", hex: "#A45A52" },
              { name: "Sage Green", hex: "#7D8471" },
              { name: "Deep Navy", hex: "#1E293B" },
              { name: "Creamy Bone", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0 },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000 },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000 },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000 },
            ]
          },
          { 
            id: "tali_katun_kanan", 
            name: "Tali Katun", 
            thumb: "/assets/thumb-tali-katun.jpg", 
            price: 15000, 
            priceLabel: "+ Rp 15.000",
            colors: [
              { name: "Natural Canvas", hex: "#EAE0C8" },
              { name: "Khaki Webbing", hex: "#BDB092" },
              { name: "Olive Webbing", hex: "#6B705C" },
              { name: "Navy Webbing", hex: "#1E293B" },
              { name: "Charcoal Webbing", hex: "#4A4A4C" },
            ],
            textures: [
              { id: "base", name: "Woven Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
            ]
          }
        ]
      },

      // --- PART 5: TALI KIRI ---
      { 
        id: "tali_kiri", 
        name: "TALI KIRI",
        basePrice: 30000,
        zIndex: { Front: 10, Back: 50, Top: 50, "360": 20 },
        variants: [
          { 
            id: "tali_kiri", 
            name: "Tali Standar", 
            thumb: "/assets/thumb-tali-standar.jpg", 
            price: 0, 
            priceLabel: "",
            colors: [
              { name: "Midnight Charcoal", hex: "#2C2C2E" }, 
              { name: "Espresso", hex: "#3E2723" },
              { name: "Cognac Leather", hex: "#9A6338" },
              { name: "Caramel Tan", hex: "#C68E5F" },
              { name: "Terracotta", hex: "#A45A52" },
              { name: "Sage Green", hex: "#7D8471" },
              { name: "Deep Navy", hex: "#1E293B" },
              { name: "Creamy Bone", hex: "#F5F5DC" },
            ],
            textures: [
              { id: "base", name: "Solid Canvas", thumb: "/assets/products/totebag/textures/thumb-canvas.jpg", price: 0 },
              { id: "dino", name: "Dino Pattern", thumb: "/assets/products/totebag/textures/thumb-dino.jpg", price: 10000 },
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/totebag/textures/thumb-leather.jpg", price: 20000 },
              { id: "leather2", name: "Glossy Leather", thumb: "/assets/products/totebag/textures/thumb-leather2.jpg", price: 25000 },
              { id: "snake", name: "Snake Skin", thumb: "/assets/products/totebag/textures/thumb-snake.jpg", price: 30000 },
            ]
          },
          { 
            id: "tali_katun_kiri", 
            name: "Tali Katun", 
            thumb: "/assets/thumb-tali-katun.jpg", 
            price: 15000, 
            priceLabel: "+ Rp 15.000",
            colors: [
              { name: "Natural Canvas", hex: "#EAE0C8" },
              { name: "Khaki Webbing", hex: "#BDB092" },
              { name: "Olive Webbing", hex: "#6B705C" },
              { name: "Navy Webbing", hex: "#1E293B" },
              { name: "Charcoal Webbing", hex: "#4A4A4C" },
            ],
            textures: [
              { id: "base", name: "Woven Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
            ]
          }
        ]
      },
    ]
  }
};