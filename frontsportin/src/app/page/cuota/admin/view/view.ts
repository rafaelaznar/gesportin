import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotaAdminDetail } from '../../../../component/cuota/admin/detail/detail';

@Component({
  selector: 'app-cuota-admin-view-page',
  imports: [CuotaAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class CuotaAdminViewPage {
  id_cuota = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_cuota.set(id ? Number(id) : NaN);
  }
}
