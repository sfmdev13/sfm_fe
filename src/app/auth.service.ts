import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_EXPIRY_TIME = 2 * 60 * 60 * 1000;

  private apiUrl = environment.apiUrl;
  
  private userRoles: string[] = []

  private activityTimeout: any;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private modal: NzModalService,
    private ngZone: NgZone
  ) {
    this.setupActivityListener();
  }

  private setupActivityListener(): void {
    this.ngZone.runOutsideAngular(() => {
      const events = ['click', 'mousemove', 'keypress', 'scroll'];

      events.forEach(event => {
        window.addEventListener(event, () => this.resetTimeout());
      });
    });
  }

  private resetTimeout(): void {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    
    this.activityTimeout = setTimeout(() => {
      if (!this.isAuthenticated()) {
      }
    }, 1000); // Check authentication status after 1 second of inactivity
  }

  hasAction(action: string): boolean {
    this.userRoles = localStorage.getItem('actions') as unknown as string[]
    return this.userRoles.includes(action);
  }

  setUserRoles(roles: string[]): void {
    this.userRoles = roles;
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/cognito/login`;
    localStorage.setItem('loginTime', new Date().getTime().toString());

    let body = {
      email,
      password
    }
    return this.http.post(url, body);
  }

  setPassword(email: string, new_password: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/cognito/new-password?email=${email}&new_password=${new_password}&session=${token}`
    return this.http.post(url, {});
  }

  logout(): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/logout`;

    localStorage.removeItem('loginTime');
    this.clearToken();

    return this.http.post(url, {}, { headers });
  }

  isAuthenticated(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    
    if (!loginTime) {
      return false;
    }

    const now = new Date().getTime();
    const elapsedTime = now - parseInt(loginTime, 10);

    if (elapsedTime > this.TOKEN_EXPIRY_TIME) {
      setTimeout(() => {
        this.ngZone.run(() => this.showLogoutWarning());
      }, 500)
      this.logout(); // Automatically log out if the session has expired
      return false;
    }

    return true; // Session is still valid
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login'])
  }


  storeEmailTemp(email: string, token: string): void {
    localStorage.setItem('email', email );
    localStorage.setItem('sessionToken', token);
  }

  showLogoutWarning(): void {
    this.modal.warning({
      nzTitle: 'Session Expired',
      nzContent: 'You have been logged out after 2 Hours. You will be redirected to the login page.',
      nzOkText: 'OK',
      nzOnOk: () => this.logout()
    });
  }
}
