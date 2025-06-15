import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { TransacoesComponent } from '../transacoes.component';
import { FluxoDeCaixaComponent } from '../fluxo-de-caixa.component';

import { TitleDirective } from '../../../directives/title/title.directive';
import { HeaderDirective } from '../../../directives/page/header.directive';

import { EntradasService } from '../entradas/entradas.service';

declare const document: any;

@Component({
  selector: 'app-saidas',
  imports: [
    CommonModule,
    TitleDirective,
    HeaderDirective,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SaidasComponent extends TransacoesComponent {}
