import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoarticuloDetailAdminUnrouted } from '../tipoarticulo-detail/tipoarticulo-detail';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tipoarticulo-view',
  imports: [CommonModule, TipoarticuloDetailAdminUnrouted],
  templateUrl: './tipoarticulo-view.html',
  styleUrl: './tipoarticulo-view.css',
})
export class TipoarticuloViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  error = signal<string | null>(null);
  idTipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idTipoarticulo.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.idTipoarticulo())) {
      this.error.set('ID no válido');
      this.snackBar.open(this.error()!, 'Cerrar', { duration: 4000 });
      this.loading.set(false);
      return;
    }
  }
}
