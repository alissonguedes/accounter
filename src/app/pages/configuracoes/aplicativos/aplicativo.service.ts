import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AplicativoService {
  constructor(private http: HttpService) {}

  getAplicativos(search?: string) {
    let find = null;
    if (search) {
      find = {
        search: search,
      };
    }
    return this.http.get('aplicativos', find);
  }

  getAplicativo(id: number) {
    return this.http.get(`aplicativos/${id}`);
  }

  saveAplicativo(values: any, id?: number) {
    if (id) return this.http.put(`aplicativos/${id}`, values);
    return this.http.post('aplicativos', values);
  }

  atualizaStatus(id: number, value: any) {
    return this.http.patch(`aplicativos/${id}`, value);
  }

  removeAplicativo(id: number) {
    return this.http.delete(`aplicativos/${id}`);
  }
}
