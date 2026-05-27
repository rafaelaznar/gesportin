import { Component, computed, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { SessionService } from '../../../../service/session';
import { IFactura } from '../../../../model/factura';
import { ICompra } from '../../../../model/compra';
import { IPage } from '../../../../model/plist';
import { FacturaService } from '../../../../service/factura-service';
import { CompraService } from '../../../../service/compra';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-factura-admin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class FacturaAdminPlist {
  @Input() id_usuario?: number;
  @Input() strRole: string = '';

  oPage = signal<IPage<IFactura> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private facturaService = inject(FacturaService);
  private compraService = inject(CompraService);
  private route = inject(ActivatedRoute);
  private modalRef = inject(MODAL_REF, { optional: true });
  session = inject(SessionService);

  ngOnInit() {
    if (this.id_usuario != null) {
      // ya se filtra por input
    } else {
      const idUsuario = this.route.snapshot.paramMap.get('id_usuario');
      if (idUsuario) {
        this.id_usuario = Number(idUsuario);
      }
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.descripcion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  getPage() {
    let orderField = this.orderField();
    if (orderField === 'id_usuario') {
      orderField = 'usuario.id';
    }

    this.facturaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.id_usuario ?? 0,
      )
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando facturas:', err);
        },
      });
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onSearchDescripcion(value: string) {
    this.searchSubject.next(value);
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

  isDialogMode(): boolean {
    return !!this.modalRef;
  }

  onSelect(factura: IFactura): void {
    this.modalRef?.close(factura);
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

        const cDesc = mL, cCant = 118, cPrecio = 148, cSuma = mR;
        const maxRowsFirstPage = 20;
        const maxRowsFollowingPages = 24;
        let y = 70;
        let rowsOnPage = 0;
        let maxRowsCurrentPage = maxRowsFirstPage;

        const pintarCabeceraTabla = (top: number) => {
          doc.setFillColor(...gold);
          doc.rect(mL, top - 5, mR - mL, 9, 'F');
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text('DESCRIPCIÓN', cDesc + 2, top);
          doc.text('CANTIDAD', cCant, top);
          doc.text('PRECIO', cPrecio, top);
          doc.text('SUMA', cSuma, top, { align: 'right' });
          return top + 7;
        };

        const pintarPie = () => {
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
        };

        y = pintarCabeceraTabla(y);

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(...dark);
        for (let i = 0; i < compras.length; i++) {
          if (rowsOnPage >= maxRowsCurrentPage) {
            doc.addPage();
            y = pintarCabeceraTabla(25);
            rowsOnPage = 0;
            maxRowsCurrentPage = maxRowsFollowingPages;
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(...dark);
          }

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
          rowsOnPage++;
        }

        if (y > 238) {
          doc.addPage();
          y = 30;
        }

        doc.setDrawColor(...gold);
        doc.line(mL, y, mR, y);
        y += 6;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...gold);
        doc.text('Total', cSuma - 30, y + 2, { align: 'right' });
        doc.text(total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), cSuma, y + 2, { align: 'right' });

        pintarPie();

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

  async exportarPDF() {
    const total = this.totalRecords(); // Cuenta el total de facturas que hay registradas
    
    if (total === 0) {
      alert("No hay facturas disponibles para exportar.");
      return;
    }

    // Import dinámico: jsPDF se carga en un chunk separado, no en el bundle inicial
    const { jsPDF } = await import('jspdf');

    this.facturaService
      .getPage(
        0,
        total,
        this.orderField(),
        this.orderDirection(),
        this.id_usuario ?? 0,
      )
      .subscribe({
        next: (data) => {
          const allFacturas = data.content; // Creamos un array con todas las facturas
          
          const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
          });

          // ESTILO
          doc.setFillColor(33, 37, 41);
          doc.rect(0, 0, 210, 30, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(18);
          doc.text("GESPORTÍN - CONTROL DE FACTURACIÓN", 14, 20);

          doc.setTextColor(40, 40, 40);
          doc.setFontSize(10);
          doc.setFont("Helvetica", "normal");
          const fechaActual = new Date().toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          doc.text(`Fecha: ${fechaActual}`, 14, 40);
          doc.text(`Total de registros exportados: ${total}`, 14, 45);

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(11);
          doc.setFillColor(230, 230, 230);
          doc.rect(14, 52, 182, 8, 'F');
          
          doc.text("ID", 18, 57);
          doc.text("Fecha", 35, 57);
          doc.text("Usuario", 95, 57);
          doc.text("Compra", 165, 57);

          doc.setDrawColor(150, 150, 150);
          doc.line(14, 60, 196, 60);

          doc.setFont("Helvetica", "normal");
          doc.setFontSize(10);
          let y = 67;

          allFacturas.forEach((factura, index) => {

            // Aquí controlamos el salto de página
            if (y > 275) {
              doc.addPage();
              y = 25;
              
              // Repetimos la cabecera en la nueva página
              doc.setFont("Helvetica", "bold");
              doc.setFillColor(230, 230, 230);
              doc.rect(14, 12, 182, 8, 'F');
              doc.text("ID", 18, 17);
              doc.text("Fecha", 35, 17);
              doc.text("Usuario", 95, 17);
              doc.text("Compra", 165, 17);
              doc.setDrawColor(150, 150, 150);
              doc.line(14, 20, 196, 20);
              doc.setFont("Helvetica", "normal");
              y = 27;
            }

            if (index % 2 === 0) {
              doc.setFillColor(248, 249, 250);
              doc.rect(14, y - 5, 182, 8, 'F');
            }

            doc.text(factura.id.toString(), 18, y);
            doc.text(factura.fecha || 'Sin fecha', 35, y);
            
            // Comprobamos si el objeto existe
            const nombreCompleto = factura.usuario 
              ? `${factura.usuario.nombre} ${factura.usuario.apellido1 || ''}` 
              : 'No asignado';
            doc.text(nombreCompleto, 80, y);

            const valorCompra = factura.compras ? factura.compras.toString() : '0';
            doc.text(valorCompra, 165, y);

            y += 8;
          });

          // Por último, hacemos que se descargue el documento
          doc.save(`gesportin-facturas-${new Date().getTime()}.pdf`);
        },
        error: (err) => {
          console.error("Error obteniendo datos para el PDF:", err);
        }
      });
  }

  exportarCSV() {
    this.facturaService.exportCsv().subscribe({
      next: (blob: Blob) => {

        // Creamos una URL temporal para el archivo binario
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Le asignamos un nombre dinámico al archivo con la fecha actual
        a.download = `gesportin-facturas-${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click(); // Forzamos el clic invisible para que se descargue
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Liberamos la memoria asignada
      },
      error: (err) => {
        console.error('Error al descargar el archivo CSV:', err);
      }
    });
  }

  exportarExcel() {
    const total = this.totalRecords();

    if (total === 0) {
      alert('No hay facturas disponibles para exportar.');
      return;
    }

    this.facturaService
      .getPage(0, total, this.orderField(), this.orderDirection(), this.id_usuario ?? 0)
      .subscribe({
        next: (data) => {
          const allFacturas = data.content;

          // SpreadsheetML: formato XML que Excel y LibreOffice abren nativamente
          const escapeXml = (val: unknown): string => {
            if (val == null) return '';
            return String(val)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };

          const rows = allFacturas.map((f) => {
            const nombreCompleto = f.usuario
              ? `${f.usuario.nombre ?? ''} ${f.usuario.apellido1 ?? ''}`.trim()
              : 'No asignado';
            return `<Row>
              <Cell><Data ss:Type="Number">${escapeXml(f.id)}</Data></Cell>
              <Cell><Data ss:Type="String">${escapeXml(f.fecha)}</Data></Cell>
              <Cell><Data ss:Type="String">${escapeXml(nombreCompleto)}</Data></Cell>
              <Cell><Data ss:Type="Number">${escapeXml(f.compras ?? 0)}</Data></Cell>
            </Row>`;
          });

          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Facturas">
    <Table>
      <Row ss:StyleID="header">
        <Cell><Data ss:Type="String">ID</Data></Cell>
        <Cell><Data ss:Type="String">Fecha</Data></Cell>
        <Cell><Data ss:Type="String">Usuario</Data></Cell>
        <Cell><Data ss:Type="String">Compras</Data></Cell>
      </Row>
      ${rows.join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`;

          const blob = new Blob([xml], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gesportin-facturas-${new Date().getTime()}.xls`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al generar el archivo Excel:', err);
        },
      });
  }
}
