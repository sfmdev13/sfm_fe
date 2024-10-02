import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { AddPurchaseOrderComponent } from 'src/app/components/add-purchase-order/add-purchase-order.component';
import { IRootUnit, ICategories, IDataInventory, IRootPurchaseOrder, IDataPurchaseOrder } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrder$!: Observable<IRootPurchaseOrder>

  isVisibleDelete = false;
  isVisibleFilter = false;

  modal_type = 'Add';

  total: number = 0;

  selectedIdDelete: number = 0;

  searchEmp: string = '';

  status: number = 1;

  pic_id = localStorage.getItem('pic_id')!;

  pic$!: Observable<any>;

  listOfPic: any;
  filteredListOfPic: any;

  unit$!: Observable<IRootUnit>;

  unitList: IRootUnit = {} as IRootUnit

  formattedLabel: string = '';

  formattedValueCost: number | null = 0;

  formattedValueSelling: number | null = 0;

  supplier$!: Observable<any>;
  productCat$!: Observable<ICategories>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  dataDetail: IDataInventory = {} as IDataInventory;

  filterForm: FormGroup;

  filtered: boolean = false;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService,
    private drawerService: NzDrawerService
  ) { 

    this.filterForm = this.fb.group({
      status: [''],
      supplier_product: [''],
      sort_by: ['']
    })
   }

  ngOnInit(): void {

    this.productCat$ = this.apiSvc.getSupplierProduct();


    this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
      tap(res => {
        this.unitList = res;
      })
    );
    
    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res.filter((p: any) => p.pic_id === this.pic_id);
      })
    )

    this.getPurchaseOrder();

    this.apiSvc.refreshGetPurchaseOrder$.subscribe(() => {
      this.getPurchaseOrder();
    })

    // this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged()
    // ).subscribe(search => {
    //   this.inventory$ = this.apiSvc.searchInventory(search, this.currentPage, this.pageSize).pipe(
    //     tap(res => {
    //       this.totalInventories = res.data.length;
    //       this.currentPage = res.pagination.current_page;
    //       this.totalAll = res.pagination.total;
    //     })
    //   );
    // });
  }

  refreshTable(): void{
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.getPurchaseOrder();
  }

  submitFilter(): void{
    // this.getFilteredInventory();
    this.isVisibleFilter=false;
  }

  // getFilteredInventory(){
  //   this.inventory$ = this.apiSvc.filterInventory(this.filterForm.value, this.currentPage, this.pageSize).pipe(
  //     tap(res => {
  //       this.totalInventories = res.data.length;
  //       this.currentPage = res.pagination.current_page;
  //       this.totalAll = res.pagination.total
  //       this.filtered = true
  //     })
  //   )
  // }

  showFilter(): void{
    this.isVisibleFilter = true;
  }

  handleCancelFilter(): void {
    this.isVisibleFilter = false;
  }

  searchHandler(search: string){
    this.searchSubject.next(search);
  }


  pageIndexChange(page: number){
    this.currentPage = page;

    // if(this.filtered){
    //   this.getFilteredInventory();
    // } else {
    // }
    
    this.getPurchaseOrder();
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };

  updateFormattedValueSelling(value: number | null): void{
    this.formattedValueSelling = value;
  }

  updateFormattedValue(value: number | null): void {
    this.formattedValueCost = value;
  }

  getFormattedLabel(measurement: string, unit: string): void {

    if(unit){
      this.formattedLabel = `${measurement}<sup>${unit}</sup>`;
      return;
    }

    this.formattedLabel =  `${measurement}`;
  }

  getPurchaseOrder(): void{
    this.purchaseOrder$ = this.apiSvc.getPurchaseOrder(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  showModalEdit(data: IDataPurchaseOrder): void {
    this.modal_type = 'edit'
    this.drawerService.create({
      nzTitle: 'Edit Purchase',
      nzContent: AddPurchaseOrderComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzContentParams: {
        modal_type: this.modal_type,
        dataDetail: data
      }
    });
  }

  showModalDuplicate(data:IDataPurchaseOrder): void{
    this.modal_type = 'duplicate'
    this.drawerService.create({
      nzTitle: 'Add Purchase',
      nzContent: AddPurchaseOrderComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzContentParams: {
        modal_type: this.modal_type,
        dataDetail: data
      }
    });
  }

  showModalAdd(): void {
    this.modal_type = 'add'
    this.drawerService.create({
      nzTitle: 'Add Purchase',
      nzContent: AddPurchaseOrderComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzContentParams: {
        modal_type: this.modal_type
      }
    });
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = parseInt(id);
    this.isVisibleDelete = true;
  }
}
