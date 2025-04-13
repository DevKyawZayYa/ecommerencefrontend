import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CartService } from '../../services/addtocart/cart.service';

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
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
      const paymentMethod = localStorage.getItem('paymentMethod') || '';
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
                  console.log('✅ Order completed');
                  
                  // Only clear cart for Stripe payments
                  if (paymentMethod === 'Stripe') {
                    this.clearCartAndRedirect(customer.id);
                  } else {
                    // For COD, just redirect to products
                    localStorage.removeItem('selectedItems');
                    localStorage.removeItem('paymentMethod');
                    this.router.navigate(['/products']);
                  }
                },
                error: err => {
                  console.error('❌ Payment error:', err);
                  this.router.navigate(['/products']);
                }
              });
            },
            error: err => {
              console.error('❌ Order error:', err);
              this.router.navigate(['/products']);
            }
          });
        },
        error: err => {
          console.error('❌ Customer info fetch failed:', err);
          this.router.navigate(['/products']);
        }
      });
    }
  }

  private clearCartAndRedirect(customerId: string): void {
    this.cartService.getCartItemsByCustomerId(customerId).subscribe({
      next: (cartItems: any[]) => {
        if (cartItems.length > 0) {
          const shoppingCartId = cartItems[0].shoppingCartId;
          this.cartService.clearCart(shoppingCartId).subscribe({
            next: () => {
              console.log('✅ Cart cleared after Stripe payment');
              localStorage.removeItem('selectedItems');
              localStorage.removeItem('paymentMethod');
              this.router.navigate(['/orders']);
            },
            error: (err) => {
              console.error('❌ Failed to clear cart', err);
              this.router.navigate(['/orders']);
            }
          });
        } else {
          this.router.navigate(['/orders']);
        }
      },
      error: (err) => {
        console.error('❌ Failed to get cart items', err);
        this.router.navigate(['/orders']);
      }
    });
  }
}
