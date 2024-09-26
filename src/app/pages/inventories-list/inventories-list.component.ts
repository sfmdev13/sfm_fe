import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { ICategories, IDataCategories, IRootSupplier, IRootUnit } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-inventories-list',
  templateUrl: './inventories-list.component.html',
  styleUrls: ['./inventories-list.component.scss']
})
export class InventoriesListComponent implements OnInit {
  contactType$!: Observable<ICategories>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  totalInventories: number = 0;

  inventoryForm: FormGroup;

  inventoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    unit_id: ['', Validators.required],
    product_cost: ['', Validators.required],
    selling_price: ['', Validators.required],
    qty: [{value: '', disabled: true}],
    pic: [[''], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    supplier_id: ['', [Validators.required]]
  })

  selectedIdDelete: number = 0;

  searchEmp: string = '';

  pageSize: number = 5;

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


  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService
  ) { 
    this.inventoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      unit_id: ['', Validators.required],
      product_cost: ['', Validators.required],
      selling_price: ['', Validators.required],
      qty: [{value: 0, disabled: true}],
      pic: [[this.pic_id], [Validators.required]],
      is_pic_internal: ['', [Validators.required]],
      supplier_id: ['', [Validators.required]],
      status: [1, [Validators.required]],
      supplier_product_id: ['', [Validators.required]]
    })
   }

  ngOnInit(): void {

    this.inventoryForm.get('supplier_product_id')?.valueChanges.subscribe((value) => {
      this.supplier$ = this.apiSvc.getSupplierByProduct(value);
    })

    this.inventoryForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.inventoryForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.productCat$ = this.apiSvc.getSupplierProduct();

    this.inventoryForm.get('unit_id')?.valueChanges.subscribe((value) => {
      const selectedUnit = this.unitList.data.filter(u => u.id === value);
      this.getFormattedLabel(selectedUnit[0].measurement, selectedUnit[0].unit)
    })

    this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
      tap(res => {
        this.unitList = res;
      })
    );
    
    this.inventoryForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter((pic: any) => value.includes(pic.pic_id));

      if(!value.includes(this.inventoryForm.get('is_pic_internal')?.value)){
        this.inventoryForm.patchValue({is_pic_internal: ''})
      }
    })


    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res.filter((p: any) => p.pic_id === this.pic_id);
      })
    )

    this.getContactType();

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getContactType();
    })
  }

  // Formatter function to display formatted value in the input
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

  getContactType(): void{
    this.contactType$ = this.apiSvc.getContactType().pipe(
      tap(res => {
        this.totalInventories = res.data.length
      })
    );
  }

  showModalEdit(data: IDataCategories): void {
    this.modal_type = 'Edit'

    this.inventoryForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description
    })

    this.isVisibleEdit = true;
  }

  showModalAdd(): void {
    this.modal_type = 'Add'
    this.isVisibleAdd = true;
  }

  showModalDelete(id: number): void{
    this.selectedIdDelete = id;
    this.isVisibleDelete = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show();
    
    if(this.inventoryForm.valid){
      this.apiSvc.editContactType(this.inventoryForm.value.id,this.inventoryForm.value.name, this.inventoryForm.value.description).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Category',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Update',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.isVisibleEdit = false;
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
        product_cost: this.inventoryForm.get('product_cost')?.value,
        selling_price: this.inventoryForm.get('selling_price')?.value,
        status: this.inventoryForm.get('status')?.value,
        pic: picComplete
      }

      this.apiSvc.createInventory(body).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Category',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Add Category',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.inventoryForm.reset();
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
    this.isVisibleEdit = false;
  }

  handleCancelAdd(): void{
    this.isVisibleAdd = false;
    this.inventoryForm.reset();
  }

  handleCancelDelete(): void{
    this.isVisibleDelete = false;
  }
}
