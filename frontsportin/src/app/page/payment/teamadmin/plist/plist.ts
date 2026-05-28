import { Component } from '@angular/core';
import { PaymentTeamadminPlist } from '../../../../component/payment/teamadmin/plist/plist';

@Component({
  selector: 'app-payment-teamadmin-plist-page',
  standalone: true,
  imports: [PaymentTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PaymentTeamadminPlistPage {}
