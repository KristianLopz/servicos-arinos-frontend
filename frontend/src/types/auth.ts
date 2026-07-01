export interface User {
  id: number;
  name: string;
  email: string;
  plan?: string;
  role?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface Destino {
  id: number;
  nome: string;
  pais: string;
  estado: string;
  custoMedio: number;
  imagem: string;
  clima: string;
}

export interface Favorito {
  id?: number;
  tipo: 'destino' | 'roteiro';
  nome?: string;
  destinoNome?: string;
  dias?: number;
  custoTotal?: number;
  custoMedio?: number;
  estado?: string;
  pais?: string;
}