import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FirebaseService } from '../../services/firebase.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexDataLabels, ApexGrid, ApexTooltip, ApexResponsive, ApexFill } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};


@Component({
  selector: 'app-gastos-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './gastos-chart.component.html',
  styleUrl: './gastos-chart.component.css',
})
export class GastosChartComponent {
  public chartOptions: ChartOptions;

  constructor(private firebaseService: FirebaseService) {
    this.chartOptions = {
      series: [], // Inicializado como un array vacío
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true, // Muestra la barra de herramientas (exportar, zoom, etc.)
        },
        animations: {
          enabled: true, // Habilita animaciones
          speed: 800, // Velocidad de la animación
          animateGradually: {
            enabled: true,
            delay: 150, // Retraso entre animaciones de barras
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350, // Velocidad de animaciones dinámicas
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false, // Barras verticales
          borderRadius: 8, // Bordes redondeados en las barras
          columnWidth: '70%', // Ancho de las barras
          distributed: false, // No distribuir colores automáticamente
          dataLabels: {
            position: 'top', // Posición de las etiquetas de datos
          },
          colors: {
            ranges: [{
              from: 0,
              to: 10000,
              color: '#FF0000' // Color de las barras
            }]
          }
        },
      },
      colors: [
        "#33b2df",
      ],
      dataLabels: {
        enabled: true, // Habilita etiquetas de datos
        formatter: (val: number) => `€${val.toFixed(0)}`, // Formato de las etiquetas
        offsetY: -20, // Posición vertical de las etiquetas
        style: {
          fontSize: '12px',
          colors: ['#000'], // Color del texto de las etiquetas
        },
      },
      xaxis: {
        categories: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
        axisBorder: {
          show: true, // Muestra el borde del eje X
          color: '#78909C', // Color del borde
        },
        axisTicks: {
          show: true, // Muestra las marcas del eje X
        },
        labels: {
          style: {
            colors: '#ececec', // Color de las etiquetas del eje X
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          formatter: (val: number) => `€${val.toFixed(0)}`,
          style: {
            colors: '#ececec', // Color de las etiquetas del eje Y
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true, // Muestra el borde del eje Y
          color: '#78909C', // Color del borde
        },
      },
      grid: {
        borderColor: '#E5E7EB', // Color de las líneas de la cuadrícula
        strokeDashArray: 4, // Líneas punteadas
      },
      tooltip: {
        enabled: true, // Habilita tooltips
        theme: 'dark', // Tema oscuro para los tooltips
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (val: number) => `€${val.toFixed(0)}`, // Formato del tooltip
        },
      },
      responsive: [
        {
          breakpoint: 768, // Ajustes para pantallas pequeñas
          options: {
            plotOptions: {
              bar: {
                columnWidth: '50%', // Ancho de las barras en pantallas pequeñas
              },
            },
            dataLabels: {
              enabled: false, // Oculta etiquetas en pantallas pequeñas
            },
          },
        },
      ],
    };
    
  }


  ngOnInit(): void {
    const userId = 'user1';

    this.firebaseService.getUserById(userId).subscribe((user: any) => {
      if (user && user.spendings) {
        const spendingData = this.mapSpendingData(user.spendings);
        this.updateChart(spendingData);
      }
    });
  }

  mapSpendingData(spendings: { [key: string]: { amount: number, dia: number } }): number[] {
    const spendingData = new Array(30).fill(0);

    Object.values(spendings).forEach(spending => {
      const day = spending.dia;
      const amount = spending.amount;
      if (day >= 1 && day <= 30) {
        spendingData[day - 1] += amount;
      }
    });

    return spendingData;
  }

  updateChart(data: number[]): void {
    this.chartOptions.series = [{
      name: 'Gastos',
      data: data
    }];
  }
}
