import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { Logout } from './component/shared/logout/logout';
import { LoginComponent } from './component/shared/login/login.component';
import { UsuarioPlist } from './component/usuario/usuario-plist/usuario-plist';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { ArticuloViewAdminRouted } from './component/articulo/view-admin-routed/articulo-view';
import { ArticuloDeleteAdminRouted } from './component/articulo/delete-admin-routed/articulo-delete';
import { ArticuloEditAdminRouted } from './component/articulo/edit-admin-routed/articulo-edit';
import { ArticuloNewAdminRouted } from './component/articulo/new-admin-routed/articulo-new';
import { UsuarioViewRouted } from './component/usuario/view-routed/usuario-view';
import { CategoriaPlistAdminRouted } from './component/categoria/plist-admin-routed/categoria-plist';
import { PartidoPlistAdminRouted } from './component/partido/plist-admin-routed/partido-plist';
import { PartidoNewAdminRouted } from './component/partido/new-admin-routed/partido-new';
import { PartidoViewAdminRouted } from './component/partido/view-admin-routed/partido-view';
import { FacturaPlistAdminRouted } from './component/factura/plist-admin-routed/factura-plist';
import { CompraPlistAdminRouted } from './component/compra/plist-admin-routed/compra-plist';
import { CompraViewRouted } from './component/compra/view-routed/compra-view';
import { CompraDeleteAdminRouted } from './component/compra/delete-admin-routed/compra-delete';
import { RolusuarioPlist } from './component/rolusuario/plist-admin-routed/rolusuario-plist';
import { TipoarticuloPlistAdminRouted } from './component/tipoarticulo/plist-admin-routed/tipoarticulo-plist';
import { TipoarticuloViewAdminRouted } from './component/tipoarticulo/view-admin-routed/tipoarticulo-view';
import { TipoarticuloEditAdminRouted } from './component/tipoarticulo/edit-admin-routed/tipoarticulo-edit';
import { TipoarticuloNewAdminRouted } from './component/tipoarticulo/new-admin-routed/tipoarticulo-new';
import { JugadorPlist } from './component/jugador/plist-admin-routed/jugador-plist';
import { JugadorViewRouted } from './component/jugador/view-admin-routed/jugador-view';
import { JugadorNewAdminRouted } from './component/jugador/new-admin-routed/jugador-new';
import { LigaPlistAdminRouted } from './component/liga/plist-admin-routed/liga-plist';
import { NoticiaPlistAdminRouted } from './component/noticia/plist-admin-routed/noticia-plist';
import { ClubPlistAdminRouted } from './component/club/plist-admin-routed/club-plist';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';
import { CuotaNewAdminRouted } from './component/cuota/new-admin-routed/cuota-new';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';
import { PlistEquipo } from './component/equipo/plist-admin-routed/equipo-plist';
import { EquipoViewRouted } from './component/equipo/view-admin-routed/equipo-view';
import { EquipoDeleteAdminRouted } from './component/equipo/delete-admin-routed/equipo.delete';
import { EquipoEditAdminRouted } from './component/equipo/edit-admin-routed/equipo-edit';
import { EquipoNewAdminRouted } from './component/equipo/new-admin-routed/equipo-new';
import { CarritoNewAdminRouted } from './component/carrito/new-admin-routed/carrito-new';
import { CarritoPlistAdminRouted } from './component/carrito/plist-admin-routed/carrito-plist';
import { ComentarioPlistAdminRouted } from './component/comentario/plist-admin-routed/comentario-plist';
import { ComentarioViewRouted } from './component/comentario/view-routed/comentario-view';
import { ComentarioNewAdminRouted } from './component/comentario/new-admin-routed/comentario-new';
import { PagoPlistComponent } from './component/pago/plist-admin-routed/pago-plist';
import { PuntuacionPlistAdminRouted } from './component/puntuacion/plist-admin-routed/puntuacion-plist';
import { PuntuacionViewRouted } from './component/puntuacion/view-routed/puntuacion-view';
import { PuntuacionEditAdminRouted } from './component/puntuacion/edit-admin-routed/puntuacion-edit';
import { PuntuacionNewAdminRouted } from './component/puntuacion/new-admin-routed/puntuacion-new';
import { NoticiaViewAdminRouted } from './component/noticia/view-admin-routed/view-admin-routed';
import { FacturaViewAdminRouted } from './component/factura/view-admin-routed/factura-view';
import { ComentarioartPlistAdminRouted } from './component/comentarioart/plist-admin-routed/comentarioart-plist';
import { ComentarioartNewAdminRouted } from './component/comentarioart/new-admin-routed/comentarioart-new';
import { TemporadaViewAdminRouted } from './component/temporada/view-admin-routed/temporada-view';
import { TemporadaDeleteAdminRouted } from './component/temporada/delete-admin-routed/temporada-delete';
import { PagoViewAdminRouted } from './component/pago/view-admin-routed/pago-view';
import { PagoEditAdminRouted } from './component/pago/edit-admin-routed/pago-edit';
import { PagoNewAdminRouted } from './component/pago/new-admin-routed/pago-new';
import { ClubViewAdminRouted } from './component/club/view-admin-routed/club-view';
import { CuotaViewAdminRouted } from './component/cuota/view-admin-routed/cuota-view';
import { TipousuarioViewAdminRouted } from './component/tipousario/view-admin-routed/tipousuario-view';
import { CarritoViewAdminRouted } from './component/carrito/view-admin-routed/view-admin-routed';
import { RolusuarioViewAdminRouted } from './component/rolusuario/view-admin-routed/rolusuario-view';
import { RolusuarioNewAdminRouted } from './component/rolusuario/new-admin-routed/rolusuario-new';
import { CategoriaViewAdminRouted } from './component/categoria/view-admin-routed/categoria-view';
import { CategoriaEditAdminRouted } from './component/categoria/edit-admin-routed/categoria-edit';
import { CategoriaNewAdminRouted } from './component/categoria/new-admin-routed/categoria-new';
import { LigaViewRouted } from './component/liga/view-routed/liga-view';
import { LigaDeleteAdminRouted } from './component/liga/delete-admin-routed/liga-delete';
import { LigaNewAdminRouted } from './component/liga/new-admin-routed/liga-new';
import { ComentarioartViewRouted } from './component/comentarioart/view-routed/comentarioart-view';
import { ComentarioartEditAdminRouted } from './component/comentarioart/edit-admin-routed/comentarioart-edit';
import { ComentarioDeleteAdminRouted } from './component/comentario/delete-admin-routed/comentario-delete';
import { PagoDeleteAdminRouted } from './component/pago/delete-admin-routed/pago-delete';
import { RolusuarioDeleteAdminRouted } from './component/rolusuario/delete-admin-routed/rolusuario-delete';
import { LigaEditAdminRouted } from './component/liga/edit-admin-routed/liga-edit';
import { TemporadaEditAdminRouted } from './component/temporada/edit-admin-routed/temporada-edit';
import { PartidoDeleteAdminRouted } from './component/partido/delete-admin-routed/partido-delete';
import { ClubDeleteAdminRouted } from './component/club/delete-admin-routed/club-delete';
import { PuntuacionDeleteAdminRouted } from './component/puntuacion/delete-admin-routed/puntuacion-delete';
import { RolusuarioEditAdminRouted } from './component/rolusuario/edit-admin-routed/rolusuario-edit';
import { CategoriaDeleteAdminRouted } from './component/categoria/delete-admin-routed/categoria-delete';
import { ClubEditAdminRouted } from './component/club/edit-admin-routed/club-edit';
import { CarritoDeleteAdminRouted } from './component/carrito/delete-admin-routed/carrito-delete';
import { ComentarioartDeleteAdminRouted } from './component/comentarioart/delete-admin-routed/delete-admin-routed';
import { FacturaDeleteAdminRouted } from './component/factura/delete-admin-routed/factura-delete';
import { FacturaEditAdminRouted } from './component/factura/edit-admin-routed/factura-edit';
import { CarritoEditAdminRouted } from './component/carrito/edit-admin-routed/carrito-edit';
import { CuotaEditAdminRouted } from './component/cuota/edit-admin-routed/cuota-edit';
import { JugadorDeleteAdminRouted } from './component/jugador/delete-admin-routed/jugador-delete';
import { TipoarticuloDeleteAdminRouted } from './component/tipoarticulo/delete-admin-routed/delete-admin-routed';
import { TemporadaPlist } from './component/temporada/plist-admin-routed/temporada-plist';
import { ComentarioEditAdminRouted } from './component/comentario/edit-admin-routed/comentario-edit';
import { NoticiaEditAdminRouted } from './component/noticia/edit-admin-routed/noticia-edit';
import { NoticiaNewAdminRouted } from './component/noticia/new-admin-routed/noticia-new';
import { ClubNewAdminRouted } from './component/club/new-admin-routed/club-new';
import { CuotaDeleteAdminRouted } from './component/cuota/delete-admin-routed/cuota-delete';
import { UsuarioEditAdminRouted } from './component/usuario/edit-admin-routed/usuario-edit';
import { UsuarioNewAdminRouted } from './component/usuario/new-admin-routed/usuario-new';
import { JugadorEditAdminRouted } from './component/jugador/edit-admin-routed/jugador-edit';
import { CompraEditAdminRouted } from './component/compra/edit-admin-routed/compra-edit';
import { CompraNewAdminRouted } from './component/compra/new-admin-routed/compra-new';
import { PartidoEditAdminRouted } from './component/partido/edit-admin-routed/partido-edit';
import { TemporadaNewAdminRouted } from './component/temporada/new-admin-routed/temporada-new';
import { AdminGuard } from './guards/admin.guard';

