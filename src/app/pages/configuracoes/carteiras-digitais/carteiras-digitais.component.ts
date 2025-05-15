import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { slugify } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { CarteiraService } from './carteira.service';
import { CarteiraForm } from './carteira-form';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-carteiras-digitais',
  imports: [CommonModule, ReactiveFormsModule, PreloaderComponent],
  templateUrl: './carteiras-digitais.component.html',
  styleUrl: './carteiras-digitais.component.css',
})
export class CarteirasDigitaisComponent implements OnInit {
  @ViewChild('modalCarteira') modalCarteira!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  public carteiras$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public isLoading = false;
  protected searchControl = new FormControl();

  constructor(
    protected carteiraService: CarteiraService,
    protected carteiraForm: CarteiraForm,
    protected preloaderService: PreloaderService
  ) {}

  ngOnInit() {
    this.getCarteiras();

    // Adiciona o evento de pesquisa no input[id="search"]
    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((valor) => {
        this.preloaderService.show('progress-bar');
        this.getCarteiras(valor);
      });
  }

  private getCarteiras(valor?: string) {
    this.isLoading = true;

    // Requisição ao backend para pegar as carteiras
    this.carteiraService.getCarteiras(valor).subscribe(
      (results: any) => {
        this.carteiras$.next(results); // Atualiza o estado do BehaviorSubject com as carteiras
        this.isLoading = false;
      },
      (error) => {
        alert('Not found');
      }
    );
  }

  save() {
    this.carteiraForm.disable();
    const rawCarteira = this.carteiraForm.getValues();

    const carteira = {
      ...rawCarteira,
      compartilhado: rawCarteira.compartilhado ? '1' : '0',
      saldo_atual: rawCarteira.saldo_atual,
      status: rawCarteira.status ? 'ativa' : 'inativa',
    };

    const carteiras = [...this.carteiras$.value];

    if (!carteira.id) {
      carteiras.push(carteira);
    } else {
      const index = carteiras.findIndex((c) => c.id === carteira.id);
      if (index !== -1) carteiras[index] = carteira;
    }

    this.carteiras$.next(carteiras);
    let modalCarteira = this.modalCarteira.nativeElement;
    let modal = M.Modal.getInstance(modalCarteira);
    modal.close();

    this.carteiraService.saveCarteira(carteira).subscribe({
      next: (res: any) => {
        toast(res.message);

        const c = res.carteira;
        const updated = {
          id: c.id,
          titulo: c.titulo,
          titulo_slug: c.titulo_slug,
          saldo_atual: c.saldo_atual,
          status: c.status,
        };

        const index = this.carteiras$.value.findIndex(
          (item) => !item.id || item.id === updated.id
        );

        if (index !== -1) {
          const updatedCarteiras = [...this.carteiras$.value];
          updatedCarteiras[index] = updated;
          this.carteiras$.next(updatedCarteiras);
        }
      },
      error: () => {
        alert('Erro ao atualizar no servidor');
        this.getCarteiras(this.searchControl.value);
      },
    });
  }

  /**
   * Muda status:
   * 1 - ativo; 2 - inativo
   */
  updateStatus(updatedItem: any) {
    const originalStatus = updatedItem.status;
    updatedItem.status = originalStatus === 'ativa' ? 'inativa' : 'ativa';

    const index = this.carteiras$.value.findIndex(
      (item) => item.id === updatedItem.id
    );
    if (index !== -1) {
      // Atualiza localmente no BehaviorSubject
      this.carteiras$.value[index] = updatedItem;
      this.carteiras$.next([...this.carteiras$.value]); // Emite o novo valor para os observadores
    }

    return this.carteiraService
      .atualizaStatus(updatedItem.id, { status: updatedItem.status })
      .subscribe(
        (ok: any) => {
          if (ok.success) {
            // this.getCarteiras(this.searchControl.value);
          }
        },
        (error) => {
          updatedItem.status = originalStatus;
          this.carteiraForm.alert(500, 'Erro ao atualizar categoria');
        }
      );
  }

  deleteCarteira(id: number) {
    // Remove a carteira do estado local
    const updatedCarteiras = this.carteiras$.value.filter(
      (item) => item.id !== id
    );

    this.carteiras$.next(updatedCarteiras);

    let modalDialog = this.modalDialog.nativeElement;
    let modal = M.Modal.getInstance(modalDialog);
    modal.close();

    // Exclui a carteira no backend
    this.carteiraService.removeCarteira(id).subscribe(
      (ok: any) => {
        toast(ok.message);
      },
      (err: any) => {
        alert('Erro ao excluir no servidor');
        this.getCarteiras(this.searchControl.value); // Recarrega os dados do servidor caso falhe
      }
    );
  }

  openModal(id?: number) {
    const modalElement = this.modalCarteira.nativeElement;
    let modalOptions = {
      dismissible: false,
      startingTop: '100px',
      endingTop: '100px',
      onOpenStart: () => {
        this.carteiraForm.submitForm(id);
      },
      onCloseEnd: () => {
        this.carteiraForm.reset();
      },
    };
    let modal = M.Modal.init(modalElement, modalOptions);
    modal.open();
  }

  replaceTitulo() {
    const titulo = this.carteiraForm.getForm().get('titulo')?.value;
    const slug = slugify(titulo);
    return this.carteiraForm.getForm().get('titulo_slug')?.setValue(slug);
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
        this.deleteCarteira(id);
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
