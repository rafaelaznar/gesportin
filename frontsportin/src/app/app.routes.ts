import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo?:id_tipoarticulo', component: ArticuloPlistAdminRouted}, //pte
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota?:id_equipo', component: CuotaPlistAdminRouted},//pte
      
];