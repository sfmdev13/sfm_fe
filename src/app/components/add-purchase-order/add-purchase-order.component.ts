import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { combineLatest, Observable, startWith, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataPurchaseOrder, IRootInvenSupplier, IRootInventory } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';
import { AddWarehouseAddressComponent } from '../categories-setting/add-warehouse-address/add-warehouse-address.component';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchaseOrderComponent implements OnInit {


  @Input() modal_type: string = '';
  @Input() dataDetail: IDataPurchaseOrder = {} as IDataPurchaseOrder;

  pic$!: Observable<any>;
  supplier$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  filtredListOfPicShipping: any[] = [];
  filteredListOfPicBilling: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  purchaseForm = this.fb.group({
    id: [null],
    supplier_id: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', Validators.required],
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    additional_cost: [''],
    tax: [0],
    project_type: ['stock'],
    warehouse_id: [''],
    province: [''],
    city: [''],
    address: [''],
    postal_code: [''],
    pic_shipping: [[], Validators.required],
    is_pic_internal_shipping: ['', Validators.required],
    pic_billing: [[], Validators.required],
    is_pic_internal_billing: ['', Validators.required],
    billing_id: ['', Validators.required],
    province_billing: [''],
    city_billing: [''],
    address_billing: [''],
    postal_code_billing: [''],
    telephone_billing: [''],
    telephone_shipping: [''],
    order: this.fb.array([])
  })

  inventoryList: IRootInvenSupplier = {} as IRootInvenSupplier;

  totalOrder: number = 0;
  totalGrandOrder: number = 0;

  formDisable: boolean = false;

  warehouse$!: Observable<any>;
  billing$!: Observable<any>;
  provinces$!: Observable<any>;

  provinceList: any[] = [];
  city: any[] = [];
  cityBillingList: any[] = [];

  warehouseList: any[] = [];
  billingList: any[] = [];

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    country: ['indonesia'],
    province: ['', Validators.required],
    city: ['', Validators.required],
    postal_code: ['', Validators.required],
    maps_url: ['', Validators.required],
    address: ['', Validators.required]
  })

  modalRef?: NzModalRef;
  modalRefBilling?: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
  ) { }

  ngOnInit(): void {

    this.purchaseForm.get('province')?.disable();
    this.purchaseForm.get('city')?.disable();
    this.purchaseForm.get('address')?.disable();
    this.purchaseForm.get('postal_code')?.disable();

    this.purchaseForm.get('province_billing')?.disable();
    this.purchaseForm.get('city_billing')?.disable();
    this.purchaseForm.get('address_billing')?.disable();
    this.purchaseForm.get('postal_code_billing')?.disable();

    // this.purchaseForm.get('project_type')?.valueChanges.subscribe((value) => {
    //   if(value === 'stock'){
    //     this.purchaseForm.get('province')?.disable();
    //     this.purchaseForm.get('city')?.disable();
    //     this.purchaseForm.get('address')?.disable();
    //     this.purchaseForm.get('postal_code')?.disable();

    //     this.purchaseForm.get('province_billing')?.disable();
    //     this.purchaseForm.get('city_billing')?.disable();
    //     this.purchaseForm.get('address_billing')?.disable();
    //     this.purchaseForm.get('postal_code_billing')?.disable();
    //   }

    //   if(value === 'project'){

    //     this.purchaseForm.get('province')?.enable();
    //     this.purchaseForm.get('city')?.enable();
    //     this.purchaseForm.get('address')?.enable();
    //     this.purchaseForm.get('postal_code')?.enable();

    //     this.purchaseForm.patchValue({
    //       province: '',
    //       city: '',
    //       address : '',
    //       postal_code: ''
    //     })
    //   }
    // })

    this.purchaseForm.get('warehouse_id')?.valueChanges.subscribe((value) => {
      const selectedWarehouse = this.warehouseList.find(w => w.id === value);

      this.purchaseForm.patchValue({
        province: parseInt(selectedWarehouse.province),
        city: parseInt(selectedWarehouse.city),
        address: selectedWarehouse.address,
        postal_code: selectedWarehouse.postal_code
      })
    })

    this.purchaseForm.get('billing_id')?.valueChanges.subscribe((value) => {
      const selectedBilling =  this.billingList.find(b => b.id === value)

      this.purchaseForm.patchValue({
        province_billing: parseInt(selectedBilling.province),
        city_billing:  parseInt(selectedBilling.city),
        address_billing: selectedBilling.address,
        postal_code_billing: selectedBilling.postal_code
      })
    })

    this.purchaseForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })

    this.purchaseForm.get('province_billing')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })


    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap(p => {
        this.provinceList = p;
      })
    );

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.warehouse$ = this.apiSvc.getWarehouse().pipe(
        tap(w => {
          this.warehouseList = w.data
        })
      );

      this.billing$ = this.apiSvc.getBillingCompany().pipe(
        tap(b => {
          this.billingList = b.data
        })
      )
    })
    
    this.warehouse$ = this.apiSvc.getWarehouse().pipe(
      tap(w => {
        this.warehouseList = w.data
      })
    );

    this.billing$ = this.apiSvc.getBillingCompany().pipe(
      tap(b => {
        this.billingList = b.data
      })
    )

    //used for calculate total order and total grand order
    const orderChanges$ = this.order.valueChanges.pipe(startWith(this.order.value));
    const additionalCostChanges$ = this.purchaseForm.get('additional_cost')?.valueChanges.pipe(startWith(this.purchaseForm.get('additional_cost')?.value)) || [];
    const taxChanges$ = this.purchaseForm.get('tax')?.valueChanges.pipe(startWith(this.purchaseForm.get('tax')?.value)) || [];
  
    combineLatest([orderChanges$, additionalCostChanges$, taxChanges$]).subscribe(() => {
      // Recalculate the total order cost
      const totalSum = this.calculateTotalCost();
      const additional_cost = parseInt(this.purchaseForm.get('additional_cost')?.value || '0', 10);
      const taxPercent = parseFloat(this.purchaseForm.get('tax')?.value || '0');
  
      this.totalOrder = totalSum + additional_cost;
  
      this.totalGrandOrder = this.totalOrder + (this.totalOrder * (taxPercent / 100));
    });


    this.purchaseForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.purchaseForm.get('is_pic_internal')?.value)){
        this.purchaseForm.patchValue({is_pic_internal: ''})
      }
    })

    this.purchaseForm.get('pic_shipping')?.valueChanges.subscribe((value) => {
      this.filtredListOfPicShipping = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.purchaseForm.get('is_pic_internal_shipping')?.value)){
        this.purchaseForm.patchValue({is_pic_internal_shipping: ''})
      }
    })

    this.purchaseForm.get('pic_billing')?.valueChanges.subscribe((value) => {
      this.filteredListOfPicBilling = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.purchaseForm.get('is_pic_internal_billing')?.value)){
        this.purchaseForm.patchValue({is_pic_internal_billing: ''})
      }
    })
    

    this.purchaseForm.get('date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.purchaseForm.patchValue({date: formattedDate})
    })

    this.purchaseForm.get('supplier_id')?.valueChanges.subscribe((res) => {      
      this.apiSvc.getInventoryBySupplier(res).subscribe(val => {
        this.inventoryList = val;
      })
    })

    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = this.listOfPic.filter(pic => this.pic_id.includes(pic.pic_id));
      })
    )

    this.supplier$ = this.apiSvc.supplierList();

    this.addOrder();

    if(this.modal_type === 'edit' || this.modal_type === 'duplicate'){

      this.purchaseForm.patchValue({
        id: this.dataDetail.id,
        supplier_id: this.dataDetail.supplier_id,
        date: this.dataDetail.date,
        description: this.dataDetail.description,
        additional_cost: parseInt(this.dataDetail.additional_cost),
        tax: this.dataDetail.tax
      })

      //update PIC
      this.pic$ = this.apiSvc.getPic().pipe(
        tap(res => {
          this.listOfPic = res;
          //extract pic id
          const picIds = this.dataDetail.pic.map(item => item.pic_id);

          //find pic internal id
          const isPicInternalId = this.dataDetail.pic.filter(item => item.is_pic_internal === 1);

          this.purchaseForm.patchValue({
            pic: picIds,
            is_pic_internal: isPicInternalId[0].pic_id
          });
        })
      )
  
      //clear existing order
      while (this.order.length !== 0) {
        this.order.removeAt(0);
      }

      //update orders
      this.dataDetail.po_items.forEach((order) => {
        const updateOrder = this.fb.group({
          inventory_id: order.inventory.id,
          product_code: order.inventory.code,
          qty: parseInt(order.qty),
          unit_measurement: order.inventory.unit.measurement,
          unit_unit: order.inventory.unit.unit,
          product_cost: parseInt(order.product_cost),
          total_cost: parseInt(order.total_cost_per_product),
          price_list: parseInt(order.inventory.price_list),
          discount: parseInt(order.inventory.discount)
        })

        this.order.push(updateOrder);
        this.cpValueChangeSubscriptions(updateOrder)
      })
      
    }

    if(this.modal_type === 'edit'){
      if(['hold', 'rejected', 'approved', 'finished'].includes(this.dataDetail.status.toLowerCase())){
        this.formDisable = true;
        this.purchaseForm.disable();
      }
    }

    
  }

  handleCancelWarehouse(): void{
    this.modalRef?.close();
    this.modalRefBilling?.close();
    this.categoryForm.reset();
  }

  handleSubmitBilling(): void{
    this.spinnerSvc.show();

    const body = {
      id: this.categoryForm.get('id')?.value,
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value,
      country: 'indonesia',
      province: this.categoryForm.get('province')?.value.toString(),
      city: this.categoryForm.get('city')?.value.toString(),
      postal_code: this.categoryForm.get('postal_code')?.value,
      maps_url: this.categoryForm.get('maps_url')?.value,
      address: this.categoryForm.get('address')?.value
    }

    this.apiSvc.createBillingCompany(body).subscribe({
      next: () => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Add Warehouse',
          nzOkText: 'Ok',
          nzCentered: true
        })
        this.apiSvc.triggerRefreshCategories()
      },
      error: (error) => {
        this.spinnerSvc.hide();
        console.log(error);
        this.modalSvc.error({
          nzTitle: 'Unable to Add Warehouse',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      },
      complete: () => {
        this.categoryForm.reset();
      }
    })
  }

  handleSubmitWarehouse(): void{
    this.spinnerSvc.show();

    const body = {
      id: this.categoryForm.get('id')?.value,
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value,
      country: 'indonesia',
      province: this.categoryForm.get('province')?.value.toString(),
      city: this.categoryForm.get('city')?.value.toString(),
      postal_code: this.categoryForm.get('postal_code')?.value,
      maps_url: this.categoryForm.get('maps_url')?.value,
      address: this.categoryForm.get('address')?.value
    }

    this.apiSvc.createWarehouse(body).subscribe({
      next: () => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Add Warehouse',
          nzOkText: 'Ok',
          nzCentered: true
        })
        this.apiSvc.triggerRefreshCategories()
      },
      error: (error) => {
        this.spinnerSvc.hide();
        console.log(error);
        this.modalSvc.error({
          nzTitle: 'Unable to Add Warehouse',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      },
      complete: () => {
        this.categoryForm.reset();
      }
    })
  }

  showModalAddWarehouse(){
    this.modalRef = this.modalSvc.create({
      nzTitle: 'Add Warehouse',
      nzContent: AddWarehouseAddressComponent,
      nzComponentParams: {
        form: this.categoryForm
      },
      nzCentered: true,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelWarehouse(),
          type: 'default'
        },
        {
          label: 'Confirm',
          onClick: () => this.handleSubmitWarehouse(),
          type: 'primary'
        }
      ]
    })
  }

  showModalAddBilling(){
    this.modalRefBilling  = this.modalSvc.create({
      nzTitle: 'Add Warehouse',
      nzContent: AddWarehouseAddressComponent,
      nzComponentParams: {
        form: this.categoryForm
      },
      nzCentered: true,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelWarehouse(),
          type: 'default'
        },
        {
          label: 'Confirm',
          onClick: () => this.handleSubmitBilling(),
          type: 'primary'
        }
      ]
    })
  }

  submitPurchase(): void{

    this.spinnerSvc.show()

    //need update
    if(this.purchaseForm.get('project_type')?.value === 'project'){
      this.modalSvc.error({
        nzTitle: 'Error',
        nzContent: 'Project type not available right now',
        nzOkText: 'Ok',
        nzCentered: true
      })
      return
    }

    const picComplete = this.purchaseForm.get('pic')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id === this.purchaseForm.get('is_pic_internal')!.value ? 1 : 0
    }));

    const picShippingComplete = this.purchaseForm.get('pic_shipping')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id ===  this.purchaseForm.get('is_pic_internal_shipping')!.value ? 1 : 0
    }));

    const picBillingComplete = this.purchaseForm.get('pic_billing')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id ===  this.purchaseForm.get('is_pic_internal_billing')!.value ? 1 : 0
    }))


    const inventoryComplete = this.order.value.map((order: any) => ({
      inventory_id: order.inventory_id,
      qty: order.qty.toString()
    }))


    if(this.modal_type === 'edit'){
      let body = {
        id: this.purchaseForm.get('id')?.value,
        description: this.purchaseForm.get('description')?.value,
        supplier_id: this.purchaseForm.get('supplier_id')?.value,
        additional_cost: this.purchaseForm.get('additional_cost')?.value.toString(),
        date: this.purchaseForm.get('date')?.value,
        pic_new: picComplete,
        inventories_new: inventoryComplete,
        tax: this.purchaseForm.get('tax')?.value
      }

      this.apiSvc.editPurchaseOrder(body).subscribe({
        next: () => {
          this.spinnerSvc.hide()
          this.apiSvc.triggerRefreshPurchaseOrder();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Edit Placed Order',
            nzOkText: 'Ok',
            nzCentered: true
          })
  
        },
        error: (error) => {
          this.spinnerSvc.hide()
          this.modalSvc.error({
            nzTitle: 'Error',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.spinnerSvc.hide()
          this.drawerRef.close();
        }
      })
    }


    if(this.modal_type === 'add' || this.modal_type === 'duplicate'){
      let body = {
        id: this.purchaseForm.get('id')?.value,
        description: this.purchaseForm.get('description')?.value,
        supplier_id: this.purchaseForm.get('supplier_id')?.value,
        additional_cost: this.purchaseForm.get('additional_cost')?.value.toString(),
        date: this.purchaseForm.get('date')?.value,
        pic: picComplete,
        inventories: inventoryComplete,
        tax: this.purchaseForm.get('tax')?.value.toString(),
        po_billing_pic: picBillingComplete,
        po_shipping_pic: picShippingComplete,
        telephone_billing: this.purchaseForm.get('telephone_billing')?.value,
        telephone_shipping: this.purchaseForm.get('telephone_shipping')?.value,
        billing_id: this.purchaseForm.get('billing_id')?.value,
        shipping_id: this.purchaseForm.get('warehouse_id')?.value,
        type: this.purchaseForm.get('project_type')?.value
      }
      
      
      this.apiSvc.addPurchaseOrder(body).subscribe({
        next: () => {
          this.spinnerSvc.hide()
          this.apiSvc.triggerRefreshPurchaseOrder();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Placed Order',
            nzOkText: 'Ok',
            nzCentered: true
          })
  
        },
        error: (error) => {
          this.spinnerSvc.hide()
          this.modalSvc.error({
            nzTitle: 'Error',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.spinnerSvc.hide()
          this.drawerRef.close();
        }
      })
    }

  }

  calculateTotalCost(): number {
    let total = 0;
    this.order.controls.forEach((group) => {
      const totalCost = group.get('total_cost')?.value;
      total += totalCost ? parseFloat(totalCost) : 0;
    });
    return total;
  }

  closeDrawer(){
    this.drawerRef.close();
  }

  updateTotalCost(orderRow: FormGroup): void {
    const qty = orderRow.get('qty')?.value || 0;
    const productCost = orderRow.get('product_cost')?.value || 0;
    const totalCost = qty * productCost;
    orderRow.get('total_cost')?.setValue(totalCost, { emitEvent: false });
  }

  cpValueChangeSubscriptions(control: FormGroup){
    control.get('inventory_id')?.valueChanges.subscribe(value => {
      const product = this.inventoryList.data.find(p => p.id === value);

      control.get('product_cost')?.setValue(parseInt(product?.product_cost ?? '0', 10));
      control.get('product_code')?.setValue(product?.code);

      control.get('discount')?.setValue(parseInt(product?.discount ?? '0',10 ));
      control.get('price_list')?.setValue(parseInt(product?.price_list ?? '0',10));

      control.get('unit_measurement')?.setValue(product?.unit.measurement);
      control.get('unit_unit')?.setValue(product?.unit.unit);
    })

    // Disable the controls after setting values
    control.get('product_cost')?.disable({ emitEvent: false, onlySelf: true });
    control.get('product_code')?.disable({ emitEvent: false, onlySelf: true });

    control.get('discount')?.disable({emitEvent: false, onlySelf: true });
    control.get('price_list')?.disable({emitEvent: false, onlySelf: true})

    control.get('qty')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('product_cost')?.valueChanges.subscribe(() => this.updateTotalCost(control));
  }

  get order(): FormArray {
    return this.purchaseForm.get('order') as FormArray;
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };  

  addOrder(): void {
    const newOrder = this.fb.group({
      inventory_id: ['', Validators.required],
      qty: ['', Validators.required],
      product_cost: [{value: '', disabled: true}],
      product_code: [{value: '', disabled: true}],
      discount: [{value: '', disabled: true}],
      price_list: [{value: '', disabled: true}],
      unit_measurement: [''],
      unit_unit: [''],
      total_cost: ['']
    });

    this.order.push(newOrder);

    this.cpValueChangeSubscriptions(newOrder)
  }

  removeOrder(index: number): void {
    if(index === 0){
      return;
    } 

    this.order.removeAt(index);
  }

}
