"use client";

import React, { useState, useRef } from "react";

// --- 1. DATA GAMBAR ---
const TOTAL_FRAMES = 32;
const imageFrames = Array.from({ length: TOTAL_FRAMES }).map(
  (_, i) => `/images/bag/frame-${i + 1}.png`
);

const sizes = [
  { id: "xs", label: "EXTRA SMALL", desc: "Fits an 11\" laptop" },
  { id: "s", label: "SMALL", desc: "Fits a 13\" laptop" },
  { id: "m", label: "MEDIUM", desc: "Fits a 15\" laptop" },
  { id: "l", label: "LARGE", desc: "Fits a 17\" laptop" },
  { id: "xl", label: "X-LARGE", desc: "Fits a 17\"+ laptop" },
];

const colors = [
  { id: "black", hex: "#1f2937" },
  { id: "white", hex: "#f3f4f6" },
  { id: "sage", hex: "#869b91" },
  { id: "gray", hex: "#6b7280" },
  { id: "darkgreen", hex: "#4b554e" },
  { id: "lightblue", hex: "#8bb6d9" },
  { id: "cyan", hex: "#0ea5e9" },
  { id: "blue", hex: "#2563eb" },
  { id: "steel", hex: "#4b5563" },
  { id: "navy", hex: "#1e3a8a" },
  { id: "lavender", hex: "#a78bfa" },
  { id: "purple", hex: "#5b21b6" },
];

export default function ProductPage() {
  // --- 2. STATE LOGIC ---
  const [selectedSize, setSelectedSize] = useState("m");
  const [leftPanelColor, setLeftPanelColor] = useState("black");
  const [centerPanelColor, setCenterPanelColor] = useState("gray");
  const [rightPanelColor, setRightPanelColor] = useState("blue");
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // --- 3. FUNGSI DRAG 360 ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startXRef.current;
    const sensitivity = 15; 

    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        // GESER KANAN: Frame mundur (-) agar putaran searah dengan kursor
        setCurrentFrame((prev) => (prev === 0 ? TOTAL_FRAMES - 1 : prev - 1));
      } else {
        // GESER KIRI: Frame maju (+) agar putaran searah dengan kursor
        setCurrentFrame((prev) => (prev === TOTAL_FRAMES - 1 ? 0 : prev + 1));
      }
      startXRef.current = currentX; 
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // --- 4. TAMPILAN UI ---
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <main className="max-w-7xl mx-auto px-4 pt-[180px] pb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        
      {/* === KIRI: IMAGE VIEWER === */}
        <div className="flex flex-col space-y-4">
          
          {/* UBAH WARNA BG DI SINI: Gunakan #b6b7b8 agar menyatu dengan fotomu */}
          <div 
            className="bg-[#b6b7b8] w-full aspect-[4/3] flex items-center justify-center cursor-ew-resize relative overflow-hidden rounded-md select-none shadow-sm"
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} 
            onTouchStart={handleMouseDown} 
            onTouchMove={handleMouseMove} 
            onTouchEnd={handleMouseUp}
          >
            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-medium rounded shadow-sm text-gray-800 pointer-events-none z-10">
              ↔ Drag to rotate
            </div>

            <img 
              src={imageFrames[currentFrame]} 
              alt={`Produk angle ${currentFrame + 1}`} 
              className="w-full h-full object-contain pointer-events-none relative z-0"
              draggable="false"
            />
          </div>
        </div>

        {/* === KANAN: DETAIL PRODUK === */}
        <div className="flex flex-col pt-4">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">Custom Classic Messenger Bag</h1>

          <div className="mb-10">
            <h3 className="text-sm font-semibold flex items-center mb-4 text-gray-800 border-b pb-2">
              <span className="bg-[#4b5563] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs">1</span>
              Choose Your Size
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {sizes.map((size) => (
                <div 
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-4 border cursor-pointer transition-all ${
                    selectedSize === size.id 
                      ? "border-[#333b4d] border-2" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="font-bold text-sm text-[#333b4d]">{size.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{size.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-semibold flex items-center mb-6 text-gray-800 border-b pb-2">
              <span className="bg-[#4b5563] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs">2</span>
              Choose Your Color
            </h3>
            
            <div className="mb-6">
              <h4 className="text-[15px] font-medium mb-3 text-gray-700">Left Panel</h4>
              <div className="flex flex-wrap gap-2.5"> 
                {colors.map((color) => (
                  <div 
                    key={`left-${color.id}`} 
                    onClick={() => setLeftPanelColor(color.id)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all shadow-sm
                      ${leftPanelColor === color.id ? 'ring-2 ring-offset-2 ring-[#4b5563]' : 'hover:scale-105 border border-gray-200'}
                    `} 
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <h4 className="text-[15px] font-medium mb-3 text-gray-700">Center Panel</h4>
              <div className="flex flex-wrap gap-2.5"> 
                {colors.map((color) => (
                  <div 
                    key={`center-${color.id}`} 
                    onClick={() => setCenterPanelColor(color.id)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all shadow-sm
                      ${centerPanelColor === color.id ? 'ring-2 ring-offset-2 ring-[#4b5563]' : 'hover:scale-105 border border-gray-200'}
                    `} 
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <h4 className="text-[15px] font-medium mb-3 text-gray-700">Right Panel</h4>
              <div className="flex flex-wrap gap-2.5"> 
                {colors.map((color) => (
                  <div 
                    key={`right-${color.id}`} 
                    onClick={() => setRightPanelColor(color.id)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all shadow-sm
                      ${rightPanelColor === color.id ? 'ring-2 ring-offset-2 ring-[#4b5563]' : 'hover:scale-105 border border-gray-200'}
                    `} 
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-6">
            <span className="text-3xl font-normal text-gray-800">$169</span>
            <button className="bg-[#303645] hover:bg-[#20242e] text-white px-10 py-4 rounded-full font-medium text-lg transition-colors w-2/3 shadow-md">
              Add to cart
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}