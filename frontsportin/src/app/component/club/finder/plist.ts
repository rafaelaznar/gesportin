import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { ClubService } from '../../../service/club';
import { ImageUploadService } from '../../../service/image-upload';
import { IClub } from '../../../model/club';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';

@Component({
  selector: 'app-club-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class ClubPlistFinder implements OnInit, OnDestroy {

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, IClub | null> | null;
  private readonly clubService = inject(ClubService);
  readonly imageUpload = inject(ImageUploadService);

  oPage = signal<IPage<IClub> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getPage();
  }

  ngOnDestroy(): void {
    // cleanup if needed
  }

  getPage(): void {
    this.loading.set(true);
    this.clubService
      .getPage(this.numPage(), this.numRpp(), this.orderField(), this.orderDirection())
      .subscribe({
        next: (data: IPage<IClub>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando clubes:', err);
          this.loading.set(false);
        },
      });
  }

  onRppChange(n: number): void {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
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

  onSelect(club: IClub): void {
    this.modalRef?.close(club);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
