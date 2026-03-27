import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioAdminDetail } from '../../../../component/comentario/admin/detail/detail';

@Component({
  selector: 'app-comentario-admin-view-page',
  imports: [ComentarioAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class ComentarioAdminViewPage {
  id_comentario = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParametro = this.route.snapshot.paramMap.get('id');
    this.id_comentario.set(idParametro ? Number(idParametro) : NaN);
  }
}
