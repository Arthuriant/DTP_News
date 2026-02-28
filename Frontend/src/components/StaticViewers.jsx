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