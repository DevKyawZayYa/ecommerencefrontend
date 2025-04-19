import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: any[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private api: ApiService) {
    // Initialize cart count
    this.initializeCartCount();
  }

  private initializeCartCount() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getCartItemsByCustomerId(userId).subscribe({
        next: (res) => {
          const count = res?.[0]?.items?.length || 0;
          this.cartCountSubject.next(count);
        },
        error: (err) => {
          console.error('Failed to initialize cart count', err);
        }
      });
    }
  }

  public updateCartCount(count?: number) {
    if (typeof count === 'number') {
      this.cartCountSubject.next(count);
    } else {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.getCartItemsByCustomerId(userId).subscribe({
          next: (res) => {
            const currentCount = res?.[0]?.items?.length || 0;
            this.cartCountSubject.next(currentCount);
          },
          error: (err) => {
            console.error('Failed to update cart count', err);
          }
        });
      }
    }
  }

  addCartItem(customerId: string, product: any): Observable<any> {
    const payload = {
      customerId: { value: customerId },
      productId: { value: product.id.value || product.id },
      price: product.price.amount || product.price,
      quantity: 1
    };
  
    return new Observable(observer => {
      this.api.post('cart/addItem', payload).subscribe({
        next: (response) => {
          this.updateCartCount();
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
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

  deleteCartItem(cartItemId: string): Observable<any> {
    return new Observable(observer => {
      this.api.delete(`cart/cartItemId?cartItemId=${cartItemId}`).subscribe({
        next: (response) => {
          this.updateCartCount();
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  clearCart(shoppingCartId: string): Observable<any> {
    return new Observable(observer => {
      this.api.post(`cart/clearCart?shoppingCartId=${shoppingCartId}`, null).subscribe({
        next: (response) => {
          this.cartCountSubject.next(0);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  
}
