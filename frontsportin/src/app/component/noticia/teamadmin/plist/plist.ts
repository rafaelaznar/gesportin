import { Component, signal, computed, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { IPage } from '../../../../model/plist';
import { INoticia } from '../../../../model/noticia';
import { NoticiaService } from '../../../../service/noticia';
import { SessionService } from '../../../../service/session';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { TrimPipe } from '../../../../pipe/trim-pipe';

@Component({
  selector: 'app-noticia-teamadmin-plist',
  imports: [Paginacion, RouterLink, DatetimePipe, TrimPipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class NoticiaTeamadminPlist {
  @Input() id_club?: number;

  oPage = signal<IPage<INoticia> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private oNoticiaService = inject(NoticiaService);
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
    this.oNoticiaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        '',
        this.id_club ?? 0,
      )
      .subscribe({
        next: (data: IPage<INoticia>) => {
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
