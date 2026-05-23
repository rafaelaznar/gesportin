import { Component, computed, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { SessionService } from '../../../../service/session';
import { IFactura } from '../../../../model/factura';
import { IPage } from '../../../../model/plist';
import { FacturaService } from '../../../../service/factura-service';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { jsPDF } from "jspdf";

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

  exportarPDF() {
    const total = this.totalRecords(); // Cuenta el total de facturas que hay registradas
    
    if (total === 0) {
      alert("No hay facturas disponibles para exportar.");
      return;
    }

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
            doc.text(nombreCompleto, 95, y);

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
}
