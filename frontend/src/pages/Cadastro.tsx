import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "..//services/authService";
import { useAuth } from "..//hooks/useAuth";
import BackButton from "../components/BackButton/BackButton";

export function Cadastro() {
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim())
      newErrors.nome = "Nome é obrigatório.";

    if (!formData.email.trim())
      newErrors.email = "E-mail é obrigatório.";

    if (!formData.senha)
      newErrors.senha = "Senha é obrigatória.";

    if (formData.senha.length < 8)
      newErrors.senha = "A senha deve possuir pelo menos 8 caracteres.";

    if (formData.senha !== formData.confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      setLoading(true);

      const data = await register(
        formData.nome,
        formData.email,
        formData.senha
      );

      authLogin(
        data.token,
        data.user
      );

      navigate("/");

    } catch (err: unknown) {

      if (err instanceof Error) {

        setErrors({
          api: err.message,
        });

      } else {

        setErrors({
          api: "Erro ao criar conta.",
        });

      }

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute left-6 top-6">
        <BackButton fallbackPath="/" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-indigo-600">
            TravelBuddy
          </h1>

          <p className="text-gray-600">
            Crie sua conta e comece a planejar
          </p>

        </div>

        {errors.api && (

          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">

            {errors.api}

          </div>

        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>

            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nome: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nome}
              </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>

            <input
              type="password"
              value={formData.senha}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  senha: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {errors.senha && (
              <p className="text-red-500 text-xs mt-1">
                {errors.senha}
              </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>

            <input
              type="password"
              value={formData.confirmarSenha}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmarSenha: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            {errors.confirmarSenha && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmarSenha}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-600">

          Já possui uma conta?

          <Link
            to="/login"
            className="text-indigo-600 font-medium ml-2"
          >
            Entrar
          </Link>

        </p>

      </div>

    </div>
  );
}