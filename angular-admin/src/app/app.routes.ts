import { Routes } from '@angular/router';
import { LibroFormComponent } from './libro-form/libro-form.component';
import { LibrosListaComponent } from './libros-lista/libros-lista.component';
import { PrestamosListaComponent } from './prestamos-lista/prestamos-lista';

export const routes: Routes = [
  { path: 'libros', component: LibrosListaComponent },
  { path: 'libros/nuevo', component: LibroFormComponent },
  { path: 'prestamos', component: PrestamosListaComponent },
  { path: 'libros/:id/editar', component: LibroFormComponent },
  { path: '', redirectTo: '/libros', pathMatch: 'full' },
  { path: '**', redirectTo: '/libros' },
];
