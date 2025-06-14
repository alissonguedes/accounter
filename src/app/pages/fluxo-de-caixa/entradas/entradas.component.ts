import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  BehaviorSubject,
  Subject,
  forkJoin,
  of,
} from 'rxjs';
import {
  switchMap,
  takeUntil,
  map,
  tap,
  catchError,
  finalize,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http'; // Para melhor tratamento de erros HTTP

import { PreloaderService } from '../../../services/preloader/preloader.service';

import { slugify, currency } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { CategoriaService } from '../../configuracoes/categorias/categoria.service';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';
import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';
import { MaskDirective } from '../../../directives/mask/mask.directive';
import { PeriodoService } from '../../../shared/periodo.service';

import { ShowCalendar } from '../../../layouts/main-layout/show-calendar';
import { EntradasModel } from './entradas.model';
import { EntradasForm } from './entradas-form';
import { EntradasService } from './entradas.service';

declare const M: any;
declare const document: any;

// Assumindo que você tem uma interface para Entradas
interface Entrada {
  id: number;
  valor: number; // Supondo que o valor vem em centavos
  // ... outras propriedades
}

@Component({
  selector: 'app-entradas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleDirective,
    HeaderDirective,
    RouterLink,
    MaskDirective,
  ],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.css',
  providers: [FluxoDeCaixaComponent],
  encapsulation: ViewEncapsulation.None,
})
export class EntradasComponent implements OnInit, AfterViewInit {
  @ViewChild('modalForm') modalForm!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;
  @ViewChild('datepicker') datepicker!: ElementRef;

  public entradas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public categorias$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public isLoading = false;
  protected searchControl = new FormControl();
  private destroy$ = new Subject<void>();

  valorTotal = 0;
  mediaDia = 0;
  mesAnterior = 0;
  mesAnteriorTotal = 0;

  constructor(
    protected caixa: FluxoDeCaixaComponent,
    protected entradasForm: EntradasForm,
    protected entradasService: EntradasService,
    protected categoriaService: CategoriaService,
    protected calendar: ShowCalendar,
    protected periodoService: PeriodoService,
    protected preloaderService: PreloaderService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.periodoService.periodo$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((periodo) => {
          let per = periodo.inicio.toISOString().substring(0, 7);
          this.getEntradas(per);
          return per;
        })
      )
      .subscribe();

    this.categoriaService
      .getCategorias(null, 'receitas')
      .subscribe((res: any) => {
        this.categorias$.next(res);
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((searchTerm: any) => {
          return this.entradasService.getEntradas(
            this.caixa.periodoSelecionado,
            searchTerm
          );
        })
      )
      .subscribe((searchTerm) => {
        this.entradas$.next(searchTerm);
      });
  }

  private calcularValorTotal(entradas: Entrada[]): number {
    if (!entradas || entradas.length === 0) {
      return 0;
    }

    return entradas.reduce((acc, entry) => acc + entry.valor / 100, 0);
  }

