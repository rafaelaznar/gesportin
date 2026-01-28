import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { AdminPlist } from './component/articulo/articulo-plist/articulo-plist';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'articulo', component: AdminPlist}
];
