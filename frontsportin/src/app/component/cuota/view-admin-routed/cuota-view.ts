import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { CuotaService } from '../../../service/cuota';
import { ICuota } from '../../../model/cuota';
import { CuotaDetailAdminUnrouted } from "../../cuota/detail-admin-unrouted/cuota-detail";


@Component({
  selector: 'app-usuario-view',
  imports: [CommonModule, CuotaDetailAdminUnrouted],
  templateUrl: './cuota-view.html',
  styleUrl: './cuota-view.css',
})
export class CuotaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oCuotaService = inject(CuotaService);
  //private snackBar = inject(MatSnackBar);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_cuota = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_cuota.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_cuota())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }    
  }
}