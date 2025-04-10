import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order/order.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer.model';
import { AccountSidebarComponent } from '../../customer/components/account-sidebar/account-sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule,AccountSidebarComponent ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomer();
  }
  
  goToOrderDetail(orderId: string): void {
    this.router.navigate(['/account/order-detail', orderId]);
  }

  loadCustomer(): void {
    this.customerService.getMyProfile().subscribe((data: Customer) => {
      const customerId = data.id?.value;
      if (customerId) {
        this.orderService.getOrderListByCustomerId(customerId).subscribe({
          next: (res) => {
            this.orders = res;
            this.loading = false;
          },
          error: (err) => {
            console.error('Order fetch failed', err);
            this.loading = false;
          }
        });
      }
    });
  }

  getOrderTotal(order: any): string {
    return order.items.reduce((sum: number, item: any) => sum + item.subtotal, 0).toFixed(2);
  }
}
