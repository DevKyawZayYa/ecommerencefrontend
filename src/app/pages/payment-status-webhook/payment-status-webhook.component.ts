import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-payment-status-webhook',
  templateUrl: './payment-status-webhook.component.html',
  styleUrls: ['./payment-status-webhook.component.css']
})
export class PaymentStatusWebhookComponent implements OnInit {
  paymentStatus: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // // Old flow: get status from query param
    // const status = this.route.snapshot.queryParamMap.get('status');
    // if (status) {
    //   this.paymentStatus = status;
    //   return;
    // }

    // New flow: get status from backend using session_id
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.apiService.get(`/orders/by-session/${sessionId}`).subscribe({
        next: (order: any) => {
          this.paymentStatus = order.paymentStatus;
          this.loading = false;
        },
        error: (_err: unknown) => {
          this.error = 'Could not fetch payment status.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No session ID found in URL.';
      this.loading = false;
    }
  }
}