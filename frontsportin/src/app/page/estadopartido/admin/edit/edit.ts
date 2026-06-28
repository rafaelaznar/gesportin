import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../../../service/notificacion';
import { EstadopartidoService } from '../../../../service/estadopartido';
import { EstadopartidoAdminForm } from '../../../../component/estadopartido/admin/form/form';
import { IEstadopartido } from '../../../../model/estadopartido';

@Component({
  selector: 'app-estadopartido-admin-edit-page',
  imports: [CommonModule, EstadopartidoAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class EstadopartidoAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private estadopartidoService = inject(EstadopartidoService);

  estadopartido = signal<IEstadopartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEstadopartido(Number(id));
    } else {
      this.error.set('ID no válido');
      this.loading.set(false);
    }
  }

  private loadEstadopartido(id: number): void {
    this.estadopartidoService.get(id).subscribe({
      next: (data) => {
        this.estadopartido.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el estado de partido');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.notificacion.info('Estado de partido actualizado exitosamente');
    this.router.navigate(['/estadopartido']);
  }

  onFormCancel(): void {
    this.router.navigate(['/estadopartido']);
  }
}
