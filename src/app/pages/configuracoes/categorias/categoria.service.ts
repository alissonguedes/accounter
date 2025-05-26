import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
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
    return this.http.get(`categorias/${id}`);
  }

  saveCategoria(values: any, id?: number) {
    if (values.id) return this.http.put(`categorias/${id}`, values);

    return this.http.post(`categorias/${id}`, values);
  }

  removeCategoria(id: number) {
    return this.http.delete(`categorias/${id}`);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`categorias/${id}`, value);
  }
}
