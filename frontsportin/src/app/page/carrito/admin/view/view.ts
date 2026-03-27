import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoAdminDetail } from '../../../../component/carrito/admin/detail/detail';

@Component({
  selector: 'app-carrito-admin-view-page',
  imports: [CarritoAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class CarritoAdminViewPage {
  id_carrito = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_carrito.set(id ? Number(id) : NaN);
  }
}
