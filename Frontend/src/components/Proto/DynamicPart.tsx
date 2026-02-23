import Image from 'next/image';

interface DynamicPartProps {
  partName: string; // contoh: 'body', 'telinga', 'tali'
  color: string;
  pov : string;
  zIndex: number;
}

export default function DynamicPart({ pov, partName, color, zIndex }: DynamicPartProps) {
  console.log(partName);
  return (
    // Menggunakan absolute inset-0 agar gambar-gambar ini menumpuk dengan presisi
    <div className="absolute inset-0" style={{ zIndex }}>
      
      {/* Gambar Base Grayscale */}
      <Image
        src={`/assets/TasKelalawar/${pov}/${partName}-base-grayscale.png`}
        alt={`${partName} Base`}
        fill
        className="object-contain"
        priority
      />

      {/* Layer Masking CSS */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          WebkitMaskImage: `url(/assets/TasKelalawar/${pov}/${partName}-mask.png)`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(/assets/TasKelalawar/${pov}/${partName}-mask.png)`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}