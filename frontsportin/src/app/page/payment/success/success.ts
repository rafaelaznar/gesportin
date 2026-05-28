import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class PaymentSuccessPage implements OnInit {
  private route = inject(ActivatedRoute);
  tipo = signal<string>('');

  ngOnInit(): void {
    this.tipo.set(this.route.snapshot.queryParamMap.get('tipo') ?? '');
  }
}
