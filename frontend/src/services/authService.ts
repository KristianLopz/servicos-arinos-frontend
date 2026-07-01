import { api } from "./api";

export async function login(
  email: string,
  password: string
) {
  const response = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao realizar login.");
  }

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  const response = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao realizar cadastro.");
  }

  return data;
}