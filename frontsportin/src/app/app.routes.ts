import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { Logout } from './component/shared/logout/logout';
import { LoginComponent } from './component/shared/login/login.component';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloAdminPlistPage } from './page/articulo/admin/plist/plist';
import { ArticuloAdminViewPage } from './page/articulo/admin/view/view';
import { ArticuloAdminNewPage } from './page/articulo/admin/new/new';
import { ArticuloAdminEditPage } from './page/articulo/admin/edit/edit';
import { ArticuloAdminDeletePage } from './page/articulo/admin/delete/delete';
import { ArticuloTeamadminPlistPage } from './page/articulo/teamadmin/plist/plist';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaAdminPlistPage } from './page/categoria/admin/plist/plist';
import { PartidoAdminPlistPage } from './page/partido/admin/plist/plist';
import { PartidoTeamadminPlistPage } from './page/partido/teamadmin/plist/plist';
import { PartidoAdminNewPage } from './page/partido/admin/new/new';
import { PartidoAdminViewPage } from './page/partido/admin/view/view';
import { PartidoAdminEditPage } from './page/partido/admin/edit/edit';
import { PartidoAdminDeletePage } from './page/partido/admin/delete/delete';
import { FacturaAdminPlistPage } from './page/factura/admin/plist/plist';
import { FacturaTeamadminPlistPage } from './page/factura/teamadmin/plist/plist';
import { CompraAdminPlistPage } from './page/compra/admin/plist/plist';
import { CompraTeamadminPlistPage } from './page/compra/teamadmin/plist/plist';
import { CompraAdminViewPage } from './page/compra/admin/view/view';
import { CompraAdminDeletePage } from './page/compra/admin/delete/delete';
import { CarritoTeamadminPlistPage } from './page/carrito/teamadmin/plist/plist';
import { RolusuarioPlist } from './component/rolusuario/plist-admin-routed/rolusuario-plist';
import { TipoarticuloAdminPlistPage } from './page/tipoarticulo/admin/plist/plist';
import { TipoarticuloTeamadminPlistPage } from './page/tipoarticulo/teamadmin/plist/plist';
import { TipoarticuloAdminViewPage } from './page/tipoarticulo/admin/view/view';
import { TipoarticuloAdminEditPage } from './page/tipoarticulo/admin/edit/edit';
import { TipoarticuloAdminNewPage } from './page/tipoarticulo/admin/new/new';
import { JugadorAdminPlistPage } from './page/jugador/admin/plist/plist';
import { JugadorTeamadminPlistPage } from './page/jugador/teamadmin/plist/plist';
import { JugadorAdminViewPage } from './page/jugador/admin/view/view';
import { JugadorAdminNewPage } from './page/jugador/admin/new/new';
import { LigaAdminPlistPage } from './page/liga/admin/plist/plist';
import { LigaAdminViewPage } from './page/liga/admin/view/view';
import { LigaAdminNewPage } from './page/liga/admin/new/new';
import { LigaAdminEditPage } from './page/liga/admin/edit/edit';
import { LigaAdminDeletePage } from './page/liga/admin/delete/delete';
import { LigaTeamadminPlistPage } from './page/liga/teamadmin/plist/plist';
import { NoticiaAdminPlistPage } from './page/noticia/admin/plist/plist';
import { NoticiaPlistTeamadminPage } from './page/noticia/teamadmin/plist/plist';
import { ClubAdminPlistPage } from './page/club/admin/plist/plist';
import { CuotaTeamadminPlistPage } from './page/cuota/teamadmin/plist/plist';
import { CuotaAdminPlistPage } from './page/cuota/admin/plist/plist';
import { CuotaAdminNewPage } from './page/cuota/admin/new/new';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';
import { EquipoAdminPlistPage } from './page/equipo/admin/plist/plist';
import { EquipoAdminViewPage } from './page/equipo/admin/view/view';
import { EquipoAdminEditPage } from './page/equipo/admin/edit/edit';
import { EquipoAdminNewPage } from './page/equipo/admin/new/new';
import { EquipoAdminDeletePage } from './page/equipo/admin/delete/delete';
import { EquipoTeamadminPlistPage } from './page/equipo/teamadmin/plist/plist';
import { CarritoAdminNewPage } from './page/carrito/admin/new/new';
import { CarritoAdminPlistPage } from './page/carrito/admin/plist/plist';
import { ComentarioAdminPlistPage } from './page/comentario/admin/plist/plist';
import { ComentarioTeamadminPlistPage } from './page/comentario/teamadmin/plist/plist';
import { ComentarioAdminViewPage } from './page/comentario/admin/view/view';
import { ComentarioAdminNewPage } from './page/comentario/admin/new/new';
import { PagoAdminPlistPage } from './page/pago/admin/plist/plist';
import { PagoTeamadminPlistPage } from './page/pago/teamadmin/plist/plist';
import { PuntuacionAdminPlistPage } from './page/puntuacion/admin/plist/plist';
import { PuntuacionAdminViewPage } from './page/puntuacion/admin/view/view';
import { PuntuacionAdminEditPage } from './page/puntuacion/admin/edit/edit';
import { PuntuacionAdminNewPage } from './page/puntuacion/admin/new/new';
import { PuntuacionAdminDeletePage } from './page/puntuacion/admin/delete/delete';
import { PuntuacionTeamadminPlistPage } from './page/puntuacion/teamadmin/plist/plist';
import { NoticiaAdminViewPage } from './page/noticia/admin/view/view';
import { FacturaAdminViewPage } from './page/factura/admin/view/view';
import { ComentarioartAdminPlistPage } from './page/comentarioart/admin/plist/plist';
import { ComentarioartAdminNewPage } from './page/comentarioart/admin/new/new';
import { TemporadaAdminViewPage } from './page/temporada/admin/view/view';
import { TemporadaAdminDeletePage } from './page/temporada/admin/delete/delete';
import { TemporadaTeamadminPlistPage } from './page/temporada/teamadmin/plist/plist';
import { PagoAdminViewPage } from './page/pago/admin/view/view';
import { PagoAdminEditPage } from './page/pago/admin/edit/edit';
import { PagoAdminNewPage } from './page/pago/admin/new/new';
import { ClubAdminViewPage } from './page/club/admin/view/view';
import { CuotaAdminViewPage } from './page/cuota/admin/view/view';
import { CarritoAdminViewPage } from './page/carrito/admin/view/view';
import { TipousuarioViewAdminRouted } from './component/tipousario/view-admin-routed/tipousuario-view';
import { RolusuarioViewAdminRouted } from './component/rolusuario/view-admin-routed/rolusuario-view';
import { RolusuarioNewAdminRouted } from './component/rolusuario/new-admin-routed/rolusuario-new';
import { CategoriaAdminViewPage } from './page/categoria/admin/view/view';
import { CategoriaAdminEditPage } from './page/categoria/admin/edit/edit';
import { CategoriaAdminNewPage } from './page/categoria/admin/new/new';
import { CategoriaTeamadminPlistPage } from './page/categoria/teamadmin/plist/plist';
import { ComentarioartAdminViewPage } from './page/comentarioart/admin/view/view';
import { ComentarioartAdminEditPage } from './page/comentarioart/admin/edit/edit';
import { ComentarioAdminEditPage } from './page/comentario/admin/edit/edit';
import { ComentarioAdminDeletePage } from './page/comentario/admin/delete/delete';
import { PagoAdminDeletePage } from './page/pago/admin/delete/delete';
import { RolusuarioDeleteAdminRouted } from './component/rolusuario/delete-admin-routed/rolusuario-delete';
import { TemporadaAdminEditPage } from './page/temporada/admin/edit/edit';
import { ClubAdminDeletePage } from './page/club/admin/delete/delete';
import { RolusuarioEditAdminRouted } from './component/rolusuario/edit-admin-routed/rolusuario-edit';
import { CategoriaAdminDeletePage } from './page/categoria/admin/delete/delete';
import { ClubAdminEditPage } from './page/club/admin/edit/edit';
import { CarritoAdminDeletePage } from './page/carrito/admin/delete/delete';
import { ComentarioartAdminDeletePage } from './page/comentarioart/admin/delete/delete';
import { FacturaAdminDeletePage } from './page/factura/admin/delete/delete';
import { FacturaAdminEditPage } from './page/factura/admin/edit/edit';
import { CarritoAdminEditPage } from './page/carrito/admin/edit/edit';
import { CuotaAdminEditPage } from './page/cuota/admin/edit/edit';
import { JugadorAdminDeletePage } from './page/jugador/admin/delete/delete';
import { TipoarticuloAdminDeletePage } from './page/tipoarticulo/admin/delete/delete';
import { TemporadaAdminPlistPage } from './page/temporada/admin/plist/plist';
import { NoticiaAdminEditPage } from './page/noticia/admin/edit/edit';
import { NoticiaAdminNewPage } from './page/noticia/admin/new/new';
import { NoticiaAdminDeletePage } from './page/noticia/admin/delete/delete';
import { ClubAdminNewPage } from './page/club/admin/new/new';
import { ClubPlistTeamadminPage } from './page/club/teamadmin/plist/plist';
import { CuotaAdminDeletePage } from './page/cuota/admin/delete/delete';
import { UsuarioEditAdminRouted } from './component/usuario/edit-admin-routed/usuario-edit';
import { UsuarioNewAdminRouted } from './component/usuario/new-admin-routed/usuario-new';
import { UsuarioDeleteAdminRouted } from './component/usuario/delete-admin-routed/usuario-delete';
import { JugadorAdminEditPage } from './page/jugador/admin/edit/edit';
import { CompraAdminEditPage } from './page/compra/admin/edit/edit';
import { CompraAdminNewPage } from './page/compra/admin/new/new';
import { TemporadaAdminNewPage } from './page/temporada/admin/new/new';
import { AdminGuard } from './guards/admin.guard';
import { ClubAdminGuard } from './guards/club-admin.guard';

