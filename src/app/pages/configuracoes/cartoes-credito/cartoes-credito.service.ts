import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CartoesCreditoService {
  constructor(private http: HttpService) {}

  getCartoes(search?: string) {
    let find = null;
    if (search) {
      find = {
        search: search,
      };
    }
    return this.http.get('cartoes-credito', find);
  }

  getCartao(id: number) {
    return this.http.get(`cartoes-credito/${id}`);
  }

  getBandeiras() {
    return this.http.get('cartoes-credito/bandeiras');
  }

  saveCartao(values: any, id?: number) {
    if (id) return this.http.put(`cartoes-credito/${id}`, values);
    return this.http.post('cartoes-credito', values);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`cartoes-credito/${id}`, value);
  }

  removeCartao(id: number) {
    return this.http.delete(`cartoes-credito/${id}`);
  }
}
