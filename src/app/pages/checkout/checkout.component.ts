import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  customer = {
    name: 'KZY',
    phone: '+60 1161157840',
    address: 'C-6-2, Room 1, Unipark condominium Block C, Jalan US 1, Sepang, 43000 Selangor'
  };

  shippingCost = 5.19;
  selectedPaymentMethod = '';
  items: any[] = [];
  total = 0;

  constructor(
    private api: ApiService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getGrandTotal(): number {
    return this.total + this.shippingCost;
  }

  handlePlaceOrderClick(): void {
    if (this.selectedPaymentMethod === 'CashOnDelivery') {
      this.placeOrder();
    } else if (this.selectedPaymentMethod === 'Stripe') {
      this.startStripeCheckout();
    } else {
      alert('Please select a payment method');
    }
  }

  placeOrder(): void {
    const orderPayload = {
      customerId: { value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
      items: this.items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      taxAmount: 0,
      shippingCost: this.shippingCost,
      discountAmount: 0,
      status: 'Pending',
      paymentStatus: 'Pending',
      deliveryStatus: 'NotShipped'
    };

    this.api.post('orders', orderPayload).subscribe({
      next: (res: any) => {
        const orderId = res?.value?.orderId ?? 'mock-id';
        this.startPayment(orderId, this.getGrandTotal());
      },
      error: err => console.error('Order failed', err)
    });
  }

  startStripeCheckout(): void {
    const stripePayload = {
      items: this.items.map(item => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.api.post<any>('stripe/create-checkout-session', stripePayload).subscribe({
      next: (res) => {
        if (res?.url) {
          window.location.href = res.url;
        } else {
          alert('Failed to get Stripe URL');
        }
      },
      error: err => {
        console.error('❌ Stripe checkout failed:', err);
        alert('Stripe checkout failed');
      }
    });
  }

  startPayment(orderId: string, amount: number) {
    const paymentPayload = {
      orderId,
      amount,
      paymentMethod: this.selectedPaymentMethod,
      paymentStatus: 'Paid',
      transactionId: 'TXN_' + Date.now(),
      transactionType: 'Online'
    };

    this.api.post('payment', paymentPayload).subscribe({
      next: () => {
        alert('✅ Payment Successful!');
        this.router.navigate(['/orders']);
      },
      error: err => console.error('Payment failed', err)
    });
  }
}
