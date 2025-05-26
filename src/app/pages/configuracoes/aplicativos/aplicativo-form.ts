import { Injectable, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { Form } from '../../../shared/form';
import { AplicativoService } from './aplicativo.service';

@Injectable({
  providedIn: 'root',
})
export class AplicativoForm extends Form {
  private aplicativoService = inject(AplicativoService);

  form = this.fb.group({
    id: [null],
    id_categoria: [228, [Validators.required]],
    nome: ['', [Validators.required]],
    icone: [''],
    descricao: [''],
    compartilhado: false,
    status: true,
  });

  submitForm(id?: any) {
    this.preloaderService.show('preloader-aplicativo');
    this.disable();

    if (!id) {
      return setTimeout(() => {
        this.getForm().get('status')?.setValue('1');
        this.getForm().get('id_categoria')?.setValue('228');
        this.preloaderService.hide('preloader-aplicativo');
        this.enable();
      }, 100);
    }

    return this.aplicativoService.getAplicativo(id).subscribe((dados: any) => {
      let fields = {
        id: dados.id,
        id_categoria: dados.id_categoria,
        nome: dados.nome,
        icone: dados.icone,
        descricao: dados.descricao,
        compartilhado: dados.compartilhado === '1',
        status: dados.status === '1',
      };

      setTimeout(() => {
        this.setValues(fields);
        this.enable();
        this.preloaderService.hide('preloader-aplicativo');
      });
    });
    return '';
  }
}
