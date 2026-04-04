import { Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { SessionService } from '../../../../service/session';
import { IPartido } from '../../../../model/partido';
import { IPage } from '../../../../model/plist';
import { PartidoService } from '../../../../service/partido';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-partido-teamadmin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_liga?: number;

  oPage = signal<IPage<IPartido> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  rival = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  private partidoService = inject(PartidoService);
  private route = inject(ActivatedRoute);
  private modalRef = inject(MODAL_REF, { optional: true });
  session = inject(SessionService);

  ngOnInit(): void {
    if (this.id_liga == null) {
      const idLiga = this.route.snapshot.paramMap.get('id_liga');
      if (idLiga) {
        this.id_liga = Number(idLiga);
      }
    }
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term: string) => {
        this.rival.set(term);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.partidoService
      .getPage(this.numPage(), this.numRpp(), 'id', 'asc', this.rival(), this.id_liga ?? null)
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando partidos:', err);
        },
      });
  }

  onRppChange(n: number): void {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number): void {
    this.numPage.set(numPage);
    this.getPage();
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  isDialogMode(): boolean {
    return !!this.modalRef;
  }

  onSelect(partido: IPartido): void {
    this.modalRef?.close(partido);
  }
}
