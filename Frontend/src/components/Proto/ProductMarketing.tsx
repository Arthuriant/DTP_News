"use client";
import React, { useState } from "react";

interface MarketingBlock {
  title: string;
  titleHighlight?: string; 
  titleHighlightStyle?: string; 
  subtitle: string;
  description: string;
  image: string;
  hasPattern?: boolean; 
  layout: "image-left" | "image-right";
  badge?: string;
  imageQuote?: string;
  featureStyle?: "cards" | "bullets";
  features: { title: string; icon?: string; content?: string }[];
}

export default function ProductMarketing({ blocks }: { blocks?: MarketingBlock[] }) {
  const [openFeature, setOpenFeature] = useState<string | null>(null);

  if (!blocks || blocks.length === 0) return null;

  const toggleFeature = (title: string) => {
    setOpenFeature(openFeature === title ? null : title);
  };

  return (
    <div className="w-full bg-[#F8F3E9] relative overflow-hidden" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* === ORNAMEN BACKGROUND TENGAH (GUNUNGAN RAKSASA) === */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] pointer-events-none z-0 opacity-[0.06] mix-blend-multiply grayscale contrast-125"
        style={{ 
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, 
          backgroundSize: 'contain', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>

      {blocks.map((block, index) => {
        const isImageLeft = block.layout === "image-left";
        const isImageRight = block.layout === "image-right";

        return (
          <section key={index} className="py-20 lg:py-24 relative z-10 border-b border-[#E5D7C1]/50 last:border-0">
            
            <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
  
              {/* SISI GAMBAR */}
              <div className={`flex w-full justify-center ${
                isImageLeft 
                  ? "lg:justify-start order-1" 
                  : "lg:justify-end order-1 lg:order-2"
              }`}>
                <div className="relative group p-1.5 rounded-xl bg-transparent border-[1.5px] border-[#C5A059] shadow-[0_15px_30px_rgba(45,26,17,0.1)] w-full max-w-[480px]">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EFE8DC]">
                    {block.image ? (
                      <img
                        src={block.image}
                        alt={block.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C5A059] opacity-30">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SISI KONTEN */}
              <div className={`space-y-6 flex flex-col justify-center ${
                isImageLeft 
                  ? "order-2 text-left" 
                  : "order-2 lg:order-1 text-left"
              }`}>

                <h3 className="text-4xl md:text-5xl lg:text-6xl text-[#C5A059] tracking-wide font-normal leading-tight">
                  {block.title}
                </h3>
                
                {block.subtitle && (
                  <span className="text-[#8B7355] text-sm tracking-[0.3em] uppercase font-sans font-medium block">
                    {block.subtitle}
                  </span>
                )}
                
                {block.description && (
                  <p className="text-sm md:text-base text-[#2D1A11] leading-relaxed max-w-md font-serif">
                    {block.description}
                  </p>
                )}

                {/* FITUR */}
<div className="pt-4 max-w-lg w-full">
                  {block.featureStyle === "cards" ? (
                    <div className="space-y-3">
                      {block.features.map((feature: any, idx: number) => {
                        return (
                          <div
                            key={idx}
                            // Dibuat statis: hapus hover dan transisi state
                            className="relative rounded-md overflow-hidden bg-[#2D1A11] border border-[#C5A059] shadow-sm"
                          >
                            {/* Ubah <button> menjadi <div> dan hapus onClick */}
                            <div className="w-full px-6 py-4 flex items-center gap-4 text-left">
                              <span className="text-[#C5A059]">
                                {/* Menggunakan ikon check/statis karena bukan accordion lagi */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                              <span className="font-serif text-base tracking-wide text-[#EFE8DC]">
                                {feature.title}
                              </span>
                            </div>
                            
                            {/* Jika ada konten tambahan, tampilkan secara permanen (tanpa max-h-0) */}
                            {feature.content && (
                              <div className="px-6 pb-4">
                                <div className="pt-2 border-t border-[#C5A059]/30">
                                  <p className="text-[#EFE8DC]/80 text-sm leading-relaxed font-serif">
                                    {feature.content}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-5">
                      {block.features.map((feature: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-[#F0EBE1] flex items-center justify-center flex-shrink-0 shadow-[0_5px_15px_rgba(197,160,89,0.3)] transition-transform duration-300 border border-[#E5D7C1]/50">
                            {feature.icon ? (
                              <div className="w-5 h-5 text-[#2D1A11]" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                            ) : (
                              <svg className="w-5 h-5 text-[#2D1A11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[#2D1A11] font-serif text-lg tracking-wide transition-colors">
                            {feature.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
                </div>
          </section>
        );
      })}
    </div>
  );
}