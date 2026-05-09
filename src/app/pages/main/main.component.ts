import { Component } from '@angular/core';
import { CryptoChartComponent } from "../../components/crypto-chart/crypto-chart.component";
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { GastosChartComponent } from "../../components/gastos-chart/gastos-chart.component";

@Component({
    selector: 'app-main',
    imports: [CryptoChartComponent, CommonModule, GastosChartComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {
  cryptoName: string = "bitcoin";
  transactions: any[] = [];
  user: any;
  isLoadingUser: boolean = true;
  isLoadingTransactions: boolean = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    const userId = 'user1';
    this.firebaseService.getUserById(userId).subscribe(
      (data) => {
        this.user = data;
        this.isLoadingUser = false;
        console.log('Datos del usuario:', this.user);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
        this.isLoadingUser = false;
      }
    );

    this.firebaseService.getTransactionsByUserId(userId).subscribe(
      (data) => {
        this.transactions = data;
        this.isLoadingTransactions = false;
        console.log('Transacciones del usuario:', this.transactions);
      },
      (error) => {
        console.error('Error al obtener transacciones:', error);
        this.isLoadingTransactions = false;
      }
    );
  }

}