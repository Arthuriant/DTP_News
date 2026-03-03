import React from 'react';

// Tambahkan productId ke interface
interface SpritePartProps {
  productId: string;
  partName: string;
  color: string;
  texture: string;
  zIndex: number;
  currentFrame: number;
  totalFrames: number;
}

export default function SpritePart({ productId, partName, color, texture, zIndex, currentFrame, totalFrames }: SpritePartProps) {
  // Arahkan ke path yang dinamis
  const basePath = `/assets/products/${productId}/360`;
  const xPos = totalFrames > 1 ? (currentFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex }}>
      {/* Layer Base Sprite */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${basePath}/${partName}-${texture}-base-sprite.webp)`, // Pastikan nama file Anda sesuai
          backgroundSize: `${totalFrames * 100}% auto`,
          backgroundPosition: `${xPos}% center`,
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)',
          willChange: 'background-position',
        }}
      />

      {/* Layer Masking Sprite */}
      <div
        className="absolute inset-0 transition-colors duration-300 ease-in-out"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          WebkitMaskImage: `url(${basePath}/${partName}-mask-sprite.webp)`, // Pastikan nama file Anda sesuai
          WebkitMaskSize: `${totalFrames * 100}% auto`,
          WebkitMaskPosition: `${xPos}% center`,
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url(${basePath}/${partName}-mask-sprite.webp)`,
          maskSize: `${totalFrames * 100}% auto`,
          maskPosition: `${xPos}% center`,
          maskRepeat: 'no-repeat',
          transform: 'translateZ(0)',
          willChange: 'mask-position, -webkit-mask-position',
        }}
      />
    </div>
  );
}