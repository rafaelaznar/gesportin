import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IFactura } from '../../../../model/factura';
import { ICompra } from '../../../../model/compra';
import { FacturaService } from '../../../../service/factura-service';
import { CompraService } from '../../../../service/compra';
import { SessionService } from '../../../../service/session';

interface FacturaRow {
  factura: IFactura;
  compras: ICompra[];
  total: number;
  expanded: boolean;
}

@Component({
  selector: 'app-factura-usuario-plist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaUsuarioPlist implements OnInit {
  private facturaService = inject(FacturaService);
  private compraService = inject(CompraService);
  private session = inject(SessionService);

  rows = signal<FacturaRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const uid = this.session.getUserId();
    if (!uid) {
      this.loading.set(false);
      return;
    }
    this.facturaService
      .getPage(0, 1000, 'id', 'desc', uid)
      .pipe(
        switchMap((page) => {
          const facturas = page.content;
          if (facturas.length === 0) return of([] as FacturaRow[]);
          return forkJoin(
            facturas.map((f) =>
              this.compraService.getPage(0, 1000, 'id', 'asc', 0, f.id).pipe(
                switchMap((cp) => {
                  const total = cp.content.reduce((acc, c) => acc + c.precio * c.cantidad, 0);
                  return of({ factura: f, compras: cp.content, total, expanded: false } as FacturaRow);
                }),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (rows) => {
          this.rows.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar las facturas');
          this.loading.set(false);
        },
      });
  }

  toggleExpand(row: FacturaRow): void {
    row.expanded = !row.expanded;
    this.rows.set([...this.rows()]);
  }

  async exportarPDFFactura(row: FacturaRow, event: Event): Promise<void> {
    event.stopPropagation();
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    const mL = 20, mR = 190;
    const gold: [number, number, number] = [180, 155, 100];
    const dark: [number, number, number] = [40, 40, 40];

    // --- CABECERA ---
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
    doc.text(`Factura  #  ${row.factura.id}`, mR, 25, { align: 'right' });

    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(mL, 36, mR, 36);

    // Fecha (izquierda)
    const fechaFactura = row.factura.fecha
      ? new Date(row.factura.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : '';
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(`Fecha de la factura: ${fechaFactura}`, mL, 46);

    // "FACTURAR A" (derecha)
    const user = row.factura.usuario;
    const userName = user ? `${user.nombre ?? ''} ${user.apellido1 ?? ''} ${user.apellido2 ?? ''}`.trim() : '';
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text('FACTURAR A', 115, 44);
    doc.setFont('Helvetica', 'normal');
    doc.text(userName, 115, 49);
    if (user?.username) doc.text(user.username, 115, 54);

    // --- TABLA ---
    let y = 70;
    const cDesc = mL, cCant = 118, cPrecio = 148, cSuma = mR;

    // Cabecera de tabla
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
    let sumTotal = 0;
    for (let i = 0; i < row.compras.length; i++) {
      const c = row.compras[i];
      const sub = c.precio * c.cantidad;
      sumTotal += sub;
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

    // Borde inferior tabla
    doc.setDrawColor(...gold);
    doc.line(mL, y, mR, y);
    y += 6;

    // --- TOTAL ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text('Total', cSuma - 30, y + 2, { align: 'right' });
    doc.text(row.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), cSuma, y + 2, { align: 'right' });

    // --- PIE ---
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

    doc.save(`factura-${row.factura.id}.pdf`);
  }

  exportarExcelFactura(row: FacturaRow, event: Event): void {
    event.stopPropagation();
    const esc = (v: unknown): string => {
      if (v == null) return '';
      return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    const fechaStr = row.factura.fecha
      ? new Date(row.factura.fecha).toLocaleDateString('es-ES')
      : '';
    const rowsXml = row.compras.map((c) => `<Row>
      <Cell><Data ss:Type="Number">${esc(row.factura.id)}</Data></Cell>
      <Cell><Data ss:Type="String">${esc(fechaStr)}</Data></Cell>
      <Cell><Data ss:Type="String">${esc(c.articulo?.descripcion)}</Data></Cell>
      <Cell><Data ss:Type="Number">${esc(c.cantidad)}</Data></Cell>
      <Cell><Data ss:Type="Number">${esc(c.precio)}</Data></Cell>
      <Cell><Data ss:Type="Number">${esc(c.precio * c.cantidad)}</Data></Cell>
      <Cell><Data ss:Type="Number">${esc(row.total)}</Data></Cell>
    </Row>`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#B49B64" ss:Pattern="Solid"/></Style></Styles>
  <Worksheet ss:Name="Factura ${row.factura.id}">
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
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    this._download(blob, `factura-${row.factura.id}.xls`);
  }

  exportarCSVFactura(row: FacturaRow, event: Event): void {
    event.stopPropagation();
    const esc = (v: unknown): string => '"' + (v == null ? '' : String(v).replace(/"/g, '""')) + '"';
    const fechaStr = row.factura.fecha
      ? new Date(row.factura.fecha).toLocaleDateString('es-ES')
      : '';
    const lines = ['ID Factura,Fecha,Artículo,Cantidad,P. Unidad,Subtotal,Total Factura'];
    for (const c of row.compras) {
      lines.push([
        esc(row.factura.id), esc(fechaStr), esc(c.articulo?.descripcion),
        esc(c.cantidad), esc(c.precio), esc(c.precio * c.cantidad), esc(row.total),
      ].join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    this._download(blob, `factura-${row.factura.id}.csv`);
  }

  async exportarPDF(): Promise<void> {
    const data = this.rows();
    if (data.length === 0) { alert('No hay facturas para exportar.'); return; }

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    // Cabecera del documento
    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('GESPORTÍN — MIS FACTURAS', 14, 20);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Fecha de exportación: ${fecha}  ·  Total facturas: ${data.length}`, 14, 38);

    let y = 46;

    for (const row of data) {
      if (y > 250) { doc.addPage(); y = 20; }

      // Cabecera de factura
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setFillColor(230, 230, 230);
      doc.rect(14, y, 182, 7, 'F');
      const fechaFactura = row.factura.fecha
        ? new Date(row.factura.fecha).toLocaleDateString('es-ES')
        : '';
      doc.text(`Factura #${row.factura.id}  ·  ${fechaFactura}`, 17, y + 5);
      const totalStr = row.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
      doc.text(totalStr, 196, y + 5, { align: 'right' });
      y += 10;

      // Cabecera de tabla
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Artículo', 17, y);
      doc.text('Cant.', 130, y);
      doc.text('P. unit.', 155, y);
      doc.text('Subtotal', 196, y, { align: 'right' });
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y + 1, 196, y + 1);
      y += 5;

      // Líneas de compra
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      for (const c of row.compras) {
        if (y > 275) { doc.addPage(); y = 20; }
        const desc = c.articulo?.descripcion ?? '';
        doc.text(doc.splitTextToSize(desc, 110)[0], 17, y);
        doc.text(String(c.cantidad), 130, y);
        doc.text(c.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 155, y);
        doc.text((c.precio * c.cantidad).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), 196, y, { align: 'right' });
        y += 5;
      }
      y += 4;
    }

    doc.save(`mis-facturas-${new Date().getTime()}.pdf`);
  }

  exportarExcel(): void {
    const data = this.rows();
    if (data.length === 0) { alert('No hay facturas para exportar.'); return; }

    const esc = (v: unknown): string => {
      if (v == null) return '';
      return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    const rowsXml: string[] = [];
    for (const row of data) {
      const fechaStr = row.factura.fecha
        ? new Date(row.factura.fecha).toLocaleDateString('es-ES')
        : '';
      for (const c of row.compras) {
        rowsXml.push(`<Row>
          <Cell><Data ss:Type="Number">${esc(row.factura.id)}</Data></Cell>
          <Cell><Data ss:Type="String">${esc(fechaStr)}</Data></Cell>
          <Cell><Data ss:Type="String">${esc(c.articulo?.descripcion)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.cantidad)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.precio)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(c.precio * c.cantidad)}</Data></Cell>
          <Cell><Data ss:Type="Number">${esc(row.total)}</Data></Cell>
        </Row>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/></Style>
  </Styles>
  <Worksheet ss:Name="Mis Facturas">
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

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    this._download(blob, `mis-facturas-${new Date().getTime()}.xls`);
  }

  exportarCSV(): void {
    const data = this.rows();
    if (data.length === 0) { alert('No hay facturas para exportar.'); return; }

    const esc = (v: unknown): string => {
      const s = v == null ? '' : String(v);
      return '"' + s.replace(/"/g, '""') + '"';
    };

    const lines = ['ID Factura,Fecha,Artículo,Cantidad,P. Unidad,Subtotal,Total Factura'];
    for (const row of data) {
      const fechaStr = row.factura.fecha
        ? new Date(row.factura.fecha).toLocaleDateString('es-ES')
        : '';
      for (const c of row.compras) {
        lines.push([
          esc(row.factura.id),
          esc(fechaStr),
          esc(c.articulo?.descripcion),
          esc(c.cantidad),
          esc(c.precio),
          esc(c.precio * c.cantidad),
          esc(row.total),
        ].join(','));
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    this._download(blob, `mis-facturas-${new Date().getTime()}.csv`);
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
}
