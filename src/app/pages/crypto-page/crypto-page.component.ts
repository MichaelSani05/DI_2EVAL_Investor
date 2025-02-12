import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoChartComponent } from "../../components/crypto-chart/crypto-chart.component";
import { Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-page',
  imports: [CryptoChartComponent, CommonModule],
  templateUrl: './crypto-page.component.html',
  styleUrl: './crypto-page.component.css'
})
export class CryptoPageComponent {
  cryptoName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.cryptoName = params.get('name') || ''; 
        this.cryptoName = this.cryptoName.toLowerCase();
        
        return this.loadCryptoData();
      })
    ).subscribe();
  }

  loadCryptoData(): Observable<any> {
    console.log(`Cargando datos para ${this.cryptoName}`);
    return of(null);
  }
}
