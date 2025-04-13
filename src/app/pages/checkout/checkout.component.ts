import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer/customer.service';
import { OrderService } from '../../services/order/order.service';
import { CartService } from '../../services/addtocart/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  customer = {
    id: '',
    name: '',
    phone: '',
    address: ''
  };

  shippingCost = 5.19;
  selectedPaymentMethod = '';
  items: any[] = [];
  total = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private customerService: CustomerService,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        this.customer = {
          id: data.id?.value,
          name: `${data?.firstName.value ?? ''} ${data?.lastName.value ?? ''}`,
          phone: `${data?.mobileCode ?? ''} ${data?.mobileNumber ?? ''}`,
          address: `${data?.address ?? ''} ${data?.city ?? ''} ${data?.country ?? ''} ${data?.postalCode ?? ''}`.trim()
        };
      },
      error: (err) => {
        console.error('❌ Failed to load customer info', err);
      }
    });
  }

  getGrandTotal(): number {
    return this.total + this.shippingCost;
  }

  handlePlaceOrder(): void {
    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (this.selectedPaymentMethod === 'Stripe') {
      this.startStripeCheckout();
    } else {
      // Handle COD
      const payload = this.orderService.buildOrderPayload(this.customer, this.items, this.shippingCost);
      this.orderService.placeOrder(payload).subscribe({
        next: (res: any) => {
          const orderId = res?.value?.orderId ?? 'mock-id';
          this.orderService.startPayment(orderId, this.getGrandTotal(), 'CashOnDelivery').subscribe({
            next: () => {
              alert('Order placed successfully ✅');
              // Clear cart after successful COD order
              if (this.customer.id) {
                this.cartService.getCartItemsByCustomerId(this.customer.id).subscribe({
                  next: (cartItems: any[]) => {
                    if (cartItems.length > 0) {
                      const shoppingCartId = cartItems[0].shoppingCartId;
                      this.cartService.clearCart(shoppingCartId).subscribe({
                        next: () => {
                          console.log('✅ Cart cleared after COD order');
                          localStorage.removeItem('selectedItems');
                          this.router.navigate(['/products']);
                        },
                        error: (err) => {
                          console.error('❌ Failed to clear cart', err);
                          this.router.navigate(['/products']);
                        }
                      });
                    } else {
                      this.router.navigate(['/products']);
                    }
                  },
                  error: (err) => {
                    console.error('❌ Failed to get cart items', err);
                    this.router.navigate(['/products']);
                  }
                });
              }
            },
            error: (err) => {
              console.error('❌ Payment error:', err);
              alert('Failed to process payment ❌');
            }
          });
        },
        error: (err) => {
          console.error('❌ Order creation error:', err);
          alert('Failed to create order ❌');
        }
      });
    }
  }

  startStripeCheckout(): void {
    const stripePayload = {
      items: this.items.map(item => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.api.post<any>('stripe/createCheckoutSession', stripePayload).subscribe({
      next: (res) => {
        if (res?.url) {
          localStorage.setItem('stripeSession', JSON.stringify(res));
          localStorage.setItem('selectedItems', JSON.stringify(this.items));
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
}
