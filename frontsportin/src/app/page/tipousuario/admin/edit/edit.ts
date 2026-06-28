import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../../../service/notificacion';;
import { TipousuarioService } from '../../../../service/tipousuario';
import { TipousuarioAdminForm } from '../../../../component/tipousuario/admin/form/form';
import { ITipousuario } from '../../../../model/tipousuario';

@Component({
  selector: 'app-tipousuario-admin-edit-page',
  imports: [CommonModule, TipousuarioAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class TipousuarioAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private tipousuarioService = inject(TipousuarioService);

  tipousuario = signal<ITipousuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTipousuario(Number(id));
    } else {
      this.error.set('ID no válido');
      this.loading.set(false);
    }
  }

  private loadTipousuario(id: number): void {
    this.tipousuarioService.get(id).subscribe({
      next: (data) => {
        this.tipousuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el tipo de usuario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.notificacion.info('Tipo de usuario actualizado exitosamente');
    this.router.navigate(['/tipousuario']);
  }

  onFormCancel(): void {
    this.router.navigate(['/tipousuario']);
  }
}
