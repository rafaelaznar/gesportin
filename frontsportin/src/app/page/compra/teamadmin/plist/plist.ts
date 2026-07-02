import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraTeamadminPlist } from '../../../../component/compra/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { ArticuloService } from '../../../../service/articulo';
import { FacturaService } from '../../../../service/factura-service';

@Component({
  selector: 'app-compra-teamadmin-plist-page',
  imports: [CompraTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CompraTeamadminPlistPage implements OnInit {
  id_articulo = signal<number | undefined>(undefined);
  id_factura = signal<number | undefined>(undefined);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Compras' },
  ]);

  constructor(
    private route: ActivatedRoute,
    private articuloService: ArticuloService,
    private facturaService: FacturaService,
  ) {}

  ngOnInit(): void {
    const idArticuloParam = this.route.snapshot.paramMap.get('id_articulo');
    const idFacturaParam = this.route.snapshot.paramMap.get('id_factura');

    if (idArticuloParam) {
      const id = Number(idArticuloParam);
      this.id_articulo.set(id);
      this.articuloService.get(id).subscribe({
        next: (articulo) => {
          const tipo = articulo.tipoarticulo;
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (tipo?.club) {
            items.push({ label: tipo.club.nombre, route: `/club/teamadmin/view/${tipo.club.id}` });
          }
          if (tipo) {
            items.push({ label: 'Tipos de Artículo', route: '/tipoarticulo/teamadmin' });
            items.push({ label: tipo.descripcion, route: `/tipoarticulo/teamadmin/view/${tipo.id}` });
            items.push({ label: 'Artículos', route: `/articulo/teamadmin/tipoarticulo/${tipo.id}` });
          } else {
            items.push({ label: 'Artículos', route: '/articulo/teamadmin' });
          }
          items.push({ label: articulo.descripcion, route: `/articulo/teamadmin/view/${articulo.id}` });
          items.push({ label: 'Compras' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }

    if (idFacturaParam) {
      const id = Number(idFacturaParam);
      this.id_factura.set(id);
      this.facturaService.get(id).subscribe({
        next: (factura) => {
          const usuario = factura.usuario;
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
          ];
          if (usuario?.club) {
            items.push({ label: usuario.club.nombre, route: `/club/teamadmin/view/${usuario.club.id}` });
          }
          items.push({ label: 'Usuarios', route: '/usuario/teamadmin' });
          if (usuario) {
            items.push({
              label: `${usuario.nombre} ${usuario.apellido1}`,
              route: `/usuario/teamadmin/view/${usuario.id}`,
            });
          }
          items.push({ label: 'Facturas', route: usuario ? `/factura/teamadmin/usuario/${usuario.id}` : '/factura/teamadmin' });
          items.push({ label: `Factura #${id}`, route: `/factura/teamadmin/view/${id}` });
          items.push({ label: 'Compras' });
          this.breadcrumbItems.set(items);
        },
        error: () => {},
      });
    }
  }
}
