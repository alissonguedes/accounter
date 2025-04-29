import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private session = false;
	// private tokenKey = 'access_token';

	constructor(private http: HttpService, private token: TokenService, private router: Router) { }

	setSessionStatus(session: boolean) {
		return this.session = session;
	}

	getSessionStatus() {
		return this.session;
	}

	login(email: string, password: string): Observable<any> {
		return this.http.post('login', { email, password });
	}

	isAuthenticated(): boolean {
		return !!this.token.getToken();
	}

	logout() {
		localStorage.removeItem(this.token.getKey());
		this.router.navigate(['/login']);
	}

}
