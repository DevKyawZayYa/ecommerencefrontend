import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CartService } from '../../services/addtocart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  constructor(
    public router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: any
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
                  // Clear cart after successful payment
                  this.cartService.getCartItemsByCustomerId(customer.id).subscribe({
                    next: (cartItems: any[]) => {
                      if (cartItems.length > 0) {
                        const cartId = cartItems[0].cartId; 
                        this.cartService.clearCart(cartId).subscribe({
                          next: () => {
                            console.log('✅ Cart cleared after payment.');
                            this.router.navigate(['/orders']);
                          },
                          error: (err: any) => {
                            console.error('❌ Failed to clear cart', err);
                            this.router.navigate(['/orders']);
                          }
                        });
                      } else {
                        this.router.navigate(['/orders']);
                      }
                    },
                    error: (err: any) => {
                      console.error('❌ Failed to get cart items', err);
                      this.router.navigate(['/orders']);
                    }
                  });
                },
                error: (err: any) => {
                  console.error('❌ Payment error:', err);
                  this.router.navigate(['/orders']);
                }
              });
            },
            error: (err: any) => {
              console.error('❌ Order error:', err);
              this.router.navigate(['/orders']);
            }
          });
        },
        error: (err: any) => {
          console.error('❌ Customer info fetch failed:', err);
          this.router.navigate(['/orders']);
        }
      });
    }
  }
}
