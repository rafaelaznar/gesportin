import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticuloAdminDetail } from '../../../../component/articulo/admin/detail/detail';

@Component({
  selector: 'app-articulo-admin-view-page',
  imports: [ArticuloAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class ArticuloAdminViewPage {
  id_articulo = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_articulo.set(id ? Number(id) : NaN);
  }
}
