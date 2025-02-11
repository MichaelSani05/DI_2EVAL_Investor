import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  getCryptoDaily(symbol: string, days: string): Observable<any> {
    const url = `${this.baseUrl}/coins/${symbol}/market_chart`;
    const params = { vs_currency: 'eur', days };
    return this.http.get(url, { params }).pipe(
      tap((response: any) => console.log('API Response:', response))
    );
  }

  getCryptoInfo(symbol: string): Observable<any> {
    const url = `${this.baseUrl}/coins/${symbol}`;
    return this.http.get(url).pipe(
      tap((response: any) => console.log('API Symbol Response:', response))
    );
  }

  listCryptocurrencies(): string[] {
    return ['bitcoin', 'ethereum', 'litecoin', 'ripple', 'dogecoin'];
  }

  searchCryptocurrencies(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/search`;
    const params = { query };

    return this.http.get(url, { params }).pipe(
      map((response: any) => {
        return response.coins.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          thumb: coin.thumb,
        }));
      }),
      catchError((error) => {
        console.error('API Error:', error);
        return of([]);
      })
    );
  }
}