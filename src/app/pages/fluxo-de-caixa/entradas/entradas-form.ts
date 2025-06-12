import { Injectable, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { greaterThanZeroValidator } from '../../../app.config';

import { Form } from '../../../shared/form';

import { EntradasService } from './entradas.service';

declare const document: any;
@Injectable({
  providedIn: 'root',
})
export class EntradasForm extends Form {
  private entradaService = inject(EntradasService);

  form = this.fb.group({
    id: [{ value: '', disabled: true }],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required, greaterThanZeroValidator()]],
    data: ['', [Validators.required]],
    tipo: ['receitas', [Validators.required]],
    categoria: ['', [Validators.required]],
    // formaPagamento: ['', [Validators.required]],
    // parcelas: ['', [Validators.required]],
  });

  submitForm(id?: any) {
    this.preloaderService.show('preloader-entrada');
    this.disable();

    if (!id) {
      return setTimeout(() => {
        this.preloaderService.hide('preloader-entrada');
        this.enable();
        this.form.get('parcelas')?.disable();
        this.form.get('tipo')?.setValue('receitas');
      }, 100);
    }
    return '';
  }
}
