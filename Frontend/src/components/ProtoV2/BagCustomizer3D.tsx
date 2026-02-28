"use client";

import { useState } from "react";
import ProductViewer from "@/components/ProductViewer";
import { FrontViewer, BackViewer, TopViewer } from "@/components/StaticViewers"; 
import Breadcrumb from "../Common/Breadcrumb";

const COLOR_PALETTE = [
  { id: "badan", name: "Badan Tas", canHide: false, colorsSolid: ["#4B5563", "#60A5FA", "#F472B6"], colorsLeather: ["#AC7434", "#88572B", "#612718", "#654321", "#954535", "#C4B289"] },
  { id: "tali", name: "Tali Bahu", colors: ["#000000", "#FFFFFF"], canHide: false },
  { id: "tali2", name: "Tali Bahu", colors: ["#000000", "#FFFFFF"], canHide: false },
  { id: "telinga", name: "Telinga Tas (Penutup)", canHide: true, colorsSolid: ["#EF4444", "#A855F7", "#22C55E"], colorsLeather: ["#AC7434", "#88572B", "#612718", "#654321", "#954535", "#C4B289"] },
  { id: "sayap", name: "Sayap Tas", colors: ["#000000", "#4B5563", "#DC2626"], canHide: true },
  { id: "detail", name: "Detail (Mata & Taring)", colors: ["#FCD34D", "#FFFFFF", "#000000"], canHide: true },
];

const PREVIEW_VIEWS = [
  { id: "360", label: "360°", type: "icon" },
  { id: "depan", label: "Depan", type: "image" },
  { id: "belakang", label: "Belakang", type: "image" },
  { id: "atas", label: "Atas", type: "image" },
];

const PREMIUM_COLORS = ["#60A5FA", "#F472B6", "#EF4444", "#A855F7", "#22C55E", "#DC2626", "#FCD34D"];

