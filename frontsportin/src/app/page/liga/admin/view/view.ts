import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaAdminDetail } from '../../../../component/liga/admin/detail/detail';

@Component({
  selector: 'app-liga-admin-view-page',
  imports: [LigaAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class LigaAdminViewPage {
  id_liga = signal<number>(0);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(id ? Number(id) : NaN);
  }
}
