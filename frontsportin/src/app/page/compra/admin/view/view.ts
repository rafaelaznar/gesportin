import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompraAdminDetail } from '../../../../component/compra/admin/detail/detail';

@Component({
  selector: 'app-compra-admin-view-page',
  imports: [CompraAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class CompraAdminViewPage {
  id_compra = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_compra.set(id ? Number(id) : NaN);
  }
}
