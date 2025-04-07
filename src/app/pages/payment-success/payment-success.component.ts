import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderService: OrderService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
      const paymentMethod = 'Stripe';
      const shippingCost = 5.19;
      const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const grandTotal = total + shippingCost;

      this.customerService.getMyProfile().subscribe({
        next: (data: Customer) => {
          const customer = {
            id: data.id?.value,
            name: `${data?.firstName.value ?? ''} ${data?.lastName.value ?? ''}`,
            phone: `${data?.mobileCode ?? ''} ${data?.mobileNumber ?? ''}`,
            address: `${data?.address ?? ''} ${data?.city ?? ''} ${data?.country ?? ''} ${data?.postalCode ?? ''}`.trim()
          };

          const payload = this.orderService.buildOrderPayload(customer, items, shippingCost);

          this.orderService.placeOrder(payload).subscribe({
            next: (res: any) => {
              const orderId = res?.value?.orderId ?? 'mock-id';
              this.orderService.startPayment(orderId, grandTotal, paymentMethod).subscribe({
                next: () => {
                  console.log('✅ Stripe order and payment completed.');
                  this.router.navigate(['/orders']);
                },
                error: err => console.error('❌ Payment error:', err)
              });
            },
            error: err => console.error('❌ Order error:', err)
          });
        },
        error: err => console.error('❌ Customer info fetch failed:', err)
      });
    }
  }
}
