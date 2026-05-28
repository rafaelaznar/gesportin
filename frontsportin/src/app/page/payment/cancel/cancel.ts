import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cancel.html',
  styleUrl: './cancel.css',
})
export class PaymentCancelPage {}
