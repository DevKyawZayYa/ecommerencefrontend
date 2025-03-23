import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName = new FormControl('');
  password = new FormControl('');

  router = inject(Router);
  http = inject(HttpClient);

  onLogin() {
    console.log('Login button clicked');

    const username = this.userName.value;
    const password = this.password.value;

    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    this.http.post<any>('https://localhost:7155/api/Onboarding/Login', {
      username,
      password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        alert('Invalid credentials');
      }
    });
  }
}