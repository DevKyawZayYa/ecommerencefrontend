import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private getHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  get<T>(url: string) {
    return this.http.get<T>(`${environment.apiUrl}/${url}`, {
      headers: this.getHeaders()
    });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${environment.apiUrl}/${url}`, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(url: string, body: any, responseType: 'json' | 'text' = 'json') {
    return this.http.put<T>(`${environment.apiUrl}/${url}`, body, {
      headers: this.getHeaders(),
      responseType: responseType as any
    });
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${environment.apiUrl}/${url}`, {
      headers: this.getHeaders()
    });
  }
}
