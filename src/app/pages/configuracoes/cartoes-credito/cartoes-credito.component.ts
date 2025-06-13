import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { slugify } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { CartoesCreditoService } from './cartoes-credito.service';
import { CartaoCreditoForm } from './cartao-credito-form';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-cartoes-credito',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PreloaderComponent],
  templateUrl: './cartoes-credito.component.html',
  styleUrl: './cartoes-credito.component.css',
})
export class CartoesCreditoComponent implements OnInit {
  @ViewChild('modalCartaoCredito') modalCartaoCredito!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  public cartoes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public bandeiras$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public isLoading = false;
  protected searchControl = new FormControl();

  constructor(
    protected cartaoService: CartoesCreditoService,
    protected form: CartaoCreditoForm,
    private preloaderService: PreloaderService
  ) {}

  ngOnInit() {
    this.getCartoes();
    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((valor) => {
        this.preloaderService.show('progress-bar');
        this.getCartoes(valor);
      });
    this.cartaoService.getBandeiras().subscribe((results: any) => {
      this.bandeiras$.next(results);
    });
  }

  private getCartoes(valor?: string) {
    this.isLoading = true;
    this.preloaderService.show('progress-bar');
    this.cartaoService.getCartoes(valor).subscribe((results: any) => {
      this.cartoes$.next(results);
      this.isLoading = false;
      this.preloaderService.hide('progress-bar');
    });
  }

  parseNumber(value: string): number {
    return parseFloat(value);
  }

  openModal(id?: number) {
    const modalElement = this.modalCartaoCredito?.nativeElement;

    let modalOptions = {
      dismissible: false,
      startingTop: '100px',
      endingTop: '100px',
      onOpenStart: () => {
        this.form.submitForm(id);
      },
      onCloseEnd: () => {
        this.form.reset();
      },
    };

    let modal = M.Modal.init(modalElement, modalOptions);
    modal.open();
  }

  private getBandeira(id: any) {
    return this.bandeiras$.value.find((b) => b.id === parseInt(id));
  }

  save() {
    this.form.disable();
    let rawCartao = this.form.getValues();
    let id = rawCartao.id;
    delete rawCartao.id;

    const bandeiraCartao = this.getBandeira(rawCartao.id_bandeira);

    // esta variável, adiciono-a localmente
    const cartao = {
      ...rawCartao,
      limite: rawCartao.limite ?? 0,
      bandeira: bandeiraCartao?.bandeira,
      compartilhado: rawCartao.compartilhado ? '1' : '0',
      status: rawCartao.status ? '1' : '0',
    };

    //esta é a variável que envio para o back-end
    const newCartao = {
      ...rawCartao,
      compartilhado: rawCartao.compartilhado ? '1' : '0',
      status: rawCartao.status ? '1' : '0',
    };

    const cartoes = [...this.cartoes$.value];

    if (!id) {
      cartoes.push(cartao);
    } else {
      const index = cartoes.findIndex((c) => c.id === id);
      if (index !== -1) cartoes[index] = cartao;
    }

    // Adiciona o novo registro à lista localmente
    this.cartoes$.next(cartoes);

    let modalCartao = this.modalCartaoCredito?.nativeElement;
    let modal = M.Modal.getInstance(modalCartao);
    modal.close();

    this.cartaoService.saveCartao(newCartao, id).subscribe((res: any) => {
      toast(res.message);

      /***********************************************************************
       * É necessário ter este bloco para atualizar o ID do banco de dados
       * para evitar erros na aplicação. Caso não seja atualizado o ID,
       * ao tentar editar ou remover o registro, o back-end irá apresentar erro
       * devido à falta do ID.
       * Visualmente, nada será atualizado para o usuário.
       ***********************************************************************/
      const index = this.cartoes$.value.findIndex((item) => {
        console.log(item, item.id, res.transaction);
        return !item.id || item.id === res.cartao.id;
      });

      if (index !== -1) {
        const novoCartao = [...this.cartoes$.value];
        novoCartao[index] = res.cartao;
        this.cartoes$.next(novoCartao);
      }
      /***********************************************************************/
    });
  }

  updateStatus(updatedItem: any) {
    const originalStatus = updatedItem.status;
    updatedItem.status = originalStatus === '1' ? '0' : '1';

    const newItem = {
      id_usuario: updatedItem.id_usuario,
      id_bandeira: updatedItem.id_bandeira,
      titulo: updatedItem.titulo,
      digito_verificador: updatedItem.digito_verificador,
      limite: updatedItem.limite,
      limite_utilizado: updatedItem.limite_utilizado,
      compartilhado: updatedItem.compartilhado,
      status: updatedItem.status,
    };

    return this.cartaoService.atualizaStatus(updatedItem.id, newItem).subscribe(
      (res: any) => {
        if (res.success) {
          // toast(res.message);
        }
      },
      (err: any) => {
        updatedItem.status = originalStatus;
        toast(err.error.message);
      }
    );
  }

  deleteCartao(id: number) {
    let originalList = [...this.cartoes$.value];
    let modalDialog = this.modalDialog?.nativeElement;
    let modal = M.Modal.getInstance(modalDialog);
    if (modal) {
      modal.close();
    }

    const cartoes = this.cartoes$.value.filter((item) => item.id !== id);
    this.cartoes$.next(cartoes);

    this.cartaoService.removeCartao(id).subscribe(
      (res: any) => {
        if (res.success) {
          toast(res.message);
        }
        this.cartoes$.next(this.cartoes$.value);
      },
      (err: any) => {
        this.cartoes$.next(originalList);
      }
    );
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
        this.deleteCartao(id);
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
