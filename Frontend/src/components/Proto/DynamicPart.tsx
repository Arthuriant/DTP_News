import Image from 'next/image';

interface DynamicPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  color: string;
  texture: string;
  textureImageUrl?: string; // ← URL gambar dari API
  zIndex: number;
}

export default function DynamicPart({ productId, pov, partName, color, texture, textureImageUrl, zIndex }: DynamicPartProps) {

  // Jangan render kalau URL kosong
  if (!textureImageUrl) return null;

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      <Image
        src={textureImageUrl}
        alt={`${partName} ${pov}`}
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
        }}
      />
    </div>
  );
}