import React, { useState, useEffect } from 'react';
import TarjetaLaboratorio from '../components/TarjetaLaboratorio';

interface Libro {
  id: number | string;
  nombre: string;
  sede: string;        // Refleja la sede física en tu JSON (Ej. Lima Centro)
  capacidad: number;   // Refleja el Stock disponible en tu JSON
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'agotado';
}

export default function Catalogo() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [buscarTexto, setBuscarTexto] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');

  // Hook useEffect para sincronizar la base de datos real del api-mock
  useEffect(() => {
    fetch('http://localhost:3000/libros')
      .then((res) => res.json())
      .then((data) => setLibros(data))
      .catch((err) => console.error('Error al conectar con db.json:', err));
  }, []);

  // Lógica de filtrado por título y por sedes reales de tu db.json
  const librosFiltrados = libros.filter((libro) => {
    const coincideTexto = libro.nombre.toLowerCase().includes(buscarTexto.toLowerCase());
    const coincideSede = 
      sedeSeleccionada === '' || 
      libro.sede.toLowerCase().trim() === sedeSeleccionada.toLowerCase().trim();
    return coincideTexto && coincideSede;
  });

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Catálogo de Libros - BiblioUTP</h2>
      
      {/* Sección de Filtros adaptados a tus sedes reales */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título del libro..."
            value={buscarTexto}
            onChange={(e) => setBuscarTexto(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            <option value="">Todas las Sedes</option>
            <option value="Lima Centro">Lima Centro</option>
            <option value="Lima Sur">Lima Sur</option>
            <option value="Lima Norte">Lima Norte</option>
            <option value="Lima Este">Lima Este</option>
            <option value="San Juan de Lurigancho">San Juan de Lurigancho</option>
            <option value="Arequipa">Arequipa</option>
          </select>
        </div>
      </div>

      {/* Renderizado dinámico e inteligente */}
      {librosFiltrados.length === 0 ? (
        <div className="alert alert-warning text-center">
          No se encontraron libros que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {librosFiltrados.map((libro) => (
            <div className="col" key={libro.id}>
              <TarjetaLaboratorio 
                id={String(libro.id)}
                nombre={libro.nombre}
                sede={libro.sede}
                capacidad={libro.capacidad}
                // Si el libro está "agotado", lo mapeamos a "ocupado" temporalmente para el estilo visual del BadgeEstado
                estado={libro.estado === 'agotado' ? 'ocupado' : 'disponible'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
