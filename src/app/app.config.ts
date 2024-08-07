import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { interceptorProvider } from './services/token.interceptor';
import { LoaderInterceptor } from './components/loader/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    interceptorProvider,
    provideHttpClient(
      withFetch(),
      withInterceptors([LoaderInterceptor])
    ),
    provideToastr({
      timeOut: 8000,
      preventDuplicates: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      tapToDismiss: false,
      closeButton: true,
    }),
    provideAnimations(),
    provideClientHydration(),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
