import { test } from "node:test";
import assert from "node:assert/strict";

import {
  esCorreoUTP,
  esCodigoAlumno,
  esHoraValida,
  esFechaValida,
} from "./validadores.js";
import { Prestamo, Libro, Usuario } from "./modelos.js";
import {
  contarPrestamosPorEstado,
  calcularOcupacionPorLibro,
  obtenerSedesUnicas,
  rankingLibrosMasPrestados,
  crearGeneradorCodigo,
} from "./estadisticas.js";

// Prueba 1: Validar formato de correo institucional UTP
test("1. Valida correctamente correos @utp.edu.pe y rechaza otros dominios", () => {
  assert.equal(esCorreoUTP("u20231234@utp.edu.pe"), true);
  assert.equal(esCorreoUTP("admin@utp.edu.pe"), true);
  assert.equal(esCorreoUTP("usuario@gmail.com"), false);
  assert.equal(esCorreoUTP("invalido@utp.com"), false);
});

// Prueba 2: Validar formato de código de alumno UTP (U + 8 dígitos)
test("2. Valida códigos de alumno que inician con U y tienen 8 dígitos", () => {
  assert.equal(esCodigoAlumno("U20231234"), true);
  assert.equal(esCodigoAlumno("u20231234"), false);
  assert.equal(esCodigoAlumno("U1234567"), false);
  assert.equal(esCodigoAlumno("A00000001"), false);
});

// Prueba 3: Validar formatos de fecha y hora
test("3. Valida horas militares HH:mm y fechas AAAA-MM-DD", () => {
  assert.equal(esHoraValida("08:30"), true);
  assert.equal(esHoraValida("23:59"), true);
  assert.equal(esHoraValida("24:00"), false);
  assert.equal(esFechaValida("2026-11-20"), true);
  assert.equal(esFechaValida("20-11-2026"), false);
});

// Prueba 4: Cálculo de duración de préstamo en horas
test("4. Prestamo.duracionHoras calcula la cantidad correcta de horas", () => {
  const p = new Prestamo({
    libroId: 1,
    fecha: "2026-11-20",
    horaInicio: "08:00",
    horaFin: "10:30",
  });
  assert.equal(p.duracionHoras(), 2.5);
});

// Prueba 5: Detección de solapamiento de horarios (seCruzaCon)
test("5. Prestamo.seCruzaCon detecta cruce de horario en el mismo libro y fecha", () => {
  const p1 = new Prestamo({
    libroId: 1,
    fecha: "2026-11-20",
    horaInicio: "08:00",
    horaFin: "10:00",
  });
  const p2 = new Prestamo({
    libroId: 1,
    fecha: "2026-11-20",
    horaInicio: "09:00",
    horaFin: "11:00",
  });

  assert.equal(p1.seCruzaCon(p2), true);
});

// Prueba 6: Préstamos contiguos o en fechas distintas NO se cruzan
test("6. Prestamos contiguos no se consideran solapados", () => {
  const p1 = new Prestamo({
    libroId: 1,
    fecha: "2026-11-20",
    horaInicio: "08:00",
    horaFin: "10:00",
  });
  const p2 = new Prestamo({
    libroId: 1,
    fecha: "2026-11-20",
    horaInicio: "10:00",
    horaFin: "12:00",
  });
  const p3 = new Prestamo({
    libroId: 1,
    fecha: "2026-11-21",
    horaInicio: "08:00",
    horaFin: "10:00",
  });

  assert.equal(p1.seCruzaCon(p2), false); // Contiguos
  assert.equal(p1.seCruzaCon(p3), false); // Diferente fecha
});

// Prueba 7: Conteo por estado con reduce
test("7. contarPrestamosPorEstado agrupa correctamente usando reduce", () => {
  const prestamos = [
    { estado: "pendiente" },
    { estado: "aprobada" },
    { estado: "aprobada" },
    { estado: "rechazada" },
  ];
  const resultado = contarPrestamosPorEstado(prestamos);
  assert.deepEqual(resultado, { pendiente: 1, aprobada: 2, rechazada: 1 });
});

// Prueba 8: Generador de códigos con closure y padStart
test("8. crearGeneradorCodigo produce códigos consecutivos con ceros a la izquierda", () => {
  const generar = crearGeneradorCodigo("PRE", 1);
  assert.equal(generar(), "PRE-0001");
  assert.equal(generar(), "PRE-0002");
  assert.equal(generar(), "PRE-0003");
});

// Prueba 9 (Extra): Sedes únicas con Set
test("9. obtenerSedesUnicas elimina duplicados usando Set", () => {
  const libros = [
    { sede: "Lima Centro" },
    { sede: "Lima Sur" },
    { sede: "Lima Centro" },
  ];
  const sedes = obtenerSedesUnicas(libros);
  assert.equal(sedes.length, 2);
  assert.deepEqual(sedes.sort(), ["Lima Centro", "Lima Sur"].sort());
});
