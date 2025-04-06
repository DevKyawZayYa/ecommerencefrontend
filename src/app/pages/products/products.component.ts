import { Component, OnInit } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

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
    private router: Router
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

  addToCart(product: Product): void {
    if (!this.authService.isLoggedInSync) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = '2457c2b7-b9de-44c6-bbe1-0791fd0ca6ad'; // 🔁 To be dynamic later
    this.isAdding = true;

    this.cartService.addToCart(userId, product).subscribe({
      next: () => {
        alert('✅ Item added to cart!');
        this.isAdding = false;
      },
      error: (err) => {
        console.error('❌ Add to cart failed', err);
        alert('Failed to add item to cart.');
        this.isAdding = false;
      }
    });
  }
}


