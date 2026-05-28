import { Component } from '@angular/core';
import { PaymentAdminPlist } from '../../../../component/payment/admin/plist/plist';

@Component({
  selector: 'app-payment-admin-plist-page',
  standalone: true,
  imports: [PaymentAdminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PaymentAdminPlistPage {}