  private getEntradas(periodoStr?: string, search?: string) {
    this.isLoading = true;
    if (!periodoStr) {
      console.warn('Período não fornecido para getEntradas.');
      return;
    }

    const partesPeriodo = periodoStr.split('-');
    if (partesPeriodo.length !== 2) {
      console.error(
        'Formato de período inválido. Esperado YYYY-MM.',
        periodoStr
      );
      return;
    }

    const anoAtual = parseInt(partesPeriodo[0], 10);
    const mesAtual = parseInt(partesPeriodo[1], 10); // Mês base 1 (1 = Janeiro)

    const mesAnteriorStr = this.calendar.getMesAnteriorFormatado(
      anoAtual,
      mesAtual
    );
    const ultimoDiaMesAtual = this.calendar.getUltimoDiaDoMes(
      anoAtual,
      mesAtual
    );

    forkJoin({
      entradasAtuais: this.entradasService.getEntradas(periodoStr, search),
      entradasMesAnterior: this.entradasService.getEntradas(mesAnteriorStr),
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(
            'Erro ao carregar entradas ou dados do mês anterior:',
            error
          );
          toast('Erro ao carregar dados. Tente novamente.');
          return of({ entradasAtuais: [], entradasMesAnterior: [] });
        }),
        map(({ entradasAtuais, entradasMesAnterior }) => {
          const valorTotalAtual = this.calcularValorTotal(entradasAtuais);
          const valorTotalMesAnterior =
            this.calcularValorTotal(entradasMesAnterior);

          return {
            entradas: entradasAtuais,
            valorTotal: valorTotalAtual,
            mediaDia: valorTotalAtual / ultimoDiaMesAtual,
            mesAnteriorTotal: valorTotalMesAnterior,
          };
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.entradas$.next(data.entradas);
          this.valorTotal = data.valorTotal;
          this.mediaDia = Number(data.mediaDia.toFixed(2));
          this.mesAnteriorTotal = data.mesAnteriorTotal;
        },
        error: (err) => {
          console.error('Erro final no subscribe:', err);
        },
      });
  }

  ngAfterViewInit() {
    const options = {
      container: 'body',
      autoClose: true,
      format: 'dd/mm/yyyy',
      onSelect: (date: Date) => {
        const formated = this.formatDate(date);
        this.entradasForm.getForm().get('data')?.setValue(formated);
        this.entradasForm.getForm().get('data')?.markAsTouched();
        this.entradasForm.getForm().get('data')?.markAsDirty();
        this.entradasForm.getForm().get('data')?.updateValueAndValidity();
      },
    };

    M.Datepicker.init(this.datepicker.nativeElement, options);
  }

  formatDate(date: Date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.entradasForm.getForm().get('data')?.setValue(value);
  }

  toggleInputParcelas(event?: any): any {
    let input = this.entradasForm.getForm().get('parcelas');
    let value = event.target.value;
    if (value !== 'cartao') input?.disable();
    else input?.enable();
  }

  private getEntradasAtuaisERecalcularTotais(
    periodoStr: string,
    search?: string
  ) {
    // Garante que o período e o search sejam passados para a API de entradas atuais
    this.entradasService
      .getEntradas(periodoStr, search)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao carregar entradas atuais:', error);
          toast('Erro ao recarregar dados. Tente novamente.');
          return of([]);
        })
      )
      .subscribe((response: Entrada[]) => {
        this.entradas$.next(response);
        this.valorTotal = this.calcularValorTotal(response);
        const ultimoDiaMesAtual = this.calendar.getUltimoDiaDoMes(
          parseInt(periodoStr.split('-')[0]),
          parseInt(periodoStr.split('-')[1])
        );
        this.mediaDia = Number(
          (this.valorTotal / ultimoDiaMesAtual).toFixed(2)
        );
      });
  }

  save() {
    this.entradasForm.disable();
    const rawEntrada = this.entradasForm.getValues();
    const id = rawEntrada.id;
    const categoria = rawEntrada.categoria;
    delete rawEntrada.id;
    delete rawEntrada.categoria;

    // Esta variável envio para o back-end
    const entrada = {
      ...rawEntrada,
      id_categoria: categoria,
      valor: parseInt(rawEntrada.valor.replace(/\W/g, '')),
      data: rawEntrada.data.split('/').reverse().join('-'),
      compartilhado: rawEntrada.compartilhado ? '1' : '0',
    };

    let modal = M.Modal.getInstance(this.modalForm?.nativeElement);

    this.entradasService
      .saveEntrada(entrada, id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.entradasForm.enable();
          modal.close();
        }),
        catchError((error: HttpErrorResponse) => {
          toast('Erro ao salvar no servidor. Tente novamente.');
          console.error('Erro ao salvar entrada:', error);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res) {
          toast(res.message);
          // Chama o método para recarregar apenas as entradas do mês atual, mantendo o filtro de busca
          this.getEntradasAtuaisERecalcularTotais(
            this.caixa.periodoSelecionado,
            this.searchControl.value
          );
        }
      });
  }

  deleteEntrada(id: number) {
    const originalEntradas = [...this.entradas$.value];
    const entradas = this.entradas$.value.filter((item) => item.id !== id);

    this.entradas$.next(entradas);

    let modalDialog = this.modalDialog.nativeElement;
    let modal = M.Modal.getInstance(modalDialog);
    modal.close();

    this.entradasService
      .removeEntrada(id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err: HttpErrorResponse) => {
          toast('Erro ao excluir no servidor.');
          console.error('Erro ao excluir entrada:', err);
          this.entradas$.next(originalEntradas);
          return of(null);
        })
      )
      .subscribe((ok: any) => {
        if (ok) {
          toast(ok.message);
          // Chama o método para recarregar apenas as entradas do mês atual, mantendo o filtro de busca
          this.getEntradasAtuaisERecalcularTotais(
            this.caixa.periodoSelecionado,
            this.searchControl.value
          );
        }
      });
  }

  openModal(id?: number) {
    const modalElement = this.modalForm?.nativeElement;
    let modalOptions = {
      dismissible: false,
      startingTop: '100px',
      endingTop: '100px',
      onOpenStart: () => {
        this.entradasForm.submitForm(id);
      },
      onCloseEnd: () => {
        this.entradasForm.reset();
      },
    };
    let modal = M.Modal.init(modalElement, modalOptions);
    modal.open();
  }

  dialog(id: number): void {
    const modalElement = this.modalDialog?.nativeElement;

    if (!modalElement) return;

    // Verifica se já há uma instância do modal
    let existingInstance = M.Modal.getInstance(modalElement);
    if (existingInstance) {
      existingInstance.destroy();
    }

    // Remove qualquer listener anterior para evitar múltiplas execuções
    const btnDelete = modalElement.querySelector('.btn-confirm');
    if (btnDelete) {
      const clonedBtn = btnDelete.cloneNode(true);
      btnDelete.parentNode.replaceChild(clonedBtn, btnDelete);

      clonedBtn.addEventListener('click', () => {
        this.deleteEntrada(id);
      });
    }

    const modalOptions = {
      startingTop: '30%',
      endingTop: '30%',
    };

    const modalInstance = M.Modal.init(modalElement, modalOptions);
    modalInstance.open();
  }
}
