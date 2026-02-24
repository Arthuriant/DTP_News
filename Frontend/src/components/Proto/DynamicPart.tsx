import Image from 'next/image';

interface DynamicPartProps {
  pov: string;
  partName: string; 
  color: string;
  texture: string; 
  zIndex: number;
}

export default function DynamicPart({ pov, partName, color, texture, zIndex }: DynamicPartProps) {
  const basePath = `/assets/TasKelalawar/${pov}`;

  return (
    // Trik React: Memberikan 'key={texture}' memaksa komponen me-load ulang animasinya setiap kali material diganti
    <div key={texture} className="absolute inset-0 animate-soft-fade" style={{ zIndex }}>
      
      {/* Gambar Base */}
      <Image
        src={`${basePath}/${partName}-${texture}-grayscale.png`}
        alt={`${partName} Base`}
        fill
        className="object-contain"
        priority
      />

      {/* Layer Masking CSS - Animasi warna diperlambat jadi 500ms agar lebih elegan */}
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