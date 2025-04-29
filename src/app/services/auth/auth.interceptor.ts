import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const tokenService = inject(TokenService);
	const token = tokenService.getToken();

	if (token) {
		const cloned = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
		return next(cloned);
	}

	return next(req);
};
