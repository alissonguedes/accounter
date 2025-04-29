import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TitleService } from './services/title/title.service';
import { PreloaderService } from './services/preloader/preloader.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { PageHeaderService } from './services/page/page-header.service';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {

	public title$;
	public pageHeader$;

	constructor(
		private auth: AuthService,
		private router: Router,
		public titleService: TitleService,
		public pageHeaderService: PageHeaderService,
		public preloaderService: PreloaderService,
	) {

		let self = this;
		this.title$ = this.titleService.title$;
		this.pageHeader$ = this.pageHeaderService.header;

		// Exibe a barra de carregamento
		this.router.events.pipe(
			filter(event => event instanceof NavigationStart)
		).subscribe(() => {
			this.pageHeaderService.clearHeader();
			this.preloaderService.show();
		});

		// Oculta a barra de carregamento
		this.router.events.pipe(
			filter(event =>
				event instanceof NavigationEnd ||
				event instanceof NavigationCancel ||
				event instanceof NavigationError
			)
		).subscribe(() => {
			setTimeout(() => {
				this.preloaderService.hide();
			}, 100)
		});

	}

	menuCollapse() {
		let sidenav = document.querySelector('.sidenav');
		console.log(sidenav)
		let instance = M.Sidenav.init(sidenav);
		document.querySelectorAll('#slide-out li a').forEach((e: any) => {
			e.addEventListener('click', function () {
				if (window.outerWidth <= 992) {
					instance.close();
				}
			});
		});
	}

	ngAfterViewInit(): void {
		let self = this;
		setTimeout(function () {
			M.AutoInit();
			self.menuCollapse();
		});
	}

	logout() {
		this.auth.logout();
		// location.href = '/login';
		this.router.navigate(['/login']);
		this.menuCollapse();
	}

	ngOnDestroy(): void {
		// this.routerSub.unsubscribe();
	}

}
