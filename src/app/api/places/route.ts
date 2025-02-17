import { NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Definir o formato esperado da resposta do Google Geocoding API
interface GeocodeResponse {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
}

// Definir o formato esperado da resposta do Google Places API
interface PlacesResponse {
    results: {
        name: string;
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cep = searchParams.get("cep");

    console.log("🔍 Requisição recebida para o CEP:", cep);

    if (!cep) {
        console.error("❌ Erro: CEP não fornecido.");
        return NextResponse.json({ error: "CEP não fornecido." }, { status: 400 });
    }

    try {
        console.log("📡 Buscando localização no Google Geocoding API...");
        const geoResponse = await axios.get<GeocodeResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${cep},Brazil&key=${GOOGLE_PLACES_API_KEY}`
        );

        console.log("📍 Resposta do Google Geocoding API:", JSON.stringify(geoResponse.data, null, 2));

        if (!geoResponse.data.results.length) {
            console.error("❌ Erro: Nenhuma localização encontrada para o CEP.");
            return NextResponse.json({ error: "Nenhuma localização encontrada." }, { status: 404 });
        }

        const { lat, lng } = geoResponse.data.results[0].geometry.location;
        console.log(`✅ Localização encontrada: LAT ${lat}, LNG ${lng}`);

        console.log("📡 Buscando estabelecimentos próximos no Google Places API...");
        const placesResponse = await axios.get<PlacesResponse>(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${GOOGLE_PLACES_API_KEY}`
        );

        console.log("🏥 Estabelecimentos encontrados:", JSON.stringify(placesResponse.data, null, 2));

        return NextResponse.json(placesResponse.data.results, { status: 200 });

    } catch (error: unknown) {
        // Verifica se o erro é uma instância de AxiosError
        if (error instanceof Error && "isAxiosError" in error) {
            const axiosError = error as any; // Forçamos o tipo para acessar AxiosError
            console.error("❌ Erro no backend:", axiosError.response?.data || axiosError.message);
            return NextResponse.json({
                error: "Erro ao buscar locais.",
                details: axiosError.response?.data || axiosError.message
            }, { status: 500 });
        }

        // Se for um erro genérico do JavaScript
        if (error instanceof Error) {
            console.error("❌ Erro inesperado:", error.message);
            return NextResponse.json({
                error: "Erro inesperado no servidor.",
                details: error.message
            }, { status: 500 });
        }

        // Captura um erro desconhecido
        console.error("❌ Erro desconhecido:", error);
        return NextResponse.json({ error: "Erro desconhecido no servidor." }, { status: 500 });
    }



}
