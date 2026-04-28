"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// 1. Import AlertService
import { AlertService } from "@/services/AlertService";

// Fix otomatis untuk masalah Ikon bawaan Leaflet di Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

// Sub-komponen untuk menangkap event klik
function LocationMarker({ position, setPosition }: MapPickerProps) {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      
      // 2. Tambahkan feedback visual sederhana saat titik dipilih
      // Kita gunakan notifikasi sukses agar user tahu lokasi sudah terkunci di koordinat tersebut
      AlertService.success("Lokasi Terpilih", "Titik koordinat pengiriman telah diperbarui.");
    },
  });

  return <Marker position={position} icon={customIcon} />;
}

// Komponen Utama yang akan diekspor
export default function MapPicker({ position, setPosition }: MapPickerProps) {
  return (
    <div className="relative w-full h-full group">
      {/* Overlay petunjuk saat hover (Opsional agar lebih premium) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <span className="bg-[#2D1A11]/80 backdrop-blur-md text-[#D9B35A] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-[#D9B35A]/30">
           Klik pada peta untuk menentukan lokasi
         </span>
      </div>

      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} // Disarankan false agar tidak mengganggu scroll halaman
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}