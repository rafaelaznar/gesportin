import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaAdminForm } from '../../../../component/categoria/admin/form/form';

@Component({
  selector: 'app-categoria-admin-edit-page',
  imports: [CategoriaAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CategoriaAdminEditPage implements OnInit {
  id = signal<number>(0);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(+idParam);
    }
  }
}
