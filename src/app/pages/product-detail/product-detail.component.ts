import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/addtocart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer/customer.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cart = inject(CartService);
  private toast = inject(ToastrService);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  product: Product | null = null;
  quantity = 1;

  mainImage: string = '';
  galleryImages: string[] = [];

  ngOnInit() {
    this.api.get<Product>(`Products/${this.route.snapshot.paramMap.get('id')}`).subscribe(res => {
      this.product = res;

      const imageUrls = res.imageUrls || [];
      const sorted = [...imageUrls].sort((a, b) => a.sortOrder - b.sortOrder);
      const primary = sorted.find(x => x.isPrimary);
      this.mainImage = primary?.imageUrl || sorted[0]?.imageUrl || '';
      this.galleryImages = sorted.map(x => x.imageUrl);
    });
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  getTextColor(backgroundColor: string): string {
    return ['black', 'red','blue', 'navy blue', 'gray', 'gold', 'rose', 'pink'].includes(backgroundColor.toLowerCase()) ? 'white' : 'black';
  }

  addToCart() {
    if (!this.product) return;

    if (!this.authService.isLoggedInSync) {
      this.router.navigate(['/login']);
      return;
    }

    this.customerService.getMyProfile().subscribe({
      next: (data) => {
        const userId = data.id?.value;
        if (userId) {
          // Create a modified product object with quantity
          const productWithQty = {
            ...this.product!,
            quantity: this.quantity
          };

          this.cart.addCartItem(userId, productWithQty).subscribe({
            next: () => {
              this.toast.success('Added to Cart', `${this.product!.name} (Qty: ${this.quantity})`);
            },
            error: (err) => {
              console.error('Failed to add to cart', err);
              this.toast.error('Unable to Add Item', 'Please try again later');
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to get user profile', err);
        this.toast.error('Authentication Error', 'Please try logging in again');
      }
    });
  }
}