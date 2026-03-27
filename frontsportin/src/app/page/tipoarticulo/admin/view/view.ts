import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoarticuloAdminDetail } from '../../../../component/tipoarticulo/admin/detail/detail';

@Component({
  selector: 'app-tipoarticulo-admin-view-page',
  imports: [TipoarticuloAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class TipoarticuloAdminViewPage {
  id_tipoarticulo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_tipoarticulo.set(id ? Number(id) : NaN);
  }
}
