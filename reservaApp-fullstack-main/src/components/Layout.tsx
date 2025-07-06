import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

export const Layout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  //Estructura del layout Principal
    <div className="min-h-screen bg-gray-100">
      {/*Barra de navegación*/}
      <nav className="bg-gray-600 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
           {/* Título del sistema o app*/}

          <h1 className="text-xl font-bold">Reserva Mesas</h1>

          <div className="flex gap-6 items-center">
            {/*Enlaces o pestañas de navegacion dentro del layout*/}

            <Link to="/reservas" className="hover:text-blue-300 transition">
              Panel Administrador
            </Link>

            <Link to="/estado" className="hover:text-blue-300 transition">
              Estado  Mesas
            </Link>

            <Link to="/lista" >Lista Reservas
            </Link>

        {/* <Link to="/documentos" className="hover:text-blue-300 transition">
              Documentos
            </Link> */}
          </div>

          {/*Información del usuario y botón de logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-base font-medium">
              {usuario?.nombre}
            </span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-300 text-lg"
            >
              {/* Icono de logout */}
              <FiLogOut />
            </button>
          </div>
        </div>
      </nav>
      {/* Contenido principal de la aplicación */}
      <main className="p-6 ">
        <Outlet />
      </main>
    </div>
  );
};
