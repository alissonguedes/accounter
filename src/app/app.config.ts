import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth/auth.interceptor';
import { routes } from './app.routes';

declare const M: any;
declare const document: any;

/**
 * Configuração principal do Angular
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};

/**
 * Função para exibir/ocultar menu
 * Se o usuário utilizar dispositivo cuja janela seja menor que 992px,
 * ao clicar nos links do menus, ao mudar de página, o menu principal
 * (.sidenav) é recolhido; sem esta função, ao acessar outra página do menu,
 * o mesmo fica sendo exibido a menos que a página se atualizada.
 */
export const menuCollapse = () => {
  let sidenav = document.querySelector('.sidenav');
  let instance = M.Sidenav.init(sidenav);

  document
    .querySelectorAll('#slide-out li a, #slide-out li button')
    .forEach((e: any) => {
      e.addEventListener('click', function () {
        if (window.innerWidth <= 992) {
          instance.close();
        }
      });
    });
};

/**
 * Iniciar funções do Materializecss automaticamente
 */
export const initApp = () => {
  setTimeout(() => {
    M.AutoInit();
    menuCollapse();
    let tooltip = document.querySelector('[data-tooltip]');
    M.Tooltip.init(tooltip);
  });
};

/**
 * FUnção para remover os caracteres especiais de palavras
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Função para exibir o nome dos meses em português
 */

function getMeses() {
  const nomes = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  const abreviados = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];

  const getMes = (indice: any) => {
    if (indice >= 1 && indice <= 12) {
      return nomes[indice - 1];
    }
    return undefined;
  };

  const getAbreviado = (indice: any) => {
    if (indice >= 1 && indice <= 12) {
      return abreviados[indice - 1];
    }
    return undefined;
  };

  const handler = {
    apply: function (target: any, thisArg: any, argumentsList: any) {
      if (argumentsList.length === 1 && Number.isInteger(argumentsList[0])) {
        const mes = getMes(argumentsList[0]);
        return mes
          ? new MesComAbreviado(mes, getAbreviado(argumentsList[0]))
          : undefined;
      }
      return nomes;
    },
    get: function (target: any, prop: any) {
      if (Number.isInteger(Number(prop))) {
        const mes = getMes(Number(prop));
        return mes
          ? new MesComAbreviado(mes, getAbreviado(Number(prop)))
          : undefined;
      } else if (prop === 'abreviados') {
        return abreviados;
      }
      return Reflect.get(target, prop);
    },
    toString: function () {
      return `[${nomes.join(', ')}]`;
    },
  };

  class MesComAbreviado {
    _nome: any;
    _abreviado: any;
    constructor(nome: any, abreviado: any) {
      this._nome = nome;
      this._abreviado = abreviado;
    }
    get abreviado() {
      return this._abreviado;
    }
    set abreviado(novoAbreviado) {
      this._abreviado = novoAbreviado;
    }
    toString() {
      return this._nome;
    }
  }

  return new Proxy(() => {}, handler);
}

export const meses = getMeses();

// console.log(mesesProxy(1));
// console.log(mesesProxy(1)?.abreviado);
// console.log(mesesProxy[1]);
// console.log(mesesProxy[1]?.abreviado);
// console.log(mesesProxy());
// console.log(meses); // Usando a coerção de string para chamar toString
// console.log(mesesProxy.abreviados);
