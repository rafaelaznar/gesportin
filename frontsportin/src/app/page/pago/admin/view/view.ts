import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoAdminDetail } from '../../../../component/pago/admin/detail/detail';

@Component({
  selector: 'app-pago-admin-view-page',
  imports: [PagoAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class PagoAdminViewPage {
  id_pago = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_pago.set(id ? Number(id) : NaN);
  }
}
