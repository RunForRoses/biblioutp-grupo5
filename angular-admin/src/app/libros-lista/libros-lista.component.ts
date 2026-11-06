import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LibrosService } from '../libros.service';
import { Libro } from '../libro';
import { ResaltarAgotadoDirective } from '../directivas/resaltar-agotado';

@Component({
  selector: 'app-libros-lista',
  standalone: true,
  imports: [NgClass, RouterLink, ResaltarAgotadoDirective],
  templateUrl: './libros-lista.component.html',
  styleUrl: './libros-lista.component.css',
})
export class LibrosListaComponent implements OnInit {
  private readonly librosService = inject(LibrosService);
  private readonly cdr = inject(ChangeDetectorRef);
  libros: Libro[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.librosService.listar().subscribe({
      next: (libros) => {
        this.libros = libros;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el catálogo. Verifica que api-mock esté activo.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
  eliminarLibro(libro: Libro): void {
    const confirmar = confirm(`¿Eliminar el libro "${libro.nombre}"?`);

    if (!confirmar) return;

    this.librosService.eliminar(libro.id).subscribe({
      next: () => {
        this.libros = this.libros.filter((item) => item.id !== libro.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo eliminar el libro.';
      },
    });
  }
}
