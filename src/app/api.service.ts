import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategories, IRootAllRoles, IRootCatContact, IRootCustomer, IRootEmployee, IRootSupplier } from './interfaces';

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

  private refreshGetSupplier = new BehaviorSubject<void>(undefined);
  refreshGetSupplier$ = this.refreshGetSupplier.asObservable();

  private refreshGetEmployee = new BehaviorSubject<void>(undefined);
  refreshGetEmployee$ = this.refreshGetEmployee.asObservable();

  private filteredCustomerDataSubject = new BehaviorSubject<IRootCustomer>({} as IRootCustomer);
  filteredCustomerData$ = this.filteredCustomerDataSubject.asObservable();

  private isFiltered = new BehaviorSubject<boolean>(false);
  isFiltered$ = this.isFiltered.asObservable();

  private refreshGetLoyalCustomer = new BehaviorSubject<void>(undefined);
  refreshGetLoyalCustomer$ = this.refreshGetLoyalCustomer.asObservable();

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

  triggerRefreshSuppliers() {
    this.refreshGetSupplier.next();
  }

  triggerRefreshLoyalCustomer(){
    this.refreshGetLoyalCustomer.next();
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

  filterSupplier(params: any, page: number, per_page: number): Observable<IRootSupplier>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/filter-supplier?type=${params.type}&status=${params.status}&sort_by=${params.sort_by}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootSupplier>(url, {}, { headers });
  }

  filterEmployee(params: any, page: number, per_page: number): Observable<IRootEmployee>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/filter-employee?role_id=${params.role_id}&status=${params.status}&sort_by=${params.sort_by}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootEmployee>(url, {}, { headers });
  }


  searchSupplier(params: any, page: number, per_page: number): Observable<IRootSupplier>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search-supplier?search=${params}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootSupplier>(url, {}, { headers });
  }
  
  
  searchCustomer(params: any, page: number, per_page: number): Observable<IRootCustomer>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search-customer?search=${params}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootCustomer>(url, {}, { headers });
  }

  searchEmployee(params: any, page: number, per_page: number): Observable<IRootEmployee>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search-employee?search=${params}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootEmployee>(url, {}, { headers });
  }

  getSupplier(page: number, per_page: number): Observable<IRootSupplier>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/suppliers?page=${page}&per_page=${per_page}`

    return this.http.get<IRootSupplier>(url, { headers })
  }

  getPic():Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const url = `${this.apiUrl}/pic`;

    return this.http.get<any>(url, { headers }).pipe(
      map(response => response.data)
    )
  }

  createSupplier(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-supplier`;

    return this.http.post<any>(url, body, {headers})
  }

  updateSupplier(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-supplier`;

    return this.http.post<any>(url, body, {headers})
  }

  deleteSupplier(id: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-supplier?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getEmployee(page: number, per_page: number): Observable<IRootEmployee>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/employee?page=${page}&per_page=${per_page}`

    return this.http.get<IRootEmployee>(url, { headers } )
  }
  
  getAllRole(): Observable<IRootAllRoles>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/all-roles`

    return this.http.get<IRootAllRoles>(url, { headers })
  }

  getLoyalCustomer(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/loyal-customer`

    return this.http.get<ICategories>(url, { headers })
  }

  createLoyalCustomer(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/loyal-customer?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editLoyalCustomer(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/loyal-customer?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteLoyalCustomer(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/loyal-customer?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }
}
