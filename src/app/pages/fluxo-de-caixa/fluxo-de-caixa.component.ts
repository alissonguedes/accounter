import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';
// import { HeaderDirective } from '../../directives/page/header.directive';
import { PeriodoService } from '../../shared/periodo.service';
import { ShowCalendar } from '../../layouts/main-layout/show-calendar';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin, BehaviorSubject } from 'rxjs';
import { PreloaderService } from '../../services/preloader/preloader.service';

import { EntradasModel } from './entradas/entradas.model';

declare const window: any;

@Component({
  selector: 'app-fluxo-de-caixa',
  imports: [
    CommonModule,
    RouterLink,
    TitleDirective,
    // HeaderDirective,
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
  periodoSelecionado = this.calendar.date.toISOString().split('T').splice(0, 1).join().split('-').splice(0, 2).join('-');

  entradas$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    public calendar: ShowCalendar,
    public periodoService: PeriodoService,
    private entradas: EntradasModel,
    private preloaderService: PreloaderService
  ) {
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

          this.preloaderService.show('progress-bar');
          this.mes = this.calendar.getSelectedMonth()[m - 1];
          this.getResumo(
            periodo.inicio
              .toISOString()
              .split('T')
              .splice(0, 1)
              .join()
              .split('-')
              .splice(0, 2)
              .join('-')
          );

          return this.mes;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  getResumo(periodo: any) {
    let entradas = this.entradas.getResumo(periodo).subscribe((response) => {
      let valorTotal = 0;

      for (let v of response) {
        valorTotal += v.valor / 100;
      }

      this.entradas$.next(valorTotal);
    });
  }

  openSearchInput() {
    let tit: any = document.querySelector('.page-header .title-header');
    let btn: any = document.querySelector('#btn-search');
    let src: any = document.querySelector('.search-header');
    let input: any = src.querySelector('input[type="search"]');

    if (!src.classList.contains('open')) {
      src.classList.add('open');
      btn.style.display = 'none';
      input.focus();
      if (window.innerWidth < 992) {
        tit.style.display = 'none';
      }
    } else {
      src.classList.remove('open');
      btn.style.display = 'block';
      if (window.innerWidth < 992) {
        tit.style.display = 'block';
      }
    }
  }

  closeSearchInput() {
    let tit: any = document.querySelector('.page-header .title-header');
    let btn: any = document.querySelector('#btn-search');
    let src: any = document.querySelector('.search-header');
    let input: any = src.querySelector('input[type="search"]');

    if (input.value.length < 1) {
      src.classList.remove('open');
      btn.style.display = 'block';
      setTimeout(() => {
        tit.style.display = 'block';
      }, 100);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
