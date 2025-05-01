import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth/auth.interceptor';
import { routes } from './app.routes';

declare const M: any;
declare const document: any;

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([authInterceptor])
		)
	]
};

export const menuCollapse = () => {

	let sidenav = document.querySelector('.sidenav');
	let instance = M.Sidenav.init(sidenav);

	document.querySelectorAll('#slide-out li a, #slide-out li button').forEach((e: any) => {
		e.addEventListener('click', function () {
			if (window.innerWidth <= 992) {
				instance.close();
			}
		});
	});

}

export const initApp = () => {

	setTimeout(() => {
		M.AutoInit();
		menuCollapse();
		let tooltip = document.querySelector('[data-tooltip]');
		M.Tooltip.init(tooltip);
	});

}
