import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: any[] = [];

  constructor(private api: ApiService) {}

  addToCart(customerId: string, product: any): Observable<any> {
    const payload = {
      customerId: {
        value: customerId
      },
      items: [
        {
          productId: {
            value: product.id.value || product.id
          },
          price: product.price.amount || product.price,
          quantity: 1
        }
      ]
    };

    return this.api.post('cart/add', payload); // ✅ Cleaned API usage
  }

  getItems(): any[] {
    return this.cartItems;
  }

  getCartTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getCartItemsByCustomerId(customerId: string): Observable<any[]> {
    return this.api.get<any[]>(`cart/getCartItemsByCustomerId?CustomerId=${customerId}`);
  }
}
