import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { LandingPage } from './component/shared/landing/landing';
import { Logout } from './component/shared/logout/logout';
import { LoginComponent } from './component/shared/login/login.component';
import { ArticuloAdminPlistPage } from './page/articulo/admin/plist/plist';
import { ArticuloAdminViewPage } from './page/articulo/admin/view/view';
import { ArticuloAdminNewPage } from './page/articulo/admin/new/new';
import { ArticuloAdminEditPage } from './page/articulo/admin/edit/edit';
import { ArticuloAdminDeletePage } from './page/articulo/admin/delete/delete';
import { ArticuloTeamadminPlistPage } from './page/articulo/teamadmin/plist/plist';
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
import { CategoriaAdminViewPage } from './page/categoria/admin/view/view';
import { CategoriaAdminEditPage } from './page/categoria/admin/edit/edit';
import { CategoriaAdminNewPage } from './page/categoria/admin/new/new';
import { CategoriaTeamadminPlistPage } from './page/categoria/teamadmin/plist/plist';
import { ComentarioartAdminViewPage } from './page/comentarioart/admin/view/view';
import { ComentarioartAdminEditPage } from './page/comentarioart/admin/edit/edit';
import { ComentarioAdminEditPage } from './page/comentario/admin/edit/edit';
import { ComentarioAdminDeletePage } from './page/comentario/admin/delete/delete';
import { PagoAdminDeletePage } from './page/pago/admin/delete/delete';
import { TemporadaAdminEditPage } from './page/temporada/admin/edit/edit';
import { ClubAdminDeletePage } from './page/club/admin/delete/delete';
import { CategoriaAdminDeletePage } from './page/categoria/admin/delete/delete';
import { ClubAdminEditPage } from './page/club/admin/edit/edit';
import { CarritoAdminDeletePage } from './page/carrito/admin/delete/delete';
import { ComentarioartAdminDeletePage } from './page/comentarioart/admin/delete/delete';
import { FacturaAdminDeletePage } from './page/factura/admin/delete/delete';
import { FacturaAdminEditPage } from './page/factura/admin/edit/edit';
import { FacturaAdminNewPage } from './page/factura/admin/new/new';
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
import { JugadorAdminEditPage } from './page/jugador/admin/edit/edit';
import { CompraAdminEditPage } from './page/compra/admin/edit/edit';
import { CompraAdminNewPage } from './page/compra/admin/new/new';
import { TemporadaAdminNewPage } from './page/temporada/admin/new/new';
import { RolusuarioAdminPlistPage } from './page/rolusuario/admin/plist/plist';
import { RolusuarioAdminViewPage } from './page/rolusuario/admin/view/view';
import { RolusuarioAdminNewPage } from './page/rolusuario/admin/new/new';
import { RolusuarioAdminEditPage } from './page/rolusuario/admin/edit/edit';
import { RolusuarioAdminDeletePage } from './page/rolusuario/admin/delete/delete';
import { TipousuarioAdminPlistPage } from './page/tipousuario/admin/plist/plist';
import { TipousuarioAdminViewPage } from './page/tipousuario/admin/view/view';
import { TipousuarioAdminNewPage } from './page/tipousuario/admin/new/new';
import { TipousuarioAdminEditPage } from './page/tipousuario/admin/edit/edit';
import { EstadopartidoAdminPlistPage } from './page/estadopartido/admin/plist/plist';
import { EstadopartidoAdminViewPage } from './page/estadopartido/admin/view/view';
import { EstadopartidoAdminNewPage } from './page/estadopartido/admin/new/new';
import { EstadopartidoAdminEditPage } from './page/estadopartido/admin/edit/edit';
import { UsuarioAdminPlistPage } from './page/usuario/admin/plist/plist';
import { UsuarioAdminViewPage } from './page/usuario/admin/view/view';
import { UsuarioAdminNewPage } from './page/usuario/admin/new/new';
import { UsuarioAdminEditPage } from './page/usuario/admin/edit/edit';
import { UsuarioTeamadminPlistPage } from './page/usuario/teamadmin/plist/plist';
import { TemporadaTeamadminViewPage } from './page/temporada/teamadmin/view/view';
import { TemporadaTeamadminNewPage } from './page/temporada/teamadmin/new/new';
import { TemporadaTeamadminEditPage } from './page/temporada/teamadmin/edit/edit';
import { TemporadaTeamadminDeletePage } from './page/temporada/teamadmin/delete/delete';
import { CategoriaTeamadminViewPage } from './page/categoria/teamadmin/view/view';
import { CategoriaTeamadminNewPage } from './page/categoria/teamadmin/new/new';
import { CategoriaTeamadminEditPage } from './page/categoria/teamadmin/edit/edit';
import { CategoriaTeamadminDeletePage } from './page/categoria/teamadmin/delete/delete';
import { EquipoTeamadminViewPage } from './page/equipo/teamadmin/view/view';
import { EquipoTeamadminNewPage } from './page/equipo/teamadmin/new/new';
import { EquipoTeamadminEditPage } from './page/equipo/teamadmin/edit/edit';
import { EquipoTeamadminDeletePage } from './page/equipo/teamadmin/delete/delete';
import { LigaTeamadminViewPage } from './page/liga/teamadmin/view/view';
import { LigaTeamadminNewPage } from './page/liga/teamadmin/new/new';
import { LigaTeamadminEditPage } from './page/liga/teamadmin/edit/edit';
import { LigaTeamadminDeletePage } from './page/liga/teamadmin/delete/delete';
import { PartidoTeamadminViewPage } from './page/partido/teamadmin/view/view';
import { PartidoTeamadminNewPage } from './page/partido/teamadmin/new/new';
import { PartidoTeamadminEditPage } from './page/partido/teamadmin/edit/edit';
import { PartidoTeamadminDeletePage } from './page/partido/teamadmin/delete/delete';
import { JugadorTeamadminViewPage } from './page/jugador/teamadmin/view/view';
import { JugadorTeamadminNewPage } from './page/jugador/teamadmin/new/new';
import { JugadorTeamadminEditPage } from './page/jugador/teamadmin/edit/edit';
import { JugadorTeamadminDeletePage } from './page/jugador/teamadmin/delete/delete';
import { CuotaTeamadminViewPage } from './page/cuota/teamadmin/view/view';
import { CuotaTeamadminNewPage } from './page/cuota/teamadmin/new/new';
import { CuotaTeamadminEditPage } from './page/cuota/teamadmin/edit/edit';
import { CuotaTeamadminDeletePage } from './page/cuota/teamadmin/delete/delete';
import { PagoTeamadminViewPage } from './page/pago/teamadmin/view/view';
import { PagoTeamadminNewPage } from './page/pago/teamadmin/new/new';
import { PagoTeamadminEditPage } from './page/pago/teamadmin/edit/edit';
import { PagoTeamadminDeletePage } from './page/pago/teamadmin/delete/delete';
import { NoticiaTeamadminViewPage } from './page/noticia/teamadmin/view/view';
import { NoticiaTeamadminNewPage } from './page/noticia/teamadmin/new/new';
import { NoticiaTeamadminEditPage } from './page/noticia/teamadmin/edit/edit';
import { NoticiaTeamadminDeletePage } from './page/noticia/teamadmin/delete/delete';
import { TipoarticuloTeamadminViewPage } from './page/tipoarticulo/teamadmin/view/view';
import { TipoarticuloTeamadminNewPage } from './page/tipoarticulo/teamadmin/new/new';
import { TipoarticuloTeamadminEditPage } from './page/tipoarticulo/teamadmin/edit/edit';
import { TipoarticuloTeamadminDeletePage } from './page/tipoarticulo/teamadmin/delete/delete';
import { ArticuloTeamadminViewPage } from './page/articulo/teamadmin/view/view';
import { ArticuloTeamadminNewPage } from './page/articulo/teamadmin/new/new';
import { ArticuloTeamadminEditPage } from './page/articulo/teamadmin/edit/edit';
import { ArticuloTeamadminDeletePage } from './page/articulo/teamadmin/delete/delete';
import { UsuarioTeamadminViewPage } from './page/usuario/teamadmin/view/view';
import { UsuarioTeamadminNewPage } from './page/usuario/teamadmin/new/new';
import { UsuarioTeamadminEditPage } from './page/usuario/teamadmin/edit/edit';
import { UsuarioTeamadminDeletePage } from './page/usuario/teamadmin/delete/delete';
import { ClubTeamadminViewPage } from './page/club/teamadmin/view/view';
import { CarritoTeamadminViewPage } from './page/carrito/teamadmin/view/view';
import { ComentarioTeamadminViewPage } from './page/comentario/teamadmin/view/view';
import { ComentarioTeamadminNewPage } from './page/comentario/teamadmin/new/new';
import { ComentarioTeamadminEditPage } from './page/comentario/teamadmin/edit/edit';
import { ComentarioTeamadminDeletePage } from './page/comentario/teamadmin/delete/delete';
import { ComentarioartTeamadminPlistPage } from './page/comentarioart/teamadmin/plist/plist';
import { ComentarioartTeamadminViewPage } from './page/comentarioart/teamadmin/view/view';
import { CompraTeamadminViewPage } from './page/compra/teamadmin/view/view';
import { CompraTeamadminNewPage } from './page/compra/teamadmin/new/new';
import { CompraTeamadminEditPage } from './page/compra/teamadmin/edit/edit';
import { CompraTeamadminDeletePage } from './page/compra/teamadmin/delete/delete';
import { PuntuacionTeamadminViewPage } from './page/puntuacion/teamadmin/view/view';
import { FacturaTeamadminViewPage } from './page/factura/teamadmin/view/view';
import { FacturaTeamadminNewPage } from './page/factura/teamadmin/new/new';
import { FacturaTeamadminEditPage } from './page/factura/teamadmin/edit/edit';
import { AdminGuard } from './guards/admin.guard';
import { ClubAdminGuard } from './guards/club-admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { MiHomePage } from './page/usuario/mi-home/mi-home';
import { NoticiaUsuarioPlistPage } from './page/noticia/usuario/plist/plist';
import { NoticiaUsuarioViewPage } from './page/noticia/usuario/view/view';
import { EquipoUsuarioPlistPage } from './page/equipo/usuario/plist/plist';
import { EquipoUsuarioViewPage } from './page/equipo/usuario/view/view';
import { CuotaUsuarioPlistPage } from './page/cuota/usuario/plist/plist';
import { CarritoUsuarioTiendaPage } from './page/carrito/usuario/tienda/tienda';
import { FacturaUsuarioPlistPage } from './page/factura/usuario/plist/plist';
import { JugadorUsuarioEquipoPlistPage } from './page/jugador/usuario/equipo-plist/plist';
import { AdminDataToolsPage } from './page/admin/data-tools/data-tools';

