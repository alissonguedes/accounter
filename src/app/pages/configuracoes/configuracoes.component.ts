import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { TitleDirective } from '../../directives/title/title.directive';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppComponent } from '../../app.component';
import { initApp, menuCollapse } from '../../app.config';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-configuracoes',
	imports: [CommonModule, TitleDirective, RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './configuracoes.component.html',
	styleUrl: './configuracoes.component.css',
	encapsulation: ViewEncapsulation.None
})
export class ConfiguracoesComponent implements AfterViewInit {

	ngAfterViewInit(): void {
		menuCollapse();
		initApp();
	}

}
