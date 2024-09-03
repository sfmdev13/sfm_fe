import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private apiUrl = 'http://34.230.59.242/api/v1';

  constructor(private http: HttpClient, private router: Router) {}

  // Example function to simulate login and store token
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/cognito/login?email=${email}&password=${password}`;
    return this.http.post(url, {});
  }

  logout(): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {}, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
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
}
