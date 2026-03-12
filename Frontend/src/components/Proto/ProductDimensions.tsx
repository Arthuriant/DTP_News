import React from "react";

interface ProductSpecification {
  label: string;
  value: string;
}

interface ProductDimensionsProps {
  productName: string;
  image?: string;
  specifications?: ProductSpecification[];
}

export default function ProductDimensions({ productName, image, specifications }: ProductDimensionsProps) {
  // Jika data spesifikasi tidak ada, jangan render section ini
  if (!specifications || specifications.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 ">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Dimensi</h3>
      <div className="bg-[#f4f4f4] rounded-xl p-8 lg:p-16">
        
        {/* Area Ilustrasi Gambar Dimensi */}
        <div className="flex flex-col items-center justify-center mb-16 relative">
          <img
            src={image || `/assets/products/default-dimensions.png`}
            alt={`Dimensi ${productName}`}
            className="max-w-full md:max-w-2xl h-auto opacity-80 mix-blend-multiply"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback ilustrasi kotak jika gambar tidak ditemukan */}
          <div className="hidden flex-col items-center gap-4 text-slate-400">
            <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="8" width="18" height="12" rx="2" />
              <path d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
            <p className="text-sm font-medium">Ilustrasi Dimensi Tidak Ditemukan</p>
          </div>
        </div>

        {/* Tabel Spesifikasi */}
        <div className="flex flex-col border-t border-slate-300">
          {specifications.map((spec, index) => (
            <div key={index} className="flex justify-between py-4 border-b border-slate-300 text-sm">
              <span className="text-slate-600">{spec.label}</span>
              {/* Data 'value' di-render secara dinamis */}
              <span className="font-medium text-slate-900 capitalize">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}