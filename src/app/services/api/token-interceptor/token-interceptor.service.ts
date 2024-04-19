import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  
  constructor(private inject: Injector) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authservice = this.inject.get(AuthService);
    let accessToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authservice.getAccessToken()}`
      }
    });
    return next.handle(accessToken);
  }

}
