import React from 'react';
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado';

interface LaboratorioProps {
  id: string;
  nombre: string;
  sede: string;
  capacidad: number;
  estado: 'disponible' | 'ocupado' | 'mantenimiento';
}

export default function TarjetaLaboratorio({ id, nombre, sede, capacidad, estado }: LaboratorioProps) {
  return (
    <div className="card h-100 shadow-sm border-0 bg-body-tertiary">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0 fw-bold">{nombre}</h5>
            <BadgeEstado estado={estado} />
          </div>
          <p className="card-text text-secondary small mb-1">
           <strong>Sede:</strong> {sede}
          </p>
          <p className="card-text text-secondary small mb-3">
           <strong>Stock Disponible:</strong> {capacidad} unidades
          </p>
        </div>
        
        <Link to={`/catalogo/${id}`} className="btn btn-primary btn-sm w-100 mt-2">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}
