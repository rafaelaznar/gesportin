import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoAdminPlist } from '../../../../component/pago/admin/plist/plist';

@Component({
  selector: 'app-pago-admin-plist-page',
  imports: [PagoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PagoAdminPlistPage {
  id_cuota = signal<number>(0);
  id_jugador = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idCuota = this.route.snapshot.paramMap.get('id_cuota');
    if (idCuota) {
      this.id_cuota.set(Number(idCuota));
    }
    const idJugador = this.route.snapshot.paramMap.get('id_jugador');
    if (idJugador) {
      this.id_jugador.set(Number(idJugador));
    }
  }
}
