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

  handlePlaceOrderClick(): void {
    if (this.selectedPaymentMethod === 'CashOnDelivery') {
      const payload = this.orderService.buildOrderPayload(this.customer, this.items, this.shippingCost);
      this.orderService.placeOrder(payload).subscribe({
        next: (res: any) => {
          const orderId = res?.value?.orderId ?? 'mock-id';
          this.orderService.startPayment(orderId, this.getGrandTotal(), 'CashOnDelivery').subscribe({
            next: () => {
              this.cartService.getCartItemsByCustomerId(this.customer.id).subscribe({
                next: (cartItems: any[]) => {
                  if (cartItems.length > 0) {
                    const cartId = cartItems[0].cartId;
                    this.cartService.clearCart(cartId).subscribe({
                      next: () => {
                        console.log('✅ Cart cleared after COD order.');
                        alert('✅ Order placed successfully! Thank you for your order. You will pay on delivery.');
                        this.router.navigate(['/products']);
                      },
                      error: (err: Error) => {
                        console.error('❌ Failed to clear cart', err);
                        alert('✅ Order placed successfully! Thank you for your order. You will pay on delivery.');
                        this.router.navigate(['/products']);
                      }
                    });
                  } else {
                    alert('✅ Order placed successfully! Thank you for your order. You will pay on delivery.');
                    this.router.navigate(['/products']);
                  }
                },
                error: (err: Error) => {
                  console.error('❌ Failed to get cart items', err);
                  alert('✅ Order placed successfully! Thank you for your order. You will pay on delivery.');
                  this.router.navigate(['/products']);
                }
              });
            },
            error: (err: Error) => {
              console.error('❌ COD payment error:', err);
              alert('Failed to place order. Please try again.');
            }
          });
        },
        error: (err: Error) => {
          console.error('❌ Order creation error:', err);
          alert('Failed to create order. Please try again.');
        }
      });
    } else if (this.selectedPaymentMethod === 'Stripe') {
      this.startStripeCheckout();
    } else {
      alert('Please select a payment method');
    }
  }

  startStripeCheckout(): void { 
    const payload = this.items.map(item => ({
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    this.api.post<any>('payment/checkout', payload).subscribe({
      next: (res) => {
        if (res?.sessionUrl) {
          localStorage.setItem('stripeSession', JSON.stringify({
            sessionId: res.sessionId,
            customerId: this.customer.id
          }));
          localStorage.setItem('selectedItems', JSON.stringify(this.items));
          window.location.href = res.sessionUrl;
        } else {
          alert('❌ Failed to get Stripe URL');
        }
      },
      error: err => {
        console.error('❌ Stripe checkout failed:', err);
        alert('Stripe checkout failed');
      }
    });
  }
}