export const publicRoutes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: Logout },
];

const protectedRoutes: Routes = [
  { path: 'admin/datos', component: AdminDataToolsPage },
  { path: 'usuario', component: UsuarioAdminPlistPage },
  { path: 'usuario/tipousuario/:id_tipousuario', component: UsuarioAdminPlistPage },
  { path: 'usuario/rol/:id_rol', component: UsuarioAdminPlistPage },
  { path: 'usuario/club/:id_club', component: UsuarioAdminPlistPage },
  { path: 'usuario/view/:id', component: UsuarioAdminViewPage },
  { path: 'usuario/new', component: UsuarioAdminNewPage },
  { path: 'usuario/edit/:id', component: UsuarioAdminEditPage },
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
  { path: 'usuario/:id', component: UsuarioAdminViewPage },
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
  { path: 'factura/new', component: FacturaAdminNewPage },
  { path: 'factura/view/:id', component: FacturaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'factura/usuario/:id_usuario', component: FacturaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'factura/delete/:id', component: FacturaAdminDeletePage },
  { path: 'factura/edit/:id', component: FacturaAdminEditPage },
  { path: 'factura/:usuario', component: FacturaAdminPlistPage, data: { allowClubAdmin: true } },

  { path: 'compra', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/articulo/:id_articulo', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/factura/:id_factura', component: CompraAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'compra/view/:id', component: CompraAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'compra/delete/:id', component: CompraAdminDeletePage },
  { path: 'compra/edit/:id', component: CompraAdminEditPage },
  { path: 'compra/new', component: CompraAdminNewPage },

  { path: 'rolusuario', component: RolusuarioAdminPlistPage },
  { path: 'rolusuario/new', component: RolusuarioAdminNewPage },
  { path: 'rolusuario/view/:id', component: RolusuarioAdminViewPage },
  { path: 'rolusuario/delete/:id', component: RolusuarioAdminDeletePage },
  { path: 'rolusuario/edit/:id', component: RolusuarioAdminEditPage },
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
  { path: 'club/new', component: ClubAdminNewPage },
  { path: 'club/view/:id', component: ClubAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'club/delete/:id', component: ClubAdminDeletePage },
  { path: 'club/edit/:id', component: ClubAdminEditPage },
  { path: 'cuota', component: CuotaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'cuota/new', component: CuotaAdminNewPage, data: { allowClubAdmin: true } },

  { path: 'cuota/equipo/:id_equipo', component: CuotaAdminPlistPage, data: { allowClubAdmin: true } },
  { path: 'cuota/view/:id', component: CuotaAdminViewPage, data: { allowClubAdmin: true } },
  { path: 'cuota/edit/:id', component: CuotaAdminEditPage, data: { allowClubAdmin: true } },

  { path: 'cuota/delete/:id', component: CuotaAdminDeletePage, data: { allowClubAdmin: true } },

  { path: 'tipousuario', component: TipousuarioAdminPlistPage },
  { path: 'tipousuario/view/:id', component: TipousuarioAdminViewPage },
  { path: 'tipousuario/new', component: TipousuarioAdminNewPage },
  { path: 'tipousuario/edit/:id', component: TipousuarioAdminEditPage },
  { path: 'estadopartido', component: EstadopartidoAdminPlistPage },
  { path: 'estadopartido/view/:id', component: EstadopartidoAdminViewPage },
  { path: 'estadopartido/new', component: EstadopartidoAdminNewPage },
  { path: 'estadopartido/edit/:id', component: EstadopartidoAdminEditPage },
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
  // Home específico de cada perfil de usuario
  { path: 'admin', component: Home, canActivate: [AdminGuard] },
  { path: 'usuario/teamadmin', component: UsuarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'usuario/teamadmin/club/:id_club', component: UsuarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'club/teamadmin', component: ClubPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin', component: TemporadaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin/club/:id_club', component: TemporadaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin', component: CategoriaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin/temporada/:id_temporada', component: CategoriaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin', component: EquipoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/categoria/:id_categoria', component: EquipoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/usuario/:id_usuario', component: EquipoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin', component: LigaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin/equipo/:id_equipo', component: LigaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin', component: PartidoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin/liga/:id_liga', component: PartidoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin', component: JugadorTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/equipo/:id_equipo', component: JugadorTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/usuario/:id_usuario', component: JugadorTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin', component: CuotaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin/equipo/:id_equipo', component: CuotaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin', component: PagoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/cuota/:id_cuota', component: PagoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/jugador/:id_jugador', component: PagoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin', component: NoticiaPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin/club/:id_club', component: NoticiaPlistTeamadminPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin', component: ArticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin/tipoarticulo/:id_tipoarticulo', component: ArticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin', component: FacturaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin/usuario/:id_usuario', component: FacturaTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'puntuacion/teamadmin', component: PuntuacionTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'puntuacion/teamadmin/usuario/:id_usuario', component: PuntuacionTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'puntuacion/teamadmin/noticia/:id_noticia', component: PuntuacionTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin', component: CompraTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/articulo/:id_articulo', component: CompraTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/factura/:id_factura', component: CompraTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin', component: CarritoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin/articulo/:id_articulo', component: CarritoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin/usuario/:id_usuario', component: CarritoTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin', component: ComentarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/noticia/:id_noticia', component: ComentarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/usuario/:id_usuario', component: ComentarioTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin', component: TipoarticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin/club/:id_club', component: TipoarticuloTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  // Teamadmin CRUD routes
  { path: 'temporada/teamadmin/view/:id', component: TemporadaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin/new', component: TemporadaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin/edit/:id', component: TemporadaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'temporada/teamadmin/delete/:id', component: TemporadaTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin/view/:id', component: CategoriaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin/new', component: CategoriaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin/edit/:id', component: CategoriaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'categoria/teamadmin/delete/:id', component: CategoriaTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/view/:id', component: EquipoTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/new', component: EquipoTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/edit/:id', component: EquipoTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'equipo/teamadmin/delete/:id', component: EquipoTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin/view/:id', component: LigaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin/new', component: LigaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin/edit/:id', component: LigaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'liga/teamadmin/delete/:id', component: LigaTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin/view/:id', component: PartidoTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin/new', component: PartidoTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin/edit/:id', component: PartidoTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'partido/teamadmin/delete/:id', component: PartidoTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/view/:id', component: JugadorTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/new', component: JugadorTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/edit/:id', component: JugadorTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'jugador/teamadmin/delete/:id', component: JugadorTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin/view/:id', component: CuotaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin/new', component: CuotaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin/edit/:id', component: CuotaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'cuota/teamadmin/delete/:id', component: CuotaTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/view/:id', component: PagoTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/new', component: PagoTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/edit/:id', component: PagoTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'pago/teamadmin/delete/:id', component: PagoTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin/view/:id', component: NoticiaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin/new', component: NoticiaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin/edit/:id', component: NoticiaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'noticia/teamadmin/delete/:id', component: NoticiaTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin/view/:id', component: TipoarticuloTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin/new', component: TipoarticuloTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin/edit/:id', component: TipoarticuloTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'tipoarticulo/teamadmin/delete/:id', component: TipoarticuloTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin/view/:id', component: ArticuloTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin/new', component: ArticuloTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin/edit/:id', component: ArticuloTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'articulo/teamadmin/delete/:id', component: ArticuloTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'usuario/teamadmin/view/:id', component: UsuarioTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'usuario/teamadmin/new', component: UsuarioTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'usuario/teamadmin/edit/:id', component: UsuarioTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'usuario/teamadmin/delete/:id', component: UsuarioTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  // Teamadmin view-only entity routes
  { path: 'club/teamadmin/view/:id', component: ClubTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'carrito/teamadmin/view/:id', component: CarritoTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/view/:id', component: ComentarioTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/new', component: ComentarioTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/edit/:id', component: ComentarioTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'comentario/teamadmin/delete/:id', component: ComentarioTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'comentarioart/teamadmin', component: ComentarioartTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentarioart/teamadmin/articulo/:id_articulo', component: ComentarioartTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentarioart/teamadmin/usuario/:id_usuario', component: ComentarioartTeamadminPlistPage, canActivate: [ClubAdminGuard] },
  { path: 'comentarioart/teamadmin/view/:id', component: ComentarioartTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/view/:id', component: CompraTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/new', component: CompraTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/edit/:id', component: CompraTeamadminEditPage, canActivate: [ClubAdminGuard] },
  { path: 'compra/teamadmin/delete/:id', component: CompraTeamadminDeletePage, canActivate: [ClubAdminGuard] },
  { path: 'puntuacion/teamadmin/view/:id', component: PuntuacionTeamadminViewPage, canActivate: [ClubAdminGuard] },
  // Factura teamadmin (CRUD except delete)
  { path: 'factura/teamadmin/view/:id', component: FacturaTeamadminViewPage, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin/new', component: FacturaTeamadminNewPage, canActivate: [ClubAdminGuard] },
  { path: 'factura/teamadmin/edit/:id', component: FacturaTeamadminEditPage, canActivate: [ClubAdminGuard] },
  // Usuario (perfil 3) routes
  { path: 'mi', component: MiHomePage, canActivate: [UsuarioGuard] },
  { path: 'mi/noticias', component: NoticiaUsuarioPlistPage, canActivate: [UsuarioGuard] },
  { path: 'mi/noticias/:id', component: NoticiaUsuarioViewPage, canActivate: [UsuarioGuard] },
  { path: 'mi/equipos', component: EquipoUsuarioPlistPage, canActivate: [UsuarioGuard] },
  { path: 'mi/equipos/:id', component: EquipoUsuarioViewPage, canActivate: [UsuarioGuard] },
  { path: 'mi/equipos/:id/jugadores', component: JugadorUsuarioEquipoPlistPage, canActivate: [UsuarioGuard] },
  { path: 'mi/cuotas', component: CuotaUsuarioPlistPage, canActivate: [UsuarioGuard] },
  { path: 'mi/tienda', component: CarritoUsuarioTiendaPage, canActivate: [UsuarioGuard] },
  { path: 'mi/facturas', component: FacturaUsuarioPlistPage, canActivate: [UsuarioGuard] },
  ...protectedRoutes.map((r) => ({ ...r, canActivate: [AdminGuard] })), 
];
