import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks/useAuth";

const destinosDestaque = [
  {
    nome: "Praia do Rosa",
    estado: "SC",
    preco: "R$ 1.400",
    imagem: "/destinations/praia-do-rosa.png",
  },
  {
    nome: "Chapada Diamantina",
    estado: "BA",
    preco: "R$ 1.500",
    imagem: "/destinations/chapada-diamantina.png",
  },
  {
    nome: "Fernando de Noronha",
    estado: "PE",
    preco: "R$ 5.200",
    imagem: "/destinations/fernando-de-noronha.svg",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  function handleComecar() {
    navigate(isAuthenticated ? "/orcamento" : "/login");
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
        <section className="max-w-7xl mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center bg-white/80 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm mb-6">
              ✈️ Planejador inteligente de viagens
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Bem-vindo ao <span className="text-indigo-600">TravelBuddy</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Informe seu orçamento, número de dias e quantidade de pessoas. O sistema mostra destinos compatíveis,
              detalhes da viagem, roteiros e favoritos em uma experiência simples e visual.
            </p>

            {isAuthenticated && (
              <div className="bg-white/80 border border-white rounded-2xl p-4 mb-6 shadow-sm">
                <p className="text-gray-700">
                  Olá, <strong>{user?.name}</strong>. Continue seu planejamento ou explore todos os destinos cadastrados.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleComecar}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-200"
              >
                Começar planejamento
              </button>

              <Link
                to={isAuthenticated ? "/destinos" : "/login"}
                className="bg-white text-indigo-700 border border-indigo-100 px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors font-bold text-center"
              >
                Ver destinos
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-300/20 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
              <img
                src="/destinations/rio-de-janeiro.png"
                alt="Capa TravelBuddy"
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sugestões por orçamento</h2>
                    <p className="text-gray-600 mt-1">Cards com imagem, custo, clima e botão de detalhes.</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-12 grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Orçamento</h3>
            <p className="text-gray-600">Informe valor disponível, dias e pessoas para encontrar destinos acessíveis.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
            <div className="text-3xl mb-3">🧭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sugestões</h3>
            <p className="text-gray-600">Veja destinos compatíveis e também a lista completa de lugares cadastrados.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Favoritos e Premium</h3>
            <p className="text-gray-600">Salve destinos, gere roteiros e compare os planos Gratuito e Premium.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Lugares em destaque</h2>
              <p className="text-gray-600 mt-1">Alguns destinos que aparecem no protótipo do TravelBuddy.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {destinosDestaque.map((destino) => (
              <div key={destino.nome} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img src={destino.imagem} alt={destino.nome} className="w-full h-52 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">{destino.nome}</h3>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-gray-500">Brasil • {destino.estado}</span>
                    <span className="font-bold text-indigo-600">{destino.preco}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
