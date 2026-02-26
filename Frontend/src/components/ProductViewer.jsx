"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

// Tangkap props bodyMaterial
function Model360({ colors, visibleParts, bodyMaterial, ...props }) {
  const { nodes } = useGLTF('/models/bat_bag.glb');
  const showTelinga = visibleParts?.telinga ?? true;
  const showSayap = visibleParts?.sayap ?? true;
  const showDetail = visibleParts?.detail ?? true;

  // Jika material leather, buat lebih mengkilap. Jika solid/base, buat lebih doff (kasar).
  const bodyRoughness = bodyMaterial === "leather" ? 0.3 : 0.8;
  const bodyMetalness = bodyMaterial === "leather" ? 0.2 : 0;

  return (
    <group {...props} dispose={null} rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={nodes.Obj_Badan.geometry} castShadow receiveShadow>
        {/* Terapkan sifat kilapan material di sini */}
        <meshStandardMaterial color={colors.badan} roughness={bodyRoughness} metalness={bodyMetalness} />
      </mesh>
      
      <mesh geometry={nodes.Obj_Tali.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={colors.tali} roughness={0.9} />
      </mesh>
      
      {showTelinga && (
        <mesh geometry={nodes.Obj_Telinga.geometry} castShadow receiveShadow>
          <meshStandardMaterial color={colors.telinga} roughness={0.8} />
        </mesh>
      )}
      {showSayap && (
        <mesh geometry={nodes.Obj_Sayap.geometry} castShadow receiveShadow>
          <meshStandardMaterial color={colors.sayap} roughness={0.8} />
        </mesh>
      )}
      {showDetail && (
        <mesh geometry={nodes.Obj_Detail.geometry} castShadow receiveShadow>
          <meshStandardMaterial color={colors.detail} roughness={0.5} metalness={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Tangkap props di komponen utama
export default function ProductViewer({ colors, visibleParts, bodyMaterial }) {
  return (
    <div className="w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing relative">
      <Canvas shadows camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            {/* Kirim ke Model360 */}
            <Model360 colors={colors} visibleParts={visibleParts} bodyMaterial={bodyMaterial} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI/1.8} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/bat_bag.glb');