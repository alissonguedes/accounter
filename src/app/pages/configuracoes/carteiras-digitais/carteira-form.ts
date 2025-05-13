import { Injectable, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { Form } from '../../../shared/form';
import { CarteiraService } from './carteira.service';

@Injectable({
  providedIn: 'root',
})
export class CarteiraForm extends Form {
  private carteiraService = inject(CarteiraService);

  form = this.fb.group({
    id: [{ value: '', disabled: true }],
    titulo: ['', [Validators.required]],
    titulo_slug: ['', [Validators.required]],
    saldo_atual: ['', [Validators.required]],
    compartilhado: [false],
    status: [true],
  });

  submitForm(id?: any) {
    this.preloaderService.show('preloader-carteira');
    this.disable();

    if (!id) {
      return setTimeout(() => {
        this.getForm().get('status')?.setValue('ativa');
        this.preloaderService.hide('preloader-carteira');
        this.enable();
      }, 100);
    }

    return this.carteiraService.getCarteira(id).subscribe((dados: any) => {
      let fields = {
        id: dados.id,
        titulo: dados.titulo,
        titulo_slug: dados.titulo_slug,
        saldo_atual: dados.saldo_atual,
        compartilhado: dados.compartilhado,
        status: dados.status === 'ativa',
      };

      setTimeout(() => {
        this.setValues(fields);
        this.enable();
        this.preloaderService.hide('preloader-carteira');
      });
    });
  }
}
