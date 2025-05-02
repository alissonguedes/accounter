/**
 * ✅ 1. Instalação
 *       npm install apexcharts ng-apexcharts
 */

/* import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
	imports: [
		NgApexchartsModule,
		// outros módulos
	]
})
*/

/**
 * ✅ 2. Componente Angular com gráfico
 * projecao - chart.component.ts
 */

/*
export class AppModule { }
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
   ApexChart,
   ApexAxisChartSeries,
   ApexXAxis,
   ApexTitleSubtitle,
   ChartComponent,
   ApexStroke,
   ApexDataLabels,
   ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
   series: ApexAxisChartSeries;
   chart: ApexChart;
   xaxis: ApexXAxis;
   title: ApexTitleSubtitle;
   stroke: ApexStroke;
   dataLabels: ApexDataLabels;
   tooltip: ApexTooltip;
};

@Component({
   selector: 'app-projecao-chart',
   template: `
   <apx-chart
	 [series]="chartOptions.series"
	 [chart]="chartOptions.chart"
	 [xaxis]="chartOptions.xaxis"
	 [stroke]="chartOptions.stroke"
	 [title]="chartOptions.title"
	 [dataLabels]="chartOptions.dataLabels"
	 [tooltip]="chartOptions.tooltip"
   ></apx-chart>
 `,
})
export class ProjecaoChartComponent implements OnInit {
   @Input() dados: { mes: string; saldo: number }[] = [];

   @ViewChild('chart') chart: ChartComponent;
   chartOptions: Partial<ChartOptions>;

   ngOnInit(): void {
	   this.chartOptions = {
		   series: [
			   {
				   name: 'Saldo Projetado',
				   data: this.dados.map(item => item.saldo),
			   },
		   ],
		   chart: {
			   type: 'line',
			   height: 350,
			   zoom: { enabled: false },
		   },
		   xaxis: {
			   categories: this.dados.map(item => item.mes),
		   },
		   stroke: {
			   curve: 'smooth',
			   width: 3,
		   },
		   title: {
			   text: 'Projeção Financeira',
			   align: 'left',
		   },
		   dataLabels: {
			   enabled: true,
		   },
		   tooltip: {
			   enabled: true,
			   y: {
				   formatter: (val: number) => `R$ ${val.toFixed(2)}`,
			   },
		   },
	   };
   }
}
*/

/**
 *✅ 3. Usar o componente
 * No seu componente pai (dashboard, por exemplo):
 *	<app-projecao-chart [dados]="projecao"></app-projecao-chart>
 */

// import { gerarProjecaoFinanceira } from './utils/projecao';

// this.projecao = gerarProjecaoFinanceira(saldo, transacoes, planejamentos);

// 💡 Resultado: Você verá um gráfico de linha suave com saldos futuros mês a mês, interativo e responsivo.
