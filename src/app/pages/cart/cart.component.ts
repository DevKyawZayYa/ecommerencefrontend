import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer/customer.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {
  items: any[] = [];
  selectedItems: Set<string> = new Set(); // Track selected productIds
  total: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private customerService: CustomerService,
    private toast: ToastrService
  )
  
    {}

    ngOnInit(): void {
      this.customerService.getMyProfile().subscribe({
        next: (data: Customer) => {
          const customerId = data.id?.value;
    
          if (customerId) {
            this.cartService.getCartItemsByCustomerId(customerId).subscribe({
              next: (res) => {
                if (res.length > 0 && res[0].items) {
                  this.items = res[0].items;
                  this.total = res[0].totalPrice;
                  this.selectedItems = new Set(res[0].items.map((i: any) => i.productId));
                }
              },
              error: (err) => {
                console.error('❌ Failed to load cart', err);
              }
            });
          } else {
            console.warn('⚠️ No customer ID found from profile.');
          }
        },
        error: (err) => {
          console.error('❌ Failed to load profile', err);
        }
      });
    }
    
  
  onCheckboxChange(event: Event, productId: string): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.toggleSelection(productId, isChecked);
  }
  

  toggleSelection(productId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedItems.add(productId);
    } else {
      this.selectedItems.delete(productId);
    }
  }

  isChecked(productId: string): boolean {
    return this.selectedItems.has(productId);
  }



  checkout() {
    const selected = this.items.filter(i => this.selectedItems.has(i.productId));
  
    localStorage.setItem('selectedItems', JSON.stringify(selected));
  
    this.router.navigate(['/checkout']);
  }

  removeItem(item: any): void {
    const cartItemId = item.id?.value || item.id;
    this.cartService.deleteCartItem(cartItemId).subscribe({
      next: () => {
        this.items = this.items.filter((i: any) => (i.id?.value || i.id) !== cartItemId);
        this.updateTotal();
      },
      error: (err) => {
        console.error('❌ Failed to delete item', err);
      }
    });
  }

  updateTotal(): void {
    this.total = this.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }
  
  increaseQty(item: any): void {
    item.quantity++;
    this.updateItemQuantity(item);
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItemQuantity(item);
    }
  }

  updateItemQuantity(item: any): void {
    const cartItemId = item.id?.value || item.id;
    this.customerService.getMyProfile().subscribe({
      next: (data: Customer) => {
        const userId = data.id?.value;
        if (userId) {
          this.cartService.addCartItem(userId, {
            ...item,
            id: { value: item.productId }
          }).subscribe({
            next: () => {
              this.updateTotal();
              this.toast.success('Cart Updated', `${item.name} (Qty: ${item.quantity})`);
            },
            error: (err) => {
              console.error('Failed to update cart', err);
              this.toast.error('Unable to Update Cart', 'Please try again later');
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to get user profile', err);
        this.toast.error('Unable to Update Cart', 'Please try again later');
      }
    });
  }
}

  

