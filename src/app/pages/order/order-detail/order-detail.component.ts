import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer.model';
import { AccountSidebarComponent } from '../../customer/components/account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, AccountSidebarComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId = '';
  order: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    this.customerService.getMyProfile().subscribe((user: Customer) => {
      const customerId = user.id?.value;
      if (customerId && this.orderId) {
        this.orderService.getOrderDetailById(this.orderId, customerId).subscribe({
          next: (res) => {
            this.order = res;
            this.loading = false;
          },
          error: () => (this.loading = false)
        });
      }
    });
  }
}
