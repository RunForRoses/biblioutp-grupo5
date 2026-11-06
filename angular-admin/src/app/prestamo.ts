export interface Prestamo {
  id: number;
  codigo: string;
  libroId: number;
  usuarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  creadoEn: string;
}
