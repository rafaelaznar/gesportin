import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { TemporadaPlist } from './component/temporada/temporada-plist/temporada-plist';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'temporada', component: TemporadaPlist },
  { path: 'temporada/:club', component: TemporadaPlist },
  { path: 'articulo', component: ArticuloPlistAdminRouted },
  { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted },
];
