import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoAdminPlist } from '../../../../component/equipo/admin/plist/plist';

@Component({
  selector: 'app-equipo-admin-plist-page',
  imports: [EquipoAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EquipoAdminPlistPage {
  categoria = signal<number>(0);
  temporada = signal<number>(0);
  usuario = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id_categoria = this.route.snapshot.paramMap.get('id_categoria');
    if (id_categoria) {
      this.categoria.set(+id_categoria);
    }

    const id_temporada = this.route.snapshot.paramMap.get('id_temporada');
    if (id_temporada) {
      this.temporada.set(+id_temporada);
    }

    const id_usuario = this.route.snapshot.paramMap.get('id_usuario');
    if (id_usuario) {
      this.usuario.set(+id_usuario);
    }
  }
}
