import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {  ChartType, ApexStroke } from 'ng-apexcharts';

@Component({
    selector: 'app-crypto-chart',
    standalone: true,
    templateUrl: './crypto-chart.component.html',
    styleUrl: './crypto-chart.component.css',
    imports: [CommonModule, HttpClientModule, NgApexchartsModule],
    providers: [CryptoService]
})
export class CryptoChartComponent implements OnInit {
  @Input() cryptoName? : string
  @ViewChild('chart') chart!: ChartComponent; // Referencia al gráfico
  currentCrypto: any = ""
  currentRange: string = '1d'; // Almacena el rango actual

  chartOptions = {
    series: [
      {
        name: 'Crypto Price',
        data: [] as number[],
      },
    ],
    chart: {
      type: 'line' as ChartType,
      height: 300,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
      },
      background: 'transparent',
    },
    colors: ['#4CAF50'],
    stroke: {
      curve: 'smooth' as ApexStroke["curve"],
      width: 2,
    },
    markers: {
      size: 3,
      colors: ['#4CAF50'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    xaxis: {
      categories: [] as string[], // Categorías se llenarán dinámicamente
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
        },
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
        },
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
      axisBorder: {
        show: false,
      },
    },
    grid: {
      borderColor: '#444',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (val: any, { seriesIndex, dataPointIndex }: { seriesIndex: number, dataPointIndex: number }) => {
          // Usa las categorías del eje X para el tooltip
          return this.chartOptions.xaxis.categories[dataPointIndex];
        },
      },
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    }
  };

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    if (this.cryptoName) {
      this.fetchCryptoData(this.cryptoName, '1d');
      this.cryptoService.getCryptoInfo(this.cryptoName).subscribe((response) => {
        const cryptoData = response;
        console.log(response)
        this.currentCrypto = cryptoData;
        console.log(this.currentCrypto);
      }
      );
    }
  }

  fetchCryptoData(symbol: string, range: string) {
    this.currentRange = range;
    let days: string = '1';
    let intervalMs: number;

    switch (range) {
      case '1d':
        days = '1';
        intervalMs = 60 * 60 * 1000;
        break;
      case '7d':
        days = '7';
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case '30d':
        days = '30';
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      default:
        days = '1';
        intervalMs = 60 * 60 * 1000;
        break;
    }

    this.cryptoService.getCryptoDaily(symbol, days).subscribe(
      (response) => {
        const firstTimestamp = response.prices[0][0];
        const lastTimestamp = response.prices[response.prices.length - 1][0];

        const prices = [];
        for (let timestamp = firstTimestamp; timestamp <= lastTimestamp; timestamp += intervalMs) {
          const closestEntry = response.prices.find((entry: any) => Math.abs(entry[0] - timestamp) < intervalMs / 2);
          if (closestEntry) {
            prices.push({
              x: closestEntry[0],
              y: closestEntry[1],
            });
          }
        }

        this.chartOptions.xaxis.categories = prices.map((p: { x: number }) => {
          const date = new Date(p.x);
          if (range === '1d') {
            return `${date.getHours()}:00`;
          } else {
            return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
          }
        });

        this.chartOptions.series[0].data = prices.map((p: { y: number }) => p.y);

        this.chart.updateOptions({
          xaxis: {
            categories: this.chartOptions.xaxis.categories,
          },
          series: this.chartOptions.series,
        });

        console.log('Chart Options:', this.chartOptions);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
