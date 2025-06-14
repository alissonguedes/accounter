import {
	inject,
	ApplicationConfig,
	provideZoneChangeDetection,
} from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import {
	Observable,
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	of,
} from 'rxjs';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { authInterceptor } from './services/auth/auth.interceptor';
import { preloaderInterceptor } from './shared/preloader.interceptor';
declare const M: any;
declare const document: any;

/**
 * Configuração principal do Angular
 */
export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([authInterceptor, preloaderInterceptor])
		),
	],
};

document.addEventListener('DOMContentLoaded', function () {
	let route = window.location.href.split('/').splice(3).splice(0, 1).join();

	window.onresize = () => {
		let sidenav = document.querySelector('.sidenav');
		let instance = M.Sidenav.getInstance(sidenav);

		// não se deve abrir o menu principal caso a página esteja localizada em `configuracoes`.
		// O resto deverá abrir ao redimensionar a janela para evitar bug na visualização.
		if (window.innerWidth > 992 && route !== 'configuracoes') {
			instance.open();
			sidenav.classList.add('sidenav-fixed');
		}
	};
});

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
		.querySelectorAll(
			'#slide-out li a, #slide-out li button, .sidenav-footer a, .sidenav-footer button'
		)
		.forEach((e: any) => {
			e.addEventListener('click', function () {
				if (window.innerWidth <= 992) {
					instance.close();
				}
			});
		});
};

// Datepicker
export const datepicker = () => {
	let datepicker = document.querySelectorAll(
		'.datepicker, [data-trigger="datepicker"], [data-mask="date"]'
	);
	M.Datepicker.init(datepicker, {
		container: 'body',
		autoClose: true,
		format: 'dd/mm/yyyy',
		showDaysInNextAndPreviousMonths: false,
		showMonthAfterYear: false,
	});
};

/**
 * Iniciar funções do Materializecss automaticamente
 */
export const initApp = () => {
	setTimeout(() => {
		M.AutoInit();
		let tooltip = document.querySelectorAll('[data-tooltip]');
		M.Tooltip.init(tooltip);
		menuCollapse();
		datepicker();
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
 * Função para formatar moeda:
 * currency(@param valor, @param moeda = 'BRL')
 */
export function currency(value: number, digits?: number, local?: string) {
	let num = typeof value === 'string' ? parseFloat(value) : value;
	return num.toLocaleString(local ?? 'pt-br', {
		style: 'decimal',
		minimumFractionDigits: digits ?? 2,
	});
}

/**
 * Função para verificar se a senha digitada é igual e correta
 */
export function confirmPasswordValidator(
	controlName: string,
	matchingControlName: string
): ValidatorFn {
	return (controls: AbstractControl): ValidationErrors | null => {
		const control = controls.get(controlName);
		const matchingControl = controls.get(matchingControlName);

		if (!control || !matchingControl) return null;

		if (
			matchingControl.errors &&
			!matchingControl.errors['confirmPasswordMismatch']
		) {
			return null;
		}

		if (control.value !== matchingControl.value) {
			matchingControl.setErrors({ confirmPasswordMismatch: true });
			return { confirmPasswordMismatch: true };
		} else {
			matchingControl.setErrors(null);
			return null;
		}
	};
}

/**
 * Função para verificar se o e-mail já existe no banco de dados
 */
export function checkEmailExists() {
	let authService = inject(AuthService);
	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) return of(null);
		return authService.checkEmail(control.value).pipe(
			debounceTime(500),
			distinctUntilChanged(),
			map((res) => (res.existe ? { emailExists: true } : null)),
			catchError(() => of(null))
		);
	};
}

/** Função para verificar se o campo é maior que zero */
export function greaterThanZeroValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (value == null || value === '') {
			// Deixe o Validators.required cuidar desse caso
			return null;
		}

		// Verifica se é número e maior que zero
		const numericValue = Number(value.replace(/\W/g, ''));
		return numericValue > 0 ? null : { maiorQueZero: true };
	};
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
		if (indice >= 0 && indice <= 11) {
			return nomes[indice];
		} else if (indice >= 1 && indice <= 12) {
			return nomes[indice - 1];
		}
		return undefined;
	};

	const getAbreviado = (indice: any) => {
		if (indice >= 0 && indice <= 11) {
			return abreviados[indice];
		} else if (indice >= 1 && indice <= 12) {
			return abreviados[indice - 1];
		}
		return undefined;
	};

	const all = () => {
		return { meses: nomes, mesesAbr: abreviados };
	};

	const target = {
		all: all(),
		meses: getMes,
		mesesAbr: getAbreviado,
	};

	const handler = {
		apply: function (target: any, thisArg: any, argumentsList: any) {
			if (argumentsList.length === 1 && Number.isInteger(argumentsList[0])) {
				const mes = getMes(argumentsList[0]);
				return mes
					? new MesComAbreviado(mes, getAbreviado(argumentsList[0]), all())
					: undefined;
			}
			return nomes;
		},
		get: function (target: any, prop: any) {
			if (Number.isInteger(Number(prop))) {
				const mes = getMes(Number(prop));
				return mes
					? new MesComAbreviado(mes, getAbreviado(Number(prop)), all())
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
		_all: any;
		constructor(nome: any, abreviado: any, all: any) {
			this._nome = nome;
			this._abreviado = abreviado;
			this._all = all;
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
		all() {
			return this._all;
		}
	}

	return new Proxy(() => { }, handler);
}

export const meses = getMeses();

// console.log(meses);
// console.log(meses(1)?.abreviado);
// console.log(meses[1]);
// console.log(meses?.abreviado);
// console.log(meses());
// console.log(meses); // Usando a coerção de string para chamar toString
// console.log(meses.abreviados);
