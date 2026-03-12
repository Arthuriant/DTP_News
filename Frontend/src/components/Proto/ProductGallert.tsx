import React from "react";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Jika tidak ada data gallery di product.ts, section ini otomatis hilang (tidak error)
  if (!images || images.length === 0) return null;

  // Fallback gambar dari Unsplash (bisa diganti sesuai selera)
  const fallbackImages = [
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1974&auto=format&fit=crop",
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Pratinjau</h3>
      
      {/* Grid akan otomatis menyesuaikan jika jumlah gambar 2, 3, atau 4 */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        {images.map((src, index) => (
          <div key={index} className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-xl">
            <img
              src={src}
              alt={`Preview Penggunaan ${productName} - ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = fallbackImages[index % fallbackImages.length];
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}