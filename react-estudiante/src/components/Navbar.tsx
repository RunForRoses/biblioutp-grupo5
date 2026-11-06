import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos tu contexto global

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const { user, logout } = useAuth(); // Extraemos el objeto 'user' y la función de cierre de sesión
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

   // 2. Efecto clave: Cada vez que el estado 'darkMode' cambie, alteramos el HTML global
  useEffect(() => {
    const root = document.documentElement; // Esto selecciona la etiqueta <html>
    
    if (darkMode) {
      root.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Lado Izquierdo: Logo o Nombre de tu Sistema */}
        <span className="navbar-brand fw-bold text-primary">BibliUTP</span>

        {/* Lado Derecho: Nombre del usuario y Botones */}
        <div className="d-flex align-items-center gap-3">
          
          {/* NUEVO: Si hay un usuario logueado, mostramos su nombre y su rol */}
          {user && (
            <div className="me-2 text-end">
              <span className="d-block fw-bold small text-dark">
                {user.nombre}
              </span>
              <span className="d-block text-muted badge bg-light text-secondary border fw-normal" style={{ fontSize: '11px' }}>
                {user.rol === 'admin' ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          )}

          {/* Botón de Modo Oscuro */}
     <button 
            className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-outline-secondary'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>

          {/* Botón Salir */}
          <button 
            onClick={handleLogout} 
            className="btn btn-danger btn-sm fw-bold px-3"
          >
            Salir
          </button>

        </div>
      </div>
    </nav>
  );
}
