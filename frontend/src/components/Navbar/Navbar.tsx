import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white/95 backdrop-blur text-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600">
          TravelBuddy
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link className="hover:text-indigo-600" to="/">
            Início
          </Link>

          {isAuthenticated && (
            <>
              <Link className="hover:text-indigo-600" to="/orcamento">
                Orçamento
              </Link>

              <Link className="hover:text-indigo-600" to="/destinos">
                Destinos
              </Link>

              <Link className="hover:text-indigo-600" to="/favoritos">
                Favoritos
              </Link>

              <Link className="hover:text-indigo-600" to="/premium">
                Premium
              </Link>

              {user?.role === "admin" && (
                <Link className="hover:text-indigo-600" to="/admin/destinos">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden lg:inline text-gray-600">
                Olá, {user?.name}
                {user?.plan === "premium" ? " • Premium" : ""}
              </span>

              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="hover:text-indigo-600 font-semibold" to="/login">
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
