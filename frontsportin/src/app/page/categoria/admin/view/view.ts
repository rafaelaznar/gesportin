import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaAdminDetail } from '../../../../component/categoria/admin/detail/detail';

@Component({
  selector: 'app-categoria-admin-view-page',
  imports: [CategoriaAdminDetail],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class CategoriaAdminViewPage implements OnInit {
  private route = inject(ActivatedRoute);

  id_categoria = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_categoria.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_categoria())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.loading.set(false);
  }
}
