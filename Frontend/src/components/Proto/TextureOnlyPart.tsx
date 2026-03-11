import Image from 'next/image';

interface TextureOnlyPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  texture: string; 
  zIndex: number;
}

export default function TextureOnlyPart({ 
  productId, 
  pov, 
  partName, 
  texture, 
  zIndex 
}: TextureOnlyPartProps) {
  const basePath = `/assets/products/${productId}/${pov.toLowerCase()}`;

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      <Image
        src={`${basePath}/${partName}-${texture}.png`}
        alt={`${partName} ${texture}`}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}