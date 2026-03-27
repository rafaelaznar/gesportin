import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { TipoarticuloAdminForm } from '../../../../component/tipoarticulo/admin/form/form';

@Component({
  selector: 'app-tipoarticulo-admin-edit-page',
  imports: [CommonModule, TipoarticuloAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class TipoarticuloAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tipoarticuloService = inject(TipoarticuloService);
  private snackBar = inject(MatSnackBar);

  id_tipoarticulo = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  tipoarticulo = signal<ITipoarticulo | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de tipo de artículo no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de tipo de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.id_tipoarticulo.set(id);
    this.loadTipoarticulo();
  }

  private loadTipoarticulo(): void {
    this.tipoarticuloService.get(this.id_tipoarticulo()).subscribe({
      next: (data) => {
        this.tipoarticulo.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando el tipo de artículo');
        this.snackBar.open('Error cargando el tipo de artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/tipoarticulo']);
  }

  onFormCancel(): void {
    this.router.navigate(['/tipoarticulo']);
  }
}
