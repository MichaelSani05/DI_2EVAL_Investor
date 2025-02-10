import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'main', component: MainComponent}
];
