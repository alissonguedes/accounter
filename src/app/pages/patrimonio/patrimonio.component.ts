import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-patrimonio',
	imports: [CommonModule, TitleDirective],
	templateUrl: './patrimonio.component.html',
	styleUrl: './patrimonio.component.css',
	encapsulation: ViewEncapsulation.None
})
export class PatrimonioComponent {

}
