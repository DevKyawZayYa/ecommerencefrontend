import { Component, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../models/customer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isAdding: boolean = false;
  currentCategory: string | null = null;
  Math = Math;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  loading = false;

  constructor(
    private api: ApiService,            
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // Subscribe to query params changes
    this.route.queryParams.subscribe(params => {
      this.currentCategory = params['category'];
      this.currentPage = Number(params['page']) || 1;
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    this.loading = true;
    
    if (this.currentCategory) {
      // Use category-specific endpoint
      this.api.get<ProductResponse>(`Products/category/${this.currentCategory}?page=${this.currentPage}&pageSize=${this.pageSize}`).subscribe({
        next: (res) => {
          this.products = res.items;
          this.totalItems = res.totalItems;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch products', err);
          this.toast.error('Failed to load products');
          this.loading = false;
        }
      });
    } else {
      // Use default products endpoint
      this.api.get<ProductResponse>(`products?page=${this.currentPage}&pageSize=${this.pageSize}`).subscribe({
        next: (res) => {
          this.products = res.items;
          this.totalItems = res.totalItems;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch products', err);
          this.toast.error('Failed to load products');
          this.loading = false;
        }
      });
    }
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      // Update URL with new page number
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { 
          page: this.currentPage,
          ...(this.currentCategory && { category: this.currentCategory })
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const pages: number[] = [];
    
    // Always show first page
    pages.push(1);
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return [...new Set(pages)].sort((a, b) => a - b);
  }

  goToDetail(id: string) {
    console.log('🔍 Going to product detail for ID:', id);
    this.router.navigate(['/product', id]);
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedInSync) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdding = true;
    
    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        const userId = data.id?.value;
        if (userId) {
          // Store userId in localStorage for cart service
          localStorage.setItem('userId', userId);

          this.cartService.addCartItem(userId, product).subscribe({
            next: () => {
              // Force update cart count after adding item
              this.cartService.getCartItemsByCustomerId(userId).subscribe({
                next: (cartItems) => {
                  const count = cartItems?.[0]?.items?.length || 0;
                  // Update the cart count in the service
                  this.cartService.updateCartCount(count);
                }
              });
              
              this.toast.success('Added to Cart', `${product.name} (Qty: 1)`);
              this.isAdding = false;
            },
            error: (err) => {
              console.error('Failed to add to cart', err);
              this.toast.error('Unable to Add Item', 'Please try again later');
              this.isAdding = false;
            }
          });     
        }
      },
      error: (err) => {
        console.error('❌ Failed to get user profile', err);
        this.isAdding = false;
      }
    });
  }
}


