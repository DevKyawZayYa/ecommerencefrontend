import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';

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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const customerId = '2457c2b7-b9de-44c6-bbe1-0791fd0ca6ad'; // temporary test ID

    this.cartService.getCartItemsByCustomerId(customerId).subscribe({
      next: (res) => {
        if (res.length > 0 && res[0].items) {
          this.cartCount = res[0].items.length;
        }
      },
      error: (err) => {
        console.error('❌ Failed to load cart count', err);
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
