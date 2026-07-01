import type { Destino } from "../types/Destino";

interface ApiDestino {
  id: number;
  name: string;
  country: string;
  state: string;
  estimated_cost: number;
  image_url: string;
  climate: string;
  best_season: string;
  description: string;
  tourist_spots: string[] | null;
}

export function converterDestino(d: ApiDestino): Destino {
  return {
    id: d.id,
    nome: d.name,
    pais: d.country,
    estado: d.state,
    custoMedio: Number(d.estimated_cost),
    imagem: d.image_url,
    clima: d.climate,
    melhorEpoca: d.best_season,
    descricao: d.description,
    pontosTuristicos: Array.isArray(d.tourist_spots)
      ? d.tourist_spots
      : [],
  };
}