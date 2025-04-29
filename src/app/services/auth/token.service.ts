import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TokenService {

	private tokenKey = 'access_token';

	constructor() { }

	getKey() {
		return this.tokenKey;
	}

	setToken(token: string) {
		localStorage.setItem(this.tokenKey, token);
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

}
