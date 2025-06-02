import { Component, ViewEncapsulation } from '@angular/core';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

@Component({
  selector: 'app-entradas',
  imports: [TitleDirective, HeaderDirective],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.css',
//   encapsulation: ViewEncapsulation.None,
})
export class EntradasComponent {
  constructor(protected caixa: FluxoDeCaixaComponent) {}
}
