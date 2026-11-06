import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { PrestamosService } from '../prestamos.service';
import { Prestamo } from '../prestamo';

@Component({
  selector: 'app-prestamos-lista',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './prestamos-lista.html',
  styleUrl: './prestamos-lista.css',
})
export class PrestamosListaComponent implements OnInit {
  private readonly prestamosService = inject(PrestamosService);
  private readonly cdr = inject(ChangeDetectorRef);

  prestamos: Prestamo[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.prestamosService.listar().subscribe({
      next: (datos) => {
        this.prestamos = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los préstamos. Verifica que api-mock esté activo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
