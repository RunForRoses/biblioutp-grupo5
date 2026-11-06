import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - No Encontrado';
    return () => { document.title = 'BiblioUTP Labs'; };
  }, []);

  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-1 fw-bold text-danger mb-3">404</h1>
          <h3 className="fw-bold mb-3">Página no encontrada</h3>
          <p className="text-secondary mb-4">
            Lo sentimos, el enlace que intentas buscar no existe o ha sido movido a otra sección del sistema.
          </p>
          <Link to="/" className="btn btn-primary px-4 py-2 fw-bold shadow-sm">
            Regresar al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
