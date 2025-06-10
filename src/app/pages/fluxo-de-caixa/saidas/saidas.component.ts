import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

declare const document: any;

@Component({
  selector: 'app-saidas',
  imports: [CommonModule, TitleDirective, HeaderDirective, RouterLink],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.css',
  providers: [FluxoDeCaixaComponent],
  encapsulation: ViewEncapsulation.None,
})
export class SaidasComponent {
  transacoes = [
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 90390,
    },
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 8509,
    },
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 13943,
    },
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 12239,
    },
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 12043,
    },
    {
      tipo: 'Despesas',
      categoria: 'Aluguéis',
      descricao: 'Aluguel',
      formaPagamento: 'Cartão de crédito',
      valor: 12320,
    },
    // Adicione mais itens conforme necessário
  ];

  protected valorUnitario: number = 0;
  protected quantidade: number = 10;

  constructor(protected caixa: FluxoDeCaixaComponent) {}

  get mostrarTotal(): number {
    return this.transacoes.reduce((total, t) => total / 100 + t.valor, 0); // * this.quantidade;
  }
}
