import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiKey = '6SCHVKJJJGKXV5MS';
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor(private http: HttpClient) {}

  getCryptoDaily(symbol: string): Observable<any> {
    const url = `${this.baseUrl}?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${this.apiKey}`;
    return this.http.get(url).pipe(
      tap((response : any) => console.log('API Response:', response))
    );
  }

  listCryptocurrencies(): string[] {
    return ['BTC', 'ETH', 'LTC', 'XRP', 'DOGE'];
  }
}