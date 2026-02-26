"use client";

// KOMPONEN PEMBANTU: Menambahkan parameter "texture"
function DynamicPart({ folder, part, color, isVisible, texture = "base", ext = "png" }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url('/assets/TasKelalawar/${folder}/${part}-mask.${ext}')`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url('/assets/TasKelalawar/${folder}/${part}-mask.${ext}')`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      >
        {/* URL Tekstur sekarang dinamis mengambil nilai dari props 'texture' */}
        <img
          src={`/assets/TasKelalawar/${folder}/${part}-${texture}-grayscale.${ext}`}
          alt={`${part} texture`}
          className="w-full h-full object-contain mix-blend-multiply opacity-80"
        />
      </div>
    </div>
  );
}

// --- VIEWER KHUSUS DEPAN ---
// Tangkap props bodyMaterial
export function FrontViewer({ colors, visibleParts, bodyMaterial }) {
  const ext = "png"; 

  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute inset-0 z-10"><DynamicPart folder="Front" part="tali" color={colors.tali} isVisible={true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Front" part="telinga" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Front" part="sayap" color={colors.sayap} isVisible={visibleParts?.sayap ?? true} ext={ext} /></div>
      
      {/* Kirim bodyMaterial khusus untuk Badan */}
      <div className="absolute inset-0 z-30">
        <DynamicPart folder="Front" part="body" color={colors.badan} isVisible={true} texture={bodyMaterial} ext={ext} />
      </div>

      {(visibleParts?.detail ?? true) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <img src={`/assets/TasKelalawar/Front/mata.${ext}`} className="absolute w-full h-full object-contain" alt="Mata" />
          <img src={`/assets/TasKelalawar/Front/gigi.${ext}`} className="absolute w-full h-full object-contain" alt="Gigi" />
        </div>
      )}
    </div>
  );
}

// --- VIEWER KHUSUS BELAKANG ---
export function BackViewer({ colors, visibleParts, bodyMaterial }) {
  const ext = "png"; 
  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute inset-0 z-10"><DynamicPart folder="Back" part="tali" color={colors.tali} isVisible={true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Back" part="telinga" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Back" part="sayap" color={colors.sayap} isVisible={visibleParts?.sayap ?? true} ext={ext} /></div>
      <div className="absolute inset-0 z-30"><DynamicPart folder="Back" part="body" color={colors.badan} isVisible={true} texture={bodyMaterial} ext={ext} /></div>
    </div>
  );
}

// --- VIEWER KHUSUS ATAS ---
export function TopViewer({ colors, visibleParts, bodyMaterial }) {
  const ext = "png"; 
  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative flex items-center justify-center p-10">
      <div className="absolute inset-0 z-10"><DynamicPart folder="Top" part="tali" color={colors.tali} isVisible={true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Top" part="telinga" color={colors.telinga} isVisible={visibleParts?.telinga ?? true} ext={ext} /></div>
      <div className="absolute inset-0 z-20"><DynamicPart folder="Top" part="sayap" color={colors.sayap} isVisible={visibleParts?.sayap ?? true} ext={ext} /></div>
      <div className="absolute inset-0 z-30"><DynamicPart folder="Top" part="body" color={colors.badan} isVisible={true} texture={bodyMaterial} ext={ext} /></div>
    </div>
  );
}