import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoAdminDetail } from '../../../../component/partido/admin/detail/detail';

@Component({
  selector: 'app-partido-admin-view-page',
  imports: [PartidoAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class PartidoAdminViewPage {
  id_partido = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_partido.set(id ? Number(id) : NaN);
  }
}
