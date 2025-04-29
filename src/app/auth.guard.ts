import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from './services/http.service';

async function isAuthenticated(): Promise<boolean> {

	const http = inject(HttpService);

	try {
		const response = await firstValueFrom(http.get<any>('session'));
		return response.authorized;
	} catch (e) {
		return false;
	}

}

export const authGuard: CanActivateFn = async (route, state) => {

	// const http = inject(HttpService);
	// const authService = inject(AuthService);
	// const router = inject(Router);
	// await firstValueFrom(http.get('sanctum/csrf-cookie', { withCredentials: true }));
	// if (authService.isAuthenticated())
	// 	return true;
	// if (location.href.split('/').splice(-1).join() != 'offline')
	// 	return true;
	// return router.createUrlTree(['/login']);

	const authService=inject(AuthService);
	const router = inject(Router);

	if(authService.isAuthenticated()){
		return true;
	} else {
		router.navigate(['/login']);
		return false;
	}

};
