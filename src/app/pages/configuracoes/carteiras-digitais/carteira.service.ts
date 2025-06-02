import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CarteiraService {
  constructor(private http: HttpService) {}

  getCarteiras(search?: string) {
    let find = null;
    if (search) {
      find = {
        search: search,
      };
    }
    return this.http.get('carteiras-digitais', find);
  }

  getCarteira(id: number) {
    return this.http.get(`carteiras-digitais/${id}`);
  }

  saveCarteira(values: any, id?: number) {
    if (values.id) return this.http.put(`carteiras-digitais/${id}`, values);
    return this.http.post(`carteiras-digitais`, values);
  }

  removeCarteira(id: number) {
    return this.http.delete(`carteiras-digitais/${id}`);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`carteiras-digitais/${id}`, value);
  }
}
