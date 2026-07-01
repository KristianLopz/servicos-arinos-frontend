import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import { Login } from "../pages/Login";
import { Cadastro } from "../pages/Cadastro";

import Destinos from "../pages/Destinos";
import DetalhesDestino from "../pages/DetalhesDestino";
import Favoritos from "../pages/Favoritos";
import Orcamento from "../pages/Orcamento";
import Perfil from "../pages/Perfil";
import { Premium } from "../pages/Premium";
import { Roteiro } from "../pages/Roteiro";
import { AdminDestinos } from "../pages/AdminDestinos";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route
        path="/orcamento"
        element={
          <PrivateRoute>
            <Orcamento />
          </PrivateRoute>
        }
      />

      <Route
        path="/destinos"
        element={
          <PrivateRoute>
            <Destinos />
          </PrivateRoute>
        }
      />

      <Route
        path="/destino/:id"
        element={
          <PrivateRoute>
            <DetalhesDestino />
          </PrivateRoute>
        }
      />

      <Route
        path="/roteiro/:id"
        element={
          <PrivateRoute>
            <Roteiro />
          </PrivateRoute>
        }
      />

      <Route
        path="/favoritos"
        element={
          <PrivateRoute>
            <Favoritos />
          </PrivateRoute>
        }
      />

      <Route
        path="/premium"
        element={
          <PrivateRoute>
            <Premium />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/destinos"
        element={
          <PrivateRoute>
            <AdminDestinos />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
