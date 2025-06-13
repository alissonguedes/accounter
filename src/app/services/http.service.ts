import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { TokenService } from './auth/token.service';
import { PreloaderService } from './preloader/preloader.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  preloaderService = inject(PreloaderService);
  private API_TOKEN =
    '$2y$12$TXHNPaAxbimjcD1S5aHaB.IbPAG/Gj46uZkfPxFVwZyTT2zWS/pzK';
  //   private baseUrl = 'http://localhost/accounter/api/public/api/v2';
  //   private baseUrl = 'http://192.168.6.151/accounter/api/public/api/v2';
  private baseUrl = 'https://ibrjp.com.br/accounter/api/public/api/v2';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService // public preloaderService: PreloaderService
  ) {
    let self = this;
    // setTimeout(function () {
    // 	self.preloaderService.show();
    // }, 200);
  }

  private getHeaders(extraHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('x-webhook-token', this.API_TOKEN);

    const token = this.tokenService.getToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (extraHeaders) {
      extraHeaders.keys().forEach((key) => {
        headers = headers.set(key, extraHeaders.get(key)!);
      });
    }

    return headers;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const usuario = localStorage.getItem('id');
    params = Object.assign(params, { id_usuario: usuario });
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params: params,
      })
      .pipe(finalize(() => this.preloaderService.hide('progress-bar')));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const usuario = localStorage.getItem('id');
    body = Object.assign(body, { id_usuario: usuario });
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(finalize(() => this.preloaderService.hide('progress-bar')));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    const usuario = localStorage.getItem('id');
    body = Object.assign(body, { id_usuario: usuario });
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(finalize(() => this.preloaderService.hide('progress-bar')));
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    const usuario = localStorage.getItem('id');
    body = Object.assign(body, { id_usuario: usuario });
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(finalize(() => this.preloaderService.hide('progress-bar')));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(finalize(() => this.preloaderService.hide('progress-bar')));
  }
}
