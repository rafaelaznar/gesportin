import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaAdminDetail } from '../../../../component/factura/admin/detail/detail';

@Component({
  selector: 'app-factura-admin-view-page',
  imports: [FacturaAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class FacturaAdminViewPage {
  id_factura = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_factura.set(id ? Number(id) : NaN);
  }
}
