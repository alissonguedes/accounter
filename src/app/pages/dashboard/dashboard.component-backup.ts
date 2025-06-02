import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleDirective } from '../../directives/title/title.directive';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexGrid,
  ApexDataLabels,
  ApexYAxis,
} from 'ng-apexcharts';
import { meses } from '../../app.config';

declare const document: any;
declare const window: any;

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TitleDirective, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  // @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any = null;
  // public chartOptions: ChartOptions;
  width = window.innerWidth;

  meses = {
    completos: [
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
    ],
    abreviados: [
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
    ],
  };
  public categorias = [];
  public resumoMensal = [];
  public resumo: any = [];

  constructor() {
    this.getResumoMensal();
    this.getChartAnalises();
    this.getChartCategoria();
  }

  getResumoMensal(): void {
    let ladoEsquerdo: any = [];
    let ladoDireito: any = [];

    meses().forEach((mes: string, index: number) => {
      let data = {
        mes: mes,
        mesAbr: meses[index]?.abreviado,
        valor: Math.random() * 1000,
      };
      if (index < 6) {
        ladoEsquerdo.push(data);
      } else {
        ladoDireito.push(data);
      }
    });

    this.resumo = [{ e: ladoEsquerdo, d: ladoDireito }];
  }

  getChartAnalises() {
    let categorias: {
      entradas: number[];
      saidas: number[];
      investimentos: number[];
      caixa_emergencial: number[];
    } = {
      entradas: [],
      saidas: [],
      investimentos: [],
      caixa_emergencial: [],
    };

    // Series/Dados dos gráficos
    let series = [];

    // Gerando dados fictícios para cada mês
    for (let mes of meses.abreviados) {
      // Simulação de valores aleatórios
      categorias.entradas.push(Math.floor(Math.random() * 1000));
      categorias.saidas.push(Math.floor(Math.random() * 1000));
      categorias.investimentos.push(Math.floor(Math.random() * 1000));
      categorias.caixa_emergencial.push(Math.floor(Math.random() * 1000));
    }

    // Montando séries para gráfico
    series.push({
      name: 'Entradas',
      type: 'line',
      data: categorias.entradas,
    });
    series.push({
      name: 'Saídas',
      type: 'line',
      data: categorias.saidas,
    });
    series.push({
      name: 'Investimentos',
      type: 'line',
      data: categorias.investimentos,
    });
    series.push({
      name: 'Caixa Emergencial',
      type: 'line',
      data: categorias.caixa_emergencial,
    });

    this.chartOptions = {
      title: {},
      chart: {
        type: 'line',
        height: '310px',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: false,
          allowMouseWheelZoom: true,
          zoomedArea: {
            fill: {
              color: '#90CAF9',
              opacity: 0.4,
            },
            stroke: {
              color: '#0D47A1',
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      series: series,
      // colors: [cores[cat]],
      xaxis: {
        labels: {
          show: true,
          // formatter: (value: any) => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        },
        decimalsInFloat: 2,
        categories: meses.abreviados,
      },
      yaxis: {
        decimalsInFloat: 2,
        labels: {
          show: true,
          formatter: (value: any) =>
            value.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
        },
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        // xaxis: {
        // 	lines: {
        // 		show: false,
        // 	}
        // },
        // yaxis: {
        // 	lines: {
        // 		show: false
        // 	}
        // },
        // row: {
        // 	colors: undefined,
        // 	opacity: 0,
        // },
        // padding: {
        // 	top: 0,
        // 	right: 0,
        // 	left: 0,
        // 	bottom: 0
        // }
      },
      dataLabels: {
        show: true,
        enabled: true,
        formatter: (value: any) =>
          value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
      },
      // yaxis: {
      // 	decimalsInFloat: 2,
      // 	labels: {
      // 		show: false,
      // 		formatter: (value: any) =>
      // 			value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
      // 	}
      // }
      // series: [
      // 	{
      // 		name: "My-series",
      // 		data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      // 	}
      // ],
      // chart: {
      // 	height: 350,
      // 	type: "bar"
      // },
      // title: {
      // 	text: "My First Angular Chart"
      // },
      // xaxis: {
      // 	categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      // }
    };
  }

  getChartCategoria() {
    setTimeout(() => {
      let spark = document.querySelector('#sparkline');
      //   console.log(spark);

      // spark.sparkline([70, 80, 65, 78, 58, 80, 78, 80, 70, 50, 75, 65, 80, 70, 65, 90, 65, 80, 70, 65, 90], { type: "bar", height: "25", barWidth: 7, barSpacing: 4, barColor: "#b2ebf2", negBarColor: "#81d4fa", zeroColor: "#81d4fa" });

      // Dados para cada categoria
      const categorias: {
        [key: string]: number[];
      } = {
        entradas: [],
        saidas: [],
        investimentos: [],
        caixa_emergencial: [],
      };

      // Preencher dados aleatórios por mês
      //   for (let i = 0; i < mesesAbr.length; i++) {
      //     categorias['entradas'].push(Math.floor(Math.random() * 1000));
      //     categorias['saidas'].push(Math.floor(Math.random() * 1000));
      //     categorias['investimentos'].push(Math.floor(Math.random() * 1000));
      //     categorias['caixa_emergencial'].push(Math.floor(Math.random() * 1000));
      //   }

      // Paleta de cores para os gráficos
      const cores: { [key: string]: string } = {
        entradas: '#00bcd4',
        saidas: '#ff5252',
        investimentos: '#ffa726',
        caixa_emergencial: '#66BB6A',
      };

      // Gerar gráfico por categoria
      for (let cat in categorias) {
        const series = [
          {
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            type: 'column',
            data: categorias[cat],
          },
        ];

        const options = {
          chart: {
            type: 'line',
            height: '80px',
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: false,
              allowMouseWheelZoom: true,
              zoomedArea: {
                fill: {
                  color: '#90CAF9',
                  opacity: 0.4,
                },
                stroke: {
                  color: '#0D47A1',
                  opacity: 0.4,
                  width: 1,
                },
              },
            },
          },
          series: series,
          colors: [cores[cat]],
          xaxis: {
            labels: {
              show: false,
            },
            categories: meses.abreviados,
          },
          grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
            row: {
              colors: undefined,
              opacity: 0,
            },
            padding: {
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            },
          },
          dataLabels: {
            show: false,
            enabled: false,
            formatter: (value: any) =>
              value.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              }),
          },
          yaxis: {
            decimalsInFloat: 2,
            labels: {
              show: false,
              formatter: (value: any) =>
                value.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }),
            },
          },
        };

        const chart = new ApexCharts(
          document.querySelector(`#${cat}`),
          options
        );
        chart.render();
      }
    });
  }
}
