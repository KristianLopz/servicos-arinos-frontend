import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "..//services/authService";
import { api } from "../services/api";
import { useAuth } from "..//hooks/useAuth";
import BackButton from "../components/BackButton/BackButton";

export function Login() {
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.email || !formData.senha) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(
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
    setError(err.message);
  } else {
    setError("Erro ao realizar login.");
  }
} finally {
  setLoading(false);
}
  };

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!formData.email.trim()) {
      setError("Informe seu e-mail para recuperar a senha.");
      return;
    }

    try {
      const response = await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao solicitar recuperação de senha.");
        return;
      }

      setMessage(data.message || "Enviamos as instruções de recuperação para o e-mail informado.");
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar ao servidor.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute left-6 top-6">
        <BackButton fallbackPath="/" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">
            TravelBuddy
          </h1>

          <p className="text-gray-600">
            Bem-vindo de volta!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Sua senha"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Não tem uma conta?{" "}

          <Link
            to="/cadastro"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Criar conta
          </Link>

        </p>

      </div>

    </div>
  );
}