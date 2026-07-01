import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Destino {
  id: number;
  nome: string;
  pais: string;
  estado: string;
  custoMedio: number;
  clima: string;
  melhorEpoca: string;
  pontosTuristicos: string;
}

export function AdminDestinos() {
  const navigate = useNavigate();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [destinoEditando, setDestinoEditando] = useState<Destino | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    pais: '',
    estado: '',
    custoMedio: '',
    clima: '',
    melhorEpoca: '',
    pontosTuristicos: ''
  });

  useEffect(() => {
    const destinosMock: Destino[] = [
      { id: 1, nome: 'Praia do Rosa', pais: 'Brasil', estado: 'SC', custoMedio: 2500, clima: 'Tropical', melhorEpoca: 'Dez-Mar', pontosTuristicos: 'Praia do Rosa, Mirante' },
      { id: 2, nome: 'Chapada Diamantina', pais: 'Brasil', estado: 'BA', custoMedio: 1800, clima: 'Tropical de altitude', melhorEpoca: 'Abr-Set', pontosTuristicos: 'Cachoeira da Fumaça, Poço Azul' },
      { id: 3, nome: 'Fernando de Noronha', pais: 'Brasil', estado: 'PE', custoMedio: 5000, clima: 'Tropical', melhorEpoca: 'Ago-Dez', pontosTuristicos: 'Baía do Sancho, Praia do Leão' }
    ];

    const destinosSalvos = localStorage.getItem('adminDestinos');
    setDestinos(destinosSalvos ? JSON.parse(destinosSalvos) : destinosMock);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (destinoEditando) {
      const destinosAtualizados = destinos.map(d =>
        d.id === destinoEditando.id
          ? { ...destinoEditando, ...formData, custoMedio: parseFloat(formData.custoMedio) }
          : d
      );
      setDestinos(destinosAtualizados);
      localStorage.setItem('adminDestinos', JSON.stringify(destinosAtualizados));
      alert('Destino atualizado com sucesso!');
    } else {
      const novoDestino: Destino = {
        id: destinos.length + 1,
        ...formData,
        custoMedio: parseFloat(formData.custoMedio)
      };
      const novosDestinos = [...destinos, novoDestino];
      setDestinos(novosDestinos);
      localStorage.setItem('adminDestinos', JSON.stringify(novosDestinos));
      alert('Destino cadastrado com sucesso!');
    }

    resetForm();
  };

  const editarDestino = (destino: Destino) => {
    setDestinoEditando(destino);
    setFormData({
      nome: destino.nome,
      pais: destino.pais,
      estado: destino.estado,
      custoMedio: destino.custoMedio.toString(),
      clima: destino.clima,
      melhorEpoca: destino.melhorEpoca,
      pontosTuristicos: destino.pontosTuristicos
    });
    setModoEdicao(true);
  };

  const excluirDestino = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este destino?')) {
      const novosDestinos = destinos.filter(d => d.id !== id);
      setDestinos(novosDestinos);
      localStorage.setItem('adminDestinos', JSON.stringify(novosDestinos));
      alert('Destino excluído com sucesso!');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      pais: '',
      estado: '',
      custoMedio: '',
      clima: '',
      melhorEpoca: '',
      pontosTuristicos: ''
    });
    setDestinoEditando(null);
    setModoEdicao(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TravelBuddy Admin</h1>
          <button onClick={() => navigate('/orcamento')} className="hover:text-indigo-200">
            Sair do Admin
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Destinos</h2>
            <p className="text-gray-600">Cadastre e gerencie destinos turísticos</p>
          </div>
          <button
            onClick={() => setModoEdicao(!modoEdicao)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
          >
            {modoEdicao ? 'Cancelar' : '+ Novo Destino'}
          </button>
        </div>

        {modoEdicao && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {destinoEditando ? 'Editar Destino' : 'Cadastrar Novo Destino'}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Destino *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <input
                  type="text"
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo Médio (R$) *
                </label>
                <input
                  type="number"
                  value={formData.custoMedio}
                  onChange={(e) => setFormData({ ...formData, custoMedio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clima *
                </label>
                <input
                  type="text"
                  value={formData.clima}
                  onChange={(e) => setFormData({ ...formData, clima: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Melhor Época *
                </label>
                <input
                  type="text"
                  value={formData.melhorEpoca}
                  onChange={(e) => setFormData({ ...formData, melhorEpoca: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pontos Turísticos (separados por vírgula) *
                </label>
                <textarea
                  value={formData.pontosTuristicos}
                  onChange={(e) => setFormData({ ...formData, pontosTuristicos: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div className="col-span-2 flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                >
                  {destinoEditando ? 'Atualizar Destino' : 'Cadastrar Destino'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Localização</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Custo Médio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Clima</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {destinos.map((destino) => (
                <tr key={destino.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-medium">{destino.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{destino.estado}, {destino.pais}</td>
                  <td className="px-6 py-4 text-gray-800">R$ {destino.custoMedio.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-gray-600">{destino.clima}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarDestino(destino)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirDestino(destino.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {destinos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum destino cadastrado ainda
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
