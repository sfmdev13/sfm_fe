import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRootCatContact, IRootCustomer } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient
  ) { }

  private profileSubject = new BehaviorSubject<any>(null);

  private refreshGetCustomer = new BehaviorSubject<void>(undefined);
  refreshGetCustomer$ = this.refreshGetCustomer.asObservable();

  private filteredCustomerDataSubject = new BehaviorSubject<IRootCustomer>({} as IRootCustomer);
  filteredCustomerData$ = this.filteredCustomerDataSubject.asObservable();

  private isFiltered = new BehaviorSubject<boolean>(false);
  isFiltered$ = this.isFiltered.asObservable();

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

  triggerRefreshCustomers() {
    this.refreshGetCustomer.next();
  }

  setFilteredCustomerData(data: IRootCustomer) {
    this.filteredCustomerDataSubject.next(data);
    this.isFiltered.next(true);
  }

  clearFilter() {
    this.isFiltered.next(false);
  }

  getCustomer(page: number, per_page: number): Observable<IRootCustomer>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/customers?page=${page}&per_page=${per_page}`

    return this.http.get<IRootCustomer>(url, {headers});
  }
  
  getCategoryCP(): Observable<IRootCatContact>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/customer-category`;

    return this.http.get<IRootCatContact>(url, { headers })
  }

  createCustomer(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-customer`;

    return this.http.post<any>(url, body, {headers})
  }

  updateCustomer(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-customer`;
    return this.http.post<any>(url, body, {headers})
  }

  deleteCustomer(id: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-customer?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  filterCustomer(params: any, page: number, per_page: number): Observable<IRootCustomer>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/filter-customer?type=${params.type}&status=${params.status}&sort_by=${params.sort_by}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootCustomer>(url, {}, { headers });
  }
}
