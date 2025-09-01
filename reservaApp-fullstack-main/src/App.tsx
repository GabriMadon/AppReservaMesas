import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { Login } from "./pages/LoginAdmin/Login";
import { Layout } from "./components/Layout";
import Reservas from "./pages/PanelAdmin/Reservas";
import EstadoReserva from "./pages/EstadoReservasMesas/EstadoReserva";
import { ListasReservas } from "./pages/ListaReservas/ListasReservas";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/"element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="reservas" />} />

            <Route path="reservas" element={<Reservas />} />

            <Route path="estado" element={<EstadoReserva />} />
            <Route path="lista" element={<ListasReservas/>} />
            {/* Aquí puedes agregar más rutas según sea necesario */}    

          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
