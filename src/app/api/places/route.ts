import { NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlacesResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    name: string;
  }>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const filterType = searchParams.get("filter") || "all"; // "all", "documentation" ou "health"

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Parâmetros 'lat' e 'lng' são obrigatórios." },
      { status: 400 }
    );
  }

  // Palavras-chave para estabelecimentos de documentação
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

  // Palavras-chave para estabelecimentos de saúde
  const allowedHealthKeywords = [
    "hospital",
    "clinica",
    "posto de saúde",
    "centro de saúde",
    "ubs",
  ];

  // Seleciona a lista de palavras-chave com base no filtro
  let allowedKeywords: string[] = [];
  if (filterType === "documentation") {
    allowedKeywords = allowedDocumentationKeywords;
  } else if (filterType === "health") {
    allowedKeywords = allowedHealthKeywords;
  } else {
    // all: junta ambas as listas
    allowedKeywords = [...allowedDocumentationKeywords, ...allowedHealthKeywords];
  }

  const excludedKeywords = ["psicolog", "sefaz"];

  try {
    // Faz uma requisição para cada palavra-chave
    const requests = allowedKeywords.map((keyword) =>
      axios.get<PlacesResponse>(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=establishment&keyword=${encodeURIComponent(
          keyword
        )}&key=${GOOGLE_PLACES_API_KEY}`
      )
    );

    // Executa todas as requisições em paralelo
    const responses = await Promise.all(requests);

    // Mescla todos os resultados em um único array
    let mergedResults: Array<{ geometry: { location: { lat: number; lng: number } }; name: string }> = [];
    responses.forEach((res) => {
      mergedResults = mergedResults.concat(res.data.results);
    });

    // Remove duplicatas com base no nome
    const uniqueResults = mergedResults.filter((result, index, self) =>
      index === self.findIndex((r) => r.name === result.name)
    );

    // Filtra os resultados para manter somente os permitidos e remover os excluídos
    const filteredResults = uniqueResults.filter((result) => {
      const nameLower = result.name.toLowerCase();
      const containsAllowed = allowedKeywords.some((keyword) =>
        nameLower.includes(keyword)
      );
      const containsExcluded = excludedKeywords.some((keyword) =>
        nameLower.includes(keyword)
      );
      return containsAllowed && !containsExcluded;
    });

    if (filteredResults.length === 0) {
      console.warn("Filtragem retornou vazio. Retornando resultados originais.");
      return NextResponse.json(uniqueResults, { status: 200 });
    }

    return NextResponse.json(filteredResults, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Places:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Erro ao buscar locais.", details: error.message },
      { status: 500 }
    );
  }
}
