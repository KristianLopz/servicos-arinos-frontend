import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import {
  addFavorite,
  checkFavorite,
  removeFavoriteByDestination,
  type FavoriteItem,
} from "../services/favoriteService";

interface Destino {
  id: number;
  nome: string;
  pais: string;
  estado: string;
  custoMedio: number;
  imagem: string;
  clima: string;
  melhorEpoca: string;
  descricao: string;
  pontosTuristicos: string[];
}

interface ApiDestino {
  id: number;
  name: string;
  country: string;
  state: string;
  estimated_cost: number | string;
  image_url: string;
  climate: string;
  best_season: string;
  description: string;
  tourist_spots: string[];
}

interface ApiResponse {
  destination: ApiDestino;
  incomplete: boolean;
}

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function lerOrcamentoSalvo() {
  try {
    const storage = localStorage.getItem("travelbuddy_orcamento");
    if (!storage) return null;
    const dados = JSON.parse(storage);

    return {
      valor: dados?.valor ? Number(dados.valor) : null,
      dias: dados?.dias ? Number(dados.dias) : null,
      pessoas: dados?.pessoas ? Number(dados.pessoas) : null,
    };
  } catch {
    return null;
  }
}

export default function DetalhesDestino() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [destino, setDestino] = useState<Destino | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [incomplete, setIncomplete] = useState(false);
  const [favoritando, setFavoritando] = useState(false);
  const [favorite, setFavorite] = useState<FavoriteItem | null>(null);
  const [feedback, setFeedback] = useState("");

  const orcamentoSalvo = useMemo(() => lerOrcamentoSalvo(), [feedback]);

  useEffect(() => {
    async function carregarDestino() {
      try {
        setLoading(true);
        setErro("");
        setFeedback("");

        const token = localStorage.getItem("token") || "";

        const response = await api(`/destinations/${id}`, {
          method: "GET",
          token,
        });

        const data: ApiResponse = await response.json();

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (response.status === 404) {
          setErro("Destino não encontrado.");
          return;
        }

        if (!response.ok) {
          setErro("Erro ao carregar destino.");
          return;
        }

        setIncomplete(data.incomplete);

        setDestino({
          id: data.destination.id,
          nome: data.destination.name,
          pais: data.destination.country,
          estado: data.destination.state,
          custoMedio: Number(data.destination.estimated_cost),
          imagem: data.destination.image_url || "/destinations/rio-de-janeiro.png",
          clima: data.destination.climate || "Não informado",
          melhorEpoca: data.destination.best_season || "Não informada",
          descricao: data.destination.description || "Descrição não disponível.",
          pontosTuristicos: Array.isArray(data.destination.tourist_spots)
            ? data.destination.tourist_spots
            : [],
        });

        const status = await checkFavorite(token, Number(id));
        setFavorite(status.favorite);
      } catch (error) {
        console.error(error);
        setErro("Erro ao conectar ao servidor.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarDestino();
    }
  }, [id, navigate]);

  async function handleToggleFavorito() {
    if (!destino) return;

    try {
      setFavoritando(true);
      setFeedback("");

      const token = localStorage.getItem("token") || "";

      if (favorite) {
        await removeFavoriteByDestination(token, destino.id);
        setFavorite(null);
        setFeedback("Viagem removida dos favoritos.");
        return;
      }

      const budgetData = lerOrcamentoSalvo();
      const data = await addFavorite(token, {
        destination_id: destino.id,
        notes: "Favoritado pela tela de detalhes do destino.",
        budget_value: budgetData?.valor || destino.custoMedio,
        budget_days: budgetData?.dias || 1,
        budget_people: budgetData?.pessoas || 1,
      });

      setFavorite(data.favorite);
      setFeedback(data.message || "Viagem adicionada aos favoritos!");
    } catch (error) {
      console.error(error);
      setFeedback(error instanceof Error ? error.message : "Erro ao atualizar favorito.");
    } finally {
      setFavoritando(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700">Carregando destino...</h2>
        </div>
      </MainLayout>
    );
  }

  if (erro || !destino) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-gray-50">
          <h2 className="text-xl text-red-600">{erro}</h2>

          <button
            onClick={() => navigate("/destinos")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Voltar
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 text-gray-600 hover:text-indigo-600 font-semibold"
          >
            ← Voltar
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src={destino.imagem}
                alt={destino.nome}
                className="w-full h-72 sm:h-96 object-cover"
              />

              <button
                onClick={handleToggleFavorito}
                disabled={favoritando}
                className={`absolute top-4 right-4 h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-105 disabled:opacity-60 ${
                  favorite
                    ? "bg-red-500 text-white"
                    : "bg-white text-indigo-600 hover:bg-indigo-50"
                }`}
                title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {favoritando ? "…" : favorite ? "♥" : "♡"}
              </button>
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Detalhes do destino
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    {destino.nome}
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600">
                    {destino.estado}, {destino.pais}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <span className="block text-sm text-gray-500">Custo médio por pessoa</span>
                  <strong className="text-3xl font-extrabold text-indigo-600">
                    {moeda(destino.custoMedio)}
                  </strong>
                </div>
              </div>

              {feedback && (
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-xl mb-6">
                  {feedback}
                </div>
              )}

              {orcamentoSalvo?.valor && (
                <div className="bg-green-50 border border-green-100 text-green-800 p-4 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>
                    Seu orçamento salvo: <strong>{moeda(orcamentoSalvo.valor)}</strong>
                    {orcamentoSalvo.dias ? ` • ${orcamentoSalvo.dias} dia(s)` : ""}
                    {orcamentoSalvo.pessoas ? ` • ${orcamentoSalvo.pessoas} pessoa(s)` : ""}
                  </span>
                  <span className="text-sm">Ao favoritar, esses dados ficam ligados à viagem.</span>
                </div>
              )}

              {incomplete && (
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-6">
                  Algumas informações deste destino ainda estão sendo atualizadas.
                </div>
              )}

              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {destino.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-1">Clima</h3>
                  <p className="text-gray-700">{destino.clima}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h3 className="font-bold text-gray-800 mb-1">Melhor época</h3>
                  <p className="text-gray-700">{destino.melhorEpoca}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Pontos turísticos</h2>

                {destino.pontosTuristicos.length === 0 ? (
                  <p className="text-gray-500">Nenhum ponto turístico cadastrado.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {destino.pontosTuristicos.map((ponto, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl"
                      >
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>{ponto}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/roteiro/${destino.id}`)}
                  className="bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all hover:-translate-y-0.5 font-bold"
                >
                  Gerar roteiro
                </button>

                <button
                  onClick={handleToggleFavorito}
                  disabled={favoritando}
                  className={`border-2 py-4 rounded-xl transition-all hover:-translate-y-0.5 font-bold disabled:opacity-60 ${
                    favorite
                      ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {favoritando
                    ? "Atualizando..."
                    : favorite
                      ? "♥ Remover dos favoritos"
                      : "♡ Marcar como favorita"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
