import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient
  ) { }

  private profileSubject = new BehaviorSubject<any>(null); 

  getProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/profile`

    return this.http.get(url, { headers }).pipe(
      tap((profile) => {
        this.profileSubject.next(profile); // Store profile data
      })
    );
  }

  get ProfileData$(): Observable<any> {
    return this.profileSubject.asObservable(); // Return observable to subscribe to profile data
  }
  
}
