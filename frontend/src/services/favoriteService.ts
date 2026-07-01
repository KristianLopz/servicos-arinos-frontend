import { api } from "./api";

export interface FavoriteDestination {
  id: number;
  name: string;
  country: string;
  state?: string | null;
  estimated_cost: number | string;
  image_url?: string | null;
  climate?: string | null;
  best_season?: string | null;
}

export interface FavoriteItem {
  id: number;
  notes?: string | null;
  budget_value?: number | string | null;
  budget_days?: number | null;
  budget_people?: number | null;
  createdAt?: string;
  updatedAt?: string;
  Destination: FavoriteDestination;
}

export interface AddFavoritePayload {
  destination_id: number;
  notes?: string;
  budget_value?: number | null;
  budget_days?: number | null;
  budget_people?: number | null;
}

export async function listFavorites(token: string) {
  const response = await api("/favorites", {
    method: "GET",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao listar favoritos.");
  }

  return data as { total: number; favorites: FavoriteItem[] };
}

export async function addFavorite(token: string, payload: AddFavoritePayload) {
  const response = await api("/favorites", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao salvar favorito.");
  }

  return data as { message: string; favorite: FavoriteItem; already_favorite?: boolean };
}

export async function checkFavorite(token: string, destinationId: number) {
  const response = await api(`/favorites/check/${destinationId}`, {
    method: "GET",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao verificar favorito.");
  }

  return data as { favorited: boolean; favorite: FavoriteItem | null };
}

export async function removeFavorite(token: string, favoriteId: number) {
  const response = await api(`/favorites/${favoriteId}`, {
    method: "DELETE",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao remover favorito.");
  }

  return data as { message: string };
}

export async function removeFavoriteByDestination(token: string, destinationId: number) {
  const response = await api(`/favorites/destination/${destinationId}`, {
    method: "DELETE",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao remover favorito.");
  }

  return data as { message: string };
}
