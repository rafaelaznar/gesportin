import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { Logout } from './component/shared/logout/logout';
import { LoginComponent } from './component/shared/login/login.component';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { ArticuloPlistTeamAdminRouted } from './component/articulo/plist-teamadmin-routed/articulo-plist-teamadmin-routed';
import { ArticuloViewAdminRouted } from './component/articulo/view-admin-routed/articulo-view';
import { ArticuloDeleteAdminRouted } from './component/articulo/delete-admin-routed/articulo-delete';
import { ArticuloEditAdminRouted } from './component/articulo/edit-admin-routed/articulo-edit';
import { ArticuloNewAdminRouted } from './component/articulo/new-admin-routed/articulo-new';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaAdminPlistPage } from './page/categoria/admin/plist/plist';
import { PartidoPlistAdminRouted } from './component/partido/plist-admin-routed/partido-plist';
import { PartidoPlistTeamAdminRouted } from './component/partido/plist-teamadmin-routed/partido-plist-teamadmin-routed';
import { PartidoNewAdminRouted } from './component/partido/new-admin-routed/partido-new';
import { PartidoViewAdminRouted } from './component/partido/view-admin-routed/partido-view';
import { FacturaPlistAdminRouted } from './component/factura/plist-admin-routed/factura-plist';
import { FacturaPlistTeamAdminRouted } from './component/factura/plist-teamadmin-routed/factura-plist-teamadmin-routed';
import { CompraPlistAdminRouted } from './component/compra/plist-admin-routed/compra-plist';
import { CompraPlistTeamAdminRouted } from './component/compra/plist-teamadmin-routed/compra-plist-teamadmin-routed';
import { CompraViewRouted } from './component/compra/view-routed/compra-view';
import { CompraDeleteAdminRouted } from './component/compra/delete-admin-routed/compra-delete';
import { CarritoPlistTeamAdminRouted } from './component/carrito/plist-teamadmin-routed/carrito-plist-teamadmin-routed';
import { RolusuarioPlist } from './component/rolusuario/plist-admin-routed/rolusuario-plist';
import { TipoarticuloPlistAdminRouted } from './component/tipoarticulo/plist-admin-routed/tipoarticulo-plist';
import { TipoarticuloPlistTeamAdminRouted } from './component/tipoarticulo/plist-teamadmin-routed/tipoarticulo-plist-teamadmin-routed';
import { TipoarticuloViewAdminRouted } from './component/tipoarticulo/view-admin-routed/tipoarticulo-view';
import { TipoarticuloEditAdminRouted } from './component/tipoarticulo/edit-admin-routed/tipoarticulo-edit';
import { TipoarticuloNewAdminRouted } from './component/tipoarticulo/new-admin-routed/tipoarticulo-new';
import { JugadorPlist } from './component/jugador/plist-admin-routed/jugador-plist';
import { JugadorPlistTeamAdminRouted } from './component/jugador/plist-teamadmin-routed/jugador-plist-teamadmin-routed';
import { JugadorViewRouted } from './component/jugador/view-admin-routed/jugador-view';
import { JugadorNewAdminRouted } from './component/jugador/new-admin-routed/jugador-new';
import { LigaPlistAdminRouted } from './component/liga/plist-admin-routed/liga-plist';
import { LigaPlistTeamAdminRouted } from './component/liga/plist-teamadmin-routed/liga-plist-teamadmin-routed';
import { NoticiaAdminPlistPage } from './page/noticia/admin/plist/plist';
import { NoticiaPlistTeamadminPage } from './page/noticia/teamadmin/plist/plist';
import { ClubAdminPlistPage } from './page/club/admin/plist/plist';
import { CuotaPlistTeamAdminRouted } from './component/cuota/plist-teamadmin-routed/cuota-plist-teamadmin-routed';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';
import { CuotaNewAdminRouted } from './component/cuota/new-admin-routed/cuota-new';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';
import { PlistEquipo } from './component/equipo/plist-admin-routed/equipo-plist';
import { EquipoPlistTeamAdminRouted } from './component/equipo/plist-teamadmin-routed/equipo-plist-teamadmin-routed';
import { EquipoViewRouted } from './component/equipo/view-admin-routed/equipo-view';
import { EquipoDeleteAdminRouted } from './component/equipo/delete-admin-routed/equipo.delete';
import { EquipoEditAdminRouted } from './component/equipo/edit-admin-routed/equipo-edit';
import { EquipoNewAdminRouted } from './component/equipo/new-admin-routed/equipo-new';
import { CarritoNewAdminRouted } from './component/carrito/new-admin-routed/carrito-new';
import { CarritoPlistAdminRouted } from './component/carrito/plist-admin-routed/carrito-plist';
import { ComentarioPlistAdminRouted } from './component/comentario/plist-admin-routed/comentario-plist';
import { ComentarioPlistTeamAdminRouted } from './component/comentario/plist-teamadmin-routed/comentario-plist-teamadmin-routed';
import { ComentarioViewRouted } from './component/comentario/view-routed/comentario-view';
import { ComentarioNewAdminRouted } from './component/comentario/new-admin-routed/comentario-new';
import { PagoPlistComponent } from './component/pago/plist-admin-routed/pago-plist';
import { PagoPlistTeamAdminRouted } from './component/pago/plist-teamadmin-routed/pago-plist-teamadmin-routed';
import { PuntuacionPlistAdminRouted } from './component/puntuacion/plist-admin-routed/puntuacion-plist';
import { PuntuacionViewRouted } from './component/puntuacion/view-routed/puntuacion-view';
import { PuntuacionEditAdminRouted } from './component/puntuacion/edit-admin-routed/puntuacion-edit';
import { PuntuacionNewAdminRouted } from './component/puntuacion/new-admin-routed/puntuacion-new';
import { NoticiaAdminViewPage } from './page/noticia/admin/view/view';
import { FacturaViewAdminRouted } from './component/factura/view-admin-routed/factura-view';
import { ComentarioartPlistAdminRouted } from './component/comentarioart/plist-admin-routed/comentarioart-plist';
import { ComentarioartNewAdminRouted } from './component/comentarioart/new-admin-routed/comentarioart-new';
import { TemporadaAdminViewPage } from './page/temporada/admin/view/view';
import { TemporadaAdminDeletePage } from './page/temporada/admin/delete/delete';
import { TemporadaTeamadminPlistPage } from './page/temporada/teamadmin/plist/plist';
import { PagoViewAdminRouted } from './component/pago/view-admin-routed/pago-view';
import { PagoEditAdminRouted } from './component/pago/edit-admin-routed/pago-edit';
import { PagoNewAdminRouted } from './component/pago/new-admin-routed/pago-new';
import { ClubAdminViewPage } from './page/club/admin/view/view';
import { CuotaViewAdminRouted } from './component/cuota/view-admin-routed/cuota-view';
import { TipousuarioViewAdminRouted } from './component/tipousario/view-admin-routed/tipousuario-view';
import { CarritoViewAdminRouted } from './component/carrito/view-admin-routed/view-admin-routed';
import { RolusuarioViewAdminRouted } from './component/rolusuario/view-admin-routed/rolusuario-view';
import { RolusuarioNewAdminRouted } from './component/rolusuario/new-admin-routed/rolusuario-new';
import { CategoriaAdminViewPage } from './page/categoria/admin/view/view';
import { CategoriaAdminEditPage } from './page/categoria/admin/edit/edit';
import { CategoriaAdminNewPage } from './page/categoria/admin/new/new';
import { CategoriaTeamadminPlistPage } from './page/categoria/teamadmin/plist/plist';
import { LigaViewRouted } from './component/liga/view-routed/liga-view';
import { LigaDeleteAdminRouted } from './component/liga/delete-admin-routed/liga-delete';
import { LigaNewAdminRouted } from './component/liga/new-admin-routed/liga-new';
import { ComentarioartViewRouted } from './component/comentarioart/view-routed/comentarioart-view';
import { ComentarioartEditAdminRouted } from './component/comentarioart/edit-admin-routed/comentarioart-edit';
import { ComentarioDeleteAdminRouted } from './component/comentario/delete-admin-routed/comentario-delete';
import { PagoDeleteAdminRouted } from './component/pago/delete-admin-routed/pago-delete';
import { RolusuarioDeleteAdminRouted } from './component/rolusuario/delete-admin-routed/rolusuario-delete';
import { LigaEditAdminRouted } from './component/liga/edit-admin-routed/liga-edit';
import { TemporadaAdminEditPage } from './page/temporada/admin/edit/edit';
import { PartidoDeleteAdminRouted } from './component/partido/delete-admin-routed/partido-delete';
import { ClubAdminDeletePage } from './page/club/admin/delete/delete';
import { PuntuacionDeleteAdminRouted } from './component/puntuacion/delete-admin-routed/puntuacion-delete';
import { RolusuarioEditAdminRouted } from './component/rolusuario/edit-admin-routed/rolusuario-edit';
import { CategoriaAdminDeletePage } from './page/categoria/admin/delete/delete';
import { ClubAdminEditPage } from './page/club/admin/edit/edit';
import { CarritoDeleteAdminRouted } from './component/carrito/delete-admin-routed/carrito-delete';
import { ComentarioartDeleteAdminRouted } from './component/comentarioart/delete-admin-routed/delete-admin-routed';
import { FacturaDeleteAdminRouted } from './component/factura/delete-admin-routed/factura-delete';
import { FacturaEditAdminRouted } from './component/factura/edit-admin-routed/factura-edit';
import { CarritoEditAdminRouted } from './component/carrito/edit-admin-routed/carrito-edit';
import { CuotaEditAdminRouted } from './component/cuota/edit-admin-routed/cuota-edit';
import { JugadorDeleteAdminRouted } from './component/jugador/delete-admin-routed/jugador-delete';
import { TipoarticuloDeleteAdminRouted } from './component/tipoarticulo/delete-admin-routed/delete-admin-routed';
import { TemporadaAdminPlistPage } from './page/temporada/admin/plist/plist';
import { ComentarioEditAdminRouted } from './component/comentario/edit-admin-routed/comentario-edit';
import { NoticiaAdminEditPage } from './page/noticia/admin/edit/edit';
import { NoticiaAdminNewPage } from './page/noticia/admin/new/new';
import { NoticiaAdminDeletePage } from './page/noticia/admin/delete/delete';
import { ClubAdminNewPage } from './page/club/admin/new/new';
import { ClubPlistTeamadminPage } from './page/club/teamadmin/plist/plist';
import { CuotaDeleteAdminRouted } from './component/cuota/delete-admin-routed/cuota-delete';
import { UsuarioEditAdminRouted } from './component/usuario/edit-admin-routed/usuario-edit';
import { UsuarioNewAdminRouted } from './component/usuario/new-admin-routed/usuario-new';
import { UsuarioDeleteAdminRouted } from './component/usuario/delete-admin-routed/usuario-delete';
import { JugadorEditAdminRouted } from './component/jugador/edit-admin-routed/jugador-edit';
import { CompraEditAdminRouted } from './component/compra/edit-admin-routed/compra-edit';
import { CompraNewAdminRouted } from './component/compra/new-admin-routed/compra-new';
import { PartidoEditAdminRouted } from './component/partido/edit-admin-routed/partido-edit';
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

  { path: 'liga', component: LigaPlistAdminRouted },
  { path: 'liga/teamadmin', component: LigaPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'liga/new', component: LigaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/view/:id', component: LigaViewRouted, data: { allowClubAdmin: true } },
  { path: 'liga/delete/:id', component: LigaDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/edit/:id', component: LigaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/equipo/:id_equipo', component: LigaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/teamadmin', component: ArticuloPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'articulo/tipoarticulo/:id_tipoarticulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'usuario/:id', component: UsuarioViewRouted },
  { path: 'articulo/new', component: ArticuloNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/view/:id', component: ArticuloViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/delete/:id', component: ArticuloDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'articulo/edit/:id', component: ArticuloEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'categoria', component: CategoriaAdminPlistPage },
  { path: 'categoria/temporada/:id_temporada', component: CategoriaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'categoria/view/:id', component: CategoriaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'categoria/edit/:id', component: CategoriaAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'categoria/new', component: CategoriaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'partido', component: PartidoPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/teamadmin', component: PartidoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'partido/liga/:id_liga', component: PartidoPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/new', component: PartidoNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'partido/view/:id', component: PartidoViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/edit/:id', component: PartidoEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'partido/delete/:id', component: PartidoDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'factura', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/teamadmin', component: FacturaPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'factura/:usuario', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/view/:id', component: FacturaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/usuario/:id_usuario', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/delete/:id', component: FacturaDeleteAdminRouted },
  { path: 'factura/edit/:id', component: FacturaEditAdminRouted },

  { path: 'compra', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/teamadmin', component: CompraPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'compra/articulo/:id_articulo', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/factura/:id_factura', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/view/:id', component: CompraViewRouted, data: { allowClubAdmin: true } },
  { path: 'compra/delete/:id', component: CompraDeleteAdminRouted },
  { path: 'compra/edit/:id', component: CompraEditAdminRouted },
  { path: 'compra/new', component: CompraNewAdminRouted },

  { path: 'rolusuario', component: RolusuarioPlist },
  { path: 'rolusuario/new', component: RolusuarioNewAdminRouted },
  { path: 'rolusuario/view/:id', component: RolusuarioViewAdminRouted },
  { path: 'rolusuario/delete/:id', component: RolusuarioDeleteAdminRouted },
  { path: 'rolusuario/edit/:id', component: RolusuarioEditAdminRouted },
  { path: 'tipoarticulo', component: TipoarticuloPlistAdminRouted },
  { path: 'tipoarticulo/teamadmin', component: TipoarticuloPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },

  { path: 'tipoarticulo/club/:id_club', component: TipoarticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/view/:id', component: TipoarticuloViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/edit/:id', component: TipoarticuloEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'tipoarticulo/new', component: TipoarticuloNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'jugador', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/teamadmin', component: JugadorPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'jugador/new', component: JugadorNewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/usuario/:id_usuario', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/equipo/:id_equipo', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/view/:id', component: JugadorViewRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/edit/:id', component: JugadorEditAdminRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/delete/:id', component: JugadorDeleteAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/delete/:id', component: TipoarticuloDeleteAdminRouted, data: { allowClubAdmin: true } },
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
  { path: 'cuota', component: CuotaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/new', component: CuotaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'cuota/equipo/:id_equipo', component: CuotaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/view/:id', component: CuotaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/edit/:id', component: CuotaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'cuota/delete/:id', component: CuotaDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'tipousuario', component: TipousuarioPlistAdminRouted },
  { path: 'tipousuario/view/:id', component: TipousuarioViewAdminRouted },
  { path: 'equipo', component: PlistEquipo },
  { path: 'equipo/teamadmin', component: EquipoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },

  { path: 'equipo/categoria/:id_categoria', component: PlistEquipo, data: { allowClubAdmin: true } },
  { path: 'equipo/new', component: EquipoNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/edit/:id', component: EquipoEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/view/:id', component: EquipoViewRouted, data: { allowClubAdmin: true } },
  { path: 'equipo/delete/:id', component: EquipoDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/usuario/:id_usuario', component: PlistEquipo },
  { path: 'carrito/new', component: CarritoNewAdminRouted },
  { path: 'carrito', component: CarritoPlistAdminRouted },
  { path: 'carrito/teamadmin', component: CarritoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'carrito/usuario/:id_usuario', component: CarritoPlistAdminRouted },
  { path: 'carrito/articulo/:id_articulo', component: CarritoPlistAdminRouted },
  { path: 'carrito/view/:id', component: CarritoViewAdminRouted },
  { path: 'carrito/delete/:id', component: CarritoDeleteAdminRouted },
  { path: 'carrito/edit/:id', component: CarritoEditAdminRouted },
  { path: 'comentario', component: ComentarioPlistAdminRouted, pathMatch: 'full' },
  { path: 'comentario/new', component: ComentarioNewAdminRouted },
  { path: 'comentario/usuario/:id_usuario', component: ComentarioPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'comentario/noticia/:id_noticia', component: ComentarioPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'comentario/view/:id', component: ComentarioViewRouted, data: { allowClubAdmin: true } },
  { path: 'comentario/edit/:id', component: ComentarioEditAdminRouted },

  { path: 'comentario/delete/:id', component: ComentarioDeleteAdminRouted },

  { path: 'pago', component: PagoPlistComponent, data: { allowClubAdmin: true } },
  { path: 'pago/new', component: PagoNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'pago/cuota/:id_cuota', component: PagoPlistComponent, data: { allowClubAdmin: true } },
  { path: 'pago/jugador/:id_jugador', component: PagoPlistComponent, data: { allowClubAdmin: true } },
  { path: 'pago/view/:id', component: PagoViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'pago/edit/:id', component: PagoEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'pago/delete/:id', component: PagoDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'categoria/delete/:id', component: CategoriaAdminDeletePage, data: { allowClubAdmin: true } },
  { path: 'puntuacion', component: PuntuacionPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'puntuacion/noticia/:id_noticia', component: PuntuacionPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'puntuacion/usuario/:id_usuario', component: PuntuacionPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'puntuacion/new', component: PuntuacionNewAdminRouted },
  { path: 'puntuacion/view/:id', component: PuntuacionViewRouted, data: { allowClubAdmin: true } },
  { path: 'puntuacion/edit/:id', component: PuntuacionEditAdminRouted },
  { path: 'puntuacion/delete/:id', component: PuntuacionDeleteAdminRouted },
  { path: 'comentarioart', component: ComentarioartPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'comentarioart/new', component: ComentarioartNewAdminRouted },
  { path: 'comentarioart/articulo/:id_articulo', component: ComentarioartPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'comentarioart/usuario/:id_usuario', component: ComentarioartPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'comentarioart/view/:id', component: ComentarioartViewRouted, data: { allowClubAdmin: true } },
  { path: 'comentarioart/edit/:id', component: ComentarioartEditAdminRouted },
  { path: 'carrito/delete/:id', component: CarritoDeleteAdminRouted },
  { path: 'comentarioart/delete/:id', component: ComentarioartDeleteAdminRouted },
];

export const routes: Routes = [
  ...publicRoutes,
  { path: 'club/teamadmin', component: ClubPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin', component: TemporadaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin', component: CategoriaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin', component: EquipoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin', component: LigaPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin', component: PartidoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin', component: NoticiaPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin', component: ArticuloPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin', component: FacturaPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin', component: CuotaPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin', component: JugadorPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin', component: PagoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin', component: CompraPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin', component: CarritoPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin', component: ComentarioPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin', component: TipoarticuloPlistTeamAdminRouted, canActivate: [ClubAdminGuard] },
  ...protectedRoutes.map((r) => ({ ...r, canActivate: [AdminGuard] })), 
];
