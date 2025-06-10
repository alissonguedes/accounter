import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TitleDirective } from '../../directives/title/title.directive';
import { PeriodoService } from '../../shared/periodo.service';
import { HttpService } from '../../services/http.service';
import { PreloaderService } from '../../services/preloader/preloader.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TitleDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private periodoService: PeriodoService,
    private http: HttpService,
    private preloaderService: PreloaderService
  ) {}

  ngOnInit() {
    this.periodoService.periodo$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((periodo) => {
          const inicio = periodo.inicio.toISOString().split('T').splice(0, 1).join().split('-').splice(0, 2).join('-');
          this.preloaderService.show('progress-bar');

          return forkJoin({
            entradas: this.http.get(`transactions/entradas?periodo=${inicio}`),
            saidas: this.http.get(`transactions/saidas?periodo=${inicio}`),
            patrimonio: this.http.get(`transactions/patrimonio?periodo=${inicio}`),
          });
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
