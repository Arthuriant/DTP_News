"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={position} icon={customIcon} />;
}

// Komponen Utama yang akan diekspor
export default function MapPicker({ position, setPosition }: MapPickerProps) {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}