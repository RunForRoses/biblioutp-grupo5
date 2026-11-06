export interface Libro {
  id: number;
  nombre: string;
  sede: string;
  capacidad: number;
  formatos: string[];
  estado: 'disponible' | 'agotado';
}
