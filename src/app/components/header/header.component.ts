import { Component } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-header',
    imports: [CommonModule, HttpClientModule, FormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    providers: [CryptoService]
})
export class HeaderComponent {
  searchTerm: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private cryptoService: CryptoService) {}

  searchCryptocurrencies() {
    this.isLoading = true;
    this.error = null;

    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      this.isLoading = false;
      return;
    }

    this.cryptoService.searchCryptocurrencies(this.searchTerm.toLowerCase()).subscribe(
      (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Error fetching cryptocurrencies.';
        this.isLoading = false;
        console.error('API Error:', error);
      }
    );
  }
}
