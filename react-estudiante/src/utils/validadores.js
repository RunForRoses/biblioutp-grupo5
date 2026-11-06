const patronCorreoUTP = /^[a-z0-9._%+-]+@utp\.edu\.pe$/i;

export function esCorreoUTP(correo) {
    if (typeof correo !== 'string') return false;
    return patronCorreoUTP.test(correo.trim());
}

const patronCodigoAlumno = /^U\d{8}$/;

export function esCodigoAlumno(codigo) {
    if (typeof codigo !== 'string') return false;
    return patronCodigoAlumno.test(codigo.trim());
}

/**
 * 3. Validador de Hora
 * Regla: Desde 00:00 hasta 23:59
 */
const patronHora = /^([01]\d|2[0-3]):[0-5]\d$/;

export function esHoraValida(hora) {
    if (typeof hora !== 'string') return false;
    return patronHora.test(hora.trim());
}

/**
 * 4. Validador de Fecha (AAAA-MM-DD)
 */
const patronFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function esFechaValida(fecha) {
    if (typeof fecha !== 'string') return false;
    return patronFecha.test(fecha.trim());
}

/**
 * Función utilitaria para convertir "08:30" en 510 minutos totales del día
 */
export function horaAMinutos(horaStr) {
    if (!horaStr || typeof horaStr !== 'string') return 0;
    const [horas, minutos] = horaStr.split(':').map(Number);
    return horas * 60 + minutos;
}

/**
 * ALGORITMO DE CRUCE: Comprueba si el libro físico ya está separado en ese rango horario
 */
export function hayCruceDePrestamo(nuevoPrestamo, prestamosExistentes) {
    const nuevoInicio = horaAMinutos(nuevoPrestamo.horaInicio);
    const nuevoFin = horaAMinutos(nuevoPrestamo.horaFin);

    return prestamosExistentes.some((existente) => {
        // Si estamos EDITANDO un préstamo, ignoramos su propio ID para que no colisione consigo mismo
        if (nuevoPrestamo.id && existente.id === nuevoPrestamo.id) return false;

        // Solo hay conflicto si es el mismo libro, la misma fecha exacta y el préstamo está activo
        if (existente.libroId !== nuevoPrestamo.libroId || existente.fecha !== nuevoPrestamo.fecha) {
            return false;
        }

        const extInicio = horaAMinutos(existente.horaInicio);
        const extFin = horaAMinutos(existente.horaFin);

        // Fórmula matemática de superposición horaria
        return nuevoInicio < extFin && nuevoFin > extInicio;
    });
}

/**
 * Función unificadora para la validación del Formulario de Préstamos
 * @param {Object} datos - Estado controlado del formulario ({ correo, codigo, fecha, horaInicio, horaFin, libroId })
 * @param {Array} prestamosExistentes - Lista de préstamos actuales consumida desde tu api-mock
 */
export function validarDatosPrestamo(datos, prestamosExistentes = []) {
    const listaErrores = [];

    // 1. Validaciones estructurales básicas (Regex)
    if (!esCorreoUTP(datos.correo)) {
        listaErrores.push(`El correo "${datos.correo}" no es válido. Debe ser institucional (@utp.edu.pe).`);
    }

    if (!esCodigoAlumno(datos.codigo)) {
        listaErrores.push(`El código "${datos.codigo}" es inválido. Debe iniciar con U y tener 8 dígitos numéricos.`);
    }

    if (!esFechaValida(datos.fecha)) {
        listaErrores.push(`La fecha "${datos.fecha}" no cumple el formato requerido AAAA-MM-DD.`);
    }

    const inicioValido = esHoraValida(datos.horaInicio);
    const finValida = esHoraValida(datos.horaFin);

    if (!inicioValido) {
        listaErrores.push(`La hora de inicio "${datos.horaInicio}" debe tener formato HH:mm (ejemplo: 08:30).`);
    }

    if (!finValida) {
        listaErrores.push(`La hora de fin "${datos.horaFin}" debe tener formato HH:mm (ejemplo: 10:30).`);
    }

    // 2. Validaciones de negocio horarias (Se ejecutan solo si los strings de hora son válidos)
    if (inicioValido && finValida) {
        const minutosInicio = horaAMinutos(datos.horaInicio);
        const minutosFin = horaAMinutos(datos.horaFin);

        // Regla: La hora final debe ser posterior al inicio
        if (minutosInicio >= minutosFin) {
            listaErrores.push("La hora de inicio debe ser estrictamente menor que la hora de devolución.");
        } 
        // Regla de Bloqueo: El libro físico no puede duplicarse en el mismo tiempo
        else if (hayCruceDePrestamo(datos, prestamosExistentes)) {
            listaErrores.push("Este ejemplar ya se encuentra reservado o prestado por otro alumno en el horario seleccionado.");
        }
    }

    return {
        esValido: listaErrores.length === 0,
        errores: listaErrores
    };
}
