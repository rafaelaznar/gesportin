import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IJugador } from '../../../../model/jugador';
import { ICuota } from '../../../../model/cuota';
import { IPago } from '../../../../model/pago';
import { JugadorService } from '../../../../service/jugador-service';
import { CuotaService } from '../../../../service/cuota';
import { PagoService } from '../../../../service/pago';
import { SessionService } from '../../../../service/session';
import { NotificacionService } from '../../../../service/notificacion';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';

interface CuotaRow {
  cuota: ICuota;
  pagos: IPago[];
}

interface EquipoGroup {
  id: number;
  nombre: string;
  categoria: string;
  temporada: string;
  jugadorId: number;
  cuotas: CuotaRow[];
}

@Component({
  selector: 'app-cuota-usuario-plist',
  standalone: true,
  imports: [CommonModule, DatetimePipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CuotaUsuarioPlist implements OnInit {
  private jugadorService = inject(JugadorService);
  private cuotaService = inject(CuotaService);
  private pagoService = inject(PagoService);
  private session = inject(SessionService);
  private notificacion = inject(NotificacionService);

  equipos = signal<EquipoGroup[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  pagando = signal<Set<number>>(new Set());

  ngOnInit(): void {
    const uid = this.session.getUserId();
    if (!uid) {
      this.error.set('No se puede determinar tu usuario');
      this.loading.set(false);
      return;
    }

    this.jugadorService
      .getPage(0, 1000, 'id', 'asc', '', uid, 0)
      .pipe(
        switchMap((page) => {
          const jugadores = page.content;
          if (jugadores.length === 0) return of([] as EquipoGroup[]);
          return forkJoin(
            jugadores.map((j) =>
              this.cuotaService.getPage(0, 1000, 'id', 'asc', '', j.equipo?.id ?? 0).pipe(
                switchMap((cuotaPage) => {
                  const cuotas = cuotaPage.content;
                  if (cuotas.length === 0) {
                    return of({
                      id: j.equipo?.id ?? 0,
                      nombre: j.equipo?.nombre ?? '',
                      categoria: j.equipo?.categoria?.nombre ?? '',
                      temporada: j.equipo?.categoria?.temporada?.descripcion ?? '',
                      jugadorId: j.id,
                      cuotas: [] as CuotaRow[],
                    } as EquipoGroup);
                  }
                  return forkJoin(
                    cuotas.map((c) =>
                      this.pagoService.getPage(0, 1000, 'id', 'asc', c.id, j.id).pipe(
                        map((pagoPage) => ({ cuota: c, pagos: pagoPage.content } as CuotaRow)),
                      ),
                    ),
                  ).pipe(
                    map(
                      (cuotaRows) =>
                        ({
                          id: j.equipo?.id ?? 0,
                          nombre: j.equipo?.nombre ?? '',
                          categoria: j.equipo?.categoria?.nombre ?? '',
                          temporada: j.equipo?.categoria?.temporada?.descripcion ?? '',
                          jugadorId: j.id,
                          cuotas: cuotaRows,
                        }) as EquipoGroup,
                    ),
                  );
                }),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (groups) => {
          this.equipos.set(groups.sort((a, b) => b.id - a.id));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error al cargar cuotas');
          this.loading.set(false);
          console.error(err);
        },
      });
  }

  estaPagado(cuotaRow: CuotaRow): boolean {
    return cuotaRow.pagos.some((p) => p.abonado);
  }

  isPagando(cuotaId: number): boolean {
    return this.pagando().has(cuotaId);
  }

  pagar(equipoId: number, jugadorId: number, cuota: ICuota): void {
    const cuotaId = cuota.id;
    this.pagando.update((s) => { s.add(cuotaId); return new Set(s); });
    const today = new Date().toISOString().split('.')[0];
    this.pagoService
      .create({
        cuota: { id: cuotaId } as ICuota,
        jugador: { id: jugadorId } as IJugador,
        abonado: 1,
        fecha: today,
      })
      .subscribe({
        next: (newId) => {
          this.pagando.update((s) => { s.delete(cuotaId); return new Set(s); });
          this.equipos.update((eqs) =>
            eqs.map((eq) => {
              if (eq.id !== equipoId) return eq;
              return {
                ...eq,
                cuotas: eq.cuotas.map((cr) => {
                  if (cr.cuota.id !== cuotaId) return cr;
                  const nuevoPago: IPago = {
                    id: newId as number,
                    cuota: cr.cuota,
                    jugador: { id: jugadorId } as IJugador,
                    abonado: 1,
                    fecha: today,
                  };
                  return { ...cr, pagos: [...cr.pagos, nuevoPago] };
                }),
              };
            }),
          );
          this.notificacion.info('Pago registrado correctamente');
        },
        error: () => {
          this.pagando.update((s) => { s.delete(cuotaId); return new Set(s); });
          this.notificacion.error('Error al registrar el pago');
        },
      });
  }

  totalAdeudado(equipoGroup: EquipoGroup): number {
    return equipoGroup.cuotas
      .filter((cr) => !this.estaPagado(cr))
      .reduce((acc, cr) => acc + (cr.cuota.cantidad ?? 0), 0);
  }
}
