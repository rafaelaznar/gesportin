import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JugadorAdminDetail } from '../../../../component/jugador/admin/detail/detail';

@Component({
  selector: 'app-jugador-admin-view-page',
  imports: [JugadorAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class JugadorAdminViewPage {
  id_jugador = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_jugador.set(id ? Number(id) : NaN);
  }
}
