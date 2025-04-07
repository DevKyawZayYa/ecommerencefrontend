import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  buildOrderPayload(customer: any, items: any[], shippingCost: number): any {
    return {
      customerId: { value: customer.id },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      taxAmount: 0,
      shippingCost,
      discountAmount: 0,
      status: 'Pending',
      paymentStatus: 'Pending',
      deliveryStatus: 'NotShipped'
    };
  }

  placeOrder(orderPayload: any): Observable<any> {
    return this.api.post('orders', orderPayload);
  }

  startPayment(orderId: string, amount: number, paymentMethod: string): Observable<any> {
    const paymentPayload = {
      orderId,
      amount,
      paymentMethod,
      paymentStatus: 'Paid',
      transactionId: 'TXN_' + Date.now(),
      transactionType: 'Online'
    };
    return this.api.post('payment', paymentPayload);
  }
}
