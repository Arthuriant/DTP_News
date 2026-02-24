import React from 'react';

interface SpritePartProps {
  partName: string;
  color: string;
  texture: string;
  zIndex: number;
  currentFrame: number;
  totalFrames: number;
}

export default function SpritePart({ partName, color, texture, zIndex, currentFrame, totalFrames }: SpritePartProps) {
  const basePath = `/assets/TasKelalawar/360`;
  const xPos = totalFrames > 1 ? (currentFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex }}>
      {/* Layer Base Sprite */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${basePath}/${partName}-${texture}-grayscale.png)`,
          // UBAH DI SINI: dari 100% menjadi auto
          backgroundSize: `${totalFrames * 100}% auto`, 
          backgroundPosition: `${xPos}% center`,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Layer Masking Sprite */}
      <div
        className="absolute inset-0 transition-colors duration-300 ease-in-out"
        style={{
          backgroundColor: color,
          mixBlendMode: 'multiply',
          WebkitMaskImage: `url(${basePath}/${partName}-mask.png)`,
          // UBAH DI SINI: dari 100% menjadi auto
          WebkitMaskSize: `${totalFrames * 100}% auto`,
          WebkitMaskPosition: `${xPos}% center`,
          WebkitMaskRepeat: 'no-repeat',
          
          maskImage: `url(${basePath}/${partName}-mask.png)`,
          // UBAH DI SINI JUGA: dari 100% menjadi auto
          maskSize: `${totalFrames * 100}% auto`,
          maskPosition: `${xPos}% center`,
          maskRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}