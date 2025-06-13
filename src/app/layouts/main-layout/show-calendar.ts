import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { PeriodoService } from '../../shared/periodo.service';
import { meses } from '../../app.config';
import { Subject, forkJoin } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

declare const M: any;

@Injectable({
  providedIn: 'root',
})
export class ShowCalendar {
  public date = new Date();
  public currentMonth: number = this.date.getMonth() + 1;
  public currentYear: number = this.date.getFullYear();
  public anoSelecionado: any = this.currentYear;
  public periodoSelecionado: string = `${this.currentMonth}/${this.currentYear}`;
  public periodoLabel: string = `${this.getMonths()[this.currentMonth - 1]}/${
    this.currentYear
  }`;

  constructor(private periodoService: PeriodoService) {}

  // Exibir anos
  getYears() {
    const ano_ini = this.date.getFullYear() - 10; // Obter o ano inicial da configuração do sistema. Padrão 10 anos anteriores ao ano atual
    const ano_fim = this.date.getFullYear(); // O ano atual
    let ano: any = [];

    for (let i = ano_ini; i <= ano_fim; i++) {
      ano.push(i);
    }

    return ano;
  }

  // Exibir meses
  getMonths() {
    let mes: any = [];

    meses.abreviados.forEach((m: any) => {
      mes.push(m);
    });

    return mes;
  }

  getSelectedMonth(abr: boolean = false) {
    return abr ? meses.abreviados : meses();
  }

  getSelectedYear(): number {
    return this.currentYear;
  }

  selectYear(event: any) {
    const value = event.target.value;
    let novoAnoSelecionado = value;
    const periodoInput = document.querySelector(
      'input[name="periodo"]'
    ) as HTMLInputElement;
    const periodoLabel = document.querySelector(
      '[id="periodo-label"]'
    ) as HTMLInputElement;
    const btnMonth = document.querySelectorAll('#calendar-months .btn');
    btnMonth.forEach((label: any) => label.classList.remove('checked'));

    let currentPeriodo =
      periodoInput?.value || `${this.currentMonth}/${this.currentYear}`;
    let [mesSelecionado, anoSelecionado] = currentPeriodo.split('/');
    let btn_mes = document.querySelector(
      `#calendar-months .btn input[value="${mesSelecionado}"]`
    ) as HTMLInputElement;

    if (novoAnoSelecionado === anoSelecionado) {
      btn_mes.disabled = true;
      btn_mes.parentElement?.classList.add('checked');
    } else {
      btn_mes.disabled = false; // isso permite clicar no botão
      btn_mes.checked = false; // isso permite clicar no botão
    }

    this.anoSelecionado = novoAnoSelecionado;
  }

  selectMonth(event: any) {
    const input = event.target;

    let mesSelecionado = input.value;
    let anoSelecionado = document.querySelector(
      'select[name="ano"]'
    ) as HTMLInputElement;
    this.periodoSelecionado = `${mesSelecionado}/${anoSelecionado?.value}`;
    this.periodoLabel = `${this.getMonths()[mesSelecionado - 1]}/${
      anoSelecionado?.value
    }`;

    const btnMonth = document.querySelectorAll('#calendar-months .btn');
    btnMonth.forEach((label: any) => label.classList.remove('checked'));

    input.parentElement.classList.add('checked');

    // Alterar o período reativo para compartilhar o novo mês selecionado
    this.periodoService.setPeriodo(mesSelecionado, this.anoSelecionado);

    let modal = M.Modal.getInstance(document.querySelector('#modal-periodo'));
    modal.close();
  }

  public getUltimoDiaDoMes(ano: number, mes: number): number {
    // Cria uma data para o primeiro dia do *próximo* mês e subtrai um dia para obter o último dia do mês atual.
    // Mês é zero-based para o construtor Date (m-1)
    // `new Date(ano, mes, 0)` também funciona para obter o último dia do mês anterior (mês-1)
    return new Date(ano, mes, 0).getDate();
  }

  public getMesAnteriorFormatado(ano: number, mes: number): string {
    // Ajusta para o mês anterior
    let anoMesAnterior = ano;
    let mesAnteriorNum = mes - 1; // Ajusta para o mês anterior (se for janeiro, vai para 0)

    if (mesAnteriorNum === 0) {
      mesAnteriorNum = 12; // Se era janeiro, vai para dezembro
      anoMesAnterior--; // E o ano anterior
    }

    // Formata para 'YYYY-MM'
    const mesFormatado = mesAnteriorNum.toString().padStart(2, '0');
    return `${anoMesAnterior}-${mesFormatado}`;
  }
}
