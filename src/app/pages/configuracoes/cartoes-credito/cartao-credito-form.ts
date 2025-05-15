import { Injectable, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { Form } from '../../../shared/form';
import { CartoesCreditoService } from './cartoes-credito.service';

@Injectable({
  providedIn: 'root',
})
export class CartaoCreditoForm extends Form {
  private cartaoService = inject(CartoesCreditoService);

  form = this.fb.group({
    id: [{ value: '', disabled: true }],
    id_bandeira: [{ value: '', disabled: true }, [Validators.required]],
    titulo: ['', [Validators.required]],
    limite: [],
    digito_verificador: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
    compartilhado: false,
    status: true,
  });

  submitForm(id?: any) {
    this.preloaderService.show('preloader-cartao');
    this.disable();

    if (!id) {
      return setTimeout(() => {
        this.getForm().get('status')?.setValue('1');
        this.preloaderService.hide('preloader-cartao');
        this.enable();
      }, 100);
    }

    return this.cartaoService.getCartao(id).subscribe((dados: any) => {
      let fields = {
        id: dados.id,
        id_bandeira: dados.id_bandeira,
        titulo: dados.titulo,
        limite: dados.limite,
        digito_verificador: dados.digito_verificador,
        compartilhado: dados.compartilhado === '1',
        status: dados.status === '1',
      };

      setTimeout(() => {
        this.setValues(fields);
        this.enable();
        this.preloaderService.hide('preloader-cartao');
      });
    });
  }
}
