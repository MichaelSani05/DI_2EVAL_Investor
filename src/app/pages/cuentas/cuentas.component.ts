import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { GastosChartComponent } from "../../components/gastos-chart/gastos-chart.component";

@Component({
  selector: 'app-cuentas',
  imports: [CommonModule, GastosChartComponent],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent {
  cards : any

  constructor(private firebaseService: FirebaseService){}

  ngOnInit(){
    this.firebaseService.getUserById("user1").subscribe(
      response => {
        this.cards = response.cards;
        console.log(this.cards);
      }
    )
  }



}
