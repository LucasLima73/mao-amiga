"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

// Altura total do contêiner (lista + mapa)
const MAP_HEIGHT_PX = 600;

// Estilo do container do mapa
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  overflow: "hidden",
};

// Posição default (São Paulo)
const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
};

// Função para calcular a distância em km (Fórmula de Haversine)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Raio médio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface Place {
  lat: number;
  lng: number;
  name: string;
  distance?: number; // distância até o usuário (km)
}

// Interface para a resposta do Geocoding do Google
interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

const GoogleMapComponent: React.FC = () => {
  const [cep, setCep] = useState(""); // para quando a geolocalização não for permitida
  const [error, setError] = useState<string | null>(null);

  // Indica se o usuário permitiu a geolocalização
  const [hasUserLocation, setHasUserLocation] = useState(false);
  // Indica se a tentativa de obter geolocalização já foi realizada
  const [locationChecked, setLocationChecked] = useState(false);

  // Localização do usuário
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Centro do mapa
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Lista de estabelecimentos retornados pela API
  const [locations, setLocations] = useState<Place[]>([]);

  // Guarda o resultado do DirectionsService (rota)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Índice do estabelecimento com InfoWindow aberto
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  // Campo de busca para filtrar estabelecimentos
  const [searchTerm, setSearchTerm] = useState("");

  // Referência ao mapa para forçar o resize
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Tenta obter a geolocalização assim que o componente monta
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setHasUserLocation(true);
          setLocationChecked(true);
          // Busca estabelecimentos com base na localização do usuário
          searchPlaces(latitude, longitude);
        },
        (err) => {
          console.warn("Geolocalização negada ou indisponível:", err);
          setHasUserLocation(false);
          setLocationChecked(true);
        }
      );
    } else {
      setLocationChecked(true);
    }
  }, []);

  // Função para buscar estabelecimentos (rota: /api/places)
  const searchPlaces = async (lat: number, lng: number) => {
    try {
      setError(null);
      setDirections(null);
      const url = `/api/places?lat=${lat}&lng=${lng}`;
      const res = await axios.get(url);
      const data = res.data as {
        geometry: { location: { lat: number; lng: number } };
        name: string;
      }[];

      if (!data.length) {
        setLocations([]);
        setError("Nenhum estabelecimento encontrado.");
        return;
      }

      const mapped: Place[] = data.map((item) => {
        const placeLat = item.geometry.location.lat;
        const placeLng = item.geometry.location.lng;
        const distance = haversineDistance(lat, lng, placeLat, placeLng);
        return { lat: placeLat, lng: placeLng, name: item.name, distance };
      });

      // Ordena os estabelecimentos do mais próximo para o mais distante
      mapped.sort((a, b) => (a.distance! - b.distance!));

      setLocations(mapped);
      // Centraliza no primeiro estabelecimento (opcional)
      if (mapped.length > 0) {
        setMapCenter({ lat: mapped[0].lat, lng: mapped[0].lng });
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar estabelecimentos. Tente novamente.");
    }
  };

  // Caso o usuário não permita geolocalização, permite digitar o CEP
  const handleSearchByCep = async () => {
    if (!cep || cep.length < 8) {
      setError("Por favor, digite um CEP válido (8 dígitos).");
      return;
    }
    try {
      setError(null);
      const geoRes = await axios.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cep},Brazil&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      if (!geoRes.data.results.length) {
        setError("Não foi possível encontrar a localização do seu CEP.");
        return;
      }
      const { lat, lng } = geoRes.data.results[0].geometry.location;
      setUserLocation({ lat, lng });
      setMapCenter({ lat, lng });
      setHasUserLocation(true);
      searchPlaces(lat, lng);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar localização via CEP.");
    }
  };

  // Ao clicar em um item da lista ou marcador, centraliza o mapa e exibe o InfoWindow
  const handleClickPlace = (place: Place, index: number) => {
    setMapCenter({ lat: place.lat, lng: place.lng });
    setDirections(null);
    setHoveredMarker(index);
  };

  // Callback do DirectionsService
  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK" && result) {
      setDirections(result);
    } else {
      console.error("Erro ao obter rota:", status);
    }
  };

  // Função para montar a URL do Google Maps para a rota (usando apenas o nome do local como destino)
  const buildGoogleMapsRouteUrl = (place: Place) => {
    if (!userLocation) return "#";
    const userLatLng = `${userLocation.lat},${userLocation.lng}`;
    return (
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${encodeURIComponent(userLatLng)}` +
      `&destination=${encodeURIComponent(place.name)}` +
      `&travelmode=driving`
    );
  };

  // Retorna uma descrição dos documentos atendidos com base no nome do local
  const getDocumentsForPlace = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("polícia federal") || lower.includes("policia federal")) {
      return "Processa CRNM e DPRNM (para imigrantes e refugiados).";
    }
    if (lower.includes("detran")) {
      return "Responsável pela CNH (Carteira Nacional de Habilitação).";
    }
    if (lower.includes("poupatempo")) {
      return "Solicita CPF, CTPS e outros serviços integrados.";
    }
    if (lower.includes("autoescola") || lower.includes("auto escola")) {
      return "Oferece treinamento e suporte para obtenção da CNH.";
    }
    return "Documentos diversos.";
  };

  // Filtra os locais com base no termo de busca
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
      style={{ height: `${MAP_HEIGHT_PX}px` }}
    >
      {/* Coluna da lista */}
      <div className="w-full md:w-1/3 bg-white p-4 overflow-auto">
        {(!hasUserLocation && locationChecked) && (
          <div className="mb-4">
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite seu CEP"
              className="border border-gray-300 p-2 mr-2 rounded text-black placeholder:text-black"
              maxLength={8}
            />
            <button
              onClick={handleSearchByCep}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Definir Minha Localização
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mb-2 text-black">{error}</p>}

        <h4 className="text-lg font-semibold mb-2 text-black">Locais para Documentação</h4>
        <input
          type="text"
          placeholder="Pesquisar local..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 mb-4 rounded w-full text-black placeholder:text-black"
        />
        <ul className="divide-y divide-gray-200">
          {filteredLocations.map((loc, index) => (
            <li
              key={index}
              className="py-3 cursor-pointer hover:bg-gray-100 text-black transition px-2 rounded"
              onClick={() => handleClickPlace(loc, index)}
            >
              <div className="font-bold text-black">{loc.name}</div>
              {loc.distance !== undefined && (
                <div className="text-sm text-black">
                  Distância: {loc.distance.toFixed(2)} km
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Coluna do mapa */}
      <div className="w-full md:w-2/3 relative">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true,
            }}
            // onLoad obtém a referência do mapa
            onLoad={(map) => setMapRef(map)}
            // Quando as tiles são carregadas, força o redimensionamento
            onTilesLoaded={() => {
              if (mapRef) {
                google.maps.event.trigger(mapRef, "resize");
              }
            }}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                }}
              />
            )}

            {filteredLocations.map((location, idx) => (
              <Marker
                key={idx}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => handleClickPlace(location, idx)}
              >
                {hoveredMarker === idx && (
                  <InfoWindow onCloseClick={() => setHoveredMarker(null)}>
                    <div style={{ color: "#000" }}>
                      <h4 style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        {location.name}
                      </h4>
                      <p style={{ marginBottom: "4px" }}>
                        <strong>Documentos atendidos:</strong>{" "}
                        {getDocumentsForPlace(location.name)}
                      </p>
                      {location.distance !== undefined && (
                        <p style={{ marginBottom: "8px" }}>
                          <strong>Distância:</strong> {location.distance.toFixed(2)} km
                        </p>
                      )}
                      <a
                        href={buildGoogleMapsRouteUrl(location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline", color: "#1D4ED8" }}
                      >
                        Ver rotas
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}

            {/* Exibe a rota no mapa se a posição do usuário for diferente do local clicado */}
            {userLocation &&
              (userLocation.lat !== mapCenter.lat || userLocation.lng !== mapCenter.lng) && (
                <DirectionsService
                  options={{
                    origin: userLocation,
                    destination: mapCenter,
                    travelMode: google.maps.TravelMode.DRIVING,
                  }}
                  callback={directionsCallback}
                />
              )}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: { strokeColor: "#ff4757", strokeWeight: 4 },
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
