import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { IPage } from '../../../../model/plist';
import { IClub } from '../../../../model/club';
import { ClubService } from '../../../../service/club';
import { SessionService } from '../../../../service/session';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-club-teamadmin-plist',
  imports: [Paginacion, RouterLink, DatePipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ClubTeamadminPlist {
  oPage = signal<IPage<IClub> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private oClubService = inject(ClubService);
  private route = inject(ActivatedRoute);
  session: SessionService = inject(SessionService);

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
