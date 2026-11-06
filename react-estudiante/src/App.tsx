import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import DetalleLab from './pages/DetalleLaboratorio';
import MisReservas from './pages/MisReservas';
import NuevaReserva from './pages/NuevaReserva';
import NotFound from './pages/NotFound';

const Inicio = () => <div className="container py-4"><h1>Inicio del Sistema</h1><p>Bienvenido a BiblioUTP.</p></div>;

// Componente para proteger las rutas privadas
const RutaProtegida = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:id" element={<DetalleLab />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Privadas (Solo con sesión iniciada) */}
        <Route path="/mis-reservas" element={
          <RutaProtegida>
            <MisReservas />
          </RutaProtegida>
        } />
        <Route path="/nueva-reserva" element={
          <RutaProtegida>
            <NuevaReserva />
          </RutaProtegida>
        } />

        {/* Error 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
