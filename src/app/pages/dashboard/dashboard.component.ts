import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';

@Component({
	selector: 'app-dashboard',
	imports: [CommonModule, TitleDirective],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

	public meses = [
		'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
	];

	public resumo: any = [];

	constructor() {
		this.getResumoMensal();
	}

	getResumoMensal(): void {

		let ladoEsquerdo: any = [];
		let ladoDireito: any = [];

		this.meses.forEach((mes, index) => {

			let data = {
				mes: mes,
				valor: Math.random() * 1000
			};

			if (index < 6) {
				ladoEsquerdo.push(data);
			} else {
				ladoDireito.push(data);
			}

		});

		this.resumo = [{ 'e': ladoEsquerdo, 'd': ladoDireito }];

	}

}
