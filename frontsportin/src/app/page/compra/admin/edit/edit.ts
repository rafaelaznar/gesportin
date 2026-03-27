import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompraService } from '../../../../service/compra';
import { ICompra } from '../../../../model/compra';
import { CompraAdminForm } from '../../../../component/compra/admin/form/form';

@Component({
  selector: 'app-compra-admin-edit-page',
  imports: [CommonModule, CompraAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CompraAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private compraService = inject(CompraService);
  private snackBar = inject(MatSnackBar);

  id_compra = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  compra = signal<ICompra | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de compra no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de compra no válido');
      this.loading.set(false);
      return;
    }
    this.id_compra.set(id);
    this.loadCompra();
  }

  private loadCompra(): void {
    this.compraService.get(this.id_compra()).subscribe({
      next: (data) => {
        this.compra.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando la compra');
        this.snackBar.open('Error cargando la compra', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/compra']);
  }

  onFormCancel(): void {
    this.router.navigate(['/compra']);
  }
}
