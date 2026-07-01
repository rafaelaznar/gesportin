import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AdminDataToolsService,
  COUNT_ORDER,
  DataEntityKey,
  EMPTY_ORDER,
  ENTITY_META,
  IEntityMeta,
  IGenerateResult,
} from '../../../service/admin-data-tools';
import { ModalService } from '../../../component/shared/modal/modal.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../component/shared/confirm-dialog/confirm-dialog.component';
import { ResultDialogComponent, ResultDialogData } from '../../../component/shared/result-dialog/result-dialog.component';

interface IEntityRow extends IEntityMeta {
  count: number | null;
  loading: boolean;
}

@Component({
  selector: 'app-admin-data-tools-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './data-tools.html',
  styleUrl: './data-tools.css',
})
export class AdminDataToolsPage implements OnInit {
  private svc = inject(AdminDataToolsService);
  private modal = inject(ModalService);

  rows = signal<IEntityRow[]>(
    COUNT_ORDER.map((key) => ({ ...ENTITY_META[key], count: null, loading: false })),
  );

  running = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCounts();
  }

  // ── Counts ──────────────────────────────────────────────────────────────────

  async loadCounts(): Promise<void> {
    const updates = this.rows().map((r) => ({ ...r, loading: true }));
    this.rows.set(updates);

    const settled = await Promise.allSettled(
      COUNT_ORDER.map((key) => firstValueFrom(this.svc.count(key))),
    );

    this.rows.set(
      COUNT_ORDER.map((key, i) => {
        const meta = ENTITY_META[key];
        const result = settled[i];
        return {
          ...meta,
          count: result.status === 'fulfilled' ? result.value : null,
          loading: false,
        };
      }),
    );
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  async confirmReset(): Promise<void> {
    const confirmed = await firstValueFrom(
      this.modal.open<ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar reseteo',
          message: '¿Estás seguro de que deseas resetear la base de datos?\n\n' +
            'Esta acción eliminará TODOS los datos de todas las tablas y restaurará ' +
            'únicamente los datos mínimos del sistema. Esta operación es IRREVERSIBLE.',
        },
      }).afterClosed$,
    );

    if (!confirmed) return;

    await this.runReset();
  }

  async runReset(): Promise<void> {
    this.running.set(true);

    try {
      const n = await firstValueFrom(this.svc.reset());
      await this.loadCounts();

      const details = [
        `Se han restaurado ${n} registros del sistema.`,
        '· Tipo Usuario: 1-Administrador, 2-Administrador de club, 3-Usuario',
        '· Estado Partido: 1-No jugado, 2-Ganado, 3-Perdido, 4-Empatado, 5-Aplazado',
        '· Rol Usuario: 1-Presidente',
        '· Club: 1-Gesportin',
        '· Usuarios: admin / clubadmin / usuario (contraseña: ausias)',
      ];

      this.modal.open<ResultDialogData, boolean>(ResultDialogComponent, {
        data: {
          title: '✅ Base de datos reseteada',
          message: 'La base de datos ha sido reseteada correctamente. ' +
            'Se han eliminado todos los datos y se han restaurado los datos mínimos del sistema.',
          details,
        },
      });
    } catch (err) {
      this.modal.open<ResultDialogData, boolean>(ResultDialogComponent, {
        data: {
          title: '❌ Error al resetear',
          message: `Ocurrió un error al resetear la base de datos:<br><code>${this.errMsg(err)}</code>`,
        },
      });
    } finally {
      this.running.set(false);
      await this.loadCounts();
    }
  }

  // ── Generate ────────────────────────────────────────────────────────────────

  async confirmGenerate(): Promise<void> {
    const confirmed = await firstValueFrom(
      this.modal.open<ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar generación de datos',
          message: '¿Estás seguro de que deseas generar datos de prueba?\n\n' +
            'Esta operación añadirá datos a los ya existentes. ' +
            'Se asegurará de que haya 10 clubes (usando los existentes, incluido Gesportin) ' +
            'y generará registros anidados congruentes en todas las tablas.\n\n' +
            'La operación puede tardar varios segundos.',
        },
      }).afterClosed$,
    );

    if (!confirmed) return;

    await this.runGenerate();
  }

  async runGenerate(): Promise<void> {
    this.running.set(true);

    try {
      const result = await firstValueFrom(this.svc.generate());
      await this.loadCounts();

      const totalRecords = this.calcTotal(result);
      const details = this.formatGenerateResult(result);

      this.modal.open<ResultDialogData, boolean>(ResultDialogComponent, {
        data: {
          title: '✅ Datos generados correctamente',
          message: `Se han generado <strong>${totalRecords.toLocaleString()} registros</strong> ` +
            `en total, repartidos en <strong>10 clubes</strong>. ` +
            `Cada club tiene al menos 10 registros en cada tabla, ` +
            `respetando todas las restricciones de integridad referencial.`,
          details,
        },
      });
    } catch (err) {
      this.modal.open<ResultDialogData, boolean>(ResultDialogComponent, {
        data: {
          title: '❌ Error al generar datos',
          message: `Ocurrió un error al generar los datos:<br><code>${this.errMsg(err)}</code>`,
        },
      });
    } finally {
      this.running.set(false);
      await this.loadCounts();
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private calcTotal(r: IGenerateResult): number {
    return (
      r.clubs + r.usuarios + r.temporadas + r.categorias + r.noticias +
      r.tipoarticulos + r.articulos + r.equipos + r.ligas + r.jugadores +
      r.cuotas + r.partidos + r.pagos + r.comentarios + r.puntuaciones +
      r.comentarioarts + r.puntuacionarts + r.carritos + r.facturas + r.compras
    );
  }

  private formatGenerateResult(r: IGenerateResult): string[] {
    return [
      `🏢 Clubs: ${r.clubs}`,
      `👤 Usuarios: ${r.usuarios}`,
      `📅 Temporadas: ${r.temporadas}`,
      `📂 Categorías: ${r.categorias}`,
      `📰 Noticias: ${r.noticias}`,
      `🏷️ Tipos de artículo: ${r.tipoarticulos}`,
      `🛒 Artículos: ${r.articulos}`,
      `⚽ Equipos: ${r.equipos}`,
      `🏆 Ligas: ${r.ligas}`,
      `🎽 Jugadores: ${r.jugadores}`,
      `💰 Cuotas: ${r.cuotas}`,
      `📋 Partidos: ${r.partidos}`,
      `💳 Pagos: ${r.pagos}`,
      `💬 Comentarios: ${r.comentarios}`,
      `⭐ Puntuaciones: ${r.puntuaciones}`,
      `💬 Comentarios art.: ${r.comentarioarts}`,
      `⭐ Puntuaciones art.: ${r.puntuacionarts}`,
      `🛍️ Carritos: ${r.carritos}`,
      `🧾 Facturas: ${r.facturas}`,
      `📦 Compras: ${r.compras}`,
    ];
  }

  private errMsg(err: unknown): string {
    if (!err || typeof err !== 'object') return String(err ?? 'Error desconocido');
    const e = err as Record<string, unknown>;
    const nested = e['error'];
    if (nested && typeof nested === 'object') {
      const ne = nested as Record<string, unknown>;
      if (typeof ne['message'] === 'string') return ne['message'];
    }
    if (typeof nested === 'string') return nested;
    if (typeof e['message'] === 'string') return e['message'];
    if (typeof e['status'] === 'number') return `HTTP ${e['status']}`;
    return JSON.stringify(err);
  }
}
