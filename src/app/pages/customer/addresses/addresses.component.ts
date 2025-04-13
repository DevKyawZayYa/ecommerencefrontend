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
  editingAddress: any = null; // Store original address for editing

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.customerService.getMyProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.userId = data.id?.value;
      },
      error: (err) => {
        console.error('❌ Failed to load profile:', err);
      }
    });
  }

  onEdit(): void {
    if (!this.user) return;
    
    // Store a copy of the current address for editing
    this.editingAddress = {
      firstName: { ...this.user.firstName },
      address: this.user.address,
      city: this.user.city,
      region: this.user.region,
      postalCode: this.user.postalCode,
      country: this.user.country,
      mobileNumber: this.user.mobileNumber,
      mobileCode: this.user.mobileCode
    };
    
    this.editMode = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    // Reset form to original values if cancelled
    if (this.user && this.editingAddress) {
      this.user.firstName = { ...this.editingAddress.firstName };
      this.user.address = this.editingAddress.address;
      this.user.city = this.editingAddress.city;
      this.user.region = this.editingAddress.region;
      this.user.postalCode = this.editingAddress.postalCode;
      this.user.country = this.editingAddress.country;
      this.user.mobileNumber = this.editingAddress.mobileNumber;
      this.user.mobileCode = this.editingAddress.mobileCode;
    }
    
    this.editMode = false;
    this.editingAddress = null;
    document.body.classList.remove('modal-open');
  }

  onSaveAddress(): void {
    if (!this.user || !this.userId) return;

    this.customerService.updateCustomer(this.userId, this.user).subscribe({
      next: () => {
        alert('Address updated successfully ✅');
        this.editMode = false;
        this.editingAddress = null;
        document.body.classList.remove('modal-open');
        // Reload user data to ensure we have the latest
        this.loadUserData();
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        alert('Something went wrong ❌');
      }
    });
  }
}
