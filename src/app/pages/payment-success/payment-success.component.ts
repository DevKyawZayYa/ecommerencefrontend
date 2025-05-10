import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { CustomerService } from '../../services/customer/customer.service';

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
    private cartService: CartService,
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.customerService.getMyProfile().subscribe({
      next: (user) => {
        const customerId = user.id?.value;
        if (customerId) {
          this.cartService.getCartItemsByCustomerId(customerId).subscribe({
            next: (cartItems) => {
              if (cartItems.length > 0) {
                const cartId = cartItems[0].cartId;
                this.cartService.clearCart(cartId).subscribe();
              }
            }
          });
        }
      }
    });
  }
}