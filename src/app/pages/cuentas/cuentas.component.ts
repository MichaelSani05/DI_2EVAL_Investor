import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { GastosChartComponent } from "../../components/gastos-chart/gastos-chart.component";
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cuentas',
  imports: [CommonModule, GastosChartComponent, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent {
  mode: ProgressSpinnerMode = 'determinate';
  value: number = 75;
  value2: number = 85;
  cards : any;

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
