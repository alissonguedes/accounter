import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-saidas',
	imports: [CommonModule, TitleDirective],
	templateUrl: './saidas.component.html',
	styleUrl: './saidas.component.css',
	encapsulation: ViewEncapsulation.None
})
export class SaidasComponent {

}
