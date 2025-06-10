import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

@Component({
  selector: 'app-patrimonio',
  imports: [TitleDirective, HeaderDirective, RouterLink],
  templateUrl: './patrimonio.component.html',
  styleUrl: './patrimonio.component.css',
  providers: [FluxoDeCaixaComponent],
  encapsulation: ViewEncapsulation.None,
})
export class PatrimonioComponent {
  constructor(protected caixa: FluxoDeCaixaComponent) {}
}