export const publicRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: Logout },
];

const protectedRoutes: Routes = [
  { path: '', component: Home },
  { path: 'usuario', component: UsuarioPlist },
  { path: 'usuario/tipousuario/:id_tipousuario', component: UsuarioPlist },
  { path: 'usuario/rol/:id_rol', component: UsuarioPlist },
  { path: 'usuario/club/:id_club', component: UsuarioPlist },
  { path: 'usuario/view/:id', component: UsuarioViewRouted },
  { path: 'usuario/new', component: UsuarioNewAdminRouted },
  { path: 'usuario/edit/:id', component: UsuarioEditAdminRouted },
  { path: 'temporada', component: TemporadaAdminPlistPage },

  { path: 'temporada/club/:id_club', component: TemporadaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'temporada/edit/:id', component: TemporadaAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'temporada/view/:id', component: TemporadaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'temporada/delete/:id', component: TemporadaAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'temporada/new', component: TemporadaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'liga', component: LigaAdminPlistPage },
  { path: 'liga/teamadmin', component: LigaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/equipo/:id_equipo', component: LigaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'liga/new', component: LigaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'liga/view/:id', component: LigaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'liga/delete/:id', component: LigaAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'liga/edit/:id', component: LigaAdminEditPage, data: { allowClubAdmin: true } },
  { path: 'articulo', component: ArticuloAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'articulo/tipoarticulo/:id_tipoarticulo', component: ArticuloAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'usuario/:id', component: UsuarioViewRouted },
  { path: 'articulo/new', component: ArticuloAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'articulo/:tipoarticulo', component: ArticuloAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'articulo/view/:id', component: ArticuloAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'articulo/delete/:id', component: ArticuloAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'articulo/edit/:id', component: ArticuloAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'categoria', component: CategoriaAdminPlistPage },
  { path: 'categoria/temporada/:id_temporada', component: CategoriaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'categoria/view/:id', component: CategoriaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'categoria/edit/:id', component: CategoriaAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'categoria/new', component: CategoriaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'partido', component: PartidoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'partido/teamadmin', component: PartidoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/liga/:id_liga', component: PartidoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'partido/new', component: PartidoAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'partido/view/:id', component: PartidoAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'partido/edit/:id', component: PartidoAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'partido/delete/:id', component: PartidoAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'factura', component: FacturaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'factura/:usuario', component: FacturaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'factura/view/:id', component: FacturaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'factura/usuario/:id_usuario', component: FacturaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'factura/delete/:id', component: FacturaAdminDeletePage },
  { path: 'factura/edit/:id', component: FacturaAdminEditPage },

  { path: 'compra', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/articulo/:id_articulo', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/factura/:id_factura', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/view/:id', component: CompraAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'compra/delete/:id', component: CompraAdminDeletePage },
  { path: 'compra/edit/:id', component: CompraAdminEditPage },
  { path: 'compra/new', component: CompraAdminNewPage },

  { path: 'rolusuario', component: RolusuarioPlist },
  { path: 'rolusuario/new', component: RolusuarioNewAdminRouted },
  { path: 'rolusuario/view/:id', component: RolusuarioViewAdminRouted },
  { path: 'rolusuario/delete/:id', component: RolusuarioDeleteAdminRouted },
  { path: 'rolusuario/edit/:id', component: RolusuarioEditAdminRouted },
  { path: 'tipoarticulo', component: TipoarticuloAdminPlistPage },

  { path: 'tipoarticulo/club/:id_club', component: TipoarticuloAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/view/:id', component: TipoarticuloAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/edit/:id', component: TipoarticuloAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'tipoarticulo/new', component: TipoarticuloAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'jugador', component: JugadorAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'jugador/new', component: JugadorAdminNewPage, data: { allowClubAdmin: true } },
  { path: 'jugador/usuario/:id_usuario', component: JugadorAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'jugador/equipo/:id_equipo', component: JugadorAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'jugador/view/:id', component: JugadorAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'jugador/edit/:id', component: JugadorAdminEditPage, data: { allowClubAdmin: true } },
  { path: 'jugador/delete/:id', component: JugadorAdminDeletePage, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/delete/:id', component: TipoarticuloAdminDeletePage, data: { allowClubAdmin: true } },
  { path: 'noticia', component: NoticiaAdminPlistPage, pathMatch: 'full' },
  { path: 'noticia/teamadmin', component: NoticiaPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/club/:id_club', component: NoticiaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'noticia/view/:id', component: NoticiaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'noticia/edit/:id', component: NoticiaAdminEditPage, data: { allowClubAdmin: true } },
  { path: 'noticia/new', component: NoticiaAdminNewPage, data: { allowClubAdmin: true } },
  { path: 'noticia/delete/:id', component: NoticiaAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'club/plist', component: ClubAdminPlistPage },
  { path: 'club', component: ClubAdminPlistPage },
  { path: 'club/new', component: ClubAdminPlistPage },
  { path: 'club/view/:id', component: ClubAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'club/delete/:id', component: ClubAdminDeletePage },
  { path: 'club/edit/:id', component: ClubAdminEditPage },
  { path: 'cuota', component: CuotaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'cuota/new', component: CuotaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'cuota/equipo/:id_equipo', component: CuotaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'cuota/view/:id', component: CuotaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'cuota/edit/:id', component: CuotaAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'cuota/delete/:id', component: CuotaAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'tipousuario', component: TipousuarioPlistAdminRouted },
  { path: 'tipousuario/view/:id', component: TipousuarioViewAdminRouted },
  { path: 'equipo', component: EquipoAdminPlistPage },
  { path: 'equipo/teamadmin', component: EquipoTeamadminPlistPage, canActivate: [ClubAdminGuard] },

  { path: 'equipo/categoria/:id_categoria', component: EquipoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'equipo/new', component: EquipoAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'equipo/edit/:id', component: EquipoAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'equipo/view/:id', component: EquipoAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'equipo/delete/:id', component: EquipoAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'equipo/usuario/:id_usuario', component: EquipoAdminPlistPage },
  { path: 'carrito/new', component: CarritoAdminNewPage },
  { path: 'carrito', component: CarritoAdminPlistPage },
  { path: 'carrito/usuario/:id_usuario', component: CarritoAdminPlistPage },
  { path: 'carrito/articulo/:id_articulo', component: CarritoAdminPlistPage },
  { path: 'carrito/view/:id', component: CarritoAdminViewPage },
  { path: 'carrito/delete/:id', component: CarritoAdminDeletePage },
  { path: 'carrito/edit/:id', component: CarritoAdminEditPage },
  { path: 'comentario', component: ComentarioAdminPlistPage, pathMatch: 'full' },
  { path: 'comentario/new', component: ComentarioAdminNewPage },
  { path: 'comentario/usuario/:id_usuario', component: ComentarioAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'comentario/noticia/:id_noticia', component: ComentarioAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'comentario/view/:id', component: ComentarioAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'comentario/edit/:id', component: ComentarioAdminEditPage },
  { path: 'comentario/delete/:id', component: ComentarioAdminDeletePage },
  { path: 'pago', component: PagoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'pago/new', component: PagoAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'pago/cuota/:id_cuota', component: PagoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'pago/jugador/:id_jugador', component: PagoAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'pago/view/:id', component: PagoAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'pago/edit/:id', component: PagoAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'pago/delete/:id', component: PagoAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'categoria/delete/:id', component: CategoriaAdminDeletePage, data: { allowClubAdmin: true } },
  { path: 'puntuacion', component: PuntuacionAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'puntuacion/noticia/:id_noticia', component: PuntuacionAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'puntuacion/usuario/:id_usuario', component: PuntuacionAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'puntuacion/new', component: PuntuacionAdminNewPage },
  { path: 'puntuacion/view/:id', component: PuntuacionAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'puntuacion/edit/:id', component: PuntuacionAdminEditPage },
  { path: 'puntuacion/delete/:id', component: PuntuacionAdminDeletePage },
  { path: 'comentarioart', component: ComentarioartAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'comentarioart/new', component: ComentarioartAdminNewPage },
  { path: 'comentarioart/articulo/:id_articulo', component: ComentarioartAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'comentarioart/usuario/:id_usuario', component: ComentarioartAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'comentarioart/view/:id', component: ComentarioartAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'comentarioart/edit/:id', component: ComentarioartAdminEditPage },
  { path: 'comentarioart/delete/:id', component: ComentarioartAdminDeletePage },
];

export const routes: Routes = [
  ...publicRoutes,
  { path: 'club/teamadmin', component: ClubPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin', component: TemporadaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin', component: CategoriaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin', component: EquipoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin', component: LigaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin', component: PartidoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin', component: NoticiaPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin', component: ArticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin', component: FacturaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin', component: CuotaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin', component: JugadorTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin', component: PagoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'puntuacion/teamadmin', component: PuntuacionTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin', component: CompraTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin', component: CarritoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin', component: ComentarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin', component: TipoarticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  ...protectedRoutes.map((r) => ({ ...r, canActivate: [AdminGuard] })), 
];
