import { Component, computed, inject, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { IFactura } from '../../../../model/factura';
import { ICompra } from '../../../../model/compra';
import { IPage } from '../../../../model/plist';
import { FacturaService } from '../../../../service/factura-service';
import { CompraService } from '../../../../service/compra';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-factura-teamadmin-plist',
  imports: [RouterLink, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_usuario?: number;

  readonly strRole = 'teamadmin';
  oPage = signal<IPage<IFactura> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  fecha = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private facturaService = inject(FacturaService);
  private compraService = inject(CompraService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (!this.id_usuario) {
      const idParam = this.route.snapshot.paramMap.get('id_usuario');
      if (idParam) {
        this.id_usuario = Number(idParam);
      }
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term) => {
        this.fecha.set(term);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.facturaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.id_usuario ?? 0
      )
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err) => console.error(err),
      });
  }

  onOrder(field: string): void {
    if (this.orderField() === field) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(field);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(n: number): void {
    this.numPage.set(n);
    this.getPage();
  }

  onSearch(v: string): void {
    this.searchSubject.next(v);
  }

  private _download(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async exportarPDFFactura(factura: IFactura): Promise<void> {
    const { jsPDF } = await import('jspdf');
    this.compraService.getPage(0, 1000, 'id', 'asc', 0, factura.id).subscribe({
      next: (data) => {
        const compras = data.content;
        const total = compras.reduce((s, c) => s + c.precio * c.cantidad, 0);
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const mL = 20, mR = 190;
        const gold: [number, number, number] = [180, 155, 100];
        const dark: [number, number, number] = [40, 40, 40];

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...gold);
        doc.text('GESPORTÍN', mL, 25);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Plataforma de gestión deportiva', mL, 31);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...gold);
        doc.text(`Factura  #  ${factura.id}`, mR, 25, { align: 'right' });

        doc.setDrawColor(...gold);
        doc.setLineWidth(0.5);
        doc.line(mL, 36, mR, 36);

        const fechaStr = factura.fecha
          ? new Date(factura.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
          : '';
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.text(`Fecha de la factura: ${fechaStr}`, mL, 46);

        const user = factura.usuario;
        const userName = user ? `${user.nombre ?? ''} ${user.apellido1 ?? ''} ${user.apellido2 ?? ''}`.trim() : '';
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.text('FACTURAR A', 115, 44);
        doc.setFont('Helvetica', 'normal');
        doc.text(userName, 115, 49);
        if (user?.username) doc.text(user.username, 115, 54);

        let y = 70;
        const cDesc = mL, cCant = 118, cPrecio = 148, cSuma = mR;

        doc.setFillColor(...gold);
        doc.rect(mL, y - 5, mR - mL, 9, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('DESCRIPCIÓN', cDesc + 2, y);
        doc.text('CANTIDAD', cCant, y);
        doc.text('PRECIO', cPrecio, y);
        doc.text('SUMA', cSuma, y, { align: 'right' });
        y += 7;

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(...dark);
        for (let i = 0; i < compras.length; i++) {
          const c = compras[i];
          const sub = c.precio * c.cantidad;
          if (i % 2 === 0) {
            doc.setFillColor(248, 246, 240);
            doc.rect(mL, y - 4, mR - mL, 7, 'F');
          }
          doc.setTextColor(...dark);
          doc.text(doc.splitTextToSize(c.articulo?.descripcion ?? '', 90)[0], cDesc + 2, y);
          doc.text(String(c.cantidad), cCant + 6, y);
          doc.text(c.precio.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €', cPrecio, y);
          doc.text(sub.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €', cSuma, y, { align: 'right' });
          y += 7;
        }

        doc.setDrawColor(...gold);
        doc.line(mL, y, mR, y);
        y += 6;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...gold);
        doc.text('Total', cSuma - 30, y + 2, { align: 'right' });
        doc.text(total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), cSuma, y + 2, { align: 'right' });

        doc.setDrawColor(...gold);
        doc.line(mL, 260, mR, 260);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.text('GESPORTÍN', mL, 268);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Plataforma de gestión deportiva', mL, 273);

        doc.save(`factura-${factura.id}.pdf`);
      },
      error: (err) => console.error('Error cargando compras para PDF:', err),
    });
  }

  exportarExcelFactura(factura: IFactura): void {
    this.compraService.getPage(0, 1000, 'id', 'asc', 0, factura.id).subscribe({
      next: (data) => {
        const compras = data.content;
        const total = compras.reduce((s, c) => s + c.precio * c.cantidad, 0);
        const esc = (v: unknown): string => {
          if (v == null) return '';
          return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        const fechaStr = factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-ES') : '';
        const rowsXml = compras.map((c) => `<Row>
          <Cell><Data ss:Type="Number">${esc(factura.id)}</Data></Cell>
          <Cell><Data ss:Type="String">${esc(fechaStr)}</Data></Cell>
          <Cell><Data ss:Type="String">${esc(c.articulo?.descripcion)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.cantidad)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.precio)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.precio * c.cantidad)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(total)}</Data></Cell>
        </Row>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#B49B64" ss:Pattern="Solid"/></Style></Styles>
  <Worksheet ss:Name="Factura ${factura.id}">
    <Table>
      <Row ss:StyleID="h">
        <Cell><Data ss:Type="String">ID Factura</Data></Cell>
        <Cell><Data ss:Type="String">Fecha</Data></Cell>
        <Cell><Data ss:Type="String">Artículo</Data></Cell>
        <Cell><Data ss:Type="String">Cantidad</Data></Cell>
        <Cell><Data ss:Type="String">P. Unidad (€)</Data></Cell>
        <Cell><Data ss:Type="String">Subtotal (€)</Data></Cell>
        <Cell><Data ss:Type="String">Total Factura (€)</Data></Cell>
      </Row>
      ${rowsXml.join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`;
        this._download(new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' }), `factura-${factura.id}.xls`);
      },
      error: (err) => console.error('Error cargando compras para Excel:', err),
    });
  }

  exportarCSVFactura(factura: IFactura): void {
    this.compraService.getPage(0, 1000, 'id', 'asc', 0, factura.id).subscribe({
      next: (data) => {
        const compras = data.content;
        const total = compras.reduce((s, c) => s + c.precio * c.cantidad, 0);
        const esc = (v: unknown): string => '"' + (v == null ? '' : String(v).replace(/"/g, '""')) + '"';
        const fechaStr = factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-ES') : '';
        const lines = ['ID Factura,Fecha,Artículo,Cantidad,P. Unidad,Subtotal,Total Factura'];
        for (const c of compras) {
          lines.push([
            esc(factura.id), esc(fechaStr), esc(c.articulo?.descripcion),
            esc(c.cantidad), esc(c.precio), esc(c.precio * c.cantidad), esc(total),
          ].join(','));
        }
        this._download(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }), `factura-${factura.id}.csv`);
      },
      error: (err) => console.error('Error cargando compras para CSV:', err),
    });
  }
}
