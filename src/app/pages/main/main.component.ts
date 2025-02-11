import { Component } from '@angular/core';
import { CryptoChartComponent } from "../../components/crypto-chart/crypto-chart.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CryptoChartComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}