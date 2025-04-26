import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthResponse } from '../../models/auth-response.model';
import { RegisterRequest } from '../../models/register.model';
import { ChangePasswordRequest, ChangePasswordResponse } from '../../models/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('onboarding/login', { email, password });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<string> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const request: ChangePasswordRequest = {
      userId: { value: userId },
      currentPassword,
      newPassword
    };

    return this.api.post<string>('Onboarding/changePassword', request, 'text');
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  get isLoggedInSync(): boolean {
    return this.hasToken();
  }

  register(request: RegisterRequest): Observable<string> {
    return this.api.post<string>('Onboarding/Register', request, 'text');
  }
}
