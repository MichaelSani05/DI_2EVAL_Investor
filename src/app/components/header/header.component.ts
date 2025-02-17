import { Component, HostListener } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  today : Date = new Date();

  private searchSubject = new Subject<string>();

  constructor(private cryptoService: CryptoService) {}

  isMobile: boolean = false;
  isMenuOpen: boolean = false;

  ngOnInit() {
    this.checkScreenSize();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim()) {
        this.fetchCryptocurrencies(term);
      } else {
        this.searchResults = [];
      }
    });

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

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  fetchCryptocurrencies(query: string) {
    this.isLoading = true;
    this.error = null;
    
    this.cryptoService.searchCryptocurrencies(query).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener datos';
        this.isLoading = false;
      }
    });
  }

  selectCrypto(crypto: any) {
    this.searchTerm = crypto.name;
    this.searchResults = [];
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
