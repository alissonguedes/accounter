import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { slugify } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { AplicativoService } from './aplicativo.service';
import { AplicativoForm } from './aplicativo-form';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-aplicativos',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PreloaderComponent],
  templateUrl: './aplicativos.component.html',
  styleUrl: './aplicativos.component.css',
})
export class AplicativosComponent {
  @ViewChild('modalAplicativo') modalAplicativo!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  public aplicativos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public bandeiras$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public isLoading = false;
  protected searchControl = new FormControl();

  constructor(
    protected aplicativoService: AplicativoService,
    protected form: AplicativoForm,
    private preloaderService: PreloaderService
  ) {}

  parseNumber(value: string): number {
    return parseFloat(value);
  }

  openModal(id?: number) {
    const modalElement = this.modalAplicativo?.nativeElement;

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

  save() {
    this.form.disable();
    let rawApp = this.form.getValues();
    let id = rawApp.id;
    delete rawApp.id;

    const app = {
      ...rawApp,
      compartilhado: rawApp.compartilhado ? '1' : '0',
      status: rawApp.status ? '1' : '0',
    };

    const aplicativos = [...this.aplicativos$.value];

    if (!id) {
      aplicativos.push(app);
    } else {
      const index = aplicativos.findIndex((c) => c.id === id);
      if (index !== -1) aplicativos[index] = app;
    }

    this.aplicativos$.next(aplicativos);
    console.log(rawApp, app);
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

    return this.aplicativoService
      .atualizaStatus(updatedItem.id, newItem)
      .subscribe(
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

  deleteAplicativo(id: number) {
    let originalList = [...this.aplicativos$.value];
    let modalDialog = this.modalDialog?.nativeElement;
    let modal = M.Modal.getInstance(modalDialog);
    if (modal) {
      modal.close();
    }

    const aplicativos = this.aplicativos$.value.filter(
      (item) => item.id !== id
    );
    this.aplicativos$.next(aplicativos);

    this.aplicativoService.removeAplicativo(id).subscribe(
      (res: any) => {
        if (res.success) {
          toast(res.message);
        }
        this.aplicativos$.next(this.aplicativos$.value);
      },
      (err: any) => {
        this.aplicativos$.next(originalList);
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
        this.deleteAplicativo(id);
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
