import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  ngOnInit(): void {
    localStorage.removeItem('selectedItems');
  }
}
