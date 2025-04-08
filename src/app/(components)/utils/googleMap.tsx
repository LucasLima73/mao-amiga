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
const MAP_HEIGHT_PX = 1000;

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
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
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

// Constantes com as palavras-chave para cada categoria
const allowedDocumentationKeywords = [
  "policia federal",
  "polícia federal",
  "poupatempo",
  "receita federal",
  "banco do brasil",
  "caixa econômica federal",
  "bradesco",
  "itaú",
  "santander",
  "cras",
];

const allowedHealthKeywords = [
  "hospital",
  "clinica",
  "posto de saúde",
  "centro de saúde",
  "ubs",
];

// Função que retorna uma descrição para cada local com base no nome
const getDocumentsForPlace = (name: string): string => {
  const lower = name.toLowerCase();
  if (allowedDocumentationKeywords.some((keyword) => lower.includes(keyword))) {
    if (lower.includes("polícia federal") || lower.includes("policia federal")) {
      return "Realiza a regularização documental (CRNM e DPRNM) para facilitar o acesso aos direitos de imigrantes e refugiados.";
    } else if (lower.includes("poupatempo")) {
      return "Oferece serviços integrados para obtenção de documentos essenciais, como CPF e CTPS, contribuindo para a integração no país.";
    } else if (lower.includes("receita federal")) {
      return "Auxilia na regularização fiscal e no processamento de documentos junto à Receita Federal.";
    } else if (lower.includes("banco do brasil")) {
      return "Fornece serviços bancários que promovem a inclusão financeira de imigrantes e refugiados.";
    } else if (lower.includes("caixa econômica federal")) {
      return "Dispõe de serviços bancários e programas habitacionais para apoiar a estabilidade social e financeira.";
    } else if (lower.includes("bradesco")) {
      return "Oferece soluções financeiras que ajudam na organização e inclusão econômica.";
    } else if (lower.includes("itaú")) {
      return "Disponibiliza uma variedade de serviços financeiros para facilitar a integração econômica.";
    } else if (lower.includes("santander")) {
      return "Presta serviços bancários com foco na inclusão e apoio financeiro.";
    } else if (lower.includes("cras")) {
      return "Centros de Referência de Assistência Social que fornecem suporte e orientação para famílias em situação de vulnerabilidade.";
    } else {
      return "Oferece diversos serviços relacionados à documentação e regularização.";
    }
  }
  if (allowedHealthKeywords.some((keyword) => lower.includes(keyword))) {
    if (lower.includes("hospital")) {
      return "Presta atendimento hospitalar de emergência e cuidados médicos essenciais.";
    } else if (lower.includes("clinica")) {
      return "Oferece atendimento clínico e especializado com enfoque no cuidado humanizado.";
    } else if (
      lower.includes("posto de saúde") ||
      lower.includes("centro de saúde") ||
      lower.includes("ubs")
    ) {
      return "Fornece atendimento básico e preventivo, promovendo programas de saúde voltados à integração e bem-estar.";
    } else {
      return "Dispõe de serviços de saúde diversos para atender as necessidades da comunidade.";
    }
  }
  return "Serviços diversos.";
};

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

  // Índice do estabelecimento com InfoWindow aberto ou selecionado
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  // Campo de busca para filtrar estabelecimentos por nome
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro de categoria: "all", "documentation", ou "health"
  const [filterType, setFilterType] = useState("all");

  // Referência ao mapa para forçar o resize
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Tenta obter a geolocalização assim que o componente monta
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setMapCenter({ lat: latitude, lng: longitude });
            setHasUserLocation(true);
            setLocationChecked(true);
            // Busca estabelecimentos com base na localização do usuário e filtro atual
            searchPlaces(latitude, longitude, filterType);
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
    }
  }, []);

  // Recarrega os estabelecimentos quando o filtro mudar, se já tivermos a localização do usuário
  useEffect(() => {
    if (userLocation) {
      searchPlaces(userLocation.lat, userLocation.lng, filterType);
    }
  }, [filterType]);

  // Função para buscar estabelecimentos (rota: /api/places)
  const searchPlaces = async (lat: number, lng: number, filter: string) => {
    try {
      setError(null);
      setDirections(null);
      const url = `/api/places?lat=${lat}&lng=${lng}&filter=${filter}`;
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
      mapped.sort((a, b) => a.distance! - b.distance!);

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
      searchPlaces(lat, lng, filterType);
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

  // Filtra os locais com base no termo de busca digitado
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
      style={{ height: `${MAP_HEIGHT_PX}px` }}
    >
      {/* Painel lateral: Filtros, busca e lista de locais */}
      <div
        className="w-full md:w-2/6 bg-white p-4 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "100%" }}
      >
        {/* Seção de filtros */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Filtros</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filterType === "all"
                  ? "bg-[#f4cb35] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Tudo
            </button>
            <button
              onClick={() => setFilterType("documentation")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filterType === "documentation"
                  ? "bg-[#f4cb35] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Documentação
            </button>
            <button
              onClick={() => setFilterType("health")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filterType === "health"
                  ? "bg-[#f4cb35] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Saúde
            </button>
          </div>
        </div>

        {/* Seção para definir localização via CEP, caso necessário */}
        {locationChecked && !hasUserLocation && (
          <div className="mb-4">
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite seu CEP"
              className="w-full border border-gray-300 p-2 rounded mb-2 text-gray-800"
              maxLength={8}
            />
            <button
              onClick={handleSearchByCep}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Definir Minha Localização
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Seção de busca */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Locais</h2>
          <input
            type="text"
            placeholder="Pesquisar local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-800"
          />
        </div>

        {/* Lista de locais */}
        <div className="space-y-4">
          {filteredLocations.map((loc, index) => (
            <div
              key={index}
              onClick={() => handleClickPlace(loc, index)}
              className={`p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${
                hoveredMarker === index ? "bg-[#f4cb35] text-white" : "bg-white"
              }`}
            >
              <div
                className={`font-bold text-lg mb-1 ${
                  hoveredMarker === index ? "text-white" : "text-gray-900"
                }`}
              >
                {loc.name}
              </div>
              {loc.distance !== undefined && (
                <div
                  className={`text-sm mb-2 ${
                    hoveredMarker === index ? "text-white" : "text-gray-600"
                  }`}
                >
                  <span className="font-medium">Distância:</span>{" "}
                  {loc.distance.toFixed(2)} km
                </div>
              )}
              <button
                className={`underline text-sm ${
                  hoveredMarker === index ? "text-white" : "text-blue-600"
                }`}
              >
                Ver no mapa
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna do mapa */}
      <div className="w-full md:w-5/6 relative">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={["places"]}
        >
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
            onLoad={(map) => setMapRef(map)}
            onTilesLoaded={() => {
              if (mapRef) {
                google.maps.event.trigger(mapRef, "resize");
              }
            }}
          >
            {/* Marcador para a localização do usuário com ícone customizado e label */}
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

            {filteredLocations.map((location, idx) => (
              <Marker
                key={idx}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => handleClickPlace(location, idx)}
              >
                {hoveredMarker === idx && (
                  <InfoWindow onCloseClick={() => setHoveredMarker(null)}>
                    <div className="text-gray-900">
                      <h4 className="font-bold mb-1">{location.name}</h4>
                      {location.distance !== undefined && (
                        <p className="text-sm mb-2">
                          <strong>Distância:</strong> {location.distance.toFixed(2)} km
                        </p>
                      )}
                      <p className="text-sm mb-2">
                        <strong>Descrição:</strong>{" "}
                        {getDocumentsForPlace(location.name)}
                      </p>
                      <a
                        href={buildGoogleMapsRouteUrl(location)}
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

            {/* Exibe a rota no mapa se a posição do usuário for diferente do local clicado */}
            {userLocation &&
              (userLocation.lat !== mapCenter.lat ||
                userLocation.lng !== mapCenter.lng) && (
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
