import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  @ViewChild('chart') chart!: ChartComponent;
  currentCrypto: any = ""
  currentRange: string = '1d';

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
    colors: ['#00684e'],
    stroke: {
      curve: 'smooth' as ApexStroke["curve"],
      width: 2,
      colors: ['#00684e'],
    },
    markers: {
      size: 3,
      colors: ['#00684e'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    xaxis: {
      categories: [] as string[],
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
      this.loadCryptoInfo(); // Cargar información de la criptomoneda al inicio
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cryptoName'] && changes['cryptoName'].currentValue) {
      this.fetchCryptoData(changes['cryptoName'].currentValue, this.currentRange); // Actualizar datos del gráfico
      this.loadCryptoInfo(); // Volver a cargar la información de la criptomoneda
    }
  }

  /** 🔥 Carga los datos de la criptomoneda */
  loadCryptoInfo() {
    if (this.cryptoName) {
      this.cryptoService.getCryptoInfo(this.cryptoName).subscribe(
        (response) => {
          this.currentCrypto = response;
          console.log("Información de la crypto cargada:", this.currentCrypto);
        },
        (error) => console.error("Error al cargar la información de la crypto:", error)
      );
    }
  }

  /** 📊 Obtiene los datos para el gráfico */
  fetchCryptoData(symbol: string, range: string) {
    this.currentRange = range;
    let days: string = '1';
    let intervalMs: number;
  
    // Determinación del rango y los intervalos
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
  
    // Llamada a la API para obtener los datos históricos
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
          return range === '1d' 
            ? `${date.getHours()}:00` 
            : date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        });
  
        this.chartOptions.series[0].data = prices.map((p: { y: number }) => p.y);
  
        if (this.chart) {
          this.chart.updateOptions({
            xaxis: {
              categories: this.chartOptions.xaxis.categories,
            },
            series: this.chartOptions.series,
          });
        }
  
        console.log('Chart Options:', this.chartOptions);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
