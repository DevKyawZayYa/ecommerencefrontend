import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer.model';
import { AccountSidebarComponent } from '../components/account-sidebar/account-sidebar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountSidebarComponent],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  user: Customer | null = null;
  userId: string = '';
  editMode = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getMyProfile().subscribe((data) => {
      this.user = data;
      this.userId = data.id?.value; // ✅ correct extraction
    });
  }

  onEdit(): void {
    this.editMode = true;
  }

  closeModal(): void {
    this.editMode = false;
  }

  onSaveAddress(): void {
    if (!this.user || !this.userId) return;

    this.customerService.updateCustomer(this.userId, this.user).subscribe({
      next: () => {
        alert('Address updated successfully ✅');
        this.editMode = false;
      },
      error: () => {
        alert('Something went wrong ❌');
      }
    });
  }
}
