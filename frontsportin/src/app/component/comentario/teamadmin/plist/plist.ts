import { Component, signal, computed, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IComentario } from '../../../../model/comentario';
import { IPage } from '../../../../model/plist';
import { ComentarioService } from '../../../../service/comentario';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { NoticiaTeamadminEmbedded } from '../../../noticia/teamadmin/embedded/embedded';
@Component({
  standalone: true,
  selector: 'app-comentario-teamadmin-plist',
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  imports: [Paginacion, RouterLink, BotoneraActionsPlist, NoticiaTeamadminEmbedded],
})
export class ComentarioTeamadminPlist implements OnInit, OnDestroy {
  readonly strRole = 'teamadmin';

  @Input() id_usuario?: number;
  @Input() id_noticia?: number;
  @Input() showFilterInfo = true;

  oPage = signal<IPage<IComentario> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10); // RPP fijo a 10

  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('desc'); // Siempre descendente por id

  idUsuario = signal<number>(0);
  idNoticia = signal<number>(0);

  private route = inject(ActivatedRoute);
  private oComentarioService = inject(ComentarioService);

  ngOnInit() {
    if (this.id_usuario) this.idUsuario.set(this.id_usuario);
    if (this.id_noticia) this.idNoticia.set(this.id_noticia);

    const msg = this.route.snapshot.queryParamMap.get('msg');
    if (msg) this.showMessage(msg);

    this.getPage();
  }

  ngOnDestroy() {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  private showMessage(msg: string, duration: number = 4000) {
    this.message.set(msg);
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
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
      '',
      this.idUsuario(),
      this.idNoticia(),
    ).subscribe({
      next: (data: IPage<IComentario>) => {
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => console.error('Error al cargar comentarios:', error),
    });
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }
}
