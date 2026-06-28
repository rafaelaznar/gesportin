import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../../../service/notificacion';;
import { UsuarioService } from '../../../../service/usuarioService';
import { UsuarioAdminForm } from '../../../../component/usuario/admin/form/form';
import { IUsuario } from '../../../../model/usuario';

@Component({
  selector: 'app-usuario-admin-edit-page',
  imports: [CommonModule, UsuarioAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class UsuarioAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private usuarioService = inject(UsuarioService);

  usuario = signal<IUsuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUsuario(Number(id));
    } else {
      this.error.set('ID no válido');
      this.loading.set(false);
    }
  }

  private loadUsuario(id: number): void {
    this.usuarioService.get(id).subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.notificacion.info('Usuario actualizado exitosamente');
    this.router.navigate(['/usuario']);
  }

  onFormCancel(): void {
    this.router.navigate(['/usuario']);
  }
}
