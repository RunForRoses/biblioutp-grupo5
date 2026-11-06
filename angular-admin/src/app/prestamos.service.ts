import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from './prestamo';

@Injectable({ providedIn: 'root' })
export class PrestamosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/prestamos';

  listar(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }
}
