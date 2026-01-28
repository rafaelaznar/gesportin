import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo?:id_tipoarticulo', component: ArticuloPlistAdminRouted} //pte
];
