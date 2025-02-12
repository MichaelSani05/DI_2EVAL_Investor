import { Component, HostListener } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, RouterLinkActive],
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

  isMobile: boolean = false;
  isMenuOpen: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 900;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

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
