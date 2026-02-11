import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-tipoarticulo-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './tipoarticulo-detail.html',
  styleUrl: './tipoarticulo-detail.css',
})
export class TipoarticuloDetailAdminUnrouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oTipoarticuloService = inject(TipoarticuloService);
  private snackBar = inject(MatSnackBar);

  oTipoarticulo = signal<ITipoarticulo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  idTipoarticulo = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idTipoarticulo.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.idTipoarticulo())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.load(this.idTipoarticulo());
  }

  load(id: number) {
    this.oTipoarticuloService.get(id).subscribe({
      next: (data: ITipoarticulo) => {
        this.oTipoarticulo.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando el tipo de artículo');
        this.snackBar.open(this.error()!, 'Cerrar', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }
}
