import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/addtocart/cart.service';

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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const customerId = '2457c2b7-b9de-44c6-bbe1-0791fd0ca6ad';

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

  removeItem(productId: string) {
    alert('❌ Remove not yet wired to backend');
  }

  checkout() {
    const selected = this.items.filter(i => this.selectedItems.has(i.productId));
    alert('Proceeding to checkout with ' + selected.length + ' item(s)');
  }
}

  

