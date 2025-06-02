import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  private periodoSelecionado = new BehaviorSubject<{ inicio: Date; fim: Date }>(
    {
      inicio: new Date(),
      fim: new Date(),
    }
  );

  periodo$ = this.periodoSelecionado.asObservable();

  constructor() {}

  setPeriodo(mes: number, ano: number) {
    const inicio = new Date(`${ano}-${mes}-1`);
    const fim = new Date(ano, mes, 0);
    this.periodoSelecionado.next({ inicio, fim });
  }
}
