import { Injectable } from '@angular/core';
import { finalize, Observable, BehaviorSubject } from 'rxjs';
import { EntradasService } from './entradas.service';

@Injectable({
  providedIn: 'root',
})
export class EntradasModel {
  entradas$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(protected entradasService: EntradasService) {}

  getResumo(periodo: any): Observable<any> {
    return this.entradasService.getEntradas(periodo);
  }
}
