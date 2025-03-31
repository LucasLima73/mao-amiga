"use client";

import React from "react";
import dynamic from "next/dynamic";

// Importa dinamicamente o componente do mapa, sem SSR
const GoogleMapComponent = dynamic(
  () => import("@/app/(components)/utils/googleMap"),
  { ssr: false }
);

const MapPage: React.FC = () => {
  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "url('/assets/images/map-background.png')", // Altere para o background desejado
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-6 mt-[9vh]">
        Mapa de Serviços
      </h2>
      <div className="w-full max-w-6xl bg-white p-4 rounded-md shadow-md">
        <GoogleMapComponent />
      </div>
    </div>
  );
};

export default MapPage;
