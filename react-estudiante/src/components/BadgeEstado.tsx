import React from 'react';

// 1. Ampliamos el tipado para aceptar las cadenas reales de tu db.json
interface BadgeEstadoProps {
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'pocas-unidades' | 'agotado';
}

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  // Asignamos una clase de Bootstrap según el estado recibido por props
  const configurarBadge = () => {
    switch (estado) {
      case 'disponible':
        return { clase: 'bg-success-subtle text-success border-success', texto: 'Disponible' };
      case 'pocas-unidades':
        return { clase: 'bg-warning-subtle text-warning-emphasis border-warning', texto: 'Pocas unidades' };
      case 'ocupado':
      case 'agotado': // 2. Acoplamos 'agotado' para que comparta el estilo rojo de advertencia
        return { clase: 'bg-danger-subtle text-danger border-danger', texto: 'Agotado' };
      case 'mantenimiento':
        return { clase: 'bg-warning-subtle text-warning border-warning', texto: 'Mantenimiento' };
      default:
        return { clase: 'bg-secondary-subtle text-secondary border-secondary', texto: 'Desconocido' };
    }
  };

  const { clase, texto } = configurarBadge();

  return (
    <span className={`badge border px-2.5 py-1.5 rounded-pill ${clase}`}>
      {texto}
    </span>
  );
}
