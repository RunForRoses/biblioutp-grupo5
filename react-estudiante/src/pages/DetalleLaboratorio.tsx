import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function DetalleLaboratorio() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); 

  // Mapeamos el título del libro de forma idéntica a tus opciones del Select
  const libroTitulo = id === '2' 
    ? 'Introducción a Python' // Cambiado para que coincida exactamente con "Introducción a Python" en tu select
    : `Libro Académico Especializado N° ${id}`;

  useEffect(() => {
    document.title = `BiblioUTP - ${libroTitulo}`;
    
    return () => {
      document.title = 'BiblioUTP';
    };
  }, [id, libroTitulo]);

  const esAdmin = user?.rol === 'admin';

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/catalogo">Catálogo</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Detalle del Libro</li>
        </ol>
      </nav>
      <div className="card p-4 shadow-sm bg-body-tertiary border-0">
        <h2 className="fw-bold mb-3">{libroTitulo}</h2>
        <p className="text-secondary">
          Estás visualizando la ficha técnica extendida, sinopsis y disponibilidad de ejemplares físicos para el libro con código único de inventario UTP-{id}.
        </p>
        <div className="mt-4">
          
          {/* CONDICIONAL SEGÚN EL ROL DEL USUARIO */}
          {esAdmin ? (
            <button 
              className="btn btn-secondary me-2 fw-semibold" 
              disabled
            >
              Préstamo No Autorizado (Admin)
            </button>
          ) : (
            // CORRECCIÓN: Ahora enviamos state con el nombre exacto del libro
            <Link 
              to="/nueva-reserva" 
              state={{ libroNombre: libroTitulo, libroId: id }} 
              className="btn btn-primary me-2 fw-semibold"
            >
              Solicitar Préstamo
            </Link>
          )}

          <Link to="/catalogo" className="btn btn-outline-secondary bg-white text-dark">
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
