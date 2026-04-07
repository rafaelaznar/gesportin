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
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { LigaService } from '../../../../service/liga';
import { ILiga } from '../../../../model/liga';

@Component({
  standalone: true,
  selector: 'app-partido-teamadmin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist, DatetimePipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PartidoTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_liga?: number;

// inyectar el servicio de liga para obtener el nombre de la liga y mostrarlo en el título de la página
  private ligaService = inject(LigaService);

  oPage = signal<IPage<IPartido> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  rival = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  totalPages = computed(() => this.oPage()?.totalPages ?? 1);
  // objeto de clase Liga para mostrar su nombre en el título de la página
  oLiga = signal<ILiga | null>(null);

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
    // obtener los datos de la liga this.id_liga para mostrar su nombre en el título
    if (this.id_liga) {
      this.ligaService.get(this.id_liga).subscribe({
        next: (liga) => {
          this.oLiga.set(liga);
        }
      });
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
