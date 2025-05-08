import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MesesService {
  private nomes: string[] = [
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
  private abreviados: string[] = [
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

  private getMes(indice: number): string | undefined {
    if (indice >= 1 && indice <= 12) {
      return this.nomes[indice - 1];
    }
    return undefined;
  }

  private getAbreviado(indice: number): string | undefined {
    if (indice >= 1 && indice <= 12) {
      return this.abreviados[indice - 1];
    }
    return undefined;
  }

  public meses = new Proxy(() => {}, {
    apply: (target, thisArg, argArray) => {
      if (argArray.length === 1 && Number.isInteger(argArray[0])) {
        return this.getMes(argArray[0]);
      }
      return undefined;
    },
    get: (target, prop) => {
      if (Number.isInteger(Number(prop))) {
        const mes = this.getMes(Number(prop));
        if (mes) {
          return new Proxy(
            {},
            {
              get: (nestedTarget, nestedProp) => {
                if (nestedProp === 'abreviado') {
                  return this.getAbreviado(Number(prop));
                }
                return undefined;
              },
            }
          );
        }
        return undefined;
      } else if (prop === 'abreviado' || prop === 'abreviados') {
        return this.abreviados;
      } else if (prop === Symbol.iterator) {
        return function* () {
          yield* this.nomes;
        }.bind(this);
      }
      return this.nomes; // Retorna a lista completa por padrão ao acessar 'meses' sem índice
    },
  }) as {
    (indice: number): { abreviado: string | undefined } | undefined;
    [key: number]: { abreviado: string | undefined } | undefined;
    abreviado: string[];
    abreviados: string[];
    [Symbol.iterator]: () => IterableIterator<string>;
  };
}
