import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private id: number | null = null;
  private id_parent: number | null = null;
  private titulo: string = '';
  private titulo_slug: string = '';
  private descricao: string = '';
  private imagem: string = '';
  private color: string = '';
  private text_color: string = '';
  private ordem: number = 1;
  private status: string = '1';

  constructor(private http: HttpService) {}

  getCategorias(search?: string): Observable<any> {
    let find = null;
    if (search) {
      find = {
        search: search,
      };
    }
    return this.http.get('categorias', find);
  }

  getCategoria(id: number) {
    return this.http.get('categorias', {
      id: id,
    });
  }

  saveCategoria(values: any) {
    if (values.id) {
      return this.http.put('categorias', values);
    }

    return this.http.post('categorias', values);
  }

  removeCategoria(id: number) {
    return this.http.delete(`categorias/${id}`);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`categorias/${id}`, value);
  }

  setId(id: number) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setIdParent(id: number) {
    this.id_parent = id;
  }

  getIdParent() {
    return this.id_parent ?? '';
  }

  setTitulo(titulo: string) {
    this.titulo = titulo;
  }

  getTitulo() {
    return this.titulo;
  }

  setTituloSlug(titulo: string) {
    this.titulo_slug = titulo;
  }

  getTituloSlug() {
    return this.titulo_slug;
  }

  setDescricao(descricao: string) {
    this.descricao = descricao;
  }

  getDescricao() {
    return this.descricao;
  }

  setImagem(imagem: string) {
    this.imagem = imagem;
  }

  getImagem() {
    return this.imagem;
  }

  setColor(color: string) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  setTextColor(color: string) {
    this.text_color = color;
  }

  getTextColor() {
    return this.text_color;
  }

  setOrdem(ordem: number) {
    this.ordem = ordem;
  }

  getOrdem() {
    return this.ordem;
  }

  setStatus(status: string) {
    this.status = status;
  }

  getStatus() {
    return this.status === '1';
  }
}
