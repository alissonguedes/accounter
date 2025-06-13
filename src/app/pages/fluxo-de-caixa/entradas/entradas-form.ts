import { Injectable, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { currency, greaterThanZeroValidator } from '../../../app.config';

import { Form } from '../../../shared/form';

import { EntradasService } from './entradas.service';

declare const document: any;
@Injectable({
  providedIn: 'root',
})
export class EntradasForm extends Form {
  private entradasService = inject(EntradasService);

  form = this.fb.group({
    id: [{ value: '', disabled: true }],
    descricao: ['', [Validators.required]],
    valor: ['', [(Validators.required, greaterThanZeroValidator())]],
    data: ['', [Validators.required]],
    tipo: ['receita', [Validators.required]],
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
        this.form.get('tipo')?.setValue('receita');
      }, 100);
    }
    return this.entradasService.getEntrada(id).subscribe((dados: any) => {
      let fields = {
        id: dados.id,
        descricao: dados.descricao,
        valor: currency(dados.valor / 100),
        data: dados.data,
        tipo: dados.tipo,
        categoria: dados.id_categoria,
        // compartilhado: dados.compartilhado === '1',
        // formaPagamento: ['', [Validators.required]],
        // parcelas: ['', [Validators.required]],
      };

	  console.log(fields)

      setTimeout(() => {
        this.setValues(fields);
        this.enable();
        this.preloaderService.hide('preloader-entrada');
      });
    });
  }
}
