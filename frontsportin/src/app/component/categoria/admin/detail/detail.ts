import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../../service/categoria';
import { ICategoria } from '../../../../model/categoria';

@Component({
  selector: 'app-categoria-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CategoriaAdminDetail implements OnInit {

  @Input() id: Signal<number> = signal(0);

  private oCategoriaService = inject(CategoriaService);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oCategoriaService.get(id).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la categoría');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
