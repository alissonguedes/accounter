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
	ActivatedRoute,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet,
} from '@angular/router';
import { tap, filter, finalize } from 'rxjs';
import { TitleService } from './services/title/title.service';
import { PreloaderService } from './services/preloader/preloader.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { PageHeaderService } from './services/page/page-header.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { initApp, menuCollapse } from './app.config';

declare const M: any;
declare const document: any;

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, NgApexchartsModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	public title$;
	public pageHeader$;
	public route: any;
	loading = this.preloaderService.loading$;

	constructor(
		private auth: AuthService,
		private router: Router,
		public titleService: TitleService,
		public pageHeaderService: PageHeaderService,
		public preloaderService: PreloaderService // private routeActive: ActivatedRoute
	) {
		let self = this;
		this.title$ = this.titleService.title;
		this.pageHeader$ = this.pageHeaderService.header;
	}

	ngOnInit() {
		// Exibe a barra de carregamento
		this.router.events
			.pipe(
				tap(() => {
					this.pageHeaderService.clearHeader();
				}),
				filter((event) => event instanceof NavigationStart)
			)
			.subscribe(() => this.preloaderService.show('progress-bar'));

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
			.subscribe((route: any) => {
				this.route = route.url.split('/').filter((s: any) => s)[0];

				let body = document.querySelector('body');
				let menu = document.querySelector('#slide-out');

				if (menu) {

					if (this.route === 'configuracoes') {
						menu.classList.remove('sidenav-fixed');
						body.classList.add('menu-collapsed');
					} else {
						if (window.innerWidth > 992) {
							menu.style.transform = 'translateX(0px)';
							body.classList.remove('menu-collapsed');
							menu.classList.add('sidenav-fixed');
							body.style.overflow = 'auto';
							let overlay = document.querySelectorAll('.sidenav-overlay');
							overlay.forEach((o: any) => {
								if (o.style.display === 'block' && o.style.opacity === '1') {
									o.style.display = 'none';
									o.style.opacity = '0';
								}
							});
						}
					}
				}

				var elems = document.querySelectorAll('.fixed-action-btn');
				var instances = M.FloatingActionButton.init(elems);

				setTimeout(() => this.preloaderService.hide('progress-bar'), 300);
				initApp();
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
