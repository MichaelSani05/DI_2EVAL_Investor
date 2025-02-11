import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  // Obtener datos históricos de una criptomoneda
  getCryptoDaily(symbol: string): Observable<any> {
    const url = `${this.baseUrl}/coins/${symbol}/market_chart`;
    const params = { vs_currency: 'usd', days: '30' };
    return this.http.get(url, { params }).pipe(
      tap((response: any) => console.log('API Response:', response))
    );
  }

  // Listar criptomonedas disponibles
  listCryptocurrencies(): string[] {
    return ['bitcoin', 'ethereum', 'litecoin', 'ripple', 'dogecoin'];
  }
}