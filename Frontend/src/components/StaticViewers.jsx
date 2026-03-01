"use client";

// ==========================================
// 1. KOMPONEN UTAMA UNTUK MEWARNAI TAS MINI
// ==========================================
function TasMiniPart({ folder, partName, color, isVisible, textureType = "Base" }) {
  if (!isVisible) return null;

  let maskFile = "";
  let baseFile = "";

  // ATURAN PEMETAAN NAMA FILE (Sesuai persis dengan screenshot folder kamu)
  if (partName === "body") {
    maskFile = "Mask.png";
    baseFile = textureType === "leather" ? "Texture.png" : "Base.png";
  } 
  else if (partName === "penutup") {
    maskFile = "Mask-penutup.png";
    baseFile = textureType === "leather" ? "Texture-penutup.png" : "Base-penutup.png";
  } 
  else if (partName === "trim-badan") {
    maskFile = "Mask-trim-badan.png";
    baseFile = "Base-trim-badan.png";
  } 
  else if (partName === "trim-penutup") {
    maskFile = "Mask-trim-penutup.png";
    baseFile = "Base-trim-penutup.png";
  }
  // TAMBAHAN BARU: Aturan untuk Pengait 2 (Tali Penutup)
  else if (partName === "pengait2") {
    maskFile = "Mask-pengait2.png";
    baseFile = textureType === "leather" ? "Texture-pengait2.png" : "Base-pengait2.png";
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full h-full" style={{
          backgroundColor: color,
          WebkitMaskImage: `url('/assets/TasMini/${folder}/${maskFile}')`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url('/assets/TasMini/${folder}/${maskFile}')`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}>
        <img 
          src={`/assets/TasMini/${folder}/${baseFile}`} 
          alt={`${partName} texture`} 
          className="w-full h-full object-contain mix-blend-multiply opacity-80" 
        />
      </div>
    </div>
  );
}

// Tambahan props "zIndex" agar kancing bisa ditaruh di tumpukan paling atas
function StaticOverlay({ folder, fileName, zIndex = "z-50" }) {
  return (
    <div className={`absolute inset-0 ${zIndex} flex items-center justify-center pointer-events-none`}>
      <img 
        src={`/assets/TasMini/${folder}/${fileName}`} 
        className="w-full h-full object-contain" 
        alt={fileName} 
      />
    </div>
  );
}

// ==========================================
// 2. VIEWER DEPAN (Folder: Base)
// ==========================================
export function FrontViewer({ colors, visibleParts, bodyMaterial, telingaMaterial, kompartemen = "kancing" }) {
  // Memisahkan penangkap material (Badan bisa beda material dengan Penutup)
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";
  
  // Jika kode mu sebelumnya belum mengirimkan telingaMaterial, kita pasang fallback ke 'Base'
  const texPenutup = telingaMaterial === "leather" ? "leather" : "Base";

  const isPenutupVisible = visibleParts?.telinga ?? true;
  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      
      {/* 1. Badan Utama (z-10) */}
      <div className="absolute inset-0 z-10">
        <TasMiniPart folder="Base" partName="body" color={colors.badan} isVisible={true} textureType={texBody} />
      </div>

      {/* 2. Trim Badan (z-20) */}
      <div className="absolute inset-0 z-20">
        <TasMiniPart folder="Base" partName="trim-badan" color={colors.tali} isVisible={true} />
      </div>

      {/* 3. Penutup (z-30) - Sekarang menerima textureType khusus penutup */}
      <div className="absolute inset-0 z-30">
        <TasMiniPart folder="Base" partName="penutup" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} textureType={texPenutup} />
      </div>

      {/* 4. Trim Penutup (z-40) */}
      <div className="absolute inset-0 z-40">
        <TasMiniPart folder="Base" partName="trim-penutup" color={colors.tali2} isVisible={visibleParts?.telinga ?? true} />
      </div>

       <StaticOverlay folder="Base" fileName="Base-kancing3.png" zIndex="z-50" />

      {/* 5. Kancing Dinamis (z-50) */}
      
      {kompartemen === "kancing" ? (
        <>
          {/* Jika modenya KANCING */}
          {!isPenutupVisible && <StaticOverlay folder="Base" fileName="Base-kancing1.png" zIndex="z-50" />}
          {isPenutupVisible && <StaticOverlay folder="Base" fileName="Base-kancing2.png" zIndex="z-50" />}
        </>
      ) : (
        <>
          {/* Jika modenya PENGAIT */}
          {/* Pengait 1: Hardware besi di badan tas (selalu muncul) */}
          <StaticOverlay folder="Base" fileName="Base-pengait1.png" zIndex="z-50" />
          
          {/* Pengait 2: Tali kulit yang menempel di penutup. Memiliki warna & tekstur yang sama persis dengan Penutup, dan ikut hilang jika penutup dimatikan */}
          <div className="absolute inset-0 z-[50]">
            <TasMiniPart 
              folder="Base" 
              partName="pengait2" 
              color={colors.telinga} 
              isVisible={isPenutupVisible} 
              textureType={texPenutup} 
            />
          </div>

          {/* Pengait 3: Hardware tambahan di penutup (HANYA muncul jika penutup DITAMPILKAN) */}
          {isPenutupVisible && (
            <StaticOverlay folder="Base" fileName="Base-pengait3.png" zIndex="z-[60]" />
          )}
        </>
      )}
      
    </div>
  );
}

// ==========================================
// 3. VIEWER BELAKANG (Folder: Back)
// ==========================================
// ==========================================
// 3. VIEWER BELAKANG (Folder: Back) - DIUPDATE
// ==========================================
export function BackViewer({ colors, visibleParts, bodyMaterial, telingaMaterial }) {
  // Tangkap pilihan material untuk Badan dan Penutup
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";
  const texPenutup = telingaMaterial === "leather" ? "leather" : "Base";

  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      
      {/* 1. Badan Utama (z-10) */}
      <div className="absolute inset-0 z-10">
        <TasMiniPart folder="Back" partName="body" color={colors.badan} isVisible={true} textureType={texBody} />
      </div>

      {/* 2. Trim Badan (z-20) */}
      <div className="absolute inset-0 z-10">
        <TasMiniPart folder="Back" partName="trim-badan" color={colors.tali} isVisible={true} />
      </div>

      {/* 3. Penutup (z-30) - Berubah material mengikuti telingaMaterial */}
      <div className="absolute inset-0 z-20">
        <TasMiniPart folder="Back" partName="penutup" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} textureType={texPenutup} />
      </div>

      {/* 4. Trim Penutup (z-40) - Ikut hilang jika penutup dimatikan */}
      <div className="absolute inset-0 z-40">
        <TasMiniPart folder="Back" partName="trim-penutup" color={colors.tali2} isVisible={visibleParts?.telinga ?? true} />
      </div>

      {/* 5. Tali Belakang Statis (z-50) */}
      <StaticOverlay folder="Back" fileName="Base-tali.png" zIndex="z-30" />

      {/* 6. Kancing Belakang Statis (z-[60] menggunakan kurung siku karena melebihi z-50 bawaan Tailwind) */}
      <StaticOverlay folder="Back" fileName="Base-kancing.png" zIndex="z-5" />

    </div>
  );
}

// ==========================================
// 4. VIEWER ATAS (Folder: Top)
// ==========================================
// ==========================================
// 4. VIEWER ATAS (Folder: Top) - DIUPDATE
// ==========================================
export function TopViewer({ colors, visibleParts, bodyMaterial, kompartemen = "kancing" }) {
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";

  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      
      {/* 1. Badan Tas */}
      <div className="absolute inset-0 z-20">
        <TasMiniPart folder="Top" partName="body" color={colors.badan} isVisible={true} textureType={texBody} />
      </div>
      
      {/* 2. Tali Statis */}
      <StaticOverlay folder="Top" fileName="Base-tali.png" zIndex="z-[5]" />
      
      {/* 3. Kompartemen Dinamis (Kancing vs Pengait) */}
      {kompartemen === "kancing" ? (
        <StaticOverlay folder="Top" fileName="Base-kancing.png" zIndex="z-10" />
      ) : (
        <StaticOverlay folder="Top" fileName="Base-pengait.png" zIndex="z-10" />
      )}
      
    </div>
  );
}

// ==========================================
// 5. KOMPONEN KHUSUS UNTUK 360 SPRITE
// ==========================================
function TasMiniSpritePart({ folder, partName, color, isVisible, textureType = "Base", currentFrame, totalFrames = 16 }) {
  if (!isVisible) return null;

  let maskFile = `Mask-${partName}.png`;
  if (partName === "body") maskFile = "Mask.png";

  let baseFile = `Base-${partName}.png`;
  if (partName === "body") baseFile = textureType === "leather" ? "Texture.png" : "Base.png";
  if (partName === "penutup") baseFile = textureType === "leather" ? "Texture-penutup.png" : "Base-penutup.png";

  // RUMUS RAHASIA: Menggeser posisi background dari 0% ke 100%
  const positionX = (currentFrame / (totalFrames - 1)) * 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-full h-full" style={{
          backgroundColor: color,
          WebkitMaskImage: `url('/assets/TasMini/${folder}/${maskFile}')`,
          WebkitMaskSize: `${totalFrames * 100}% 100%`,
          WebkitMaskPosition: `${positionX}% center`,
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url('/assets/TasMini/${folder}/${maskFile}')`,
          maskSize: `${totalFrames * 100}% 100%`,
          maskPosition: `${positionX}% center`,
          maskRepeat: 'no-repeat',
        }}>
        <div 
          className="w-full h-full mix-blend-multiply opacity-80" 
          style={{
            backgroundImage: `url('/assets/TasMini/${folder}/${baseFile}')`,
            backgroundSize: `${totalFrames * 100}% 100%`,
            backgroundPosition: `${positionX}% center`,
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
    </div>
  );
}

