import Image from 'next/image';

interface TextureOnlyPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  texture: string;
  textureImageUrl?: string; // ← tambah ini
  zIndex: number;
}

export default function TextureOnlyPart({ 
  productId, 
  pov, 
  partName, 
  texture,
  textureImageUrl, // ← tambah ini
  zIndex 
}: TextureOnlyPartProps) {

  if (!textureImageUrl) return null; // ← jangan render kalau kosong

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      <Image
        src={textureImageUrl}
        alt={`${partName} ${texture}`}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}