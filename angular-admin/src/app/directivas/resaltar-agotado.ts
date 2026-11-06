import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appResaltarAgotado]',
  standalone: true,
})
export class ResaltarAgotadoDirective implements OnChanges {
  private readonly elemento = inject(ElementRef);
  private readonly render = inject(Renderer2);

  @Input('appResaltarAgotado') estadoLibro = '';

  ngOnChanges(): void {
    const el = this.elemento.nativeElement;

    if (this.estadoLibro === 'agotado') {
      this.render.setStyle(el, 'backgroundColor', '#fef2f2');
      this.render.setStyle(el, 'borderLeft', '4px solid #ef4444');
    } else {
      this.render.removeStyle(el, 'backgroundColor');
      this.render.removeStyle(el, 'borderLeft');
    }
  }
}