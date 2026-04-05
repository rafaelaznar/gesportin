import { Component, Input, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../../model/plist';
import { IPuntuacion } from '../../../../model/puntuacion';
import { PuntuacionService } from '../../../../service/puntuacion';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';

@Component({
  standalone: true,
  selector: 'app-puntuacion-teamadmin-plist',
  imports: [Paginacion, RouterLink, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PuntuacionTeamadminPlist implements OnInit {
  readonly strRole = 'teamadmin';

  @Input() id_noticia?: number;
  @Input() id_usuario?: number;

  oPage = signal<IPage<IPuntuacion> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);

  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  noticia = signal<number>(0);
  usuario = signal<number>(0);

  private modalRef = inject(MODAL_REF, { optional: true });

  constructor(
    private oPuntuacionService: PuntuacionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    if (this.id_usuario) {
      this.usuario.set(this.id_usuario);
    } else {
      const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
      if (idUsuario) this.usuario.set(+idUsuario);
    }

    if (this.id_noticia) {
      this.noticia.set(this.id_noticia);
    } else {
      const idNoticia = this.route.snapshot.paramMap.get('id_noticia');
      if (idNoticia) this.noticia.set(+idNoticia);
    }

    this.getPage();
  }

  getPage() {
    this.oPuntuacionService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.noticia(),
        this.usuario(),
      )
      .subscribe({
        next: (data: IPage<IPuntuacion>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => console.error(error),
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

  isDialogMode(): boolean {
    return !!this.modalRef;
  }

  onSelect(p: IPuntuacion): void {
    this.modalRef?.close(p);
  }
}
