import React from 'react';

interface StaticSpritePartProps {
  imageUrl: string;
  zIndex: number;
  currentFrame: number;
  totalFrames: number;
}

export default function StaticSpritePart({ imageUrl, zIndex, currentFrame, totalFrames }: StaticSpritePartProps) {
  const xPos = totalFrames > 1 ? (currentFrame / (totalFrames - 1)) * 100 : 0;

  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        zIndex,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${totalFrames * 100}% auto`, 
        backgroundPosition: `${xPos}% center`,
        backgroundRepeat: 'no-repeat',
        transform: 'translateZ(0)',
        willChange: 'background-position',
      }}
    />
  );
}