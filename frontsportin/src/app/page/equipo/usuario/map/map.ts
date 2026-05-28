import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';
import { EquipoUsuarioMap } from '../../../../component/equipo/usuario/map/map';

@Component({
  selector: 'app-equipo-usuario-map-page',
  standalone: true,
  imports: [BreadcrumbComponent, EquipoUsuarioMap],
  template: '<app-breadcrumb [items]="breadcrumbItems()"></app-breadcrumb><app-equipo-usuario-map [id]="id_partido()"></app-equipo-usuario-map>',
})
export class EquipoUsuarioMapPage implements OnInit {
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Equipos', route: '/mi/equipos' },
    { label: 'Mapa del partido' },
  ]);

  private route = inject(ActivatedRoute);
  id_partido = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_partido.set(id ? Number(id) : 0);
  }
}
