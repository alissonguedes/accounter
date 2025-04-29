import { Component } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-about',
	imports: [TitleDirective],
	templateUrl: './about.component.html',
	styleUrl: './about.component.css'
})
export class AboutComponent {

}
