import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { PreloaderService } from '../services/preloader/preloader.service';

let requests = 0;

export const preloaderInterceptor: HttpInterceptorFn = (req, next) => {
  const preloaderService = inject(PreloaderService);

  // endpoints pra excluir e não exibir o preloader
  const exclude = ['/refresh', '/notifications', /\/(\d?)+$/];

  const shouldIgnore = exclude.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(req.url);
    }
    return req.url.includes(pattern);
  });

  if (shouldIgnore) {
    return next(req);
  }

  requests++;
  if (requests === 1) {
    preloaderService.show('progress-bar');
  }

  return next(req).pipe(
    finalize(() => {
      requests--;
      if (requests === 0) {
        preloaderService.hide('progress-bar');
      }
    })
  );
};
