import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../../../service/notificacion';;
import { RolusuarioService } from '../../../../service/rolusuario';
import { IRolusuario } from '../../../../model/rolusuario';

@Component({
  selector: 'app-rolusuario-admin-delete-page',
  imports: [CommonModule],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class RolusuarioAdminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private rolusuarioService = inject(RolusuarioService);

  rolusuario = signal<IRolusuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRolusuario(Number(id));
    } else {
      this.error.set('ID no válido');
      this.loading.set(false);
    }
  }

  private loadRolusuario(id: number): void {
    this.rolusuarioService.get(id).subscribe({
      next: (data) => {
        this.rolusuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el rol de usuario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onDelete(): void {
    if (!this.rolusuario()?.id) return;
    
    this.deleting.set(true);
    this.rolusuarioService.delete(this.rolusuario()!.id).subscribe({
      next: () => {
        this.notificacion.info('Rol de usuario eliminado exitosamente');
        this.router.navigate(['/rolusuario']);
      },
      error: (err: HttpErrorResponse) => {
        this.notificacion.error('Error eliminando el rol de usuario');
        console.error(err);
        this.deleting.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/rolusuario']);
  }
}
