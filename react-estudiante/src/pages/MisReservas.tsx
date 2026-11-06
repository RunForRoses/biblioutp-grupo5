import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar tu contexto de autenticación

export default function MisReservas() {
  const { user } = useAuth(); // Recuperamos el usuario activo (ej: Justin Cedillo)
  const [todosLosPrestamos, setTodosLosPrestamos] = useState<any[]>([]);

  // 1. Consumimos los datos del api-mock
  useEffect(() => {
    fetch('http://localhost:3000/prestamos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTodosLosPrestamos(data);
        }
      })
      .catch(err => console.error('Error al cargar historial:', err));
  }, [user]); // Se refresca si cambia el usuario

  // 2. FILTRO CLAVE: Dejamos pasar solo los registros que pertenezcan al usuario logueado
  const misPrestamosFiltrados = todosLosPrestamos.filter(
    (prestamo) => 
      String(prestamo.usuarioId) === String(user?.id) || 
      String(prestamo.codigoUsuario) === String(user?.codigo)
  );

  return (
    <div className="container py-4">
      <h2>Mis Préstamos de Libros</h2>
      
      {/* 3. Mapeamos la constante filtrada en lugar de la lista global */}
      <div className="row">
        {misPrestamosFiltrados.length === 0 ? (
          <p className="text-muted">No cuentas con préstamos registrados actualmente.</p>
        ) : (
          misPrestamosFiltrados.map((p) => (
            <div key={p.id} className="card p-3 mb-2 shadow-sm">
              <h5>📘 {p.libro}</h5>
              <p className="small mb-1 text-muted">Devolución estimada: {p.fecha}</p>
              <p className="small mb-0">Estado: <span className="badge bg-success">{p.estado}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
