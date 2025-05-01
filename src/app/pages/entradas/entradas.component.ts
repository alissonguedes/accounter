import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-entradas',
	imports: [CommonModule, TitleDirective],
	templateUrl: './entradas.component.html',
	styleUrl: './entradas.component.css',
	encapsulation: ViewEncapsulation.None
})
export class EntradasComponent {

}
