import Image from 'next/image';

interface DynamicPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  color: string;
  texture: string;
  textureImageUrl?: string; 
  maskImageUrl?: string;  
  zIndex: number;
}

export default function DynamicPart({ 
  productId, 
  pov, 
  partName, 
  color, 
  texture, 
  textureImageUrl, 
  maskImageUrl, 
  zIndex 
}: DynamicPartProps) {

  // Jangan render kalau URL gambar dasar kosong
  if (!textureImageUrl) return null;

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      
      {/* 1. Gambar Dasar (Base) */}
      <Image
        src={textureImageUrl}
        alt={`${partName} ${pov}`}
        fill
        className="object-contain"
        priority
      />

      {/* 2. Masking untuk Pewarnaan */}
      {/* Layer ini hanya muncul jika warna bukan putih dan ada gambar mask */}
      {maskImageUrl && color && color !== "#FFFFFF" && (
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500 ease-in-out mix-blend-multiply"
          style={{
            backgroundColor: color,
            maskImage: `url('${maskImageUrl}')`,
            WebkitMaskImage: `url('${maskImageUrl}')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      )}
      
    </div>
  );
}