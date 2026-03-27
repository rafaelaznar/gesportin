import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioartAdminDetail } from '../../../../component/comentarioart/admin/detail/detail';

@Component({
  selector: 'app-comentarioart-admin-view-page',
  imports: [ComentarioartAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class ComentarioartAdminViewPage {
  id_comentarioart = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_comentarioart.set(id ? Number(id) : NaN);
  }
}
