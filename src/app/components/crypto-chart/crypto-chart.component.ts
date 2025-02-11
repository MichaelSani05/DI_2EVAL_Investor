import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ChartType, ApexStroke, ApexTitleSubtitle } from 'ng-apexcharts';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrl: './crypto-chart.component.css',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgApexchartsModule],
  providers: [CryptoService],
})
export class CryptoChartComponent implements OnInit {
  chartOptions = {
    series: [{
      name: 'Crypto Price',
      data: [] as any[],
    }],
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
      curve: 'smooth',
      width: 2,
    } as ApexStroke,
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
      categories: [] as string[],
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
        },
        rotate: 0,
        formatter: (value: any) => {
          const date = new Date(value);
          return date.getDate().toString();
        },
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
        formatter: (val: any) => {
          const date = new Date(val);
          return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        },
      },
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    title: {
      text: 'Crypto Price Over Time'
    },
    subtitle: {
      text: 'Minimalist visualization'
    },
  };

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.fetchCryptoData('bitcoin', '30d');
  }

  fetchCryptoData(symbol: string, range: string) {
    this.cryptoService.getCryptoDaily(symbol).subscribe(
      (response) => {
        let interval = 1;
        if (range === '1h') interval = 5; // Última hora en intervalos de 5 min
        else if (range === '24h') interval = 60; // Último día en intervalos de 1 hora
        else if (range === '7d' || range === '30d') interval = 24 * 60; // Última semana y mes en 1 día

        const prices = response.prices.filter((_: any, index: number) => index % (interval / 5) === 0)
          .map((entry: any) => ({
            x: entry[0],
            y: entry[1],
          }));

        this.chartOptions.xaxis.categories = prices.map((p: { x: string | number | Date; }) => new Date(p.x).getDate().toString());
        this.chartOptions.series[0].data = prices;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
