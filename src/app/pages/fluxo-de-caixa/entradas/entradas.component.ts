import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

@Component({
  selector: 'app-entradas',
  imports: [TitleDirective, HeaderDirective, RouterLink],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.css',
  //   encapsulation: ViewEncapsulation.None,
  providers: [FluxoDeCaixaComponent],
})
export class EntradasComponent {
  constructor(protected caixa: FluxoDeCaixaComponent) {}
}
