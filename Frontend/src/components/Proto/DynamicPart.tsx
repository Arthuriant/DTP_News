import Image from 'next/image';

// Tambahkan productId ke interface
interface DynamicPartProps {
  productId: string; 
  pov: string;
  partName: string; 
  color: string;
  texture: string; 
  zIndex: number;
}

// Pastikan ada kata 'export default'
export default function DynamicPart({ productId, pov, partName, color, texture, zIndex }: DynamicPartProps) {
  const basePath = `/assets/products/${productId}/${pov.toLowerCase()}`;

  return (
    <div className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      <Image
        src={`${basePath}/${partName}-${texture}-base.png`}
        alt={`${partName} Base`}
        fill
        className="object-contain"
        priority
      />

      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500 ease-in-out"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          WebkitMaskImage: `url(${basePath}/${partName}-mask.png)`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${basePath}/${partName}-mask.png)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}