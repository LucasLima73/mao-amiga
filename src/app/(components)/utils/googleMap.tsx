// src/app/(components)/utils/googleMap.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

// — layout —
const MAP_HEIGHT_PX = 1000;
const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: -23.55052, lng: -46.633308 };

// — tipagens —
interface PlaceApiResponse {
  geometry: { location: { lat: number; lng: number } };
  name: string;
}
interface Place {
  lat: number;
  lng: number;
  name: string;
  distance?: number;
}

// — categorias e descrições —
const DOC_KEYS = [
  "policia federal","polícia federal","poupatempo","receita federal",
  "banco do brasil","caixa econômica federal","bradesco","itaú","santander","cras",
];
const HEALTH_KEYS = [
  "hospital","clinica","posto de saúde","centro de saúde","ubs",
];
const getDocumentsForPlace = (name: string) => {
  const lower = name.toLowerCase();
  if (DOC_KEYS.some(k => lower.includes(k))) return "Serviços de documentação";
  if (HEALTH_KEYS.some(k => lower.includes(k))) return "Serviços de saúde básicos e especializados.";
  return "Serviços diversos";
};

// — distância Haversine —
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

const GoogleMapComponent: React.FC = () => {
  // *** Carrega a lib do Maps apenas UMA vez aqui ***
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // — estados —
  const [cep, setCep] = useState("");
  const [error, setError] = useState<string|null>(null);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }|null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [locations, setLocations] = useState<Place[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<number|null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all"|"documentation"|"health">("all");

  // monta link externo para rotas
  const buildGoogleMapsRouteUrl = (place: Place) => {
    if (!userLocation) return "#";
    const origin = `${userLocation.lat},${userLocation.lng}`;
    return [
      "https://www.google.com/maps/dir/?api=1",
      `origin=${encodeURIComponent(origin)}`,
      `destination=${encodeURIComponent(place.name)}`,
      `travelmode=driving`,
    ].join("&");
  };

  // 1) geolocalização
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationChecked(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
        setHasUserLocation(true);
        setLocationChecked(true);
        loadPlaces(loc.lat, loc.lng, filterType);
      },
      () => setLocationChecked(true)
    );
  }, []);

  // 2) refaz ao trocar filtro
  useEffect(() => {
    if (userLocation) {
      loadPlaces(userLocation.lat, userLocation.lng, filterType);
    }
  }, [filterType]);

  // 3) busca da sua API
  const loadPlaces = async (lat: number, lng: number, filter: string) => {
    try {
      setError(null);
      const res = await axios.get<PlaceApiResponse[]>(
        `/api/places?lat=${lat}&lng=${lng}&filter=${filter}`
      );
      if (!res.data.length) {
        setLocations([]);
        setError("Nenhum estabelecimento encontrado.");
        return;
      }
      const mapped = res.data.map(p => ({
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        name: p.name,
        distance: haversineDistance(lat, lng, p.geometry.location.lat, p.geometry.location.lng),
      }));
      mapped.sort((a,b) => a.distance! - b.distance!);
      setLocations(mapped);
      setMapCenter({ lat: mapped[0].lat, lng: mapped[0].lng });
    } catch {
      setError("Erro ao buscar estabelecimentos.");
    }
  };

  // 4) busca via CEP
  const handleSearchByCep = async () => {
    if (cep.length < 8) {
      setError("Digite um CEP válido (8 dígitos).");
      return;
    }
    try {
      const geo = await axios.get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?address=${cep},Brazil` +
        `&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const loc = geo.data.results[0]?.geometry.location;
      if (!loc) throw new Error();
      setUserLocation(loc);
      setMapCenter(loc);
      setHasUserLocation(true);
      loadPlaces(loc.lat, loc.lng, filterType);
    } catch {
      setError("Não foi possível encontrar seu CEP.");
    }
  };

  // 5) filtro de texto
  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // — loading / erro —
  if (loadError) {
    return <div className="p-4 text-red-600">Erro ao carregar o Google Maps:<br/>{loadError.message}</div>;
  }
  if (!isLoaded) {
    return <div className="p-4 text-center">Carregando mapa…</div>;
  }

  // — render —
  return (
    <div
      className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
      style={{ height: `${MAP_HEIGHT_PX}px` }}
    >
      {/* SIDEBAR */}
      <div className="w-full md:w-2/6 bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Filtros</h2>
        <div className="flex gap-2 mb-4">
          {(["all","documentation","health"] as const).map(type => (
            <button
              key={type}
              onClick={()=>setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filterType===type
                  ? "bg-[#f4cb35] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {type==="all"?"Tudo":type==="documentation"?"Documentação":"Saúde"}
            </button>
          ))}
        </div>

        {locationChecked && !hasUserLocation && (
          <div className="mb-4">
            <input
              value={cep}
              onChange={e=>setCep(e.target.value)}
              placeholder="Digite seu CEP"
              maxLength={8}
              className="w-full border border-gray-300 p-2 rounded mb-2 text-gray-800"
            />
            <button
              onClick={handleSearchByCep}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Usar CEP
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <h2 className="text-xl font-bold mb-2 text-gray-800">Locais</h2>
        <input
          value={searchTerm}
          onChange={e=>setSearchTerm(e.target.value)}
          placeholder="Pesquisar..."
          className="w-full border border-gray-300 p-2 rounded text-gray-800 mb-4"
        />

        <div className="space-y-4">
          {filtered.map((loc, idx)=>(
            <div
              key={idx}
              onClick={()=>setHoveredMarker(idx)}
              className={`p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition ${
                hoveredMarker===idx?"bg-[#f4cb35] text-white":"bg-white"
              }`}
            >
              <h4 className={`font-bold text-lg mb-1 ${
                hoveredMarker===idx?"text-white":"text-gray-900"
              }`}>{loc.name}</h4>
              {loc.distance!==undefined&&(
                <p className={`text-sm mb-2 ${
                  hoveredMarker===idx?"text-white":"text-gray-600"
                }`}>Distância: {loc.distance.toFixed(2)} km</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAPA */}
      <div className="w-full md:w-5/6">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
          onLoad={map => {
            // força redraw ao montar
            google.maps.event.trigger(map, "resize");
          }}
        >
          {/* Usuário */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "/assets/images/localization-realtime.png",
                scaledSize: new google.maps.Size(40, 40),
                labelOrigin: new google.maps.Point(20, -10),
              }}
              label={{
                text: "Você está aqui",
                color: "#000000",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              title="Você está aqui!"
            />
          )}

          {/* Marcadores */}
          {filtered.map((loc, idx)=>(
            <Marker
              key={idx}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={()=>setHoveredMarker(idx)}
            >
              {hoveredMarker===idx && (
                <InfoWindow onCloseClick={()=>setHoveredMarker(null)}>
                  <div className="text-gray-900">
                    <h4 className="font-bold mb-1">{loc.name}</h4>
                    {loc.distance!==undefined && (
                      <p className="text-sm mb-2">
                        <strong>Distância:</strong> {loc.distance.toFixed(2)} km
                      </p>
                    )}
                    <p className="text-sm mb-2">
                      <strong>Descrição:</strong> {getDocumentsForPlace(loc.name)}
                    </p>
                    <a
                      href={buildGoogleMapsRouteUrl(loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600 text-sm"
                    >
                      Ver rotas
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapComponent;