import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { Form } from '../../../shared/form';
import { Categoria } from './categoria';

declare const M: any;
declare const document: any;

@Injectable({
  providedIn: 'root',
})
export class CategoriaForm extends Form {
  private categoria = inject(Categoria);
  private categoriaService = inject(CategoriaService);

  protected fields() {
    return {
      id: [{ value: '', disabled: true }],
      id_parent: [{ value: '', disabled: true }],
      titulo: [{ value: '', disabled: true }, [Validators.required]],
      titulo_slug: [{ value: '', disabled: true }, [Validators.required]],
      descricao: [{ value: '', disabled: true }],
      status: [{ value: '1', disabled: true, checked: true }],
      ordem: [],
      imagem: [],
      color: [],
      text_color: [],
    };
  }

  public edit(id: number) {
    this.disable();
    return this.categoriaService.getCategoria(id).subscribe((dados: any) => {
      this.categoria.setId(dados.id);
      this.categoria.setIdParent(dados.id_parent);
      this.categoria.setTitulo(dados.titulo);
      this.categoria.setTituloSlug(dados.titulo_slug);
      this.categoria.setDescricao(dados.descricao);
      this.categoria.setStatus(dados.status);
      this.categoria.setOrdem(dados.ordem);
      this.categoria.setImagem(dados.imagem);
      this.categoria.setColor(dados.color);
      this.categoria.setTextColor(dados.text_color);

      let fields = {
        id: this.categoria.getId(),
        id_parent: this.categoria.getIdParent(),
        titulo: this.categoria.getTitulo(),
        titulo_slug: this.categoria.getTituloSlug(),
        descricao: this.categoria.getDescricao(),
        status: this.categoria.getStatus(),
        ordem: this.categoria.getOrdem(),
        imagem: this.categoria.getImagem(),
        color: this.categoria.getColor(),
        text_color: this.categoria.getTextColor(),
      };

      this.setValues(fields);
      this.enable();
    });
  }
}
