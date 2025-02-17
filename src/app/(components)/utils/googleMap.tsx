"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -23.55052, // Padrão: São Paulo
  lng: -46.633308,
};

const GoogleMapComponent: React.FC = () => {
  const [cep, setCep] = useState("");
  const [locations, setLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!cep || cep.length < 8) {
      setError("Por favor, digite um CEP válido.");
      return;
    }

    try {
      setError(null);
      const response = await axios.get(`/api/places?cep=${cep}`);
      const results = response.data as { geometry: { location: { lat: number; lng: number } }; name: string }[];

      if (results.length > 0) {
        const mappedLocations = results.map((loc) => ({
          lat: loc.geometry.location.lat,
          lng: loc.geometry.location.lng,
          name: loc.name,
        }));

        setLocations(mappedLocations);
        setMapCenter(mappedLocations[0]); // Centraliza no primeiro local
      } else {
        setError("Nenhum estabelecimento encontrado para o CEP fornecido.");
      }
    } catch (err) {
      setError("Erro ao buscar locais. Por favor, tente novamente.");
      console.error(err);
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP"
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 15px" }}>
          Buscar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={14}>
          <>
            {locations.map((location, index) => (
              <Marker key={index} position={{ lat: location.lat, lng: location.lng }} />
            ))}
          </>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