function StaticSpriteOverlay({ folder, fileName, zIndex = "z-50", currentFrame, totalFrames = 16 }) {
  const positionX = (currentFrame / (totalFrames - 1)) * 100;
  return (
    <div className={`absolute inset-0 ${zIndex} pointer-events-none`}>
      <div 
        className="w-full h-full" 
        style={{
          backgroundImage: `url('/assets/TasMini/${folder}/${fileName}')`,
          backgroundSize: `${totalFrames * 100}% 100%`,
          backgroundPosition: `${positionX}% center`,
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}

// ==========================================
// 6. VIEWER 360 DERAJAT (INTERAKTIF)
// ==========================================
import { useState } from "react";

export function Viewer360({ colors, visibleParts, bodyMaterial, telingaMaterial }) {
  const [frame, setFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const TOTAL_FRAMES = 16; // Asumsi ada 16 gambar di dalam 1 sprite memanjang
  const SENSITIVITY = 15; // Semakin kecil angka ini, semakin cepat putarannya

  // Fungsi menangkap pergerakan Mouse / Touchscreen
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const diffX = currentX - startX;

    if (Math.abs(diffX) > SENSITIVITY) {
      const frameChange = diffX > 0 ? 1 : -1;
      let newFrame = frame + frameChange;

      // Agar putarannya tidak mentok (menyambung dari awal ke akhir)
      if (newFrame >= TOTAL_FRAMES) newFrame = 0;
      if (newFrame < 0) newFrame = TOTAL_FRAMES - 1;

      setFrame(newFrame);
      setStartX(currentX); // Reset titik mulai
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const texBody = bodyMaterial === "leather" ? "leather" : "Base";
  const texPenutup = telingaMaterial === "leather" ? "leather" : "Base";
  const isPenutupVisible = visibleParts?.telinga ?? true;

  return (
    <div 
      className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10 cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      // Khusus untuk mobile:
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Teks Instruksi */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] text-[11px] font-bold text-gray-500 bg-white/80 px-4 py-1.5 rounded-full shadow-sm pointer-events-none tracking-widest uppercase">
        Geser Kiri/Kanan
      </div>

      {/* 1. Badan Utama (z-10) */}
      <div className="absolute inset-0 z-20">
        <TasMiniSpritePart folder="360" partName="body" color={colors.badan} isVisible={true} textureType={texBody} currentFrame={frame} totalFrames={TOTAL_FRAMES} />
      </div>

      {/* 2. Trim Pinggiran (z-20) -> Dari screenshot, namanya Mask-trim.png */}
      <div className="absolute inset-0 z-10">
        <TasMiniSpritePart folder="360" partName="trim" color={colors.tali} isVisible={true} currentFrame={frame} totalFrames={TOTAL_FRAMES} />
      </div>

      {/* 3. Penutup (z-30) */}
      <div className="absolute inset-0 z-20">
        <TasMiniSpritePart folder="360" partName="penutup" color={colors.telinga} isVisible={isPenutupVisible} textureType={texPenutup} currentFrame={frame} totalFrames={TOTAL_FRAMES} />
      </div>

      {/* 4. Tali Statis (z-40) */}
            <div className="absolute inset-0 z-10">
      <StaticSpriteOverlay folder="360" fileName="Base-tali.png" zIndex="z-40" currentFrame={frame} totalFrames={TOTAL_FRAMES} />
</div>

      {/* 5. Kancing Statis (z-50) */}
      <div className="absolute inset-0 z-10">
      <StaticSpriteOverlay folder="360" fileName="Base-kancing.png" zIndex="z-50" currentFrame={frame} totalFrames={TOTAL_FRAMES} />
</div>
    </div>
  );
}