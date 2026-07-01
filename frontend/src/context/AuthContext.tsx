import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  plan?: "free" | "premium" | string;
  role?: "user" | "admin" | string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const [user, setUser] = useState<User | null>(() => {
    const storage = localStorage.getItem("user");
    if (!storage) return null;

    try {
      return JSON.parse(storage);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  function login(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("plano", user.plan || "free");

    setToken(token);
    setUser(user);
  }

  function updateUser(data: Partial<User>) {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, ...data };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("plano");
    localStorage.removeItem("dataAssinatura");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        updateUser,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
