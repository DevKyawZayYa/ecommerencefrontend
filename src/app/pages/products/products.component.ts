import { Component, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
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

  constructor(
    private api: ApiService,            
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.api.get<ProductResponse>('products?page=1&pageSize=50').subscribe({
      next: (res) => {
        this.products = res.items;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
      }
    });
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


