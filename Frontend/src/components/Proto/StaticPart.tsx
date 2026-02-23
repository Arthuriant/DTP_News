import Image from 'next/image';

interface StaticPartProps {
  imageUrl: string; 
  zIndex: number;  
  altText?: string; 
}

export default function StaticPart({ imageUrl, zIndex, altText = "Static Part" }: StaticPartProps) {
  return (
 
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex }}>
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className="object-contain"
        priority 
      />
    </div>
  );
}