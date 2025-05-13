// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';
// import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';

// import { PreloaderService } from '../../../services/preloader/preloader.service';
// import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
// import { ItemNode } from '../../../shared/nestable/item-node.model';
// import { slugify } from '../../../app.config';

// import { CarteiraService } from './carteira.service';
// import { CarteiraForm } from './carteira-form';

// declare const M: any;
// declare const document: any;

// @Component({
//   selector: 'app-carteiras-digitais',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     // NestableComponent,
//     PreloaderComponent,
//   ],
//   templateUrl: './carteiras-digitais.component.html',
//   styleUrl: './carteiras-digitais.component.css',
// })
// export class CarteirasDigitaisComponent implements OnInit {
//   @ViewChild('modalCarteira') modalCarteira!: ElementRef;
//   @ViewChild('modalDialog') modalDialog!: ElementRef;

//   //   public carteiras: ItemNode[] = [];
//   public carteiras: any = [];
//   public isLoading = false;

//   protected searchControl = new FormControl();

//   constructor(
//     protected carteiraService: CarteiraService,
//     protected carteiraForm: CarteiraForm,
//     protected preloaderService: PreloaderService
//   ) {}

//   ngOnInit() {
//     this.getCarteiras();

//     // Adiciona o evento de pesquisa no input[id="search"]
//     this.searchControl.valueChanges
//       .pipe(debounceTime(200), distinctUntilChanged())
//       .subscribe((valor) => {
//         this.getCarteiras(valor);
//       });
//   }

//   private getCarteiras(valor?: string) {
//     this.isLoading = true;
//     this.carteiras = [];

//     return this.carteiraService.getCarteiras(valor).subscribe(
//       (results) => {
//         this.carteiras = results;
//         this.isLoading = false;
//       },
//       (error) => {
//         alert('Not found');
//       }
//     );
//   }

//   openModal(id?: number) {
//     const modalElement = this.modalCarteira.nativeElement;
//     let modalOptions = {
//       dismissible: false,
//       startingTop: '100px',
//       endingTop: '100px',
//       onOpenStart: () => {
//         this.carteiraForm.submitForm(id);
//       },
//       onCloseEnd: () => {
//         this.carteiraForm.reset();
//       },
//     };
//     let modal = M.Modal.init(modalElement, modalOptions);
//     modal.open();
//   }

//   replaceTitulo() {
//     const titulo = this.carteiraForm.getForm().get('titulo')?.value;
//     const slug = slugify(titulo);
//     return this.carteiraForm.getForm().get('titulo_slug')?.setValue(slug);
//   }

//   save() {
//     this.carteiraForm.disable();
//     let values = this.carteiraForm.getValues();
//     values.compartilhado = values.compartilhado ? '1' : '0';
//     values.status = values.status ? 'ativa' : 'inativa';
//     this.carteiraService.saveCarteira(values).subscribe(
//       (ok: any) => {
//         this.carteiraForm.enable();
//         this.carteiraForm.alert(ok.success, ok.message);
//         this.getCarteiras(this.searchControl.value);
//         let modalCarteira = this.modalCarteira.nativeElement;
//         let modal = M.Modal.getInstance(modalCarteira);
//         modal.close();
//       },
//       (err: any) => {}
//     );
//   }

//   /**
//    * Muda status:
//    * 1 - ativo; 2 - inativo
//    */
//   updateStatus(item: any) {
//     const originalStatus = item.status;
//     item.status = originalStatus === 'ativa' ? 'inativa' : 'ativa';
//     return this.carteiraService
//       .atualizaStatus(item.id, { status: item.status })
//       .subscribe(
//         (ok: any) => {
//           if (ok.success) {
//             this.getCarteiras(this.searchControl.value);
//           }
//         },
//         (error) => {
//           item.status = originalStatus;
//           this.carteiraForm.alert(500, 'Erro ao atualizar categoria');
//         }
//       );
//   }

//   dialog(id: number) {
//     const modalElement = this.modalDialog.nativeElement;
//     let modalOptions = {
//       startingTop: '30%',
//       endingTop: '30%',
//       onOpenStart: () => {
//         let btn_delete = modalElement.querySelector('.btn-confirm');
//         if (btn_delete) {
//           btn_delete.addEventListener('click', () => this.delete(id));
//         }
//       },
//       onCloseEnd: () => {},
//     };
//     let modal = M.Modal.init(modalElement, modalOptions);
//     modal.open();
//   }

//   delete(id: number) {
//     this.carteiraService.removeCarteira(id).subscribe((ok: any) => {
//       if (ok.success) {
//         this.carteiraForm.enable();
//         this.carteiraForm.alert(ok.success, ok.message);
//         this.getCarteiras();
//         // this.getCategorias(this.searchControl.value);
//         let modalDialog = this.modalDialog.nativeElement;
//         let dialog = M.Modal.getInstance(modalDialog);
//         dialog.close();
//       }
//     });
//   }
// }

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { ItemNode } from '../../../shared/nestable/item-node.model';
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
  //   public carteiras$ = new BehaviorSubject<any[]>([]); // BehaviorSubject para gerenciar o estado das carteiras
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
      },
      (error) => {
        alert('Not found');
      }
    );
  }

  save() {
    this.carteiraForm.disable();
    let savedItem = this.carteiraForm.getValues();
    savedItem.compartilhado = savedItem.compartilhado ? '1' : '0';
    savedItem.status = savedItem.status ? 'ativa' : 'inativa';

    // Envia a atualização para o backend
    this.carteiraService.saveCarteira(savedItem).subscribe(
      (ok: any) => {
        this.carteiraForm.alert(ok.success, ok.message);
        this.getCarteiras(this.searchControl.value); // Recarrega os dados do servidor caso falhe
        let modalCarteira = this.modalCarteira.nativeElement;
        let modal = M.Modal.getInstance(modalCarteira);
        modal.close();
      },
      (err: any) => {
        alert('Erro ao atualizar no servidor');
        this.getCarteiras(); // Recarrega os dados do servidor caso falhe
      }
    );
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
