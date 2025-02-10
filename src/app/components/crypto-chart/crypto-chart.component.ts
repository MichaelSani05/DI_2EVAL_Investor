import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ChartType } from 'ng-apexcharts';

@Component({
  selector: 'app-crypto-chart',
  template: `
    <div>
      <h2>Bitcoin Price Chart</h2>
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
      ></apx-chart>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgApexchartsModule],
  providers: [CryptoService], // Agregamos el servicio aquí
})
export class CryptoChartComponent implements OnInit {
  chartOptions = {
    series: [
      {
        name: 'Bitcoin Price',
        data: [] as number[],
      },
    ],
    chart: {
      type: 'line' as ChartType,
      height: 350,
    },
    xaxis: {
      categories: [] as string[], // Declara explícitamente el tipo
    },
  };

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.fetchBitcoinData();
  }

  fetchBitcoinData() {
    this.cryptoService.getCryptoDaily('BTC').subscribe((response) => {
      const timeSeries = response['Time Series (Digital Currency Daily)'];
      if (!timeSeries) {
        console.error('No data found in the API response');
        return;
      }
  
      const dates = Object.keys(timeSeries).slice(0, 30); // Últimos 30 días
      const prices = dates.map((date) => {
        const price = timeSeries[date]['4. close']; // Usa la clave correcta
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
          console.warn(`Invalid price for date ${date}:`, price);
          return null; // Opcional: Usa un valor predeterminado como 0
        }
        return parsedPrice;
      }).filter((price) => price !== null); // Filtra valores inválidos
  
      console.log('Dates:', dates); // Inspecciona las fechas
      console.log('Prices:', prices); // Inspecciona los precios
  
      // Actualizar opciones del gráfico
      this.chartOptions.xaxis.categories = dates;
      this.chartOptions.series[0].data = prices;
  
      console.log('Chart Options:', this.chartOptions); // Inspecciona las opciones
    });
  }
}