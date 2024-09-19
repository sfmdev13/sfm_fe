import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategories, IRootAllRoles, IRootCatContact, IRootCustomer, IRootEmployee, IRootSupplier, IRootUserByRole } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;
  private provinceUrl = 'assets/wilayah/provinces.json';
  private regencyUrl = 'assets/wilayah/regencies.json';
  
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

  private refreshGetCategories = new BehaviorSubject<void>(undefined);
  refreshGetCategories$ = this.refreshGetCategories.asObservable();

  private refreshGetRoles = new BehaviorSubject<void>(undefined);
  refreshGetRoles$ = this.refreshGetRoles.asObservable();

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

  triggerRefreshCategories(){
    this.refreshGetCategories.next();
  }

  triggerRefreshEmployee(){
    this.refreshGetEmployee.next();
  }

  triggerRefreshRoles(){
    this.refreshGetRoles.next();
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

    let httpParams = new HttpParams()
    .set('type', params.type)
    .set('status', params.status)
    .set('sort_by', params.sort_by)
    .set('loyal_customer', params.loyal_customer)
    .set('customer_sector', params.customer_sector)
    .set('customer_firm', params.customer_firm)
    .set('province', params.province)
    .set('city', params.city)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/filter-customer`

    return this.http.post<IRootCustomer>(url, {}, { headers, params: httpParams });
  }

  filterSupplier(params: any, page: number, per_page: number): Observable<IRootSupplier>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let httpParams = new HttpParams()
    .set('type', params.type)
    .set('status', params.status)
    .set('sort_by', params.sort_by)
    .set('supplier_product', params.supplier_product)
    .set('supplier_source', params.supplier_source)
    .set('province', params.province)
    .set('city', params.city)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/filter-supplier`

    return this.http.post<IRootSupplier>(url, {}, { headers, params: httpParams });
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

  getCustomerSector(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/customer-sector`

    return this.http.get<ICategories>(url, { headers })
  }


  createCustomerSector(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/customer-sector?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editCustomerSector(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/customer-sector?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  
  deleteCustomerSector(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/customer-sector?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getCustomerFirm(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/customer-firm`

    return this.http.get<ICategories>(url, { headers })
  }

  createCustomerFirm(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/customer-firm?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editCustomerFirm(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/customer-firm?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteCustomerFirm(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/customer-firm?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getSupplierProduct(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/supplier-product`

    return this.http.get<ICategories>(url, { headers })
  }

  createSupplierProduct(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/supplier-product?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editSupplierProduct(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/supplier-product?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteSupplierProduct(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/supplier-product?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getSupplierSource(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/supplier-source`

    return this.http.get<ICategories>(url, { headers })
  }

  createSupplierSource(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/supplier-source?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editSupplierSource(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/supplier-source?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteSupplierSource(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/supplier-source?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getProvinces(): Observable<any> {
    return this.http.get(this.provinceUrl);
  }
  
  getRegencies(): Observable<any> {
    return this.http.get(this.regencyUrl);
  }

  getRegenciesByProvince(provinceId: number): Observable<any> {
    return new Observable(observer => {
      this.getRegencies().subscribe((regencies: any[]) => {
        const filteredRegencies = regencies.filter(regency => regency.province_id === provinceId);
        observer.next(filteredRegencies);
        observer.complete();
      });
    });
  }

  createRole(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-role`;
    return this.http.post<any>(url, body ,{ headers })
  }

  searchRole(status: string, page: number, per_page: number): Observable<IRootAllRoles>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search-roles?search=${status}&page=${page}&per_page=${per_page}`

    return this.http.post<IRootAllRoles>(url, {}, { headers });
  }

  editRole(body: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/edit-role`;
    return this.http.post<any>(url, body ,{ headers })
  }

  getUserByRole(roleId: string, page: number, per_page: number): Observable<IRootUserByRole> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/user-byrole?role_id=${roleId}&page=${page}&per_page=${per_page}`;
    return this.http.get<IRootUserByRole>(url, { headers })
  }

  searchUserByRole(search: string, roleId: string, page: number, per_page: number): Observable<IRootUserByRole>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search/user-byrole?search=${search}&role_id=${roleId}&page=${page}&per_page=${per_page}`;
    return this.http.post<IRootUserByRole>(url, { headers })
  }


  assignRole(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/assign-role`;
    return this.http.post<IRootUserByRole>(url, body ,{ headers })
  }

  deleteRole(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-role?id=${id}`;
    return this.http.post<any>(url, {} ,{ headers })
  }

  createEmployee(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/cognito/register`;
    return this.http.post<any>(url, body ,{ headers })
  }

  udpateEmployee(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-employee`;
    return this.http.post<any>(url, body ,{ headers })
  }
}
