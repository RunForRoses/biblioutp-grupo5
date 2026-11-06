//Conteo de prestamos agrupados por estado usando reduce
export const contarPrestamosPorEstado = (prestamos) => {
  return prestamos.reduce(
    (acumulador, prestamo) => {
      const estado = prestamo.estado;
      acumulador[estado] = (acumulador[estado] || 0) + 1;
      return acumulador;
    },
    { pendiente: 0, aprobada: 0, rechazada: 0 },
  );
};

//Conteo de préstamos por libro usando la estructura map
export const calcularOcupacionPorLibro = (prestamos) => {
  const mapa = new Map();
  for (const prestamo of prestamos) {
    const actual = mapa.get(prestamo.libroId) || 0;
    mapa.set(prestamo.libroId, actual + 1);
  }
  return mapa;
};

//Obtener la lista de sedes sin repetidos usando Set
export const obtenerSedesUnicas = (libros) => {
  const sedesSet = new Set(libros.map((libro) => libro.sede));
  return Array.from(sedesSet);
};

//Ranking de libros más prestados
export const rankingLibrosMasPrestados = (prestamos, libros) => {
  const conteos = calcularOcupacionPorLibro(prestamos);

  return [...libros]
    .map((libro) => ({
      id: libro.id,
      nombre: libro.nombre,
      totalPrestamos: conteos.get(libro.id) || 0,
    }))
    .sort((a, b) => b.totalPrestamos - a.totalPrestamos);
};

//Generador de codigos usando closure y padStart (como en el simulacro pasado XD)
export const crearGeneradorCodigo = (prefijo = "PRE", inicio = 1) => {
  let contador = inicio;
  return () => {
    const numeroFormateado = String(contador).padStart(4, "0");
    const codigoGenerado = `${prefijo}-${numeroFormateado}`;
    contador += 1;
    return codigoGenerado;
  };
};
