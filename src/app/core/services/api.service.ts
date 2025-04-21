import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (typeof error.error === 'string') {
        try {
          // Try to parse the error if it's a JSON string
          const parsedError = JSON.parse(error.error);
          errorMessage = parsedError.message || parsedError.title || parsedError.error || error.error;
        } catch {
          // If parsing fails, use the error string directly
          errorMessage = error.error;
        }
      } else if (error.error && typeof error.error === 'object') {
        // If error is already an object
        errorMessage = error.error.message || error.error.title || error.message || 'Server error';
      }
    }

    // Clean up the error message by removing System.UnauthorizedAccessException etc.
    errorMessage = errorMessage.replace(/^System\.[^:]+:\s*/i, '');
    
    return throwError(() => errorMessage);
  }

  get<T>(url: string) {
    return this.http.get<T>(`${environment.apiUrl}/${url}`).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, responseType: 'json' | 'text' = 'json') {
    return this.http.post<T>(`${environment.apiUrl}/${url}`, body, {
      responseType: responseType as any
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body: any, responseType: 'json' | 'text' = 'json') {
    return this.http.put<T>(`${environment.apiUrl}/${url}`, body, {
      responseType: responseType as any
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${environment.apiUrl}/${url}`).pipe(
      catchError(this.handleError)
    );
  }
}
