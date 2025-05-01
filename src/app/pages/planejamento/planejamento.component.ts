import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-planejamento',
	imports: [CommonModule, TitleDirective],
	templateUrl: './planejamento.component.html',
	styleUrl: './planejamento.component.css'
})
export class PlanejamentoComponent {

}
