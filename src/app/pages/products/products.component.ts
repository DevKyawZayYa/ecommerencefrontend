import { Component } from '@angular/core';
import { Product, ProductResponse } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() : void {
    this.fetchProducts();
  }

  fetchProducts() {
    // https://localhost:7155/api/Products?page=1&pageSize=10
    this.http.get<ProductResponse>('https://localhost:7155/api/Products?page=1&pageSize=50')
    .subscribe((res) => {
      this.products = res.items;
    });
  }
  
}


