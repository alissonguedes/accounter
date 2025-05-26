import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { toast } from '../../shared/toast';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private session = false;
  // private tokenKey = 'access_token';

  constructor(
    private http: HttpService,
    private token: TokenService,
    private router: Router
  ) {}

  setSessionStatus(session: boolean) {
    return (this.session = session);
  }

  getSessionStatus() {
    return this.session;
  }

  login(email: any | string, password?: string): Observable<any> {
    let params;
    if (typeof email === 'object') {
      params = email;
    } else {
      params = { email, password };
    }
    return this.http.post('login', params);
  }

  // cadastro(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
  cadastro(form: any): Observable<any> {
    return this.http.post('register', form);
  }

  checkEmail(email: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>('mailcheck', {
      query: encodeURIComponent(email),
    });
  }

  isAuthenticated(): boolean {
    return !!this.token.getToken();
  }

  logout() {
    this.http
      .post('logout', {
        id: localStorage.getItem('id'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        token: localStorage.getItem('access_token'),
      })
      .subscribe((success: any) => {
        localStorage.removeItem(this.token.getKey());
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
        toast(success.message);
      });
  }
}
