import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CryptoService } from '../../services/cryptos.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-investments',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.css',
  providers: [CryptoService]
})
export class InvestmentsComponent {

  trendingCryptos : any
  userFavorites : any
  favoriteCryptos : Array<any> = []

  constructor(private cryptoService: CryptoService, private firebaseService: FirebaseService){}

  ngOnInit(){
    this.cryptoService.getTrendingCryptos().subscribe(response => {
      console.log(response.coins);
      this.trendingCryptos = response.coins;
    });

    this.firebaseService.getUserById('user1').subscribe(
      response => {
        this.userFavorites = response.favorites;
        console.log(this.userFavorites);
        if (this.userFavorites) {
          this.getCryptoInfo(this.userFavorites);
        } else{
          console.error("No hay nada")
        }
      }
    )

  }

  private rotationFactor = 0.15;

  onMouseMove(event: MouseEvent) {
    const element = event.currentTarget as HTMLLIElement; 
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    // INVIRTIENDO LOS VALORES para que siga el ratón correctamente
    const rotateY = mouseX * this.rotationFactor; 
    const rotateX = mouseY * this.rotationFactor;

    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    element.style.boxShadow = `5px 5px 6px black`;
  }

  onMouseLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLLIElement;
    element.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    element.style.boxShadow = `2px 2px 4px black`;
  }

  getCryptoInfo(symbols : Array<string>){
    symbols.forEach(element => {
      this.cryptoService.getCryptoInfo(element).subscribe(
        response => this.favoriteCryptos.push(response)
        );
    });
  }

}
