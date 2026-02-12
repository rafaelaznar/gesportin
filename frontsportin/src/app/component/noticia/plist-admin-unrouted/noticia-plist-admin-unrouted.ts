import { Component, signal, computed, inject, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { INoticia } from '../../../model/noticia';
import { IPage } from '../../../model/plist';
import { NoticiaService } from '../../../service/noticia';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch } from '../../../environment/environment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-noticia-plist-admin-unrouted',
  standalone: true,
  imports: [Paginacion, BotoneraRpp, DatetimePipe, TrimPipe, RouterLink],
  templateUrl: './noticia-plist-admin-unrouted.html',
  styleUrl: './noticia-plist-admin-unrouted.css',
})
export class NoticiaPlistAdminUnrouted {
  @Input() id_club?: number;

  oPage = signal<IPage<INoticia> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  club = signal<number>(0);

  // Variables de búsqueda
  titulo = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private oNoticiaService = inject(NoticiaService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef<NoticiaPlistAdminUnrouted>, { optional: true });

  ngOnInit() {
    // Si se proporciona id_club desde @Input, usarlo
    if (this.id_club) {
      this.club.set(this.id_club);
    }

    const msg = this.route.snapshot.queryParamMap.get('msg');
    if (msg) {
      this.showMessage(msg);
    }

    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.titulo.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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
        this.titulo(),
        this.club()
      )
      .subscribe({
        next: (data: IPage<INoticia>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
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
    this.cdr.detectChanges();
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
    this.cdr.detectChanges();
  }

  onSearchTitulo(value: string) {
    this.searchSubject.next(value);
  }

  isDialogMode(): boolean {
    return !!this.dialogRef;
  }

  onSelect(noticia: INoticia): void {
    this.dialogRef?.close(noticia);
  }
}