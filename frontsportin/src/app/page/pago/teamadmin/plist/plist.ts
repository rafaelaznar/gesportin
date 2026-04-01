import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoTeamadminPlist } from '../../../../component/pago/teamadmin/plist/plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-pago-teamadmin-plist-page',
  imports: [PagoTeamadminPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PagoTeamadminPlistPage {
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Equipos', route: '/equipo/teamadmin' }, { label: 'Cuotas', route: '/cuota/teamadmin' }, { label: 'Pagos' }]);

  id_cuota = signal<number | undefined>(undefined);
  id_jugador = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const cuotaParam = this.route.snapshot.paramMap.get('id_cuota');
    if (cuotaParam) {
      this.id_cuota.set(Number(cuotaParam));
    }
    const jugadorParam = this.route.snapshot.paramMap.get('id_jugador');
    if (jugadorParam) {
      this.id_jugador.set(Number(jugadorParam));
    }
  }
}
