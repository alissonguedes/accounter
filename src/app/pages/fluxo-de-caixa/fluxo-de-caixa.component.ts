import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';
import { HeaderDirective } from '../../directives/page/header.directive';
import { PeriodoService } from '../../shared/periodo.service';
import { ShowCalendar } from '../../layouts/main-layout/show-calendar';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';

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
export class FluxoDeCaixaComponent implements OnInit, OnDestroy {
  mes: string = '';
  ano: number = this.calendar.getSelectedYear();
  route = window.location.href.split('/').splice(-1).join();

  private destroy$ = new Subject<void>();

  periodo = this.periodoService.periodo$;

  constructor(
    protected calendar: ShowCalendar,
    public periodoService: PeriodoService
  ) {}

  ngOnInit(): void {
    this.periodoService.periodo$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((periodo) => {
          let m = parseInt(
            periodo.inicio
              .toISOString()
              .split('T')
              .splice(0, 1)
              .join()
              .split('-')
              .splice(1, 1)
              .join()
          );

          this.mes = this.calendar.getSelectedMonth()[m - 1];

          return this.mes;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
