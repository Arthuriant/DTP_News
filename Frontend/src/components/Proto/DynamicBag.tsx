import Image from 'next/image';

interface DynamicBagProps {
  color: string;
}

export default function DynamicBag({ color }: DynamicBagProps) {
  return (
    <div className="relative w-80 h-80">
      {/* Base Image (Grayscale + Mata/Gigi utuh) */}
      <Image
        src="/base-grayscale.png" // Pastikan file ini ada di folder /public
        alt="Bag Base"
        fill
        className="object-contain z-10"
        priority
      />

      {/* Color Masking Layer */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-colors duration-300"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          WebkitMaskImage: 'url(/mask.png)', // Pastikan file ini ada di folder /public
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: 'url(/mask.png)',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}