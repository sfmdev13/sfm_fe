import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
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
  productCat$!: Observable<ICategories>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  dataDetail: IDataInventory = {} as IDataInventory;

  filterForm: FormGroup;

  filtered: boolean = false;

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
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    unit_id: ['', Validators.required],
    price_list: ['', Validators.required],
    discount: [0, Validators.required],
    price_factor: ['', Validators.required],
    product_cost: [{value: 0, disabled: true}],
    selling_price: [{value: 0, disabled: true}],
    qty: [{value: 0, disabled: true}],
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    supplier_id: ['', [Validators.required]],
    status: [1, [Validators.required]],
    supplier_product_id: ['', [Validators.required]],
    discount_price: [0, [Validators.required]],
    discount_type: ['percent', [Validators.required]],
    tax: [0, [Validators.required]]
  })

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService
  ) { 
    
    this.filterForm = this.fb.group({
      status: [''],
      supplier_product: [''],
      supplier: [''],
      supplier_source: [''],
      sort_by: ['']
    })
   }

  ngOnInit(): void {

    this.inventoryForm.get('discount_type')?.valueChanges.subscribe((res) => {
       if(res === 'percent'){
        this.inventoryForm.patchValue({discount_price: 0});
       }

       if(res === 'price'){
        this.inventoryForm.patchValue({discount: 0})
       }
    })

    this.source$ = this.apiSvc.getSupplierSource();

    this.filterForm.get('supplier_source')?.valueChanges.subscribe((value) => {
      this.supplier$ = this.apiSvc.getSupplierBySource(value);
    })

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
        tap((res) => {
          this.unitList = res;
      
          this.inventoryForm.get('unit_id')?.valueChanges.subscribe((value) => {
            if (this.unitList?.data && value) {
              const selectedUnit = this.unitList.data.filter((u) => u.id === value);
              if (selectedUnit.length > 0) {
                this.getFormattedLabel(selectedUnit[0].measurement, selectedUnit[0].unit);
              }
            }
          });
        })
      );
  
    })

    this.inventoryForm.get('supplier_product_id')?.valueChanges.subscribe((value) => {
      if(value !== ''){
        this.supplier$ = this.apiSvc.getSupplierByProduct(value);
      }
    })

    this.inventoryForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.inventoryForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.productCat$ = this.apiSvc.getSupplierProduct();

    this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
      tap((res) => {
        this.unitList = res;
    
        this.inventoryForm.get('unit_id')?.valueChanges.subscribe((value) => {
          if (this.unitList?.data && value) {
            const selectedUnit = this.unitList.data.filter((u) => u.id === value);
            if (selectedUnit.length > 0) {
              this.getFormattedLabel(selectedUnit[0].measurement, selectedUnit[0].unit);
            }
          }
        });
      })
    );


    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res.filter((p: any) => p.pic_id === this.pic_id);

        this.inventoryForm.get('pic')?.valueChanges.subscribe((value) => {
          if(value){
            this.filteredListOfPic = this.listOfPic.filter((pic: any) => value.includes(pic.pic_id));
    
            if(!value.includes(this.inventoryForm.get('is_pic_internal')?.value)){
              this.inventoryForm.patchValue({is_pic_internal: ''})
            }
          }
    
        })
      })
    )

    this.getInventory();

    this.apiSvc.refreshGetInventory$.subscribe(() => {
      this.getInventory();
    })

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.inventory$ = this.apiSvc.searchInventory(search, this.currentPage, this.pageSize).pipe(
        tap(res => {
          this.totalInventories = res.data.length;
          this.currentPage = res.pagination.current_page;
          this.totalAll = res.pagination.total;
        })
      );
    });

    //trigger update product cost
    this.inventoryForm.get('discount')?.valueChanges.subscribe(() => this.updateProductCost());
    this.inventoryForm.get('price_list')?.valueChanges.subscribe(() => this.updateProductCost());
    this.inventoryForm.get('discount_price')?.valueChanges.subscribe(() => this.updateProductCost());
    this.inventoryForm.get('tax')?.valueChanges.subscribe(() => this.updateProductCost())

    //trigger update selling price
    this.inventoryForm.get('price_factor')?.valueChanges.subscribe(() => this.updateSellingPrice());
    this.inventoryForm.get('product_cost')?.valueChanges.subscribe(() => this.updateSellingPrice());
  }

  showModalCategoryAdd(titleCat: string): void {

    this.nestedModalRef = this.modalSvc.create({
      nzTitle: ' Add Unit of Measurment',
      nzContent: EditCategoriesModalComponent,
      nzComponentParams: {
        form: this.categoryForm,
        type: titleCat
      },
      nzWidth: '500px',
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelCategoryAdd(),
          type: 'default'
        },
        {
          label: 'Confirm',
          onClick: () => this.handleCategorySubmitAdd(),
          type: 'primary'
        }
      ]
    });
  }

  handleCategorySubmitAdd(): void{

    this.spinnerSvc.show();

    if(this.categoryForm.valid){

      this.apiSvc.createUnitMeasurement(this.categoryForm.value).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Unit',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
          this.nestedModalRef?.close();
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Add Unit',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.resetDefaultForm();
        }
      })
    
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Add',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true
      })      
    }
  }

  
  handleCancelCategoryAdd(): void{
    this.nestedModalRef?.close();
    this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      unit_id: ['', Validators.required],
      price_list: ['', Validators.required],
      discount: ['', Validators.required],
      price_factor: ['', Validators.required],
      product_cost: [{value: 0, disabled: true}],
      selling_price: [{value: 0, disabled: true}],
      qty: [{value: 0, disabled: true}],
      pic: [[this.pic_id], [Validators.required]],
      is_pic_internal: ['', [Validators.required]],
      supplier_id: ['', [Validators.required]],
      status: [1, [Validators.required]],
      supplier_product_id: ['', [Validators.required]]
    })
  }

  updateSellingPrice(): void{
    const productCost = this.inventoryForm.get('product_cost')?.value || 0;
    const priceFactor = this.inventoryForm.get('price_factor')?.value || 0;
    const totalSelling: number = parseInt(productCost) * parseFloat(priceFactor)
    this.inventoryForm.get('selling_price')?.setValue(totalSelling, { emitEvent: false })
  }

  updateProductCost(): void {
    const priceList = this.inventoryForm.get('price_list')?.value || 0;
    const discount = this.inventoryForm.get('discount')?.value || 0;
    const discount_price = this.inventoryForm.get('discount_price')?.value || 0;
    const discount_type = this.inventoryForm.get('discount_type')?.value || 0;
    const tax = this.inventoryForm.get('tax')?.value || 0;
    let totalCost = this.inventoryForm.get('product_cost')?.value || 0


    if(discount_type === 'percent'){
      totalCost = parseInt(priceList) - (parseInt(priceList) * (parseFloat(discount)/100));
    }

    if(discount_type === 'price'){
      totalCost = parseInt(priceList) - parseInt(discount_price);
    }

    totalCost = parseInt(totalCost) + (parseInt(totalCost) * (parseFloat(tax)/100));

    this.inventoryForm.get('product_cost')?.setValue(totalCost, { emitEvent: false });
  }


  refreshTable(): void{
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.resetDefaultForm();
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
    this.modal_type = 'Edit'

    this.inventoryForm.patchValue({
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      unit_id: data.unit_id,
      product_cost: parseInt(data.product_cost),
      selling_price: parseInt(data.selling_price),
      qty: data.qty,
      supplier_product_id: data.supplier_product_id,
      supplier_id: data.supplier_id,
      status:data.status,
      price_list: parseInt(data.price_list),
      discount: parseFloat(data.discount),
      price_factor: parseFloat(data.price_factor),
      discount_price: parseInt(data.discount_price),
      discount_type: data.discount_type,
      tax: parseFloat(data.tax)
    })

    this.getFormattedLabel(data.unit.measurement, data.unit.unit);
    
    //extract pic id
    const picIds = data.pic.map(item => item.pic_id);

    //find pic internal id
    const isPicInternalId = data.pic.filter(item => item.is_pic_internal === 1);

    this.inventoryForm.patchValue({
      pic: picIds,
      is_pic_internal: isPicInternalId[0].pic_id
    });

    this.isVisibleEdit = true;
  }

  showModalDuplicate(data: IDataInventory): void{

    this.modal_type = 'duplicate'

    this.inventoryForm.patchValue({
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      unit_id: data.unit_id,
      product_cost: parseInt(data.product_cost),
      selling_price: parseInt(data.selling_price),
      qty: data.qty,
      supplier_product_id: data.supplier_product_id,
      supplier_id: data.supplier_id,
      status:data.status,
      price_list: parseInt(data.price_list),
      discount: parseFloat(data.discount),
      price_factor: parseFloat(data.price_factor)
    })

    this.getFormattedLabel(data.unit.measurement, data.unit.unit);
    
    //extract pic id
    const picIds = data.pic.map(item => item.pic_id);

    //find pic internal id
    const isPicInternalId = data.pic.filter(item => item.is_pic_internal === 1);

    this.inventoryForm.patchValue({
      pic: picIds,
      is_pic_internal: isPicInternalId[0].pic_id
    });

    this.isVisibleAdd = true;
  }

  showModalAdd(): void {
    this.resetDefaultForm();
    this.modal_type = 'Add'
    this.isVisibleAdd = true;
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = parseInt(id);
    this.isVisibleDelete = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show();
    
    if(this.inventoryForm.valid){
      const picComplete = this.inventoryForm.get('pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.inventoryForm.get('is_pic_internal')!.value ? 1 : 0
      }));
  

      let body = {
        id: this.inventoryForm.get('id')?.value,
        name: this.inventoryForm.get('name')?.value,
        code: this.inventoryForm.get('code')?.value,
        description: this.inventoryForm.get('description')?.value,
        unit_id: this.inventoryForm.get('unit_id')?.value,
        supplier_product_id: this.inventoryForm.get('supplier_product_id')?.value,
        supplier_id: this.inventoryForm.get('supplier_id')?.value,
        discount: this.inventoryForm.get('discount')?.value.toString(),
        price_list: this.inventoryForm.get('price_list')?.value,
        price_factor: this.inventoryForm.get('price_factor')?.value,
        status: this.inventoryForm.get('status')?.value,
        pic_new: picComplete,
        discount_type: this.inventoryForm.get('discount_type')?.value,
        discount_price: this.inventoryForm.get('discount_price')?.value.toString(),
        tax: this.inventoryForm.get('tax')?.value.toString()
      }

      this.apiSvc.updateInventory(body).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Inventory',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshInventory()
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Update Inventory',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.isVisibleEdit = false;
          this.spinnerSvc.hide()
        }
      })
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Update',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true
      })
    }
  }

  handleSubmitAdd(): void{

    this.spinnerSvc.show();

    if(this.inventoryForm.valid){

      const picComplete = this.inventoryForm.get('pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.inventoryForm.get('is_pic_internal')!.value ? 1 : 0
      }));
  

      let body = {
        name: this.inventoryForm.get('name')?.value,
        code: this.inventoryForm.get('code')?.value,
        description: this.inventoryForm.get('description')?.value,
        unit_id: this.inventoryForm.get('unit_id')?.value,
        supplier_product_id: this.inventoryForm.get('supplier_product_id')?.value,
        supplier_id: this.inventoryForm.get('supplier_id')?.value,
        discount: this.inventoryForm.get('discount')?.value.toString(),
        price_list: this.inventoryForm.get('price_list')?.value,
        price_factor: this.inventoryForm.get('price_factor')?.value,
        status: this.inventoryForm.get('status')?.value,
        pic: picComplete,
        discount_type: this.inventoryForm.get('discount_type')?.value,
        discount_price: this.inventoryForm.get('discount_price')?.value.toString(),
        tax: this.inventoryForm.get('tax')?.value.toString()
      }


      this.apiSvc.createInventory(body).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Inventory',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshInventory()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Add Inventory',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.spinnerSvc.hide();
        }
      })
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Add',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true
      }) 
    }
  }

  handleSubmitDelete(): void{

    this.apiSvc.deleteContactType(this.selectedIdDelete).subscribe({
      next:() => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Delete Category',
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

  handleCancelEdit(): void {
    this.modal_type = '';
    this.isVisibleEdit = false;
  }

  handleCancelAdd(): void{
    this.modal_type = '';
    this.isVisibleAdd = false;
  }

  handleCancelDelete(): void{
    this.isVisibleDelete = false;
  }

  resetDefaultForm(): void{
    this.inventoryForm.patchValue({
      id:'',
      name: '',
      code: '',
      description: '',
      unit_id: '',
      price_list: '',
      discount: '',
      price_factor: '',
      product_cost: 0,
      selling_price: 0,
      qty: 0,
      pic: [this.pic_id],
      is_pic_internal: '',
      supplier_id: '',
      status: 1,
      supplier_product_id: '',
      discount_price: 0,
      discount_type: 'percent',
      tax: 0
    })
  }
}
