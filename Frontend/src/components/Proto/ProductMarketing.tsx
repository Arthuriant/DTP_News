import React from "react";

export default function ProductMarketing({ blocks }: { blocks?: any[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => (
        <section key={index} className="py-24 relative bg-[#e5eaf4]">
          {/* Pattern Background Opsional */}
          {block.hasPattern && (
            <div
              className="absolute inset-0 z-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(#4154f1 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            ></div>
          )}

          <div className="max-w-[1100px] w-full mx-auto px-6 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* === SISI GAMBAR === */}
              <div className={`flex ${block.layout === "image-left" ? "lg:justify-start order-1" : "lg:justify-end order-1 lg:order-2"}`}>
                <div className="relative w-full max-w-[320px] group">
                  {/* Glow Effect */}
                  <div className={`absolute rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                    block.layout === "image-left" 
                      ? "-inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-30 group-hover:duration-200" 
                      : "-top-6 -right-6 w-32 h-32 bg-amber-200/40"
                  }`}></div>
                  
                  {/* Image Card */}
                  <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-white ${
                    block.layout === "image-left" ? "shadow-2xl border border-gray-100" : "shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white"
                  }`}>
                    <img
                      src={block.image}
                      alt={block.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${block.layout === "image-left" ? "group-hover:scale-110" : "group-hover:scale-105"}`}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop";
                      }}
                    />
                    
                    {/* Badge (Kiri Atas) */}
                    {block.badge && block.layout === "image-left" && (
                      <div className="absolute top-4 left-4 backdrop-blur-md bg-white/70 px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{block.badge}</span>
                      </div>
                    )}
                    
                    {/* Quote Overlay (Bawah) */}
                    {block.imageQuote && block.layout === "image-right" && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-sm font-medium italic opacity-90">{block.imageQuote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* === SISI KONTEN (TEKS) === */}
              <div className={`space-y-8 ${block.layout === "image-right" ? "order-2 lg:order-1 text-right lg:text-left" : "order-2"}`}>
                <div className={`flex flex-col ${block.layout === "image-right" ? "items-end lg:items-start" : ""}`}>
                  
                  {/* Badge untuk versi image-right */}
                  {block.badge && block.layout === "image-right" && (
                    <div className="inline-block px-3 py-1 mb-4 text-[11px] font-bold tracking-[0.2em] uppercase bg-amber-100 text-amber-700 rounded-lg shadow-sm">
                      {block.badge}
                    </div>
                  )}

                  {block.subtitle && (
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase block mb-3">
                      {block.subtitle}
                    </span>
                  )}
                  
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                    {block.title} <br />
                    {block.titleHighlight && (
                      <span className={
                        block.titleHighlightStyle === "amber" 
                          ? "text-amber-600" 
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500"
                      }>
                        {block.titleHighlight}
                      </span>
                    )}
                  </h3>
                  
                  <p className={`text-lg text-gray-600 leading-relaxed max-w-md ${block.layout === "image-right" ? "ml-auto lg:ml-0" : ""}`}>
                    {block.description}
                  </p>
                </div>

                {/* --- RENDER FEATURES (Cards vs Bullets) --- */}
                {block.featureStyle === "cards" ? (
                  <div className="grid grid-cols-1 gap-4">
                    {block.features.map((feature: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon || "M5 13l4 4L19 7"} />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-800">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {block.features.map((feature: any, idx: number) => (
                      <li key={idx} className="flex items-center justify-end lg:justify-start gap-3 group">
                        <span className="text-gray-700 text-sm font-semibold group-hover:text-amber-600 transition-colors">
                          {feature.title}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}