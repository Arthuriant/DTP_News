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
export function FrontViewer({ colors, visibleParts, bodyMaterial, telingaMaterial }) {
  // Memisahkan penangkap material (Badan bisa beda material dengan Penutup)
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";
  
  // Jika kode mu sebelumnya belum mengirimkan telingaMaterial, kita pasang fallback ke 'Base'
  const texPenutup = telingaMaterial === "leather" ? "leather" : "Base";

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
        <TasMiniPart folder="Base" partName="trim-penutup" color={colors.tali} isVisible={visibleParts?.telinga ?? true} />
      </div>

      {/* 5. Kancing Statis (z-50) */}
      <StaticOverlay folder="Base" fileName="Base-kancing.png" zIndex="z-50" />
      
    </div>
  );
}

// ==========================================
// 3. VIEWER BELAKANG (Folder: Back)
// ==========================================
export function BackViewer({ colors, visibleParts, bodyMaterial, telingaMaterial }) {
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";
  const texPenutup = telingaMaterial === "leather" ? "leather" : "Base";

  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute inset-0 z-10">
        <TasMiniPart folder="Back" partName="body" color={colors.badan} isVisible={true} textureType={texBody} />
      </div>
      <div className="absolute inset-0 z-20">
        <TasMiniPart folder="Back" partName="penutup" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} textureType={texPenutup} />
      </div>
      <StaticOverlay folder="Back" fileName="Base-tali.png" zIndex="z-30" />
      <StaticOverlay folder="Back" fileName="Base-kancing.png" zIndex="z-40" />
    </div>
  );
}

// ==========================================
// 4. VIEWER ATAS (Folder: Top)
// ==========================================
export function TopViewer({ colors, visibleParts, bodyMaterial }) {
  const texBody = bodyMaterial === "leather" ? "leather" : "Base";

  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute inset-0 z-10">
        <TasMiniPart folder="Top" partName="body" color={colors.badan} isVisible={true} textureType={texBody} />
      </div>
      <StaticOverlay folder="Top" fileName="Base-tali.png" zIndex="z-20" />
      <StaticOverlay folder="Top" fileName="Base-kancing.png" zIndex="z-30" />
    </div>
  );
}