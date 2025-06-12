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
} from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { slugify, currency } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { CategoriaService } from '../../configuracoes/categorias/categoria.service';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';
import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';
import { MaskDirective } from '../../../directives/mask/mask.directive';
import { PeriodoService } from '../../../shared/periodo.service';

import { EntradasModel } from './entradas.model';
import { EntradasForm } from './entradas-form';
import { EntradasService } from './entradas.service';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-entradas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleDirective,
    HeaderDirective,
    RouterLink,
    PreloaderComponent,
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

  constructor(
    protected caixa: FluxoDeCaixaComponent,
    protected entradasForm: EntradasForm,
    protected entradasService: EntradasService,
    protected categoriaService: CategoriaService,
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
          let per = periodo.inicio
            .toISOString()
            .split('T')
            .splice(0, 1)
            .join()
            .split('-')
            .splice(0, 2)
            .join('-');

          this.entradasService.getEntradas(per).subscribe((response: any) => {
            this.entradas$.next(response);
          });
          return per;
        })
      )
      .subscribe();

    this.categoriaService
      .getCategorias(null, 'receitas')
      .subscribe((res: any) => {
        this.categorias$.next(res);
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

  getResumo() {
    // this.entradasService.getEntradas().subscribe((response: any) => {
    //   console.log(response);
    // });
  }

  toggleInputParcelas(event?: any): any {
    let input = this.entradasForm.getForm().get('parcelas');
    let value = event.target.value;
    if (value !== 'cartao') input?.disable();
    else input?.enable();
  }

  save() {
    this.entradasForm.disable();
    const rawEntrada = this.entradasForm.getValues();
    const id = rawEntrada.id;
    const categoria = rawEntrada.categoria;
    delete rawEntrada.id;
    delete rawEntrada.categoria;

    const novaEntrada = {
      ...rawEntrada,
      valor: parseInt(rawEntrada.valor.replace(/\W/g, '')),
      categoria: document.querySelector(
        `#categoria option[value="${categoria}"]`
      ).innerText,
    };

    // Esta variável envio para o back-end
    const entrada = {
      ...rawEntrada,
      id_categoria: categoria,
      valor: parseInt(rawEntrada.valor.replace(/\W/g, '')),
      data: rawEntrada.data.split('/').reverse().join('-'),
      compartilhado: rawEntrada.compartilhado ? '1' : '0',
    };

    const entradasValues = [...this.entradas$.value];

    if (!id) {
      entradasValues.push(novaEntrada);
    } else {
      const index = entradasValues.findIndex((c) => c.id === id);
      if (index !== -1) entradasValues[index] = novaEntrada;
    }

    this.entradas$.next(entradasValues);

    let modal = M.Modal.getInstance(this.modalForm?.nativeElement);
    modal.close();

    this.entradasService.saveEntrada(entrada, id).subscribe((res: any) => {
      toast(res.message);

      const index = this.entradas$.value.findIndex(
        (item) => !item.id || item.id === res.transaction.id
      );

      if (index !== -1) {
        entradasValues[index] = res.transaction;
        this.entradas$.next(entradasValues);
      }
    });
  }

  deleteEntrada(id: number) {
    // Remove a carteira do estado local
    const entradas = this.entradas$.value.filter((item) => item.id !== id);

    console.log(entradas);

    // this.carteiras$.next(updatedCarteiras);
    // let modalDialog = this.modalDialog.nativeElement;
    // let modal = M.Modal.getInstance(modalDialog);
    // modal.close();
    // // Exclui a carteira no backend
    // this.carteiraService.removeCarteira(id).subscribe(
    //   (ok: any) => {
    // 	toast(ok.message);
    //   },
    //   (err: any) => {
    // 	alert('Erro ao excluir no servidor');
    // 	this.getCarteiras(this.searchControl.value); // Recarrega os dados do servidor caso falhe
    //   }
    // );
  }

  openModal(id?: number) {
    const modalElement = this.modalForm.nativeElement;
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
