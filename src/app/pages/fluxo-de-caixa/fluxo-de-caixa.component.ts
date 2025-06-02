import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';
import { HeaderDirective } from '../../directives/page/header.directive';
import { PeriodoService } from '../../shared/periodo.service';
import { ShowCalendar } from '../../layouts/main-layout/show-calendar';

declare const window: any;

@Component({
  selector: 'app-fluxo-de-caixa',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    TitleDirective,
    HeaderDirective,
  ],
  templateUrl: './fluxo-de-caixa.component.html',
  styleUrl: './fluxo-de-caixa.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FluxoDeCaixaComponent {
  mes: string = this.calendar.getMonth() ?? '';
  ano: number = this.calendar.getSelectedYear();
  route = window.location.href.split('/').splice(-1).join();

  periodo = this.periodoService.periodo$;

  constructor(
    protected calendar: ShowCalendar,
    public periodoService: PeriodoService
  ) {
	console.log(this.periodo);
  }
}
