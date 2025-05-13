import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { TitleService } from './services/title/title.service';
import { PreloaderService } from './services/preloader/preloader.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { PageHeaderService } from './services/page/page-header.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { initApp, menuCollapse } from './app.config';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  public title$;
  public pageHeader$;

  constructor(
    private auth: AuthService,
    private router: Router,
    public titleService: TitleService,
    public pageHeaderService: PageHeaderService,
    public preloaderService: PreloaderService
  ) {
    let self = this;
    this.title$ = this.titleService.title$;
    this.pageHeader$ = this.pageHeaderService.header;

    // Exibe a barra de carregamento
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.pageHeaderService.clearHeader();
        this.preloaderService.show('progress-bar');
      });

    // Oculta a barra de carregamento
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe(() => {
        setTimeout(() => {
          this.preloaderService.hide('progress-bar');
        }, 500);
      });
  }

  ngAfterViewInit(): void {
    menuCollapse();
    initApp();
  }

  logout() {
    menuCollapse();
    this.auth.logout();
  }

  ngOnDestroy(): void {
    // this.routerSub.unsubscribe();
  }
}