export const publicRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: Logout },
];

const protectedRoutes: Routes = [
  { path: '', component: Home },
  { path: 'usuario', component: UsuarioPlist, data: { allowClubAdmin: true } },
  { path: 'usuario/tipousuario/:id_tipousuario', component: UsuarioPlist, data: { allowClubAdmin: true } },
  { path: 'usuario/rol/:id_rol', component: UsuarioPlist, data: { allowClubAdmin: true } },
  { path: 'usuario/club/:id_club', component: UsuarioPlist, data: { allowClubAdmin: true } },
  { path: 'usuario/view/:id', component: UsuarioViewRouted, data: { allowClubAdmin: true } },
  { path: 'usuario/new', component: UsuarioNewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'usuario/edit/:id', component: UsuarioEditAdminRouted, data: { allowClubAdmin: true } },
  { path: 'temporada', component: TemporadaPlist, data: { allowClubAdmin: true } },
  { path: 'temporada/club/:id_club', component: TemporadaPlist, data: { allowClubAdmin: true } },
  { path: 'temporada/edit/:id', component: TemporadaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'temporada/view/:id', component: TemporadaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'temporada/delete/:id', component: TemporadaDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'temporada/new', component: TemporadaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga', component: LigaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'liga/new', component: LigaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/view/:id', component: LigaViewRouted, data: { allowClubAdmin: true } },
  { path: 'liga/delete/:id', component: LigaDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/edit/:id', component: LigaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'liga/equipo/:id_equipo', component: LigaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/tipoarticulo/:id_tipoarticulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'usuario/:id', component: UsuarioViewRouted },
  { path: 'articulo/new', component: ArticuloNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/view/:id', component: ArticuloViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'articulo/delete/:id', component: ArticuloDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'articulo/edit/:id', component: ArticuloEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'categoria', component: CategoriaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'categoria/temporada/:id_temporada', component: CategoriaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'categoria/view/:id', component: CategoriaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'categoria/edit/:id', component: CategoriaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'categoria/new', component: CategoriaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'partido', component: PartidoPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/liga/:id_liga', component: PartidoPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/new', component: PartidoNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'partido/view/:id', component: PartidoViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'partido/edit/:id', component: PartidoEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'partido/delete/:id', component: PartidoDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'factura', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/:usuario', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/view/:id', component: FacturaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/usuario/:id_usuario', component: FacturaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'factura/delete/:id', component: FacturaDeleteAdminRouted },
  { path: 'factura/edit/:id', component: FacturaEditAdminRouted },

  { path: 'compra', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/articulo/:id_articulo', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/factura/:id_factura', component: CompraPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'compra/view/:id', component: CompraViewRouted, data: { allowClubAdmin: true } },
  { path: 'compra/delete/:id', component: CompraDeleteAdminRouted },
  { path: 'compra/edit/:id', component: CompraEditAdminRouted },
  { path: 'compra/new', component: CompraNewAdminRouted },
  { path: 'rolusuario', component: RolusuarioPlist, data: { allowClubAdmin: true } },
  { path: 'rolusuario/new', component: RolusuarioNewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'rolusuario/view/:id', component: RolusuarioViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'rolusuario/delete/:id', component: RolusuarioDeleteAdminRouted, data: { allowClubAdmin: true } },
  { path: 'rolusuario/edit/:id', component: RolusuarioEditAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo', component: TipoarticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/club/:id_club', component: TipoarticuloPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/view/:id', component: TipoarticuloViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/edit/:id', component: TipoarticuloEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'tipoarticulo/new', component: TipoarticuloNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'jugador', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/new', component: JugadorNewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/usuario/:id_usuario', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/equipo/:id_equipo', component: JugadorPlist, data: { allowClubAdmin: true } },
  { path: 'jugador/view/:id', component: JugadorViewRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/edit/:id', component: JugadorEditAdminRouted, data: { allowClubAdmin: true } },
  { path: 'jugador/delete/:id', component: JugadorDeleteAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipoarticulo/delete/:id', component: TipoarticuloDeleteAdminRouted, data: { allowClubAdmin: true } },
  { path: 'noticia', component: NoticiaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'noticia/club/:id_club', component: NoticiaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'noticia/view/:id', component: NoticiaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'noticia/edit/:id', component: NoticiaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'noticia/new', component: NoticiaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'club/plist', component: ClubPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'club', component: ClubPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'club/new', component: ClubNewAdminRouted },
  { path: 'club/view/:id', component: ClubViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'club/delete/:id', component: ClubDeleteAdminRouted },
  { path: 'club/edit/:id', component: ClubEditAdminRouted },
  { path: 'cuota', component: CuotaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/new', component: CuotaNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'cuota/equipo/:id_equipo', component: CuotaPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/view/:id', component: CuotaViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'cuota/edit/:id', component: CuotaEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'cuota/delete/:id', component: CuotaDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'tipousuario', component: TipousuarioPlistAdminRouted, data: { allowClubAdmin: true } },
  { path: 'tipousuario/view/:id', component: TipousuarioViewAdminRouted, data: { allowClubAdmin: true } },
  { path: 'equipo', component: PlistEquipo, data: { allowClubAdmin: true } },
  { path: 'equipo/categoria/:id_categoria', component: PlistEquipo, data: { allowClubAdmin: true } },
  { path: 'equipo/new', component: EquipoNewAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/edit/:id', component: EquipoEditAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/view/:id', component: EquipoViewRouted, data: { allowClubAdmin: true } },
  { path: 'equipo/delete/:id', component: EquipoDeleteAdminRouted, data: { allowClubAdmin: true } },

  { path: 'equipo/usuario/:id_usuario', component: PlistEquipo },
  { path: 'carrito/new', component: CarritoNewAdminRouted },
  { path: 'carrito', component: CarritoPlistAdminRouted },
  { path: 'carrito/usuario/:id_usuario', component: CarritoPlistAdminRouted },
  { path: 'carrito/articulo/:id_articulo', component: CarritoPlistAdminRouted },
  { path: 'carrito/view/:id', component: CarritoViewAdminRouted },
  { path: 'carrito/delete/:id', component: CarritoDeleteAdminRouted },
  { path: 'carrito/edit/:id', component: CarritoEditAdminRouted },
  { path: 'comentario', component: ComentarioPlistAdminRouted, data: { allowClubAdmin: true } },
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

  { path: 'categoria/delete/:id', component: CategoriaDeleteAdminRouted, data: { allowClubAdmin: true } },
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
  ...protectedRoutes.map(r => ({ ...r, canActivate: [AdminGuard] }))
];
