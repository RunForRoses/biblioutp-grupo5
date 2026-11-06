import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Importamos los validadores desde tu archivo core-js
import { validarDatosPrestamo } from '../utils/validadores';


interface FormErrores {
  formato?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  limite?: string;
  cruceUId?: string; // Para mostrar los errores acumulados del validador.js
}

export default function NuevaReserva() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  // Recuperamos el nombre del libro y su ID desde la navegación anterior
  const libroPreseleccionado = location.state?.libroNombre || '';
  const libroId = location.state?.libroId || '';

  // 1. FORMULARIO CONTROLADO: Estados para cada input requerido por el validador
  const [formato, setFormato] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const [formatosDisponibles, setFormatosDisponibles] = useState<string[]>([]);
  const [errores, setErrores] = useState<FormErrores>({});
  const [prestamosActivos, setPrestamosActivos] = useState<any[]>([]); // Guardamos la lista completa para cruces
  const [cargandoFormatos, setCargandoFormatos] = useState(true);

  // Efecto para consultar los formatos reales de este libro en el db.json
  useEffect(() => {
    if (libroId) {
      setCargandoFormatos(true);
      fetch(`http://localhost:3000/libros/${libroId}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo obtener el libro');
          return res.json();
        })
        .then(data => {
          if (data.formatos && Array.isArray(data.formatos)) {
            setFormatosDisponibles(data.formatos);
          } else {
            setFormatosDisponibles(['Físico']);
          }
        })
        .catch(err => {
          console.error(err);
          setFormatosDisponibles(['Físico', 'E-book']);
        })
        .finally(() => setCargandoFormatos(false));
    } else {
      setFormatosDisponibles(['Físico', 'E-book']);
      setCargandoFormatos(false);
    }
  }, [libroId]);

  // Consultar todos los préstamos globales para inyectárselos al algoritmo de colisiones
  useEffect(() => {
    document.title = 'BiblioUTP - Solicitar Préstamo';
    if (!user) {
      setPrestamosActivos([]);
    setErrores({});
      return;
    }
    
    fetch('http://localhost:3000/prestamos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrestamosActivos(data);
        }
      })
      .catch(err => console.error('Error al conectar con api-mock:', err));

    return () => { document.title = 'BiblioUTP'; };
  }, [user]);

  // Filtrar cuántos préstamos tiene este alumno específico de manera síncrona
  const misPrestamosActuales = prestamosActivos.filter(
    (p) => p.usuarioId === user?.id || p.codigoUsuario === user?.codigo
  );

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: FormErrores = {};

    // Validación de límite de cantidad
    if (misPrestamosActuales.length >= 3) {
      nuevosErrores.limite = 'No puedes solicitar más libros. Has alcanzado tu límite máximo de 3 préstamos activos.';
      setErrores(nuevosErrores);
      return;
    }

    if (!formato) nuevosErrores.formato = 'Debes seleccionar un formato de lectura.';
    if (!fecha) nuevosErrores.fecha = 'Debes ingresar una fecha de reserva.';
    if (!horaInicio) nuevosErrores.horaInicio = 'Debes ingresar una hora de inicio.';
    if (!horaFin) nuevosErrores.horaFin = 'Debes ingresar una hora de devolución.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Estructuramos el payload dinámico simulando los datos que core-js espera analizar
    const datosAAvaliar = {
      id: undefined, // undefined al crear una nueva reserva
      libroId: libroId.toString(),
      correo: user?.correo || '',
      codigo: user?.codigo || '',
      fecha,
      horaInicio,
      horaFin
    };

    // -- VALIDACIONES DE CORE-JS Y BLOQUEO DE CRUCE DE HORARIOS --
    // Solo activamos el validador de cruce si el formato seleccionado es 'Físico'
    if (formato === 'Físico') {
      const resultadoValidacion = validarDatosPrestamo(datosAAvaliar, prestamosActivos);

      if (!resultadoValidacion.esValido) {
        // Concatenamos y pintamos los mensajes de error devueltos por tu core analítico
        nuevosErrores.cruceUId = resultadoValidacion.errores.join(' ');
        setErrores(nuevosErrores);
        return;
      }
    }

    // Si supera la validación estructural y matemática de colisión, se guarda en el db.json
    try {
      const respuesta = await fetch('http://localhost:3000/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usuarioId: user?.id,             
          codigoUsuario: user?.codigo,     
          nombreUsuario: user?.nombre,     
          libroId: libroId.toString(),
          libro: libroPreseleccionado || `Libro ID: ${libroId}`, 
          formato, 
          fecha,
          horaInicio,
          horaFin,
          estado: 'En posesión del alumno' 
        })
      });

      if (respuesta.ok) {
        alert('¡Préstamo registrado exitosamente!');
        navigate('/mis-reservas'); 
      }
    } catch (error) {
      alert('Error de red al intentar guardar en el api-mock.');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm border-0 bg-body-tertiary">
            <h3 className="text-center fw-bold mb-2">Formulario de Préstamo</h3>
            
            <p className="text-center text-muted small mb-3">
              Mis préstamos registrados: <span className="fw-bold text-primary">{misPrestamosActuales.length} / 3</span>
            </p>

            <div className="alert alert-info text-center py-2 small mb-4">
              Libro a solicitar: <strong>{libroPreseleccionado || 'Seleccionado desde el catálogo'}</strong>
            </div>
            
            {errores.limite && <div className="alert alert-danger small py-2">⚠️ {errores.limite}</div>}
            {errores.cruceUId && <div className="alert alert-danger small py-2">❌ {errores.cruceUId}</div>}

            <form onSubmit={manejarEnvio}>
              
              {/* Selección de Formato */}
              <div className="mb-3">
                <label className="form-label small fw-bold">Formato Disponible</label>
                <select
                  className={`form-select ${errores.formato ? 'is-invalid' : ''}`}
                  value={formato}
                  onChange={(e) => { setFormato(e.target.value); setErrores({}); }}
                  disabled={misPrestamosActuales.length >= 3 || cargandoFormatos}
                >
                  <option value="">-- Elige el formato de lectura --</option>
                  {formatosDisponibles.map((f, index) => (
                    <option key={index} value={f}>{f}</option>
                  ))}
                </select>
                {errores.formato && <div className="invalid-feedback">{errores.formato}</div>}
              </div>

              {/* Selección de Fecha */}
              <div className="mb-3">
                <label className="form-label small fw-bold">Fecha del Préstamo</label>
                <input
                  type="date"
                  className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setErrores({}); }}
                  disabled={misPrestamosActuales.length >= 3}
                />
                {errores.fecha && <div className="invalid-feedback">{errores.fecha}</div>}
              </div>

              {/* Fila controlada para rango de Horarios */}
              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label small fw-bold">Hora Entrega</label>
                  <input
                    type="time"
                    className={`form-control ${errores.horaInicio ? 'is-invalid' : ''}`}
                    value={horaInicio}
                    onChange={(e) => { setHoraInicio(e.target.value); setErrores({}); }}
                    disabled={misPrestamosActuales.length >= 3}
                  />
                  {errores.horaInicio && <div className="invalid-feedback">{errores.horaInicio}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Hora Devolución</label>
                  <input
                    type="time"
                    className={`form-control ${errores.horaFin ? 'is-invalid' : ''}`}
                    value={horaFin}
                    onChange={(e) => { setHoraFin(e.target.value); setErrores({}); }}
                    disabled={misPrestamosActuales.length >= 3}
                  />
                  {errores.horaFin && <div className="invalid-feedback">{errores.horaFin}</div>}
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn w-100 py-2 fw-bold ${misPrestamosActuales.length >= 3 ? 'btn-secondary' : 'btn-primary'}`}
                disabled={misPrestamosActuales.length >= 3 || cargandoFormatos}
              >
                {misPrestamosActuales.length >= 3 ? 'Límite Permitido Alcanzado' : 'Confirmar Préstamo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
