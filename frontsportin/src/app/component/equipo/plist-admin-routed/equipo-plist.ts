import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoPlistAdminUnrouted } from '../plist-admin-unrouted/equipo-plist-admin-unrouted';

@Component({
  selector: 'app-equipo-plist',
  imports: [EquipoPlistAdminUnrouted],
  templateUrl: './equipo-plist.html',
  styleUrl: './equipo-plist.css',
})
export class PlistEquipo {
  categoria = signal<number>(0);
  usuario = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id_categoria = this.route.snapshot.paramMap.get('id_categoria');
    if (id_categoria) {
      this.categoria.set(+id_categoria);
    }

    const id_usuario = this.route.snapshot.paramMap.get('id_usuario');
    if (id_usuario) {
      this.usuario.set(+id_usuario);
    }
  }
}
