import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/api";

export default function Orcamento() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    valor: "",
    dias: "",
    pessoas: "1",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!formData.valor || Number(formData.valor) <= 0) {
      setError("Informe um valor válido.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";

      const response = await api("/destinations/budget", {
        method: "POST",
        token,
        body: JSON.stringify({
          budget: Number(formData.valor),
          duration_days: formData.dias
            ? Number(formData.dias)
            : null,
          num_people: Number(formData.pessoas),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.status === 422) {
        setError(data.error);
        return;
      }

      if (!response.ok) {
        setError(data.error || "Erro ao salvar orçamento.");
        return;
      }

      localStorage.setItem(
        "travelbuddy_orcamento",
        JSON.stringify({
          valor: Number(formData.valor),
          dias: formData.dias ? Number(formData.dias) : null,
          pessoas: Number(formData.pessoas),
        })
      );

      navigate("/destinos");

    } catch (err) {
      console.error(err);
      setError("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

        <div className="max-w-2xl mx-auto p-6 mt-12">

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Defina seu orçamento
            </h2>

            <p className="text-gray-600 mb-8">
              Vamos encontrar os melhores destinos dentro do seu orçamento.
            </p>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor disponível (R$)
                </label>

                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="5000"
                  min="1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias de viagem
                  </label>

                  <input
                    type="number"
                    value={formData.dias}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dias: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="7"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pessoas
                  </label>

                  <input
                    type="number"
                    value={formData.pessoas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pessoas: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                    min="1"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {loading
                  ? "Salvando..."
                  : "Buscar Destinos"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}