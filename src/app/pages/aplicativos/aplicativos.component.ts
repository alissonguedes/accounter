import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-aplicativos',
	imports: [ CommonModule, TitleDirective],
	templateUrl: './aplicativos.component.html',
	styleUrl: './aplicativos.component.css',
	encapsulation: ViewEncapsulation.None
})
export class AplicativosComponent {

}
