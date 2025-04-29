import { Component, inject } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';
declare const ApexCharts: any;

@Component({
	selector: 'app-dashboard',
	imports: [CommonModule, TitleDirective],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

	public categorias = [];

	public meses = [
		'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
	];

	public mesesAbr = [
		'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
	];

	public resumoMensal = [];

	public resumo: any = [];

	constructor() {
		this.getResumoMensal();
		this.getChart();
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

	getChart() {
		setTimeout(() => {

			let data = [];
			let categories = [];

			let entradas = [];
			let saidas = [];
			let investimentos = [];
			let caixa_emercial = [];

			for (let i = 0; i < this.meses.length; i++) {

				let mes = this.mesesAbr[i].toUpperCase();
				let num = Math.random() * 100;

				categories.push(mes);
				data.push(num);

			}

			var options = {
				chart: {
					type: 'line',
					stroke: {
						curve: 'smooth',
					}
				},
				series: [{
					type: 'line',
					name: 'sales',
					data: data,
				}, {
					type: 'column',
					name: 'sales',
					data: data,
				}, {
					type: 'line',
					name: 'other',
					data: data,
				}],
				xaxis: {
					show: false,
					categories: categories
				},
				dataLabels: {
					enabled: false,
					formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
						return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					}
				},
				yaxis: {
					show: true,
					decimalsInFloat: 2,
					labels: {
						formatter: function (value: any, { seriesIndex, dataPointIndex, w }: any) {
							return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
						}
					}
				}
			}
			var chart = new ApexCharts(document.querySelector("#chart"), options);
			chart.render();
		});
	}

}
