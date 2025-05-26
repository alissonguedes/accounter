import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';
import { HeaderDirective } from '../../directives/page/header.directive';

@Component({
  selector: 'app-fluxo-de-caixa',
  imports: [CommonModule, RouterLink, TitleDirective /*HeaderDirective*/],
  templateUrl: './fluxo-de-caixa.component.html',
  styleUrl: './fluxo-de-caixa.component.css',
})
export class FluxoDeCaixaComponent {}
