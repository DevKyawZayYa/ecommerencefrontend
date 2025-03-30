import { Component } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: Product[] = [];
  isAdding: boolean = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http
      .get<ProductResponse>('https://localhost:7155/api/Products?page=1&pageSize=50')
      .subscribe((res) => {
        this.products = res.items;
      });
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedInSync) {
      this.router.navigate(['/login']);
      return;
    }

    // 👇 Replace with dynamic user ID in future
    const userId = '2457c2b7-b9de-44c6-bbe1-0791fd0ca6ad';

    this.isAdding = true;

    this.cartService.addToCart(userId, product).subscribe({
      next: () => {
        alert('Item added to cart!');
        this.isAdding = false;
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        alert('Failed to add item to cart.');
        this.isAdding = false;
      },
    });
  }
}
