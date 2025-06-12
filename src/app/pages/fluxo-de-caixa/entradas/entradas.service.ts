import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class EntradasService {
  constructor(private http: HttpService) {}

  getEntradas(periodo: string, search?: string): Observable<any> {
    let query = Object.assign({ periodo });
    if (search) query = Object.assign(query, { search });
    return this.http.get('transactions/entradas', query);
  }

  getEntrada(id: number): Observable<any> {
    return this.http.get(`transactions/entradas/${id}`);
  }

  saveEntrada(values: any, id?: number): Observable<any> {
    if (values.id) return this.http.put(`transactions/entradas/${id}`, values);
    return this.http.post(`transactions/entradas`, values);
  }

  removeEntrada(id: number): Observable<any> {
    return this.http.delete(`transactions/entradas/${id}`);
  }

  atualizaStatus(id: number, value: any): Observable<any> {
    return this.http.patch(`transactions/entradas/${id}`, value);
  }
}
