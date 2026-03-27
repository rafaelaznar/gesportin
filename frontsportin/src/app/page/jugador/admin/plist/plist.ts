import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorAdminPlist } from '../../../../component/jugador/admin/plist/plist';

@Component({
  selector: 'app-jugador-admin-plist-page',
  imports: [JugadorAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class JugadorAdminPlistPage {
  id_usuario = signal<number>(0);
  id_equipo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
    if (idUsuario) {
      this.id_usuario.set(Number(idUsuario));
    }
    const idEquipo = this.route.snapshot.paramMap.get('id_equipo');
    if (idEquipo) {
      this.id_equipo.set(Number(idEquipo));
    }
  }
}
