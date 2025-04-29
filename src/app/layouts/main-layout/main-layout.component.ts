import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title/title.service';
import { AppComponent } from '../../app.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';


@Component({
	selector: 'app-main-layout',
	imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './main-layout.component.html',
	styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

	constructor(public app: AppComponent, public http: HttpService) { }

}
