import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { CuotaService } from '../../../service/cuota';
import { ICuota } from '../../../model/cuota';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cuota-detail-unrouted',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './cuota-detail.html',
  styleUrl: './cuota-detail.css',
})

export class CuotaDetailAdminUnrouted implements OnInit {

  @Input() id: Signal<number> = signal(0);
  
  private oCuotaService = inject(CuotaService);
  private snackBar = inject(MatSnackBar);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);


  ngOnInit(): void {  
    this.load(this.id());
  }

  load(id: number) {
    this.oCuotaService.get(id).subscribe({
      next: (data: ICuota) => {
        this.oCuota.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        this.loading.set(false);
        this.snackBar.open('Error cargando el usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
