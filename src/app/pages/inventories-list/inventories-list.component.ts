import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormArray } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { AddInventoriesComponent } from 'src/app/components/add-inventories/add-inventories.component';
import { EditCategoriesModalComponent } from 'src/app/components/categories-setting/edit-categories-modal/edit-categories-modal.component';
import { ICategories, IDataCategories, IDataInventory, IRootInventory, IRootUnit } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-inventories-list',
  templateUrl: './inventories-list.component.html',
  styleUrls: ['./inventories-list.component.scss']
})
export class InventoriesListComponent implements OnInit {
  inventory$!: Observable<IRootInventory>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;
  isVisibleDetail = false;
  isVisibleFilter = false;

  modal_type = 'Add';

  totalInventories: number = 0;

  selectedIdDelete: string = '';

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
  productCat$!: Observable<ICategories>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  dataDetail: IDataInventory = {} as IDataInventory;

  filterForm: UntypedFormGroup;

  filtered: boolean = false;
  searched: boolean = false;

  searchValue: string = '';

  nestedModalRef?: NzModalRef;

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    measurement: ['', Validators.required],
    unit: [''],
    description: ['', Validators.required]
  })

  source$!: Observable<any>;


  inventoryForm = this.fb.group({
    id: [''],
    code: ['', Validators.required],
    unit_id: ['', Validators.required],
    qty: [{value: 0, disabled: true}],
    supplier_id: ['', [Validators.required]],
    status: [1, [Validators.required]],
    supplier_product_id: ['', [Validators.required]],
    tax: [0, [Validators.required]],
    sub_category: ['', Validators.required],
    manufacturer: ['', Validators.required],
    unit_report: ['', Validators.required],
    alias: ['', Validators.required],
    hs_code: ['', Validators.required],
    is_hs_code: [false],
    attachment: ['', Validators.required],
    price_list: ['', Validators.required],
    inventory_items: this.fb.array([])
  })

  constructor(
    private apiSvc: ApiService,
    private fb: UntypedFormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService
  ) { 
    
    this.filterForm = this.fb.group({
      status: [''],
      supplier_product: [''],
      // supplier: [''],
      // supplier_source: [''],
      sort_by: ['']
    })
   }

  ngOnInit(): void {

    this.source$ = this.apiSvc.getSupplierSource();

    this.getInventory();

    this.apiSvc.refreshGetInventory$.subscribe(() => {
      this.getInventory();
    })

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      
      this.searchValue = search;
      this.searched = true;
      this.getSearchedInventory();
    });

  }



  refreshTable(): void{
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.getInventory();
  }

  submitFilter(): void{
    this.getFilteredInventory();
    this.isVisibleFilter=false;
  }

  getFilteredInventory(){
    this.inventory$ = this.apiSvc.filterInventory(this.filterForm.value, this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.totalInventories = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
        this.filtered = true
      })
    )
  }

  getSearchedInventory(){
    this.inventory$ = this.apiSvc.searchInventory(this.searchValue, this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.totalInventories = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total;
      })
    );
  }

  showFilter(): void{
    this.isVisibleFilter = true;
  }

  handleCancelFilter(): void {
    this.isVisibleFilter = false;
  }

  searchHandler(search: string){
    this.searchSubject.next(search);
  }

  handleCancelDetail(): void {
    this.isVisibleDetail = false;
  }

  showModalDetail(data: IDataInventory){
    this.dataDetail = data;

    this.isVisibleDetail = true;
  }

  pageIndexChange(page: number){
    this.currentPage = page;

    if(this.filtered){
      this.getFilteredInventory();

    } else if(this.searched){
      this.getSearchedInventory();
    } else {
      this.getInventory();
    }

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

  getInventory(): void{
    this.inventory$ = this.apiSvc.getInventory(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.totalInventories = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  showModalEdit(data: IDataInventory): void {
    this.modal_type = 'edit'

    this.modalSvc.create({
      nzTitle: 'Edit Inventories',
      nzContent: AddInventoriesComponent,
      nzData: {
        modal_type: this.modal_type,
        dataDetail: data
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzCentered: true,
      nzWidth: '80vw'
    });
  }

  showModalDuplicate(data: IDataInventory): void{
    this.modal_type = 'duplicate'
    
    this.modalSvc.create({
      nzTitle: 'Add Inventories',
      nzContent: AddInventoriesComponent,
      nzData: {
        modal_type: this.modal_type,
        dataDetail: data
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzCentered: true,
      nzWidth: '80vw'
    });
  }

  showModalAdd(): void {

    this.modal_type = 'add';

    this.modalSvc.create({
      nzTitle: 'Add Inventories',
      nzContent: AddInventoriesComponent,
      nzData: {
        modal_type: this.modal_type
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzCentered: true,
      nzWidth: '80vw'
    });
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = id;
    this.isVisibleDelete = true;
  }

  handleSubmitDelete(): void{

    this.apiSvc.deleteInventory(this.selectedIdDelete).subscribe({
      next:() => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Delete Inventory',
          nzOkText: 'Ok',
          nzCentered: true
        })


        this.apiSvc.triggerRefreshCategories();
        this.isVisibleDelete = false;
      },
      error:(error) => {
        this.spinnerSvc.hide();

        this.modalSvc.error({
          nzTitle: 'Unable to Delete',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      }
    })
  }


  handleCancelDelete(): void{
    this.isVisibleDelete = false;
  }
}
