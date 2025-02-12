import { Component } from '@angular/core';
import { CryptoChartComponent } from "../../components/crypto-chart/crypto-chart.component";
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main',
    imports: [CryptoChartComponent, CommonModule],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {
  cryptoName: string = "bitcoin";
  transactions: any[] = [];
  user: any;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    const userId = 'user1';
    this.firebaseService.getUserById(userId).subscribe(
      (data) => {
        this.user = data;
        console.log('Datos del usuario:', this.user);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );

    this.firebaseService.getTransactionsByUserId(userId).subscribe(
      (data) => {
        this.transactions = data;
        console.log('Transacciones del usuario:', this.transactions);
      },
      (error) => console.error('Error al obtener transacciones:', error)
    );
  }

}