import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { Form } from '../../../shared/form';

declare const M: any;
declare const document: any;

@Injectable({
  providedIn: 'root',
})
export class CategoriaForm extends Form {
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
      this.categoriaService.setId(dados.id);
      this.categoriaService.setIdParent(dados.id_parent);
      this.categoriaService.setTitulo(dados.titulo);
      this.categoriaService.setTituloSlug(dados.titulo_slug);
      this.categoriaService.setDescricao(dados.descricao);
      this.categoriaService.setStatus(dados.status);
      this.categoriaService.setOrdem(dados.ordem);
      this.categoriaService.setImagem(dados.imagem);
      this.categoriaService.setColor(dados.color);
      this.categoriaService.setTextColor(dados.text_color);
      let fields = {
        id: this.categoriaService.getId(),
        id_parent: this.categoriaService.getIdParent(),
        titulo: this.categoriaService.getTitulo(),
        titulo_slug: this.categoriaService.getTituloSlug(),
        descricao: this.categoriaService.getDescricao(),
        status: this.categoriaService.getStatus(),
        ordem: this.categoriaService.getOrdem(),
        imagem: this.categoriaService.getImagem(),
        color: this.categoriaService.getColor(),
        text_color: this.categoriaService.getTextColor(),
      };

      console.log(fields);

      this.setValues(fields);
      this.enable();
    });
  }
}
