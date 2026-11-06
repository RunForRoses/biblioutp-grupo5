import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCodigo = codigo.trim().toLowerCase();
    const cleanCorreo = correo.trim().toLowerCase();

    try {
      // Petición directa al servidor local usando el puerto 3000
      const response = await fetch('http://localhost:3000/usuarios');

      if (!response.ok) {
        throw new Error('Error al conectarse con el servidor de datos');
      }

      const listaUsuarios = await response.json();

      if (Array.isArray(listaUsuarios)) {
        // Buscamos el usuario ignorando diferencias de mayúsculas/minúsculas
        const usuarioEncontrado = listaUsuarios.find(
          (user) => 
            user.codigo?.toString().toLowerCase() === cleanCodigo && 
            user.correo?.toString().toLowerCase() === cleanCorreo
        );

        // Verificamos la contraseña exacta
        if (usuarioEncontrado && usuarioEncontrado.password === password) {
          setError('');
          login(usuarioEncontrado); // Enviamos el objeto completo (id, nombre, correo, codigo, rol) al AuthContext
          navigate('/catalogo');
        } else {
          setError('El código, correo o contraseña son incorrectos.');
        }
      } else {
        setError('Estructura de datos inválida en el servidor.');
      }
    } catch (err) {
      console.error("Error detectado en la petición fetch:", err);
      setError('No se pudo conectar al servidor de usuarios. Asegúrate de levantar JSON Server incluyendo la bandera --cors');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3 className="text-center fw-bold mb-4" style={{ color: '#0f172a' }}>Iniciar Sesión</h3>
            
            <form onSubmit={handleSubmit}>
              
              {/* Campo Código */}
              <div className="mb-3 text-center">
                <label className="form-label small fw-bold text-secondary">Código de Estudiante / Personal</label>
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Ej. A0001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>

              {/* Campo Correo */}
              <div className="mb-3 text-center">
                <label className="form-label small fw-bold text-secondary">Correo Institucional</label>
                <input
                  type="email"
                  className="form-control text-center"
                  placeholder="Ej. admin1@utp.edu.pe"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="mb-3 text-center">
                <label className="form-label small fw-bold text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control text-center"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Alerta de error */}
              {error && (
                <div 
                  className="alert text-center small py-2 mb-3" 
                  style={{ backgroundColor: '#fce8e6', color: '#a83232', border: '1px solid #f5c2c2', borderRadius: '6px' }} 
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Botón Ingresar */}
              <button 
                type="submit" 
                className="btn w-100 py-2.5 fw-bold mt-2 text-white"
                style={{ backgroundColor: '#0d6efd', borderRadius: '6px' }}
              >
                Ingresar al Sistema
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
