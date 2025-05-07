import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../models/customer.model';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  isLoggedIn$ = this.authService.isLoggedIn();
  showMenu = false;
  username = '';
  isLoggedIn = true;
  isNavbarOpen = false;

  cartCount = 0;
  private cartSubscription: Subscription;

  categories: Category[] = [];
  showCategoryMenu = false;
  searchQuery: string = '';
  minPrice: number = 10;

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
        // Set the username from profile data
        this.username = `${data.firstName?.value || ''} ${data.lastName?.value || ''}`.trim();
        
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

    this.loadCategories();
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

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  toggleCategoryMenu() {
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery.trim() }
      });
    }
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  closeNavbar() {
    this.isNavbarOpen = false;
  }
}
