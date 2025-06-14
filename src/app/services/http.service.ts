import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  private baseUrl = 'https://app.alissonguedes.dev.br/api/v2';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService // public preloaderService: PreloaderService
  ) {
    let self = this;
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
    params =
      typeof params !== 'undefined'
        ? Object.assign(params, { id_usuario: usuario })
        : null;
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params: params,
      })
      .pipe(
        finalize(() => {
          let skeleton = document.querySelectorAll('.skeleton');
          skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          this.preloaderService.hide('progress-bar');
        })
      );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    this.preloaderService.show();
    const usuario = localStorage.getItem('id');
    body =
      typeof body !== 'undefined'
        ? Object.assign(body, { id_usuario: usuario })
        : null;
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          let skeleton = document.querySelectorAll('.skeleton');
          skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          this.preloaderService.hide();
        })
      );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    this.preloaderService.show();
    const usuario = localStorage.getItem('id');
    body =
      typeof body !== 'undefined'
        ? Object.assign(body, { id_usuario: usuario })
        : null;
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          let skeleton = document.querySelectorAll('.skeleton');
          skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          this.preloaderService.hide();
        })
      );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    this.preloaderService.show();
    const usuario = localStorage.getItem('id');
    body =
      typeof body !== 'undefined'
        ? Object.assign(body, { id_usuario: usuario })
        : null;
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          let skeleton = document.querySelectorAll('.skeleton');
          skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          this.preloaderService.hide();
        })
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    this.preloaderService.show('progress-bar');
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        finalize(() => {
          let skeleton = document.querySelectorAll('.skeleton');
          skeleton.forEach((s: any) => s.classList.remove('skeleton-loading'));
          this.preloaderService.hide('progress-bar');
        })
      );
  }
}
