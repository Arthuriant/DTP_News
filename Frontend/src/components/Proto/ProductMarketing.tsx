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
                
                {/* ================= SISI GAMBAR ================= */}
                <div className={`flex w-full justify-center ${isImageLeft ? "lg:justify-start order-1" : "lg:justify-end order-1 lg:order-2"}`}>
                  
                  {/* BINGKAI EMAS ALA GAMBAR REFERENSI */}
                  <div className="relative group p-1.5 rounded-xl bg-transparent border-[1.5px] border-[#C5A059] shadow-[0_15px_30px_rgba(45,26,17,0.1)] w-full max-w-[400px]">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#EFE8DC]">
                      <img
                        src={block.image}
                        alt={block.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  </div>

                </div>

                {/* ================= SISI KONTEN (TEKS) ================= */}
                <div className={`space-y-6 flex flex-col justify-center ${isImageRight ? "order-2 lg:order-1 lg:text-left text-center" : "order-2 text-center lg:text-left"}`}>
                  
                  <div className={`flex flex-col ${isImageRight ? "items-center lg:items-start" : "items-center lg:items-start"}`}>
                    
                    {/* Judul Emas (Playfair/Cinzel Style) */}
                    <h3 className="text-4xl md:text-5xl lg:text-6xl text-[#C5A059] mb-2 tracking-wide font-normal">
                      {block.title}
                    </h3>
                    
                    {/* Subjudul Gelap */}
                    <span className="text-[#2D1A11] text-lg md:text-xl tracking-wide mb-6 block font-medium">
                      {block.subtitle}
                    </span>
                    
                    {/* Paragraf Deskripsi */}
                    <p className="text-sm md:text-base text-[#2D1A11] leading-relaxed max-w-md font-serif">
                      {block.description}
                    </p>
                  </div>

                  {/* ================= RENDER FITUR (LIST BULLET / CARDS) ================= */}
                  <div className="pt-4 max-w-lg mx-auto lg:mx-0 w-full">
                    
                    {/* === STYLE KARTU (ACCORDION / DROPDOWN) === */}
                    {block.featureStyle === "cards" ? (
                      <div className="space-y-3">
                        {block.features.map((feature: any, idx: number) => {
                          const isFeatureOpen = openFeature === feature.title;
                          return (
                            <div 
                              key={idx} 
                              className={`relative rounded-md transition-all duration-300 overflow-hidden ${
                                isFeatureOpen 
                                  ? 'bg-[#F8F3E9] border border-[#C5A059] shadow-md' 
                                  : 'bg-[#2D1A11] border border-[#C5A059] hover:bg-[#3a2216]'
                              }`}
                            >
                              {/* Inner Border Khusus Kartu Aktif (Efek Pigura Klasik) */}
                              {isFeatureOpen && (
                                <div className="absolute inset-1 border border-[#C5A059]/40 rounded-sm pointer-events-none"></div>
                              )}
                              
                              <button
                                onClick={() => toggleFeature(feature.title)}
                                className="w-full px-6 py-4 flex items-center gap-4 text-left focus:outline-none relative z-10"
                              >
                                {/* Ikon Chevron (Panah) */}
                                <span className={`text-sm transform transition-transform duration-300 ${isFeatureOpen ? 'text-[#C5A059]' : 'text-[#C5A059]'}`}>
                                  {isFeatureOpen ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                  )}
                                </span>
                                
                                {/* Teks Fitur */}
                                <span className={`font-serif text-base tracking-wide ${isFeatureOpen ? 'text-[#C5A059] font-semibold' : 'text-[#EFE8DC]'}`}>
                                  {feature.title}
                                </span>
                              </button>

                              {/* Accordion Content */}
                              {feature.content && (
                                <div 
                                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out relative z-10 ${
                                    isFeatureOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
                                  }`}
                                >
                                  <div className="pt-2 border-t border-[#C5A059]/30 mt-1">
                                    <p className="text-[#2D1A11] text-sm leading-relaxed font-serif">
                                      {feature.content}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    /* === STYLE BULLET (IKON LINGKARAN GLOWING) === */
                    ) : (
                      <ul className="space-y-6">
                        {block.features.map((feature: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-5 group justify-start">
                            
                            {/* Lingkaran Ikon dengan Bayangan Lembut */}
                            <div className="w-12 h-12 rounded-full bg-[#F0EBE1] flex items-center justify-center flex-shrink-0 shadow-[0_5px_15px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform duration-300 border border-[#E5D7C1]/50">
                               {feature.icon ? (
                                  <div className="w-6 h-6 text-[#2D1A11]" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                               ) : (
                                  <svg className="w-6 h-6 text-[#2D1A11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                  </svg>
                               )}
                            </div>
                            
                            {/* Teks Fitur */}
                            <span className="text-[#2D1A11] font-serif text-lg tracking-wide group-hover:text-[#C5A059] transition-colors">
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