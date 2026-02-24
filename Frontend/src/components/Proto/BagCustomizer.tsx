"use client";

import { useState } from "react";
import DynamicPart from "./DynamicPart";
import StaticPart from "./StaticPart";
import Breadcrumb from "../Common/Breadcrumb";
import SpritePart from "./SpritePart";
import StaticSpritePart from "./StaticSpritePart";

const BAG_PARTS = [
  { id: "body", name: "BODY" },
  { id: "telinga", name: "TELINGA TAS" },
  { id: "tali", name: "TALI BAHU" },
];

const colorOptions = [
  { name: "Black", hex: "#111111" },
  { name: "Charcoal", hex: "#3a3a3a" },
  { name: "Grey", hex: "#8a8a8a" },
  { name: "Light Grey", hex: "#d1d5db" },
  { name: "Pink", hex: "#e8729a" },
  { name: "Hot Pink", hex: "#c0185a" },
  { name: "Red", hex: "#dc2626" },
  { name: "Dark Red", hex: "#7f1d1d" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Navy", hex: "#1e3a8a" },
];

const textureOptions = [
  { id: "base", name: "Solid" },
  { id: "leather", name: "Leather" },
];

const PREVIEW_VIEWS = [
  { id: "360", label: "360°", type: "icon" },
  { id: "front", label: "Front", type: "image" },
  { id: "back", label: "Back", type: "image" },
  { id: "top", label: "Top", type: "image" },
];

export default function BagCustomizer() {
  const [selections, setSelections] = useState<Record<string, string>>({
    body: "#e8729a",   
    telinga: "#111111", 
    tali: "#3a3a3a",    
  });

  const [textureSelections, setTextureSelections] = useState<Record<string, string>>({
    body: "base",   
    telinga: "base", 
    tali: "base",    
  });

  const [activeView, setActiveView] = useState<string>("front");
  // --- LOGIKA 360 ROTATION ---
  const TOTAL_FRAMES = 16; // Sesuai jumlah telinga di gambar Mas
  const [frame360, setFrame360] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Mulai geser
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  // Sedang menggeser
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;
    
    if (Math.abs(diff) > 3) {
      setFrame360((prev) => {
        let newFrame = prev + (diff > 0 ? -1 : 1); 
        if (newFrame < 0) newFrame = TOTAL_FRAMES - 1;
        if (newFrame >= TOTAL_FRAMES) newFrame = 0;
        return newFrame;
      });
      setStartX(clientX);
    }
  };

  // Berhenti geser
  const handleDragEnd = () => setIsDragging(false);

  const handleColorSelect = (partId: string, hexColor: string) => {
    setSelections((prev) => ({ ...prev, [partId]: hexColor }));
  };

  const handleTextureSelect = (partId: string, textureId: string) => {
    setTextureSelections((prev) => ({ ...prev, [partId]: textureId }));
  };

  return (
    <>
      {/* CSS Animasi Kustom untuk efek Smooth Fade & Scale */}
      <style>{`
        @keyframes softFade {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-soft-fade {
          animation: softFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <Breadcrumb title={"Build Your Bag"} pages={["customizer"]} />
      
      <section className="bg-[#f4f7fa] py-12">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden lg:h-[750px]">
            
            {/* =========================================
                KIRI: PREVIEW AREA
            ========================================= */}
            <div className="w-full lg:w-[55%] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 relative flex flex-col bg-[#f8f9fa] overflow-hidden">
              
              <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.04)_0%,transparent_70%)] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>

              <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pt-4">
                
                {/* --- FRONT VIEW --- */}
                {/* Tambahkan key dan class animasi di sini */}
                {activeView === "front" && (
                  <div key="front" className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative">
                    <DynamicPart pov="Front" partName="tali" color={selections.tali} texture={textureSelections.tali} zIndex={10} />
                    <DynamicPart pov="Front" partName="telinga" color={selections.telinga} texture={textureSelections.telinga} zIndex={20} />
                    <DynamicPart pov="Front" partName="body" color={selections.body} texture={textureSelections.body} zIndex={30} />
                    
                    <StaticPart imageUrl="/assets/TasKelalawar/Front/mata.png" zIndex={40} altText="Mata" />
                    <StaticPart imageUrl="/assets/TasKelalawar/Front/gigi.png" zIndex={40} altText="Gigi" />
                  </div>
                )}

                {/* --- BACK VIEW --- */}
                {activeView === "back" && (
                  <div key="back" className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative">
                    <DynamicPart pov="Back" partName="tali" color={selections.tali} texture={textureSelections.tali} zIndex={10} />
                    <DynamicPart pov="Back" partName="telinga" color={selections.telinga} texture={textureSelections.telinga} zIndex={30} />
                    <DynamicPart pov="Back" partName="body" color={selections.body} texture={textureSelections.body} zIndex={20} />
                  </div>
                )}

                {/* --- TOP VIEW --- */}
                {activeView === "top" && (
                  <div key="top" className="animate-soft-fade w-full max-w-[420px] aspect-[4/5] relative">
                    <DynamicPart pov="Top" partName="tali" color={selections.tali} texture={textureSelections.tali} zIndex={10} />
                    <DynamicPart pov="Top" partName="telinga" color={selections.telinga} texture={textureSelections.telinga} zIndex={30} />
                    <DynamicPart pov="Top" partName="body" color={selections.body} texture={textureSelections.body} zIndex={20} />
                  </div>
                )}

               {/* --- 360 VIEW --- */}
                {activeView === "360" && (
                  <div 
                    className="w-full max-w-[420px] aspect-[4/5] relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    {/* WRAPPED BARU: scale-[0.80] 
                      Berfungsi untuk mengecilkan gambar agar tidak nabrak/terpotong di ujung layar 
                    */}
                    <div className="absolute inset-0 pointer-events-none">
                      <SpritePart
                        partName="telinga" 
                        color={selections.telinga} 
                        texture={textureSelections.telinga} 
                        zIndex={20} 
                        currentFrame={frame360}
                        totalFrames={TOTAL_FRAMES}
                      />
                      <SpritePart
                        partName="body" 
                        color={selections.body} 
                        texture={textureSelections.body} 
                        zIndex={30} 
                        currentFrame={frame360}
                        totalFrames={TOTAL_FRAMES}
                      />
                      <SpritePart
                        partName="tali" 
                        color={selections.tali} 
                        texture={textureSelections.tali} 
                        zIndex={10} 
                        currentFrame={frame360}
                        totalFrames={TOTAL_FRAMES}
                      />
                      
                      {(frame360 < 4 || frame360 > 12) && (
                        <>
                          <StaticSpritePart 
                            imageUrl="/assets/TasKelalawar/360/mata.png" 
                            zIndex={40} 
                            currentFrame={frame360}
                            totalFrames={TOTAL_FRAMES}
                          />
                          <StaticSpritePart 
                            imageUrl="/assets/TasKelalawar/360/gigi.png" 
                            zIndex={60} 
                            currentFrame={frame360}
                            totalFrames={TOTAL_FRAMES}
                          />
                        </>
                      )}
                    </div>

                    {/* Instruksi Geser di layar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-[11px] font-bold text-gray-600 shadow-sm pointer-events-none flex items-center gap-2 border border-gray-100 z-50">
                      <span className="text-lg leading-none pb-0.5">↔</span> Geser untuk memutar
                    </div>
                  </div>
                )}

                <p className="mt-8 text-[13px] text-gray-500 font-medium flex items-center gap-1.5">
                  <span className="text-lg leading-none">↻</span> Klik warna di sebelah kanan untuk preview real-time
                </p>
              </div>

              {/* AREA THUMBNAILS (Bawah) */}
              <div className="mt-6 flex justify-center z-20 pb-2">
                <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2.5 rounded-2xl border border-[#cbd5e1] shadow-sm">
                  <button className="w-6 h-8 flex items-center justify-center text-[#1e293b] hover:text-[#4154f1] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  {PREVIEW_VIEWS.map((view) => {
                    const isActive = activeView === view.id;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`relative w-[65px] h-[65px] rounded-xl flex flex-col items-center justify-center transition-all bg-[#f8f9fa]
                          ${isActive ? "border-2 border-[#4154f1] ring-[3.5px] ring-[#e0e7ff] text-[#4154f1]" : "border border-[#cbd5e1] text-[#64748b] hover:border-[#94a3b8]"}
                        `}
                      >
                        {view.type === "icon" ? (
                          <div className="flex flex-col items-center">
                            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-[10px] font-bold tracking-widest">360°</span>
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold uppercase tracking-widest">{view.label}</div>
                        )}
                      </button>
                    );
                  })}

                  <button className="w-6 h-8 flex items-center justify-center text-[#1e293b] hover:text-[#4154f1] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================
                KANAN: CONTROL PANEL
            ========================================= */}
            <div className="w-full lg:w-[45%] flex flex-col h-full bg-white">
              
              <div className="px-8 lg:px-12 pt-10 pb-6 border-b border-gray-100">
                <h2 className="text-[32px] font-extrabold text-[#111827] mb-2 tracking-tight">Design Your Bag</h2>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">
                  Sesuaikan warna dan material untuk setiap bagian tas.
                </p>
              </div>

              <div className="flex-grow overflow-y-auto px-8 lg:px-12 py-6 flex flex-col gap-7 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {BAG_PARTS.map((part) => {
                  const activeColorName = colorOptions.find(c => c.hex === selections[part.id])?.name || "Unknown";

                  return (
                    <div key={part.id} className="pb-7 border-b border-gray-100 last:border-0 last:pb-0">
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5 font-bold text-[#111827] text-[13px] uppercase tracking-wider">
                          <span>{part.name}</span>
                        </div>
                        <span className="text-[13px] text-gray-500 font-medium">{activeColorName}</span>
                      </div>

                      {/* Lingkaran Warna */}
                      <div className="flex flex-wrap gap-3.5 mb-5">
                        {colorOptions.map((color) => {
                          const isActive = selections[part.id] === color.hex;
                          const isLightColor = color.hex === "#d1d5db" || color.hex === "#8a8a8a";

                          return (
                            <button
                              key={`${part.id}-${color.hex}`}
                              onClick={() => handleColorSelect(part.id, color.hex)}
                              className="group relative focus:outline-none"
                            >
                              <div
                                style={{ backgroundColor: color.hex }}
                                className={`w-10 h-10 rounded-full transition-all duration-200 ease-in-out
                                  ${isLightColor ? "border border-gray-300" : "border border-transparent"}
                                  ${isActive ? "ring-2 ring-[#4154f1] ring-offset-2 scale-110" : "hover:scale-105"}
                                `}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Pilihan Material/Tekstur */}
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Material:</span>
                        <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
                          {textureOptions.map((tex) => {
                            const isSelected = textureSelections[part.id] === tex.id;
                            const isDisabled = part.id !== "body" && tex.id !== "base";

                            return (
                              <button
                                key={tex.id}
                                onClick={() => handleTextureSelect(part.id, tex.id)}
                                disabled={isDisabled}
                                title={isDisabled ? "Material ini belum tersedia untuk bagian ini" : ""}
                                className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all duration-200
                                  ${isSelected && !isDisabled ? "bg-white text-[#4154f1] shadow-sm" : "text-gray-500"}
                                  ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:text-[#4154f1]"}
                                `}
                              >
                                {tex.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              <div className="px-8 lg:px-12 py-8 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] mt-auto">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[34px] font-extrabold text-[#111827] tracking-tight leading-none">Rp 1.250.000</span>
                  <span className="text-[14px] text-gray-500 font-medium">Sudah termasuk kustomisasi</span>
                </div>
                
                <button className="w-full py-4 px-6 bg-[#4154f1] text-white rounded-md font-bold text-[15px] tracking-wide uppercase transition-colors hover:bg-[#3444c4] active:scale-[0.99] shadow-md shadow-blue-500/20">
                  TAMBAH KE KERANJANG
                </button>
              </div>

            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}