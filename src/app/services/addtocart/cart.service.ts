import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: any[] = [];
  private apiUrl = 'https://localhost:7155/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(customerId: string, product: any) {

    console.log('hi product', product);

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

    return this.http.post(`${this.apiUrl}/add`, payload);
  }

  getItems() {
    return this.cartItems;
  }

  getCartTotal() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getCartItemsByCustomerId(customerId: string) {
    return this.http.get<any[]>(
      `https://localhost:7155/api/cart/getCartItemsByCustomerId?CustomerId=${customerId}`
    );
  }
  
}
