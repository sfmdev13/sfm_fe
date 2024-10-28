import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { IRootInventory, IRootUnit, ICategories, IDataInventory, IRootUnitReport } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';
import { AddUnitReportComponent } from '../categories-setting/add-unit-report/add-unit-report.component';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-inventories',
  templateUrl: './add-inventories.component.html',
  styleUrls: ['./add-inventories.component.scss']
})
export class AddInventoriesComponent implements OnInit {


 @Input() modal_type = 'add';
 @Input() dataDetail?: IDataInventory = {} as IDataInventory;

  unit$!: Observable<IRootUnit>;
  unitReport$!: Observable<IRootUnitReport>;

  unitList: IRootUnit = {} as IRootUnit;

  formattedLabel: string = '';

  supplier$!: Observable<any>;
  productCat$!: Observable<ICategories>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

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

  categoryFormReport = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    code: ['', Validators.required],
    value: ['', Validators.required],
    unit_of_measurement_id: ['', Validators.required],
    dimension: ['', Validators.required]
  })

  inventoryForm = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    unit_id: ['', Validators.required],
    status: [1, [Validators.required]],
    supplier_product_id: ['', [Validators.required]],
    tax: [0, [Validators.required]],
    sub_category: ['', Validators.required],
    manufacturer: ['', Validators.required],
    unit_report: ['', Validators.required],
    alias: ['', Validators.required],
    hs_code: [{value: '', disabled: true}],
    source: ['local', Validators.required],
    attachment: ['', Validators.required],
    price_list: [0, Validators.required],
    part_number: ['', Validators.required],
    inventory_items: this.fb.array([])
  })

  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService,
    private modal: NzModalRef,
    private nzMsgSvc: NzMessageService
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

    this.inventoryForm.get('source')?.valueChanges.subscribe((res) => {
      if(res === 'local'){
        this.inventoryForm.get('hs_code')?.setValue('');
        this.inventoryForm.get('hs_code')?.disable();
      } else {
        this.inventoryForm.get('hs_code')?.setValue('');
        this.inventoryForm.get('hs_code')?.enable();
      }
    })

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getUnit();
      this.getUnitReport();
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

    this.getUnit();
    this.getUnitReport();
    

    this.addInventoryItem();
  }

  getUnit(){
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
  }

  getUnitReport(){
    this.unitReport$ = this.apiSvc.getUnitReport();
  }


  inventoryChangeHandler(control: FormGroup) {
    // Calculate all dependent values
    const calculateValues = () => {
        const priceList = parseInt(this.inventoryForm.get('price_list')?.value || '0');

        // Calculate total_1 based on discount_1 and price_list
        const discount1 = parseInt(control.get('discount_1')?.value || '0');
        const discountType1 = control.get('discount_type_1')?.value;
        const total1 = calculateTotal(priceList, discountType1, discount1);
        control.patchValue({ total_1: total1 }, { emitEvent: false });

        // Calculate total_2 based on discount_2 and total_1
        const discount2 = parseInt(control.get('discount_2')?.value || '0');
        const discountType2 = control.get('discount_type_2')?.value;
        const total2 = calculateTotal(total1, discountType2, discount2);
        control.patchValue({ total_2: total2 }, { emitEvent: false });

        // Calculate selling price based on total_2 and price_factor
        const priceFactor = parseInt(control.get('price_factor')?.value || '1');
        const sellingPrice = total2 * priceFactor;
        control.patchValue({ selling_price: sellingPrice }, { emitEvent: false });
    };

    // Helper function to calculate total based on discount type and value
    const calculateTotal = (basePrice: number, discountType: string, discount: number) => {
        return discountType === 'percent'
            ? basePrice - (basePrice * discount / 100)
            : basePrice - discount;
    };

    // Update calculated values when price_list changes
    this.inventoryForm.get('price_list')?.valueChanges.subscribe(() => calculateValues());

    // Recalculate totals and selling price on changes in related controls
    control.get('discount_type_1')?.valueChanges.subscribe((res) => {
      control.patchValue({discount_1: 0});
      calculateValues();
    });

    control.get('discount_type_2')?.valueChanges.subscribe(() => {
      control.patchValue({discount_2: 0});
      calculateValues();
    });

    control.get('discount_1')?.valueChanges.subscribe(() => calculateValues());
    control.get('discount_2')?.valueChanges.subscribe(() => calculateValues());
    control.get('price_factor')?.valueChanges.subscribe(() => calculateValues());
}
  get inventoryItem(): FormArray {
    return this.inventoryForm.get('inventory_items') as FormArray;
  }

  removeInventoryItem(index: number): void {
    if(index === 0){
      return;
    }
    
    this.inventoryItem.removeAt(index);
  }

  
  addInventoryItem(): void {
    const newInventory = this.fb.group({
      supplier_id: ['', Validators.required],
      discount_1: [0, Validators.required],
      discount_type_1: ['percent', Validators.required],
      discount_2: [0, Validators.required],
      discount_type_2: ['percent', Validators.required],
      price_factor: [0, Validators.required],
      total_1: [{value: 0, disabled: true}],
      total_2: [{value: 0, disabled: true}],
      selling_price: [{value: 0, disabled: true}]
    });

    this.inventoryItem.push(newInventory);
    this.inventoryChangeHandler(newInventory);
  }

  showModalCategoryAdd(titleCat: string): void {

    if(titleCat === 'uom'){
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
            onClick: () => this.handleCategorySubmitAdd('uom'),
            type: 'primary'
          }
        ]
      });
    }

    if(titleCat === 'uop'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Unit of Report',
        nzContent: AddUnitReportComponent,
        nzComponentParams: {
          form: this.categoryFormReport,
          type: titleCat,
          unitList: this.unitList.data
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
            onClick: () => this.handleCategorySubmitAdd('uop'),
            type: 'primary'
          }
        ]
      });
    }

  }

  handleCategorySubmitAdd(type: string): void{

    this.spinnerSvc.show();

    if(type === 'uom'){
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

    if(type === 'uop'){
      if(this.categoryFormReport.valid){
        this.apiSvc.createUnitReport(this.categoryFormReport.value).subscribe({
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
  }

  
  handleCancelCategoryAdd(): void{
    this.nestedModalRef?.close();
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
        code: this.inventoryForm.get('part_number')?.value,
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


      const inventoryItemComplete = this.inventoryItem.value.map((item: any) => ({
        supplier_id: item.supplier_id,
        discount_1: item.discount_1.toString(),
        discount_type_1: item.discout_type_1,
        discount_2: item.discount_2,
        discount_type_2: item.discount_type_2,
        price_factor: item.price_factor
      }))

      let body = {
        code: this.inventoryForm.get('part_number')?.value,
        description: this.inventoryForm.get('description')?.value,
        alias: this.inventoryForm.get('alias')?.value,
        unit_id: this.inventoryForm.get('unit_id')?.value,
        unit_report_id: this.inventoryForm.get('unit_report_id')?.value,
        supplier_product_id: this.inventoryForm.get('supplier_product_id')?.value,
        sub_category: this.inventoryForm.get('sub_category')?.value,
        manufacturer: this.inventoryForm.get('manufacturer')?.value,
        price_list: this.inventoryForm.get('price_list')?.value.toString(),
        status: this.inventoryForm.get('status')?.value,
        tax: this.inventoryForm.get('tax')?.value.toString(),
        inventory_source: this.inventoryForm.get('source')?.value,
        hs_code: this.inventoryForm.get('hs_code')?.value,
        inventory_items: inventoryItemComplete,
        attachment: this.inventoryForm.get('attachment')?.value
      }

      // const formData = new FormData();

      // Object.keys(body).forEach(key => {
      //   if(typeof (body as any)[key] === 'object'){
      //     formData.append(key, JSON.stringify((body as any)[key]))
      //   } else {
      //     formData.append(key, ( body as any )[key]);
      //   }
      // })



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


  handleCancel(){
    this.modal.destroy();
  }

  beforeUploadCpProfile() {
    return (file: NzUploadFile): boolean => {

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        
        this.nzMsgSvc.error('You can only upload JPG/PNG file!');
        return false;
      }
      const isLt5M = file.size! / 1024 / 1024 < 1;
      if (!isLt5M) {
        this.nzMsgSvc.error('Image must be smaller than 1MB!');
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        file.url = reader.result as string;
        this.inventoryForm.get('attachment')?.setValue(file);
      };
  
      return false;
    };
  }

  getValidProfilePicture(file: NzUploadFile | null): NzUploadFile[] {
    if (file && file.url) {
      return [file];
    }
    return [];
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  
  handleRemoveProfilePicture() {
    return (file: NzUploadFile): boolean => {

      // For updating deleted attachment
      // this.inventoryForm.get('attachment')?.setValue([file.uid]);

      this.inventoryForm.get('attachment')?.setValue([]);
    
      return true;
    }

  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