export default function BagCustomizer3D() {
  const [colors, setColors] = useState<Record<string, string>>({
    badan: "#F472B6", tali: "#FFFFFF",tali2: "#FFFFFF", telinga: "#22C55E", sayap: "#000000", detail: "#FCD34D",
  });

  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>({
    badan: true, tali: true,tali2: true, telinga: true, sayap: true, detail: true,
  });

  const [activeView, setActiveView] = useState("depan"); // Diubah ke "depan" untuk testing awal
  
  // STATE MATERIAL DAN KOMPARTEMEN
  const [bodyMaterial, setBodyMaterial] = useState("base");
  const [telingaMaterial, setTelingaMaterial] = useState("base");
  const [kompartemen, setKompartemen] = useState("kancing"); // "kancing" atau "pengait"

  const handleColorChange = (partId: string, colorHex: string) => {
    setColors((prev) => ({ ...prev, [partId]: colorHex }));
  };

  const handleVisibilityToggle = (partId: string) => {
    setVisibleParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  const handleMaterialChange = (partId: string, materialType: string) => {
    if (partId === "badan") {
      setBodyMaterial(materialType);
      if (materialType === "base") setColors(prev => ({ ...prev, badan: "#F472B6" }));
      else if (materialType === "leather") setColors(prev => ({ ...prev, badan: "#AC7434" }));
    } else if (partId === "telinga") {
      setTelingaMaterial(materialType);
      if (materialType === "base") setColors(prev => ({ ...prev, telinga: "#22C55E" }));
      else if (materialType === "leather") setColors(prev => ({ ...prev, telinga: "#654321" }));
    }
  };

  const calculatePrice = () => {
    let total = 850000; 
    
    // Biaya Tambahan Komponen
    if (visibleParts.telinga) {
      total += 100000; 
      if (telingaMaterial === "leather") total += 75000; 
    }
    if (visibleParts.sayap) total += 200000;   
    if (visibleParts.detail) total += 50000;   

    // Biaya Tambahan Material Badan
    if (bodyMaterial === "leather") total += 150000; 

    // Biaya Tambahan Pengait
    if (kompartemen === "pengait") total += 50000; // Hardware pengait tambah Rp 50.000

    // Biaya Warna Premium
    Object.entries(colors).forEach(([part, hex]) => {
      const isPartActive = visibleParts[part] || part === "badan" || part === "tali"  || part === "tali2";
      if (isPartActive && PREMIUM_COLORS.includes(hex)) total += 25000; 
    });
    
    return total;
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const currentPrice = calculatePrice();

  return (
    <>
      <Breadcrumb title={"Build Your Bag"} pages={["customizer"]} />
      
      <section className="bg-[#f4f7fa] py-12">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden lg:h-[750px]">
            
            {/* KIRI: PREVIEW AREA */}
            <div className="w-full lg:w-[55%] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 relative flex flex-col bg-[#f8f9fa] overflow-hidden">
              <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.04)_0%,transparent_70%)] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>

              <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pt-4">
                {activeView === "360" && <ProductViewer colors={colors} visibleParts={visibleParts} bodyMaterial={bodyMaterial} />}
                {/* PROPS KOMPARTEMEN DIKIRIM KE FRONTVIEWER */}
                {activeView === "depan" && <FrontViewer colors={colors} visibleParts={visibleParts} bodyMaterial={bodyMaterial} telingaMaterial={telingaMaterial} kompartemen={kompartemen} />}
                {activeView === "belakang" && <BackViewer colors={colors} visibleParts={visibleParts} bodyMaterial={bodyMaterial} telingaMaterial={telingaMaterial} />}
{activeView === "atas" && <TopViewer colors={colors} visibleParts={visibleParts} bodyMaterial={bodyMaterial} kompartemen={kompartemen} />}              </div>

              <div className="mt-6 flex justify-center z-20 pb-2">
                <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2.5 rounded-2xl border border-[#cbd5e1] shadow-sm">
                  {PREVIEW_VIEWS.map((view) => {
                    const isActive = activeView === view.id;
                    return (
                      <button key={view.id} onClick={() => setActiveView(view.id)} className={`relative w-[65px] h-[65px] rounded-xl flex flex-col items-center justify-center transition-all bg-[#f8f9fa] ${isActive ? "border-2 border-[#4154f1] ring-[3.5px] ring-[#e0e7ff] text-[#4154f1]" : "border border-[#cbd5e1] text-[#64748b] hover:border-[#94a3b8]"}`}>
                        {view.type === "icon" ? (
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold tracking-widest">360°</span>
                          </div>
                        ) : (<div className="text-[10px] font-bold uppercase tracking-widest">{view.label}</div>)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* KANAN: CONTROL PANEL */}
            <div className="w-full lg:w-[45%] flex flex-col h-full bg-white">
               <div className="px-8 lg:px-12 pt-10 pb-6 border-b border-gray-100">
                <h2 className="text-[32px] font-extrabold text-[#111827] mb-2 tracking-tight">Design Your Bag</h2>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">Sesuaikan warna, material, dan aksesoris tas.</p>
              </div>

              <div className="flex-grow overflow-y-auto px-8 lg:px-12 py-6 flex flex-col gap-7 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                
                {/* TAMBAHAN UI: PILIHAN KOMPARTEMEN (KANCING/PENGAIT) */}
                <div className="pb-7 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 font-bold text-[#111827] text-[13px] uppercase tracking-wider">
                      <span>Tipe Kompartemen</span>
                    </div>
                  </div>
                  <div className="flex bg-[#f1f5f9] p-1 rounded-lg w-max">
                    <button 
                      onClick={() => setKompartemen("kancing")} 
                      className={`px-6 py-2 text-[13px] font-bold rounded-md transition-all duration-200 ${kompartemen === "kancing" ? "bg-white text-[#4154f1] shadow-sm" : "text-gray-500 hover:text-[#4154f1]"}`}
                    >
                      Kancing
                    </button>
                    <button 
                      onClick={() => setKompartemen("pengait")} 
                      className={`px-6 py-2 text-[13px] font-bold rounded-md transition-all duration-200 ${kompartemen === "pengait" ? "bg-white text-[#4154f1] shadow-sm" : "text-gray-500 hover:text-[#4154f1]"}`}
                      title="+ Rp 50.000"
                    >
                      Pengait Sabuk
                    </button>
                  </div>
                </div>

                {/* LOOPING WARNA PALETTE */}
                {COLOR_PALETTE.map((part) => {
                  const isVisible = visibleParts[part.id];
                  
                  const activeMaterial = part.id === "badan" ? bodyMaterial : (part.id === "telinga" ? telingaMaterial : "base");
                  const currentColorsToRender = (part.id === "badan" || part.id === "telinga") 
                    ? (activeMaterial === "leather" ? part.colorsLeather : part.colorsSolid)
                    : part.colors;
                  
                  return (
                    <div key={part.id} className="pb-7 border-b border-gray-100 last:border-0 last:pb-0">
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 font-bold text-[#111827] text-[13px] uppercase tracking-wider">
                          <span>{part.name}</span>
                          {part.canHide && (
                            <button onClick={() => handleVisibilityToggle(part.id)} className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none ${isVisible ? 'bg-[#4154f1]' : 'bg-[#cbd5e1] border border-gray-300 shadow-inner'}`}>
                              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-300 ${isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={`transition-all duration-300 ${!isVisible ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}>
                        <div className="flex flex-wrap gap-3.5 mb-5">
                          {currentColorsToRender?.map((color) => {
                            const isActive = colors[part.id] === color;
                            const isLightColor = color === "#FFFFFF" || color === "#f2f2f2";
                            const isPremium = PREMIUM_COLORS.includes(color);

                            let tooltipName = isPremium ? "+ Rp 25.000" : "Warna Standar";
                            if (color === "#AC7434") tooltipName = "Leather (Standard)";
                            if (color === "#88572B") tooltipName = "Brown Leather (Dulux)";
                            if (color === "#612718") tooltipName = "Espresso Brown";
                            if (color === "#654321") tooltipName = "Dark Brown (Klasik)";
                            if (color === "#954535") tooltipName = "Chestnut (Kastanye)";
                            if (color === "#C4B289") tooltipName = "Khaki (Kulit Bumi)";

                            return (
                              <button key={`${part.id}-${color}`} onClick={() => handleColorChange(part.id, color)} className="group relative focus:outline-none" title={tooltipName}>
                                <div style={{ backgroundColor: color }} className={`w-10 h-10 rounded-full transition-all duration-200 ease-in-out ${isLightColor ? "border border-gray-300" : "border border-transparent"} ${isActive ? "ring-2 ring-[#4154f1] ring-offset-2 scale-110" : "hover:scale-105"}`} />
                                {isPremium && <div className="absolute -top-1 -right-1 bg-yellow-400 w-3 h-3 rounded-full border border-white shadow-sm" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* UI MATERIAL UNTUK BADAN DAN TELINGA */}
                        {(part.id === "badan" || part.id === "telinga") && (
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Material:</span>
                            <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
                              <button onClick={() => handleMaterialChange(part.id, "base")} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all duration-200 ${activeMaterial === "base" ? "bg-white text-[#4154f1] shadow-sm" : "text-gray-500 hover:text-[#4154f1]"}`}>Solid</button>
                              <button onClick={() => handleMaterialChange(part.id, "leather")} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all duration-200 ${activeMaterial === "leather" ? "bg-white text-[#4154f1] shadow-sm" : "text-gray-500 hover:text-[#4154f1]"}`} title={part.id === "badan" ? "+ Rp 150.000" : "+ Rp 75.000"}>Leather</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
               
              <div className="px-8 lg:px-12 py-8 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] mt-auto">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-[34px] font-extrabold text-[#111827] tracking-tight leading-none">{formatRupiah(currentPrice)}</span>
                  <span className="text-[14px] text-gray-500 font-medium">Berdasarkan pilihanmu</span>
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