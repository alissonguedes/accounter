import {
  inject,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  Observable,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FluxoDeCaixaComponent } from './fluxo-de-caixa.component';
import { PeriodoService } from '../../shared/periodo.service';

@Component({
  selector: 'app-transacoes',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  providers: [FluxoDeCaixaComponent],
  templateUrl: './transacoes.component.html',
  styleUrl: './transacoes.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TransacoesComponent implements OnInit {
  @ViewChild('modalForm') modalForm!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  caixa = inject(FluxoDeCaixaComponent);
  periodoService = inject(PeriodoService);

  protected service: any;

  public transaction$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  protected destroy$ = new Subject<void>();
  protected searchControl = new FormControl();

  //   protected transaction: any;

  //   constructor(
  //     public caixa?: FluxoDeCaixaComponent,
  //     public periodoService?: PeriodoService
  //   ) {}

  ngOnInit() {
    this.periodoService.periodo$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((periodo: any) => {
          let mes = periodo.inicio.toISOString().substring(0, 7);
          let tra = this.getTransaction(this.caixa.periodoSelecionado);
          return mes;
        })
      )
      .subscribe((resp: any) => console.log(resp));

    /**
     * Ativa o campo de pesquisa
     */
    this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((searchTerm: any) => {
          //   return this.service(this.caixa.periodoSelecionado, searchTerm);
          return '';
        })
      )
      .subscribe();
  }

  getTransaction(periodo: any, searchTerm?: any): any {}
}
