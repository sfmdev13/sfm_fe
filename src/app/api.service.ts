import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategories, ICustomerDetail, IQuotation, IRootAllInventories, IRootAllRoles, IRootCatContact, IRootCustomer, IRootDetailQuotation, IRootDivision, IRootEmployee, IRootInventory, IRootProject, IRootPurchaseOrder, IRootQuotation, IRootSupplier, IRootUnit, IRootUserByRole } from './interfaces';

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

  private refreshGetDivision = new BehaviorSubject<void>(undefined);
  refreshGetDivision$ = this.refreshGetDivision.asObservable();

  private refreshGetInventory = new BehaviorSubject<void>(undefined);
  refreshGetInventory$ = this.refreshGetInventory.asObservable();

  private refreshGetPurchaseOrder = new BehaviorSubject<void>(undefined);
  refreshGetPurchaseOrder$ = this.refreshGetPurchaseOrder.asObservable();

  private refreshGetProjects = new BehaviorSubject<void>(undefined);
  refreshGetProjects$ = this.refreshGetProjects.asObservable();

  private refreshGetAssembly = new BehaviorSubject<void>(undefined);
  refreshGetAssembly$ = this.refreshGetAssembly.asObservable();

  private refreshGetQuotation = new BehaviorSubject<void>(undefined);
  refreshGetQuotation$ = this.refreshGetQuotation.asObservable();

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

  triggerRefreshDivision(){
    this.refreshGetDivision.next();
  }

  triggerRefreshInventory(){
    this.refreshGetInventory.next();
  }

  triggerRefreshPurchaseOrder(){
    this.refreshGetPurchaseOrder.next();
  }

  triggerRefreshProject(){
    this.refreshGetProjects.next();
  }

  triggerRefreshAssembly(){
    this.refreshGetAssembly.next();
  }

  triggerRefreshQuotation(){
    this.refreshGetQuotation.next();
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

    const url = `${this.apiUrl}/filter-employee?role_id=${params.role_id}&status=${params.status}&sort_by=${params.sort_by}&division_id=${params.division_id}&page=${page}&per_page=${per_page}`

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


  createCustomerSector(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/customer-sector`

    return this.http.post<any>(url, body , { headers })
  }

  editCustomerSector(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/customer-sector`

    return this.http.post<any>(url, body , { headers })
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

  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>(this.provinceUrl).pipe(
      map((provinces: any[]) => 
        provinces.sort((a, b) => a.province.localeCompare(b.province))
      )
    );
  }
  
  getRegencies(): Observable<any[]> {
    return this.http.get<any[]>(this.regencyUrl).pipe(
      map((regencies: any[]) => 
        regencies.sort((a, b) => a.regency.localeCompare(b.regency))
      )
    );
  }

  getRegenciesByProvince(provinceId: number): Observable<any> {
    return new Observable(observer => {
      this.getRegencies().subscribe((regencies: any[]) => {
        const filteredRegencies = regencies.filter(regency => regency.province_id === provinceId).sort((a, b) => a.regency.localeCompare(b.regency));
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

  deleteEmployee(id: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/cognito/delete-employee?employee_id=${id}`;
    return this.http.post<any>(url, {} , { headers })
  }

  getEmployeeContract(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    
    const url = `${this.apiUrl}/employee-contract`;
    return this.http.get<ICategories>(url, { headers })

  }


  createEmployeeContract(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/employee-contract?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editEmployeeContract(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/employee-contract?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteEmployeeContract(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/employee-contract?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getContactType(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    
    const url = `${this.apiUrl}/customer-category`;
    return this.http.get<ICategories>(url, { headers })

  }


  createContactType(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/customer-category?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editContactType(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/customer-category?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteContactType(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/customer-category?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getDivision(page: number, per_page: number): Observable<IRootDivision>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/role-division?&page=${page}&per_page=${per_page}`;
    return this.http.get<any>(url, { headers })
  }
  
  createDivision(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create-division?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editDivision(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit-division?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteDivision(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-division?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getRoleByDivision(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/division/${id}`;
    return this.http.get<any>(url, { headers })
  }

  getDivisionList(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/division-list`;
    return this.http.get<any>(url, { headers })

  }

  createUnitMeasurement(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    
    const url = `${this.apiUrl}/create-unit`;
    return this.http.post<any>(url, body ,{ headers })
  }

  getUnitMeasurement(): Observable<IRootUnit>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const url = `${this.apiUrl}/units`;
    return this.http.get<any>(url, { headers })
  }

  updateUnitMeasurment(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    
    const url = `${this.apiUrl}/update-unit`;
    return this.http.post<any>(url, body ,{ headers })
  }

  getSupplierByProduct(id: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/supplier-byproduct/${id}`;
    return this.http.get<any>(url,{ headers })
  }

  createInventory(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-inventory`;
    return this.http.post<any>(url, body , { headers })
  }

  getInventory(page: number, per_page: number): Observable<IRootInventory>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/inventory?page=${page}&per_page=${per_page}`

    return this.http.get<IRootInventory>(url, { headers } )
  }

  updateInventory(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-inventory`

    return this.http.post<any>(url, body ,{ headers } )
  }

  searchInventory(search: string, page: number, per_page: number): Observable<IRootInventory>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search-inventory?search=${search}&page=${page}&per_page=${per_page}`;
    return this.http.post<IRootInventory>(url, { headers })
  }

  filterInventory(params: any, page: number, per_page: number): Observable<IRootInventory>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let httpParams = new HttpParams()
    .set('supplier_product', params.supplier_product)
    .set('status', params.status)
    .set('sort_by', params.sort_by)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/filter-inventory`

    return this.http.post<IRootInventory>(url, {}, { headers, params: httpParams });
  }

  deleteUnit(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-unit?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getInventoryBySupplier(id: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/inventory-bysupplier/${id}`;
    return this.http.get<any>(url, { headers })
  }

  supplierList(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const url = `${this.apiUrl}/supplier-list`;
    return this.http.get<any>(url, { headers })
  }

  addPurchaseOrder(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create/po-inventory`;
    return this.http.post<any>(url, body ,{ headers })
  }

  getPurchaseOrder(page: number, per_page: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const url = `${this.apiUrl}/po-inventory?page=${page}&per_page=${per_page}`;
    return this.http.get<any>(url, { headers })
  }

  editPurchaseOrder(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update/po-inventory`;
    return this.http.post<any>(url, body ,{ headers })
  }

  searchPurchaseOrder(search: string, page: number, per_page: number): Observable<IRootPurchaseOrder>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let httpParams = new HttpParams()
    .set('search', search)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/search/po-inventory`

    return this.http.post<IRootPurchaseOrder>(url, {}, { headers, params: httpParams });
  }

  getSupplierBySource(id: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/supplier-bysource/${id}`

    return this.http.get<any>(url, { headers });
  }

  filterPurchaseOrder(params: any, page: number, per_page: number): Observable<IRootPurchaseOrder>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let httpParams = new HttpParams()
    .set('status', params.status)
    .set('supplier', params.supplier)
    .set('sort_by', params.sort_by)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/filter/po-inventory`

    return this.http.post<IRootPurchaseOrder>(url, {}, { headers, params: httpParams });
  }

  changePOStatus(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/change-postatus`

    return this.http.post<any>(url, body, { headers })
  }

  getWarehouse(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/warehouse`

    return this.http.get<any>(url, { headers })
  }

  createWarehouse(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-warehouse`

    return this.http.post<any>(url, body , { headers })
  }

  updateWarehouse(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-warehouse`

    return this.http.post<any>(url, body , { headers })
  }

  getBillingCompany(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/billing-address`

    return this.http.get<any>(url, { headers })
  }

  createBillingCompany(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create/billing-address`

    return this.http.post<any>(url, body , { headers })
  }

  updateBillingCompany(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update/billing-address`

    return this.http.post<any>(url, body , { headers })
  }

  getProjects(page: number, per_page: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/project?page=${page}&per_page=${per_page}`

    return this.http.get<any>(url, { headers })
  }

  getAllProject(): Observable<IRootProject>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/all-project`

    return this.http.get<IRootProject>(url, { headers })
  }

  createProjects(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create-project`

    return this.http.post<any>(url, body , { headers })
  }

  updateProjects(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update-project`

    return this.http.post<any>(url, body , { headers })
  }

  getCustomerList(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/customer-list`

    return this.http.get<any>(url, { headers })
  }

  getCustomerDetail(id: any): Observable<ICustomerDetail>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/customer-detail/${id}`

    return this.http.get<ICustomerDetail>(url, { headers })
  }

  getInventoryList(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/inventory-list`

    return this.http.get<any>(url, { headers })
  }

  getAssemblyInventories(page: number, per_page: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/assembly-inventory?page=${page}&per_page=${per_page}`

    return this.http.get<any>(url, { headers })
  }

  createAssembly(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create/assembly-inventory`

    return this.http.post<any>(url, body ,{ headers })
  }

  updateAssembly(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update/assembly-inventory`

    return this.http.post<any>(url, body ,{ headers })
  }

  getUnitReport(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const url = `${this.apiUrl}/unit-report`;
    return this.http.get<any>(url, { headers })
  }

  createUnitReport(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/create/unit-report`;
    return this.http.post<any>(url, body ,{ headers })
  }

  updateUnitReport(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/update/unit-report`;
    return this.http.post<any>(url, body ,{ headers })
  }

  getAssemblyList(): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/assembly-list`;
    return this.http.get<any>(url, { headers })
  }

  getAllInventories(page: number, per_page: number): Observable<IRootAllInventories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/inventory-assembly?page=${page}&per_page=${per_page}`;
    return this.http.get<IRootAllInventories>(url, { headers })
  }

  searchAllInventories(search: string,page: number, per_page: number): Observable<IRootAllInventories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/search/inventory-assembly?page=${page}&per_page=${per_page}&search=${search}`;
    return this.http.post<IRootAllInventories>(url, { headers })
  }

  
  filterAllInventories(params: any, page: number, per_page: number): Observable<IRootAllInventories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let httpParams = new HttpParams()
    .set('type', params.type)
    .set('page', page.toString())
    .set('per_page', per_page.toString());

    const url = `${this.apiUrl}/filter/inventory-assembly`

    return this.http.post<IRootAllInventories>(url, {}, { headers, params: httpParams });
  }

  getSubCategory(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/sub-category`

    return this.http.get<ICategories>(url, { headers })
  }

  createSubCategory(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/sub-category?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editSubCategory(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/sub-category?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  getManufacture(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/manufacture`

    return this.http.get<ICategories>(url, { headers })
  }

  createManufacture(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create/manufacture?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editManufacture(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/edit/manufacture?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  deleteUnitReport(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/unit-report?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  deleteManufacture(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/manufacture?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  deleteSubCategory(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/sub-category?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  deleteWarehouse(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/warehouse?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  deleteBillingAddress(id: number): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete/billing-address?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  deleteInventory(id: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/delete-inventory?id=${id}`;
    return this.http.delete<any>(url, { headers })
  }

  getSegmentation(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/segmentation`

    return this.http.get<ICategories>(url, { headers })
  }

  createSegmentation(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create-segmentation?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editSegmentation(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/update-segmentation?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  getMaterial(): Observable<ICategories>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/material`

    return this.http.get<ICategories>(url, { headers })
  }

  createMaterial(name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create-material?name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editMaterial(id: string, name: string, description: string): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/update-material?id=${id}&name=${name}&description=${description}`

    return this.http.post<any>(url, {} , { headers })
  }

  editProjectCategory(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/update/project-category`

    return this.http.post<any>(url, body , { headers })

  }

  createQuotation(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/create-quotation`

    return this.http.post<any>(url, body , { headers })
  }

  getQuotation(): Observable<IRootQuotation>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/all-quotation`

    return this.http.get<IRootQuotation>(url, { headers })
  }

  editQuotation(body: any): Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/update-quotation`

    return this.http.post<any>(url, body , { headers })
  }

  getDetailQuotation(id: any): Observable<IQuotation[]>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    const url = `${this.apiUrl}/quotation/${id}`

    return this.http.get<IRootDetailQuotation>(url, { headers }).pipe(
      map(res => res.data.quotation)
    )
  }
}
