import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';
import { ApiService } from '../../core/services/api.service';
import { switchMap } from 'rxjs/operators';
import { text } from 'stream/consumers';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'User'; // No need to include full URL, handled by ApiService

  constructor(private api: ApiService) {}

  getMyProfile(): Observable<Customer> {
    return this.api.get<{ id: string }>('User/me').pipe(
      switchMap((res) => this.getCustomerById(res.id))
    );
  } 

  getCustomerById(id: string): Observable<Customer> {
    return this.api.get<Customer>(`${this.baseUrl}/${id}`);
  }

  updateCustomer(id: string, payload: Partial<Customer>): Observable<string> {
    return this.api.put<string>(`${this.baseUrl}/update/${id}`, payload, 'text');
  }
  
}
