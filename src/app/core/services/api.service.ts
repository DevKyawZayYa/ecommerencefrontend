import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string) {
    return this.http.get<T>(`${environment.apiUrl}/${url}`);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${environment.apiUrl}/${url}`, body);
  }

  put<T>(url: string, body: any, responseType: 'json' | 'text' = 'json') {
    return this.http.put<T>(`${environment.apiUrl}/${url}`, body, {
      responseType: responseType as any
    });
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${environment.apiUrl}/${url}`);
  }
}
