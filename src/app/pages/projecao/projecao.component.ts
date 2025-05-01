import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-projecao',
	imports: [CommonModule, TitleDirective],
	templateUrl: './projecao.component.html',
	styleUrl: './projecao.component.css'
})
export class ProjecaoComponent {

}
