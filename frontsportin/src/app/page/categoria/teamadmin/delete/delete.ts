import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriaService } from '../../../../service/categoria';
import { NotificacionService } from '../../../../service/notificacion';;
import { CategoriaTeamadminDetail } from '../../../../component/categoria/teamadmin/detail/detail';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../component/shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categoria-teamadmin-delete-page',
  imports: [CategoriaTeamadminDetail, BreadcrumbComponent],
  templateUrl: './delete.html',
})
export class CategoriaTeamadminDeletePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private notificacion = inject(NotificacionService);
  error = signal<string | null>(null);
  breadcrumbItems = signal<BreadcrumbItem[]>([{ label: 'Categorías', route: '/categoria/teamadmin' }, { label: 'Eliminar Categoría' }]);
  id_categoria = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id_categoria.set(id ? Number(id) : NaN);
    if (isNaN(this.id_categoria())) this.error.set('ID no válido');
  }

  doDelete(): void {
    this.categoriaService.delete(this.id_categoria()).subscribe({
      next: () => {
        this.notificacion.info('Categoria eliminado/a');
        this.router.navigate(['/categoria/teamadmin']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el registro');
        this.notificacion.error('Error eliminando el registro');
        console.error(err);
      },
    });
  }

  doCancel(): void { window.history.back(); }
}
