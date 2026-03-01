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
  thumb?: string;
  price: number;
  priceLabel?: string;
  // Tambahan: Variant bisa punya warna dan tekstur sendiri (Mengesampingkan setingan part)
  colors?: ProductColor[];     
  textures?: ProductTexture[]; 
  staticOverlays?: ProductStaticOverlay[];

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
        // Body punya banyak warna dan bisa Canvas/Leather
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "Pink", hex: "#e8729a" },
          { name: "Blue", hex: "#2563eb" },
        ],
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
          { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
          { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
          { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000 },
          { id: "leather4", name: "Premium Leather 4", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 190000 },
          { id: "leather5", name: "Premium Leather 5", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 200000 },
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
           { name: "Pink", hex: "#e8729a" },
        ],
        textures: [
          { id: "base", name: "Solid Canvas", thumb: "/assets/products/tas_kelalawar/textures/thumb-canvas.jpg", price: 0 },
          { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
          { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
          { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
          { id: "leather3", name: "Premium Leather 3", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 180000 },
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
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
            ]
          },
          { 
            id: "tali1",
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
              { id: "leather", name: "Premium Leather", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 150000 },
              { id: "leather1", name: "Premium Leather 1", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 160000 },
              { id: "leather2", name: "Premium Leather 2", thumb: "/assets/products/tas_kelalawar/textures/thumb-leather.jpg", price: 170000 },
            ]
          }
        ]
      },
    ]
  },
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
        zIndex: { Front: 40, Back: 40, Top: 10, "360": 20 }, // Posisi zIndex disesuaikan, misal body di tengah
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "Cream", hex: "#f5f5dc" },
          { name: "Navy", hex: "#1e3a8a" },
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
        zIndex: { Front: 20, Back: 20, Top: 20, "360": 20 }, // Inner ditaruh di bawah body
        colors: [
          { name: "Black", hex: "#111111" },
          { name: "Red", hex: "#dc2626" },
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
        zIndex: { Front: 30, Back: 30, Top: 30, "360": 20 }, // Pita ditaruh di atas body
        colors: [
          { name: "Pink", hex: "#e8729a" },
          { name: "Blue", hex: "#2563eb" },
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
        zIndex: { Front: 50, Back: 10, Top: 40, "360": 20 }, // Tali di atas body
        variants: [
          { 
            id: "tali_kanan", 
            name: "Tali Standar", 
            thumb: "/assets/thumb-tali-standar.jpg", 
            price: 0, 
            priceLabel: "",
            colors: [
              { name: "Black", hex: "#111111" },
              { name: "Brown", hex: "#8b4513" },
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
              { name: "White", hex: "#ffffff" },
              { name: "Beige", hex: "#f5f5dc" },
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
        zIndex: { Front: 10, Back: 50, Top: 50, "360": 20 }, // Tali di atas body
        variants: [
          { 
            id: "tali_kiri", 
            name: "Tali Standar", 
            thumb: "/assets/thumb-tali-standar.jpg", 
            price: 0, 
            priceLabel: "",
            colors: [
              { name: "Black", hex: "#111111" },
              { name: "Brown", hex: "#8b4513" },
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
              { name: "White", hex: "#ffffff" },
              { name: "Beige", hex: "#f5f5dc" },
            ],
            textures: [
              { id: "base", name: "Woven Cotton", thumb: "/assets/products/totebag/textures/thumb-cotton.jpg", price: 0 },
            ]
          }
        ]
      },
    ]
  },
  tas_mini: {
  id: "tas_mini",
  name: "Tas Mini",
  basePrice: 850000,
  parts: [

    // ======================
    // 1. BODY
    // ======================
    {
      id: "body",
      name: "Badan Tas",
      basePrice: 0,
      zIndex: { Front: 10, Back: 10, Top: 20 },
      colors: [
        { name: "Gray", hex: "#4B5563" },
        { name: "Blue", hex: "#60A5FA" },
        { name: "Pink", hex: "#F472B6" }
      ],
      textures: [
        { id: "base", name: "Solid", thumb: "", price: 0 },
        { id: "leather", name: "Leather", thumb: "", price: 150000 }
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
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" }
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
        { name: "Red", hex: "#EF4444" },
        { name: "Green", hex: "#22C55E" },
        { name: "Purple", hex: "#A855F7" }
      ],
      textures: [
        { id: "base", name: "Solid", thumb: "", price: 0 },
        { id: "leather", name: "Leather", thumb: "", price: 75000 }
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
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" }
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
        { name: "Red", hex: "#EF4444" },
        { name: "Green", hex: "#22C55E" },
        { name: "Purple", hex: "#A855F7" }
      ],
      textures: [
        { id: "base", name: "Solid", thumb: "", price: 0 },
        { id: "leather", name: "Leather", thumb: "", price: 75000 }
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
              url: "/assets/products/tas_mini/front/pengait3-base-base.png",
              zIndex: 60,
              name: "Pengait 3"
            }
          ]
        }
      ]
    }
  ]
}
};