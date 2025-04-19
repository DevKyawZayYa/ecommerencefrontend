import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../models/customer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  isLoggedIn$ = this.authService.isLoggedIn();
  showMenu = false;
  username = 'kyawzayya656'; 
  isLoggedIn = true;

  cartCount = 0;
  private cartSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private customerService: CustomerService
  ) {
    // Subscribe to cart count changes
    this.cartSubscription = this.cartService.cartCount$.subscribe(
      count => this.cartCount = count
    );
  }

  ngOnInit(): void {
    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        const customerId = data.id?.value;
        if (customerId) {
          localStorage.setItem('userId', customerId); // Store userId for cart service
          this.cartService.getCartItemsByCustomerId(customerId).subscribe({
            next: (res) => {
              this.cartCount = res?.[0]?.items?.length || 0;
            },
            error: (err) => {
              console.error('❌ Failed to load cart count', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Failed to load user profile', err);
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  } 

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }
}
