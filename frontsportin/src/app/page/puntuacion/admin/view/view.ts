import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuntuacionAdminDetail } from '../../../../component/puntuacion/admin/detail/detail';

@Component({
  selector: 'app-puntuacion-admin-view-page',
  imports: [PuntuacionAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class PuntuacionAdminViewPage {
  id_puntuacion = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_puntuacion.set(id ? Number(id) : NaN);
  }
}
