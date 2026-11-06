export const aMinutos = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

export class Usuario {
    constructor({ id, nombre, correo, codigo, rol, password }) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.codigo = codigo;
        this.rol = rol;
        this.password = password;
    }

    get esAdmin() {
        return this.rol === 'admin';
    }

    get esEstudiante() {
        return this.rol === 'estudiante';
    }
}

export class Libro {
    constructor({ id, nombre, sede, capacidad, formatos = [], estado = 'disponible' }) {
        this.id = id;
        this.nombre = nombre;
        this.sede = sede;
        this.capacidad = capacidad;
        this.formatos = formatos;
        this.estado = estado;
    }

    get estaDisponible() {
        return this.estado === 'disponible' && this.capacidad > 0;
    }

    tieneFormato(formatoBuscado) {
        return this.formatos.some(
            (f) => f.toLowerCase() === formatoBuscado.toLowerCase()
        );
    }
}

export class Prestamo {
    constructor({
        id,
        codigo,
        libroId,
        usuarioId,
        fecha,
        horaInicio,
        horaFin,
        motivo,
        estado = 'pendiente',
        creadoEn = new Date().toISOString()
    }) {
        this.id = id;
        this.codigo = codigo;
        this.libroId = Number(libroId);
        this.usuarioId = Number(usuarioId);
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.motivo = motivo;
        this.estado = estado;
        this.creadoEn = creadoEn;
    }

    duracionHoras() {
        return (aMinutos(this.horaFin) - aMinutos(this.horaInicio)) / 60;
    }

    seCruzaCon(otro) {
        if (this.libroId !== otro.libroId || this.fecha !== otro.fecha) {
            return false;
        }
        return (
            aMinutos(this.horaInicio) < aMinutos(otro.horaFin) &&
            aMinutos(otro.horaInicio) < aMinutos(this.horaFin)
        );
    }

    get esActivo() {
        return this.estado === 'pendiente' || this.estado === 'aprobada';
    }
}