import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

@Component({
  selector: 'app-aplicativos',
  imports: [TitleDirective, HeaderDirective, RouterLink],
  templateUrl: './aplicativos.component.html',
  styleUrl: './aplicativos.component.css',
  providers: [FluxoDeCaixaComponent],
  encapsulation: ViewEncapsulation.None,
})
export class AplicativosComponent {
  constructor(protected caixa: FluxoDeCaixaComponent) {}
}
