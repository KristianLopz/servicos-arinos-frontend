import { api } from "./api";

export async function generateItinerary(token: string, payload: {
  destination_id: number;
  duration_days: number;
  budget?: number;
  num_people?: number;
}) {
  const response = await api("/itinerary/generate", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao gerar roteiro.");
  }

  return data;
}

export async function listItineraries(token: string) {
  const response = await api("/itinerary", {
    method: "GET",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao listar roteiros.");
  }

  return data;
}

export async function getLatestItineraryByDestination(token: string, destinationId: number) {
  const response = await api(`/itinerary/destination/${destinationId}`, {
    method: "GET",
    token,
  });

  const data = await response.json();

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar roteiro salvo.");
  }

  return data;
}
