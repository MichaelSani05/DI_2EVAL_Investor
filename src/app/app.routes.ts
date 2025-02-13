import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { CryptoPageComponent } from './pages/crypto-page/crypto-page.component';
import { InvestmentsComponent } from './pages/investments/investments.component';

export const routes: Routes = [
    {path: '', redirectTo: '/main', pathMatch: 'full'},
    {path: 'main', component: MainComponent},
    {path: 'crypto/:name', component: CryptoPageComponent},
    {path: 'inversiones', component: InvestmentsComponent}
];
