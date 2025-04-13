import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  isLoggedIn$ = this.authService.isLoggedIn();
  showMenu = false;
  username = 'kyawzayya656'; 
  isLoggedIn = true;

  cartCount = 0;

  constructor(
    private cartService: CartService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        const customerId = data.id?.value;
        if (customerId) {
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
  

  onLogout() {
    this.authService.logout();
  } 

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }
}
