import { Component, signal, computed, inject } from '@angular/core';
import { IPage } from '../../../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { ClubService } from '../../../../service/club';
import { IClub } from '../../../../model/club';
import { SessionService } from '../../../../service/session';
import { ImageUploadService } from '../../../../service/image-upload';

@Component({
  selector: 'app-club-admin-plist',
  imports: [Paginacion, BotoneraRpp, RouterLink, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ClubAdminPlist {
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
  session: SessionService = inject(SessionService);
  imageUpload = inject(ImageUploadService);

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
}
