import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title/title.service';
import { AppComponent } from '../../app.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { PreloaderComponent } from '../../services/preloader/preloader/preloader.component';

declare const localStorage: any;

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PreloaderComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  storage: any;
  constructor(public app: AppComponent, public http: HttpService) {
    this.storage = localStorage;
  }
}
