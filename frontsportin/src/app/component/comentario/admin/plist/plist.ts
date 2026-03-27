import { Component, signal, computed, inject, Input, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IComentario } from '../../../../model/comentario';
import { IPage } from '../../../../model/plist';
import { ComentarioService } from '../../../../service/comentario';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch, serverURL } from '../../../../environment/environment';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { SessionService } from '../../../../service/session';

@Component({
  standalone: true,
  selector: 'app-comentario-admin-plist',
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  imports: [Paginacion, BotoneraRpp, RouterLink, TrimPipe, BotoneraActionsPlist]
})
export class ComentarioAdminPlist implements OnDestroy {
  session: SessionService = inject(SessionService);

  @Input() id_usuario?: number;
  @Input() id_noticia?: number;

  oPage = signal<IPage<IComentario> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);

  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  contenido = signal<string>('');
  idUsuario = signal<number>(0);
  idNoticia = signal<number>(0);

  private route = inject(ActivatedRoute);
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit() {
    if (this.id_usuario) {
      this.idUsuario.set(this.id_usuario);
    }
    if (this.id_noticia) {
      this.idNoticia.set(this.id_noticia);
    }

    const msg = this.route.snapshot.queryParamMap.get('msg');
    if (msg) {
      this.showMessage(msg);
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.contenido.set(searchTerm);
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
    this.oComentarioService.getPage(
      this.numPage(),
      this.numRpp(),
      this.orderField(),
      this.orderDirection(),
      this.contenido(),
      this.idUsuario(),
      this.idNoticia()
    ).subscribe({
      next: (data: IPage<IComentario>) => {
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar comentarios:', error);
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

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) {
      return '';
    }
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    return `${serverURL}/${imagen}`;
  }

  private oComentarioService = inject(ComentarioService);
}
