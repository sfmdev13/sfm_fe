import { Component, inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray, AbstractControl } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { IRootInventory, IRootUnit, ICategories, IDataInventory, IRootUnitReport } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';
import { AddUnitReportComponent } from '../categories-setting/add-unit-report/add-unit-report.component';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-add-inventories',
  templateUrl: './add-inventories.component.html',
  styleUrls: ['./add-inventories.component.scss']
})
export class AddInventoriesComponent implements OnInit {

 nzData = inject(NZ_MODAL_DATA);

 modal_type = this.nzData.modal_type;
 dataDetail: IDataInventory = this.nzData.dataDetail;

  unit$!: Observable<IRootUnit>;
  unitReport$!: Observable<IRootUnitReport>;

  unitList: IRootUnit = {} as IRootUnit;

  formattedLabel: string = '';

  supplier$!: Observable<any>;
  productCat$!: Observable<ICategories>;
  subCategory$!: Observable<ICategories>;
  manufacture$!: Observable<ICategories>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  filterForm: UntypedFormGroup;

  filtered: boolean = false;

  nestedModalRef?: NzModalRef;

  categoryFormBasic = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

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
    isEqualMeasurement: [false],
    inventory_items: this.fb.array([])
  })

  previewImage: string | undefined = '';
  previewVisible = false;

  deletedInventory: string[] = [];

  isAttachmentChange: boolean = false;

  constructor(
    private apiSvc: ApiService,
    private fb: UntypedFormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService,
    private modal: NzModalRef,
    private nzMsgSvc: NzMessageService,
    private notifSvc: NzNotificationService
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

    this.inventoryForm.get('isEqualMeasurement')?.valueChanges.subscribe((res) => {
      if(res === true){
        this.inventoryForm.get('unit_report')?.disable();
      }else {
        this.inventoryForm.get('unit_report')?.enable();
      }
    })
    
    this.inventoryForm.get('source')?.valueChanges.subscribe((res) => {
      if(res === 'local'){
        this.inventoryForm.get('hs_code')?.disable();
      } else {
        this.inventoryForm.get('hs_code')?.enable();
      }
    })

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getUnit();
      this.getUnitReport();
      this.productCat$ = this.apiSvc.getSupplierProduct();
      this.subCategory$ = this.apiSvc.getSubCategory();
      this.manufacture$ = this.apiSvc.getManufacture();
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
    this.subCategory$ = this.apiSvc.getSubCategory();
    this.manufacture$ = this.apiSvc.getManufacture();

    this.getUnit();
    this.getUnitReport();


    // this.addInventoryItem();

    if(this.modal_type === 'edit' || this.modal_type === 'duplicate'){

      const newUpdateFileList: NzUploadFile = {
        uid: this.dataDetail.attachment.id ?? 'picture',
        name: this.dataDetail.attachment.file_name,
        status: 'done',
        url: this.dataDetail.attachment.file_url,
        response: {
          id: this.dataDetail.attachment.id ?? 'picture',
          attachment_path: this.dataDetail.attachment.attachment_path
        } 
      }
      
      this.inventoryForm.patchValue({
        id: this.dataDetail.id,
        description: this.dataDetail.description,
        unit_id: this.dataDetail.unit.id,
        status: this.dataDetail.status,
        supplier_product_id: this.dataDetail.supplier_product.id,
        tax: this.dataDetail.tax,
        sub_category: this.dataDetail.sub_category.id,
        manufacturer: this.dataDetail.manufacturer.id,
        unit_report:  this.dataDetail.unit_report?.id,
        alias: this.dataDetail.alias,
        hs_code: this.dataDetail.hs_code,
        source: this.dataDetail.inventory_source,
        price_list: parseInt(this.dataDetail.price_list),
        part_number: this.dataDetail.code,
        isEqualMeasurement: this.dataDetail.unit_report === null ? true : false,
        attachment: newUpdateFileList
      })

      this.inventoryForm.get('part_number')?.disable();

      this.getFormattedLabel(this.dataDetail.unit.measurement, this.dataDetail.unit.unit);

      this.dataDetail.inventory_items.forEach((item) => {
        const updateInvent = this.fb.group({
          id: item.id,
          supplier_id: item.supplier.id,
          discount_1: parseInt(item.discount_1),
          discount_type_1: item.discount_type_1,
          discount_2: parseInt(item.discount_2),
          discount_type_2: item.discount_type_2,
          price_factor: parseInt(item.price_factor),
          total_1: parseInt(item.product_cost_1),
          total_2: parseInt(item.product_cost_2),
          selling_price: parseInt(item.selling_price),
          qty: parseInt(item.qty),
          gross_margin: parseInt(item.gross_margin),
          is_default: item.is_default === 1 ? true : false
        })

        this.inventoryItem.push(updateInvent)
        this.inventoryChangeHandler(updateInvent);
      })
    }
  }

  checkButton(i: number){

    for (let index = 0; index < this.inventoryItem.length; index++) {
      if (index !== i) {
        this.inventoryItem.at(index).patchValue({ is_default: false });
      }
    } 
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


  inventoryChangeHandler(control: UntypedFormGroup) {
    // Calculate all dependent values
    const calculateValues = () => {
        const priceList = parseInt(this.inventoryForm.get('price_list')?.value || '0');
        // const tax = parseInt(this.inventoryForm.get('tax')?.value || '0');

        console.log(priceList)
        // Calculate total_1 based on discount_1 and price_list
        control.patchValue({ total_1: priceList }, { emitEvent: false });
        control.patchValue({ total_2: priceList }, { emitEvent: false });

        const discount1 = parseInt(control.get('discount_1')?.value || '0');
        const discountType1 = control.get('discount_type_1')?.value;
        const total1 = calculateTotal(priceList, discountType1, discount1);
        console.log(total1)
        control.patchValue({ total_1: total1 }, { emitEvent: false });

        // Calculate total_2 based on discount_2 and total_1
        const discount2 = parseInt(control.get('discount_2')?.value || '0');
        const discountType2 = control.get('discount_type_2')?.value;
        const total2 = calculateTotal(total1, discountType2, discount2);
        control.patchValue({ total_2: total2 }, { emitEvent: false });

        // Calculate selling price based on total_2 and price_factor
        const priceFactor = parseInt(control.get('price_factor')?.value || '1');
        const baseSellingPrice = total2 * priceFactor;
        // const sellingPrice = baseSellingPrice + (baseSellingPrice * tax / 100);
        const sellingPrice = baseSellingPrice

        const grossMargin = ((baseSellingPrice - total2) / baseSellingPrice) * 100 || 0;

        control.patchValue({ selling_price: sellingPrice }, { emitEvent: false });
        control.patchValue({ gross_margin: grossMargin }, { emitEvent: false })
    };

    // Helper function to calculate total based on discount type and value
    const calculateTotal = (basePrice: number, discountType: string, discount: number) => {
        return discountType === 'percent'
            ? basePrice - (basePrice * discount / 100)
            : basePrice - discount;
    };

    // Update calculated values when price_list changes
    this.inventoryForm.get('price_list')?.valueChanges.subscribe(() => calculateValues());

    // this.inventoryForm.get('tax')?.valueChanges.subscribe(() => calculateValues());

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

  get inventoryItem(): UntypedFormArray {
    return this.inventoryForm.get('inventory_items') as UntypedFormArray;
  }

  removeInventoryItem(index: number): void {
    if(index === 0){
      return;
    }

    this.deletedInventory.push(this.inventoryItem.at(index).get('id')?.value)

    this.inventoryItem.removeAt(index);
  }

  
  addInventoryItem(): void {

    const priceList = this.inventoryForm.get('price_list')?.value

    const newInventory = this.fb.group({
      id: [''],
      supplier_id: ['', Validators.required],
      discount_1: [0, Validators.required],
      discount_type_1: ['percent', Validators.required],
      discount_2: [0, Validators.required],
      discount_type_2: ['percent', Validators.required],
      price_factor: [0, Validators.required],
      total_1: [{value: priceList, disabled: true}],
      total_2: [{value: priceList, disabled: true}],
      selling_price: [{value: 0, disabled: true}],
      qty: [0],
      is_default:[this.inventoryItem.length === 0],
      gross_margin: [0],
    });

    this.inventoryItem.push(newInventory);
    this.inventoryChangeHandler(newInventory);
  }

  showModalCategoryAdd(titleCat: string): void {

    if(titleCat === 'uom'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Unit of Measurment',
        nzContent: EditCategoriesModalComponent,
        nzData: {
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

    if(titleCat === 'product_category'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Product Category',
        nzContent: EditCategoriesModalComponent,
        nzData: {
          form: this.categoryFormBasic,
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
            onClick: () => this.handleCategorySubmitAdd('product_category'),
            type: 'primary'
          }
        ]
      });
    }

    if(titleCat === 'sub_category'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Product Sub Category',
        nzContent: EditCategoriesModalComponent,
        nzData: {
          form: this.categoryFormBasic,
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
            onClick: () => this.handleCategorySubmitAdd('sub_category'),
            type: 'primary'
          }
        ]
      });
    }

    if(titleCat === 'manufacture'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Manufacture',
        nzContent: EditCategoriesModalComponent,
        nzData: {
          form: this.categoryFormBasic,
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
            onClick: () => this.handleCategorySubmitAdd('manufacture'),
            type: 'primary'
          }
        ]
      });
    }

    if(titleCat === 'uop'){
      this.nestedModalRef = this.modalSvc.create({
        nzTitle: ' Add Unit of Report',
        nzContent: AddUnitReportComponent,
        nzData: {
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

    if(type === 'product_category'){
      if(this.categoryFormBasic.valid){
        this.apiSvc.createSupplierProduct(this.categoryFormBasic.value.name, this.categoryFormBasic.value.description).subscribe({
          next: () => {
  
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Product Category',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories()
            this.categoryFormBasic.reset();
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Product Category',
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

    if(type === 'sub_category'){
      if(this.categoryFormBasic.valid){
        this.apiSvc.createSubCategory(this.categoryFormBasic.value.name, this.categoryFormBasic.value.description).subscribe({
          next: () => {
  
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Sub Category',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories();
            this.categoryFormBasic.reset();
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Sub Category',
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

    if(type === 'manufacture'){
      if(this.categoryFormBasic.valid){
        this.apiSvc.createManufacture(this.categoryFormBasic.value.name, this.categoryFormBasic.value.description).subscribe({
          next: () => {
  
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Manufacture',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories();
            this.categoryFormBasic.reset();
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Manufacture',
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
      const equal = this.inventoryForm.get('isEqualMeasurement')?.value;

      const inventoryItemComplete = this.inventoryItem.value.map((item: any) => ({
        id: item.id,
        supplier_id: item.supplier_id,
        discount_1: item.discount_1.toString(),
        discount_type_1: item.discount_type_1,
        discount_2: item.discount_2.toString(),
        discount_type_2: item.discount_type_2,
        price_factor: item.price_factor,
        qty: item.qty,
        is_default: item.is_default ? 1 : 0
      }))
  

      let body = {
        id: this.inventoryForm.get('id')?.value,
        code: this.inventoryForm.get('part_number')?.value,
        description: this.inventoryForm.get('description')?.value,
        alias: this.inventoryForm.get('alias')?.value,
        unit_id: this.inventoryForm.get('unit_id')?.value,
        unit_report_id: equal ? null : this.inventoryForm.get('unit_report')?.value,
        supplier_product_id: this.inventoryForm.get('supplier_product_id')?.value,
        sub_category_id: this.inventoryForm.get('sub_category')?.value,
        manufacture_id: this.inventoryForm.get('manufacturer')?.value,
        price_list: this.inventoryForm.get('price_list')?.value.toString(),
        status: this.inventoryForm.get('status')?.value,
        tax: this.inventoryForm.get('tax')?.value.toString(),
        inventory_source: this.inventoryForm.get('source')?.value,
        hs_code: this.inventoryForm.get('hs_code')?.value,
        inventory_items_new: inventoryItemComplete,
      }

      const formData = new FormData();

      Object.keys(body).forEach(key => {
        if(typeof (body as any)[key] === 'object'){
          formData.append(key, JSON.stringify((body as any)[key]))
        } else {
          formData.append(key, ( body as any )[key]);
        }
      })

      if(this.isAttachmentChange){
        const attachment = this.inventoryForm.get('attachment')?.value
        const file = this.dataURLtoFile(attachment.url, `${attachment.uid}.png`);
        formData.append(`attachment_new`, file);
      }
    
      this.apiSvc.updateInventory(formData).subscribe({
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
          this.modal.destroy();
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
      
      const equal = this.inventoryForm.get('isEqualMeasurement')?.value;

      const attachment = this.inventoryForm.get('attachment')?.value
      const file = this.dataURLtoFile(attachment.url, `${attachment.uid}.png`);

      const inventoryItemComplete = this.inventoryItem.value.map((item: any) => ({
        supplier_id: item.supplier_id,
        discount_1: item.discount_1.toString(),
        discount_type_1: item.discount_type_1,
        discount_2: item.discount_2.toString(),
        discount_type_2: item.discount_type_2,
        price_factor: item.price_factor,
        is_default: item.is_default ? 1 : 0
      }))

      let body = {
        code: this.inventoryForm.get('part_number')?.value,
        description: this.inventoryForm.get('description')?.value,
        alias: this.inventoryForm.get('alias')?.value,
        unit_id: this.inventoryForm.get('unit_id')?.value,
        unit_report_id: equal ? null : this.inventoryForm.get('unit_report')?.value,
        supplier_product_id: this.inventoryForm.get('supplier_product_id')?.value,
        sub_category_id: this.inventoryForm.get('sub_category')?.value,
        manufacture_id: this.inventoryForm.get('manufacturer')?.value,
        price_list: this.inventoryForm.get('price_list')?.value.toString(),
        status: this.inventoryForm.get('status')?.value,
        tax: this.inventoryForm.get('tax')?.value.toString(),
        inventory_source: this.inventoryForm.get('source')?.value,
        hs_code: this.inventoryForm.get('hs_code')?.value,
        inventory_items: inventoryItemComplete,
      }

      const formData = new FormData();

      Object.keys(body).forEach(key => {
        if(typeof (body as any)[key] === 'object'){
          formData.append(key, JSON.stringify((body as any)[key]))
        } else {
          formData.append(key, ( body as any )[key]);
        }
      })

      formData.append(`attachment`, file);

      this.apiSvc.createInventory(formData).subscribe({
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
          this.modal.destroy();
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

      this.isAttachmentChange = true;

      this.inventoryForm.get('attachment')?.setValue('');
    
      return true;
    }

  }

  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
