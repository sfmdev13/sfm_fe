import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { AddAssemblyComponent } from 'src/app/components/add-assembly/add-assembly.component';
import { FilterPurchaseOrderComponent } from 'src/app/components/filter-purchase-order/filter-purchase-order.component';
import { IDataInventory, ICategories, IDataPurchaseOrder, IRootUnit, IRootAssembly, IDataAssembly } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.scss']
})
export class AssemblyComponent implements OnInit {
  assemblyInventory$!: Observable<IRootAssembly>

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
  
  supplier$!: Observable<any>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  dataDetail: IDataInventory = {} as IDataInventory;

  filtered: boolean = false;

  filterParams: any;

  currentDate = new Date();

  inventoryList: any;
  assemblyList: any;

  constructor(
    private apiSvc: ApiService,
    private fb: UntypedFormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService,
    private drawerService: NzDrawerService
  ) { }

  ngOnInit(): void {

    this.apiSvc.getInventoryList().subscribe((res) => {
      this.inventoryList = res
    })

    this.apiSvc.getAssemblyList().subscribe((res) => {
      this.assemblyList = res
    })


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

    this.getAssemblyInventory();

    this.apiSvc.refreshGetAssembly$.subscribe(() => {
      this.getAssemblyInventory();
    })

    // this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged()
    // ).subscribe(search => {
    //   this.purchaseOrder$ = this.apiSvc.searchPurchaseOrder(search, this.currentPage, this.pageSize).pipe(
    //     tap(res => {
    //       this.total = res.data.length;
    //       this.currentPage = res.pagination.current_page;
    //       this.totalAll = res.pagination.total;
    //     })
    //   );
    // });
  }

  changeStatus(status: string, id: any): void{
    this.spinnerSvc.show();

    let body = { status, id }

    this.apiSvc.changePOStatus(body).subscribe({
      next: () => {
        this.modalSvc.closeAll();
        this.spinnerSvc.hide();
        this.apiSvc.triggerRefreshPurchaseOrder();
      },
      error: () => {
        this.spinnerSvc.hide()
        this.modalSvc.closeAll()
      }
    })
  }

  handleChangeStatus(status: string, id: any): void{
    this.modalSvc.warning({
      nzTitle: 'Action Cannot Be Undone',
      nzContent: 'You are about to permanently change purchase order status. This action cannot be undone. Do you want to proceed?',
      nzCentered: true,
      nzOkText: 'Confirm',
      nzOkType: 'primary',
      nzOnOk: () => this.changeStatus(status, id),
      nzCancelText: 'Cancel',
      nzOnCancel: () => this.modalSvc.closeAll()
    });
  }


  refreshTable(): void{
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.getAssemblyInventory();
  }

  submitFilter(): void{
    // this.getFilteredInventory();
    this.isVisibleFilter=false;
  }

  getFilteredPO(){
    // this.purchaseOrder$ = this.apiSvc.filterPurchaseOrder(this.filterParams, this.currentPage, this.pageSize).pipe(
    //   tap(res => {
    //     this.total= res.data.length;
    //     this.currentPage = res.pagination.current_page;
    //     this.totalAll = res.pagination.total
    //     this.filtered = true
    //   })
    // )
  }

  showFilter(): void{
    const poModal = this.modalSvc.create({
      nzTitle: 'Filter Purchase Order',
      nzContent: FilterPurchaseOrderComponent,
      nzCentered: true,
      nzData: {
        filteredPO: this.filtered
      }
    })

    poModal.afterClose.subscribe(result => {
      if(result){
        this.filterParams = result
        this.getFilteredPO()
      }
    })
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
    //   this.getFilteredPO();
    // } else {
    //   this.getAssemblyInventory();
    // }
    
    this.getAssemblyInventory();
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };

  getFormattedLabel(measurement: string, unit: string): void {

    if(unit){
      this.formattedLabel = `${measurement}<sup>${unit}</sup>`;
      return;
    }

    this.formattedLabel =  `${measurement}`;
  }

  getAssemblyInventory(): void{
    this.assemblyInventory$ = this.apiSvc.getAssemblyInventories(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  showModalEdit(data: IDataAssembly): void {
    this.modal_type = 'edit'
    this.drawerService.create({
      nzTitle: 'Edit Assembly Inventory',
      nzContent: AddAssemblyComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        modal_type: this.modal_type,
        dataDetail: data,
        inventoryList: this.inventoryList,
        assemblyList: this.assemblyList
      }
    });
  }

  showModalDuplicate(data: IDataAssembly): void{
    this.modal_type = 'duplicate'
    this.drawerService.create({
      nzTitle: 'Add Assembly Inventory',
      nzContent: AddAssemblyComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        modal_type: this.modal_type,
        dataDetail: data,
        inventoryList: this.inventoryList,
        assemblyList: this.assemblyList
      }
    });
  }

  showModalAdd(): void {
    this.modal_type = 'add'
    this.drawerService.create({
      nzTitle: 'Add Assembly Inventory',
      nzContent: AddAssemblyComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        modal_type: this.modal_type,
        inventoryList: this.inventoryList,
        assemblyList: this.assemblyList
      }
    });
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = parseInt(id);
    this.isVisibleDelete = true;
  }
}
