import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideClientHydration(withEventReplay()),
    provideAnimations(), // required for toastr
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      toastClass: 'ngx-toastr custom-toast toast-animation',
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      easing: 'cubic-bezier(0.21, 1.02, 0.73, 1)',
      easeTime: 300,
      tapToDismiss: true,
      maxOpened: 1
    }),

    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() // Use interceptors declared with `HTTP_INTERCEPTORS`
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
