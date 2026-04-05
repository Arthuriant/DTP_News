import Image from 'next/image';

interface DynamicPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  color: string;
  texture: string; 
  zIndex: number;
}

export default function DynamicPart({ productId, pov, partName, color, texture, zIndex }: DynamicPartProps) {
  // POV dipastikan lowercase agar sesuai dengan nama folder (front, back, top, 360)
  const basePath = `/assets/products/${productId}/${pov.toLowerCase()}`;

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      {/* 1. Perbaikan .webo -> .webp
          2. Perbaikan nama file: di folder kamu filenya adalah "partName-texture-base-base.webp"
      */}
      <Image
        src={`${basePath}/${partName}-${texture}-base-base.webp`}
        alt={`${partName} Base`}
        fill
        className="object-contain"
        priority
      />

      {/* Masking untuk pewarnaan */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500 ease-in-out"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          // Ubah .png ke .webp di sini juga jika file mask-nya sudah kamu convert
          WebkitMaskImage: `url(${basePath}/${partName}-mask.webp)`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${basePath}/${partName}-mask.webp)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}