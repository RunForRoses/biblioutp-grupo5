import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from './libro';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/libros';

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }
  crear(libro: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }
  actualizar(id: number, libro: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, libro);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  obtenerPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }
}
