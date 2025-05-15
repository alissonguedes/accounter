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
    id: [{ value: '', disabled: true }],
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.maxLength(255)]],
    compartilhado: false,
    status: true,
  });

  submitForm(id?: any) {
    return '';
  }
}
