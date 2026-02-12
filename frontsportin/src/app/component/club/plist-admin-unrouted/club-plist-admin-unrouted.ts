import { Component, signal, computed, inject } from '@angular/core';
import { IClub } from '../../../model/club';
import { IPage } from '../../../model/plist';
import { ClubService } from '../../../service/club';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-club-plist-admin-unrouted',
  imports: [Paginacion, BotoneraRpp, DatetimePipe, RouterLink],
  templateUrl: './club-plist-admin-unrouted.html',
  styleUrl: './club-plist-admin-unrouted.css',
})
export class ClubPlistAdminUnrouted {
  oPage = signal<IPage<IClub> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private oClubService = inject(ClubService);
  private route = inject(ActivatedRoute);
  private dialogRef = inject(MatDialogRef<ClubPlistAdminUnrouted>, { optional: true });

  ngOnInit() {
    const msg = this.route.snapshot.queryParamMap.get('msg');
    if (msg) {
      this.showMessage(msg);
    }
    this.getPage();
  }

  private showMessage(msg: string, duration: number = 4000) {
    this.message.set(msg);
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.message.set(null);
      this.messageTimeout = null;
    }, duration);
  }

  getPage() {
    this.oClubService
      .getPage(this.numPage(), this.numRpp(), this.orderField(), this.orderDirection())
      .subscribe({
        next: (data: IPage<IClub>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  onOrder(order: string) {
    if (this.orderField() === order) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(order);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  isDialogMode(): boolean {
    return !!this.dialogRef;
  }

  onSelect(club: IClub): void {
    this.dialogRef?.close(club);
  }
}
