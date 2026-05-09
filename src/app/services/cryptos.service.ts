import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getCryptoDaily(symbol: string, days: string): Observable<any> {
    const url = `${this.baseUrl}/coins/${symbol}/market_chart`;
    const cacheKey = `${url}?days=${days}`;

    if (!this.cache.has(cacheKey)) {
      const params = { vs_currency: 'eur', days };
      const request$ = this.http.get<any>(url, { params }).pipe(
        tap((response: any) => console.log('API Response:', response)),
        shareReplay(1)
      );
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  getCryptoInfo(symbol: string): Observable<any> {
    const url = `${this.baseUrl}/coins/${symbol}`;
    
    if (!this.cache.has(url)) {
      const request$ = this.http.get<any>(url).pipe(
        tap((response: any) => console.log('API Symbol Response:', response)),
        shareReplay(1)
      );
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  listCryptocurrencies(): string[] {
    return ['bitcoin', 'ethereum', 'litecoin', 'ripple', 'dogecoin'];
  }

  searchCryptocurrencies(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/search`;
    const cacheKey = `${url}?query=${query}`;

    if (!this.cache.has(cacheKey)) {
      const params = { query };
      const request$ = this.http.get<any>(url, { params }).pipe(
        map((response: any) => {
          return response.coins.map((coin: any) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: coin.thumb,
          }));
        }),
        catchError((error: any) => {
          console.error('API Error:', error);
          return of([]);
        }),
        shareReplay(1)
      );
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  getTrendingCryptos(): Observable<any> {
    const url = `${this.baseUrl}/search/trending`;
    
    if (!this.cache.has(url)) {
      const request$ = this.http.get<any>(url).pipe(shareReplay(1));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}