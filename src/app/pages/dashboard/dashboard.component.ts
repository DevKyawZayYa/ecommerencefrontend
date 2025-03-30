import { Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductsComponent], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  categories = [
    { name: 'Fashion', image: 'assets/fashion.jpg' },
    { name: 'Electronics', image: 'assets/electronics.jpg' },
    { name: 'Toys', image: 'assets/toys.jpg' },
    { name: 'Kitchen', image: 'assets/kitchen.jpg' }
  ];
}
