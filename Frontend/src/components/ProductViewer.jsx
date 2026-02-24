"use client";

// 1. Tambahkan useFrame dan useThree dari fiber
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
// 2. Import library THREE untuk perhitungan matematika posisi kamera
import * as THREE from "three";

// Pengontrol Kamera Pintar dengan Animasi Transisi
function CameraController({ activeView }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  
  // Titik target koordinat tujuan kamera
  const targetPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (activeView === "360") {
      // MODE 360: Kembalikan kendali ke tangan user
      controls.enabled = true;
      controls.minPolarAngle = Math.PI / 2;
      controls.maxPolarAngle = Math.PI / 2;
    } else {
      // MODE GAMBAR STATIS: Kunci kendali user
      controls.enabled = false;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI;

      // Ambil jarak (zoom) kamera saat ini agar ukurannya konsisten
      const distance = Math.max(camera.position.distanceTo(controls.target), 3.5);

      // Tentukan titik tujuan kamera berdasarkan tombol yang ditekan
      if (activeView === "depan") {
        targetPosition.current.set(0, 0, distance);
      } else if (activeView === "belakang") {
        targetPosition.current.set(0, 0, -distance);
      } else if (activeView === "atas") {
        targetPosition.current.set(0, distance, 0.1); // 0.1 wajib agar kamera tidak terbalik
      }
    }
  }, [activeView, camera]);

  // useFrame berjalan setiap detik (60 FPS) untuk menciptakan animasi mulus
  useFrame(() => {
    if (activeView !== "360" && controlsRef.current) {
      // Lerp (Linear Interpolation) menarik kamera ke titik tujuan secara perlahan
      camera.position.lerp(targetPosition.current, 0.05); // Angka 0.05 adalah kecepatan animasi
      camera.lookAt(controlsRef.current.target); // Pastikan kamera tetap menatap tas
    }
  });

  return <OrbitControls ref={controlsRef} makeDefault enableZoom={false} enablePan={false} />;
}

function Model({ badanColor, taliColor, telingaColor, sayapColor, detailColor, ...props }) {
  const { nodes } = useGLTF('/models/bat_bag.glb'); 

  return (
    <group {...props} dispose={null} rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={nodes.Obj_Badan.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={badanColor} roughness={0.8} />
      </mesh>
      <mesh geometry={nodes.Obj_Tali.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={taliColor} roughness={0.9} />
      </mesh>
      <mesh geometry={nodes.Obj_Telinga.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={telingaColor} roughness={0.8} />
      </mesh>
      <mesh geometry={nodes.Obj_Sayap.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={sayapColor} roughness={0.8} />
      </mesh>
      <mesh geometry={nodes.Obj_Detail.geometry} castShadow receiveShadow>
        <meshStandardMaterial color={detailColor} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

export default function ProductViewer({ badanColor, taliColor, telingaColor, sayapColor, detailColor, activeView }) {
  return (
    <div className={`w-full h-[500px] bg-[#f2f2f2] rounded-lg overflow-hidden relative ${activeView === "360" ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}>
      <Canvas shadows camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            <Model 
              badanColor={badanColor} 
              taliColor={taliColor} 
              telingaColor={telingaColor} 
              sayapColor={sayapColor}
              detailColor={detailColor} 
            />
          </Stage>
        </Suspense>

        {/* Pemanggil Kamera Timbuk2 dengan Animasi */}
        <CameraController activeView={activeView} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/bat_bag.glb');