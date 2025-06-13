import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private http: HttpService) {}

  getCategorias(search?: string | null, tipo?: string | null): Observable<any> {
    let query = {};
    if (search) query = Object.assign({ search });
    if (tipo) query = Object.assign(query, { tipo });
    return this.http.get('categorias', query);
  }

  getCategoria(id: number) {
    return this.http.get(`categorias/${id}`);
  }

  saveCategoria(values: any, id?: number) {
    if (values.id) return this.http.put(`categorias/${id}`, values);

    return this.http.post(`categorias`, values);
  }

  removeCategoria(id: number) {
    return this.http.delete(`categorias/${id}`);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`categorias/${id}`, value);
  }
}
