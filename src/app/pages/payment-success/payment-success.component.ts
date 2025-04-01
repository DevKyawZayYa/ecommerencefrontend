import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Access localStorage only in the browser
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken);
    } else {
      console.log('Running on the server, localStorage is not available.');
    }
  }
}