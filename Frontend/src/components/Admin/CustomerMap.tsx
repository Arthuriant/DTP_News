"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Ikon Leaflet
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function CustomerMap({ customers, onSelectCustomer }: any) {
  const center: [number, number] = [-2.5489, 118.0149];

  return (
    <>
      {/* 👇 IMPORT CSS LEAFLET VIA CDN AGAR PETA FULL SCREEN 👇 */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        
        {customers.map((customer: any) => {
          const validAddress = customer.addresses?.find((a: any) => a.latitude && a.longitude);
          if (!validAddress) return null;

          return (
            <Marker
              key={customer.id}
              position={[parseFloat(validAddress.latitude), parseFloat(validAddress.longitude)]}
              icon={customIcon}
              eventHandlers={{ click: () => onSelectCustomer(customer, validAddress) }}
            >
              <Popup>
                <span className="font-bold text-slate-700">{customer.name}</span><br />
                <span className="text-xs text-slate-500">{validAddress.region.split(',')[1]}</span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}