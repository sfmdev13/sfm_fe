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
  @Input() inventoryList: any;

  pic$!: Observable<any>;
  supplier$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  filtredListOfPicShipping: any[] = [];
  filteredListOfPicBilling: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  purchaseForm = this.fb.group({
    id: [null],
    date: ['', Validators.required],
    description: ['', Validators.required],
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
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
    billing_id: [''],
    province_billing: [''],
    city_billing: [''],
    address_billing: [''],
    postal_code_billing: [''],
    telephone_billing: [''],
    telephone_shipping: [''],
    payment_term: ['down_payment', Validators.required],
    shipping_term: ['', Validators.required],
    remarks: ['', Validators.required],
    order: this.fb.array([]),
    order_additional: this.fb.array([]),
    manufacture: [''],
    project_id: [''],
    payment_due_date: [''],
    payment_due_date_status: [{value: 'Pay Immediately', disabled: true}],
    tax1: [0],
    tax2: [0]
  })

  inventory$!: Observable<any>;

  totalOrder: number = 0;
  totalGrandOrder: number = 0;

  formDisable: boolean = false;

  warehouse$!: Observable<any>;
  billing$!: Observable<any>;
  provinces$!: Observable<any>;
  unit$!: Observable<any>;

  provinceList: any[] = [];
  city: any[] = [];
  cityBillingList: any[] = [];

  warehouseList: any[] = [];
  billingList: any[] = [];
  unitList: any[] = [];

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    country: ['indonesia'],
    province: ['', Validators.required],
    city: ['', Validators.required],
    postal_code: ['', Validators.required],
    maps_url: ['', Validators.required],
    address: ['', Validators.required],

  })

  categoryFormUnit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    measurement: ['', Validators.required],
    unit: [''],
    description: ['', Validators.required]
  })

  modalRef?: NzModalRef;
  modalRefBilling?: NzModalRef;
  ModalRefUnit?: NzModalRef;

  deletedOrderAdditional: string[] = [];

  paymentTerm: string = 'down_payment'
  terminDueDate: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
  ) { }

  ngOnInit(): void {

    this.purchaseForm.get('tax1')?.valueChanges.subscribe(value => {
      this.purchaseForm.get('tax2')?.setValue(value, { emitEvent: false });
      this.updateTaxValue();
    });

      this.purchaseForm.get('tax2')?.valueChanges.subscribe(value => {
      this.purchaseForm.get('tax1')?.setValue(value, { emitEvent: false });
      this.updateTaxValue();
    });

    this.purchaseForm.get('payment_term')?.valueChanges.subscribe((res) => {
      this.paymentTerm = res

      if(res === 'cash_on_delivery'){
        this.purchaseForm.get('payment_due_date')?.setValue('paid');
        this.purchaseForm.get('payment_due_date_status')?.setValue('Paid');
        this.purchaseForm.get('payment_due_date')?.disable();
        return
      } 
      
      if(res === 'down_payment') {
        this.purchaseForm.get('payment_due_date')?.setValue('0');
        this.purchaseForm.get('payment_due_date_status')?.setValue('Pay Immediately');
      }

      this.purchaseForm.get('payment_due_date')?.enable();
    })

    this.purchaseForm.get('payment_due_date')?.valueChanges.subscribe((res) => {

      const date = this.purchaseForm.get('date')?.value;

      if(this.paymentTerm === 'termin'){
        if(date === '') {
          return
        }

        this.terminDueDate = parseInt(res)

        this.calculateDueDate(date, this.terminDueDate)
      }
    })

    // this.purchaseForm.get('province')?.disable();
    // this.purchaseForm.get('city')?.disable();
    // this.purchaseForm.get('address')?.disable();
    // this.purchaseForm.get('postal_code')?.disable();

    // this.purchaseForm.get('province_billing')?.disable();
    // this.purchaseForm.get('city_billing')?.disable();
    // this.purchaseForm.get('address_billing')?.disable();
    // this.purchaseForm.get('postal_code_billing')?.disable();

    this.purchaseForm.get('project_type')?.valueChanges.subscribe((value) => {
      if(value === 'stock'){
        this.purchaseForm.get('province')?.disable();
        this.purchaseForm.get('city')?.disable();
        this.purchaseForm.get('address')?.disable();
        this.purchaseForm.get('postal_code')?.disable();

        this.purchaseForm.get('province_billing')?.disable();
        this.purchaseForm.get('city_billing')?.disable();
        this.purchaseForm.get('address_billing')?.disable();
        this.purchaseForm.get('postal_code_billing')?.disable();
      }

      if(value === 'project'){

        this.purchaseForm.get('province')?.enable();
        this.purchaseForm.get('city')?.enable();
        this.purchaseForm.get('address')?.enable();
        this.purchaseForm.get('postal_code')?.enable();

        this.purchaseForm.patchValue({
          province: '',
          city: '',
          address : '',
          postal_code: ''
        })
      }
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

      this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
        tap(unit => {
          this.unitList = unit.data
        } )
      )
    })

    this.unit$ = this.apiSvc.getUnitMeasurement().pipe(
      tap(unit => {
        this.unitList = unit.data
      }
    ))
    
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

    this.purchaseForm.get('warehouse_id')?.valueChanges.subscribe((value) => {
      const selectedWarehouse = this.warehouseList.find(w => w.id === value);

      this.purchaseForm.patchValue({
        province: parseInt(selectedWarehouse?.province),
        city: parseInt(selectedWarehouse?.city),
        address: selectedWarehouse?.address,
        postal_code: selectedWarehouse?.postal_code
      })
    })

    this.purchaseForm.get('billing_id')?.valueChanges.subscribe((value) => {
      const selectedBilling =  this.billingList.find(b => b.id === value)

      this.purchaseForm.patchValue({
        province_billing: parseInt(selectedBilling?.province),
        city_billing:  parseInt(selectedBilling?.city),
        address_billing: selectedBilling?.address,
        postal_code_billing: selectedBilling?.postal_code
      })
    })

    //used for calculate total order and total grand order
    const orderChanges$ = this.order.valueChanges.pipe(startWith(this.order.value));
    const orderAdditionalChanges$ = this.orderAdditional.valueChanges.pipe(startWith(this.orderAdditional.value));
    const taxChanges$ = this.purchaseForm.get('tax')?.valueChanges.pipe(startWith(this.purchaseForm.get('tax')?.value)) || [];
  
    combineLatest([orderChanges$,orderAdditionalChanges$, taxChanges$]).subscribe(() => {
      // Recalculate the total order cost
      const totalSumOrder = this.calculateTotalCost();
      const totalSumAdditional = this.calculateTotalCostAdditional();
      const taxPercent = parseFloat(this.purchaseForm.get('tax')?.value || '0');
  
      this.totalOrder = totalSumOrder + totalSumAdditional;
  
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

      if(this.paymentTerm === 'termin'){
        this.calculateDueDate(formattedDate, this.terminDueDate)
      }
    })



    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = this.listOfPic.filter(pic => this.pic_id.includes(pic.pic_id));
      })
    )

    this.supplier$ = this.apiSvc.supplierList();

    if(this.modal_type === 'edit' || this.modal_type === 'duplicate'){

      this.purchaseForm.patchValue({
        id: this.dataDetail.id,
        date: this.dataDetail.date,
        description: this.dataDetail.description,
        tax: parseInt(this.dataDetail.tax),
        project_type: this.dataDetail.type,
        warehouse_id: this.dataDetail.shipping.id,
        province: parseInt(this.dataDetail.shipping.province),
        city: parseInt(this.dataDetail.shipping.city),
        address: this.dataDetail.shipping.address,
        postal_code: this.dataDetail.shipping.postal_code,
        telephone_shipping: this.dataDetail.telephone_shipping,
        billing_id: this.dataDetail.billing.id,
        province_billing: parseInt(this.dataDetail.billing.province),
        city_billing: parseInt(this.dataDetail.billing.city),
        telephone_billing: this.dataDetail.telephone_billing,
        postal_code_billing: this.dataDetail.billing.postal_code,
        maps_url_billing: this.dataDetail.billing.maps_url,
        address_billing: this.dataDetail.billing.address,
        payment_term: this.dataDetail.payment_term,
        shipping_term: this.dataDetail.shipping_term,
        remarks: this.dataDetail.remarks,
        maps_url: this.dataDetail.shipping.maps_url,
        manufacture: this.dataDetail.manufacture,
        project_id: this.dataDetail.project_id,
        payment_due_date: this.dataDetail.payment_due_date
      })

      //update PIC
      this.pic$ = this.apiSvc.getPic().pipe(
        tap(res => {
          this.listOfPic = res;

          //extract pic id
          const picIds = this.dataDetail.pic.map(item => item.pic_id);
          const picIdsBilling = this.dataDetail.billing_pic.map(item => item.pic_id);
          const picIdsShipping = this.dataDetail.shipping_pic.map(item => item.pic_id)

          //find pic internal id
          const isPicInternalId = this.dataDetail.pic.filter(item => item.is_pic_internal === 1);
          const isPicInternalIdShipping = this.dataDetail.shipping_pic.filter(item => item.is_pic_internal === 1);
          const isPicInternalIdBilling = this.dataDetail.billing_pic.filter(item => item.is_pic_internal === 1)

          this.purchaseForm.patchValue({
            pic: picIds,
            is_pic_internal: isPicInternalId[0].pic_id,
            pic_shipping: picIdsShipping,
            is_pic_internal_shipping: isPicInternalIdShipping[0].pic_id,
            pic_billing: picIdsBilling,
            is_pic_internal_billing: isPicInternalIdBilling[0].pic_id
          });
        })
      )
      
  
      //clear existing order
      while (this.order.length !== 0) {
        this.order.removeAt(0);
      }

      //update orders
      this.dataDetail.po_items.forEach((order) => {
        const product = this.inventoryList.data.find((p: any) => p.id === order.inventory_items.inventory.id);
        console.log(product.inventory_items)

        const updateOrder = this.fb.group({
          inventory_id: [order.inventory_items.inventory.id, Validators.required],
          qty: [parseInt(order.qty), Validators.required],
          product_code: [order.inventory_items.inventory.id],
          unit_measurement: [order.inventory_items.inventory.unit.measurement],
          unit_unit: [order.inventory_items.inventory.unit.unit],
          total_cost: [parseInt(order.total_cost_per_product)],
          discount: [parseInt(order.discount)],
          discount_type: [order.discount_type],
          alias: [order.inventory_items.inventory.alias],
          suppliersList: [product.inventory_items],
          supplier: [order.inventory_items.id],
          selling_price: [{value: parseInt(order.inventory_items.selling_price), disabled: true}],
        })

        this.order.push(updateOrder);
        this.cpValueChangeSubscriptions(updateOrder)
      })
      
      this.dataDetail.po_additonal_items.forEach((order) => {
        const updateOrderAdd = this.fb.group({
          id: order.id,
          product_description: order.product_description,
          qty: parseInt(order.qty),
          unit_id: order.unit.id,
          price_list: parseInt(order.price_list),
          discount: parseInt(order.discount),
          discount_type: order.discount_type,
          discount_price: parseInt(order.discount_price),
          total_cost: parseInt(order.total_cost_per_product),
          measurement: order.unit.measurement,
          unit: order.unit.unit          
        })

        this.orderAdditional.push(updateOrderAdd),
        this.cpValueChangeSubscriptionsAdditional(updateOrderAdd)
      })
    }

    if(this.modal_type === 'edit'){
      if(['hold', 'rejected', 'approved', 'finished'].includes(this.dataDetail.status.toLowerCase())){
        this.formDisable = true;
        this.purchaseForm.disable();
      }
    }

    
  }

  updateTaxValue() {
    const taxValue = this.purchaseForm.get('tax1')?.value;
    this.purchaseForm.get('tax')?.setValue(taxValue, { emitEvent: false });
}

  calculateDueDate(selectedDate: string, daysToAdd: number) {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + daysToAdd);
    const dueDate = date.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format

    this.purchaseForm.get('payment_due_date_status')?.setValue(dueDate)
  }

  handleSubmitUnitAdd(): void{

    this.spinnerSvc.show();

    if(this.categoryFormUnit.valid){

      this.apiSvc.createUnitMeasurement(this.categoryFormUnit.value).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Unit',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
          this.ModalRefUnit?.close();
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

  
  handleCancelUnitAdd(): void{
    this.ModalRefUnit?.close();
  }

  showModalUnit(titleCat: string): void {

    this.ModalRefUnit = this.modalSvc.create({
      nzTitle: ' Add Unit of Measurment',
      nzContent: EditCategoriesModalComponent,
      nzComponentParams: {
        form: this.categoryFormUnit,
        type: titleCat
      },
      nzWidth: '500px',
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelUnitAdd(),
          type: 'default'
        },
        {
          label: 'Confirm',
          onClick: () => this.handleSubmitUnitAdd(),
          type: 'primary'
        }
      ]
    });
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

    // //need update
    // if(this.purchaseForm.get('project_type')?.value === 'project'){
    //   this.modalSvc.error({
    //     nzTitle: 'Error',
    //     nzContent: 'Project type not available right now',
    //     nzOkText: 'Ok',
    //     nzCentered: true
    //   })
    //   return
    // }

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

    let inventoryComplete = null

    if(this.order.length > 0){
      inventoryComplete = this.order.value.map((order: any) => ({
        inventory_item_id: order.supplier,
        qty: order.qty.toString(),
        discount_type: order.discount_type,
        discount: order.discount.toString()
      }))
    }

    let additionalComplete = null;

    if(this.orderAdditional.length > 0){
      additionalComplete = this.orderAdditional.value.map((order: any) => ({
        product_description: order.product_description,
        qty: order.qty.toString(),
        unit_id: order.unit_id.toString(),
        price_list: order.price_list.toString(),
        discount_type: order.discount_type,
        discount: order.discount.toString(),
        discount_price: order.discount_price.toString()
      }))
    }


    if(this.modal_type === 'edit'){
      let body = {
        id: this.purchaseForm.get('id')?.value,
        description: this.purchaseForm.get('description')?.value,
        supplier_id: this.purchaseForm.get('supplier_id')?.value,
        additional_cost: this.purchaseForm.get('additional_cost')?.value.toString(),
        date: this.purchaseForm.get('date')?.value,
        pic_new: picComplete,
        inventories_new: inventoryComplete,
        tax: this.purchaseForm.get('tax')?.value,
        po_billing_pic_new: picBillingComplete,
        po_shipping_pic_new: picShippingComplete,
        type: this.purchaseForm.get('project_type')?.value,
        payment_term: this.purchaseForm.get('payment_term')?.value,
        shipping_term: this.purchaseForm.get('shipping_term')?.value,
        remarks: this.purchaseForm.get('remarks')?.value,
        telephone_billing: this.purchaseForm.get('telephone_billing')?.value,
        telephone_shipping: this.purchaseForm.get('telephone_shipping')?.value,
        billing_id: this.purchaseForm.get('billing_id')?.value,
        shipping_id: this.purchaseForm.get('warehouse_id')?.value,
        additional_items_new: additionalComplete,
        deleted_additional_item_ids: this.deletedOrderAdditional,
        project_id: this.purchaseForm.get('project_id')?.value,
        payment_due_date: this.purchaseForm.get('payment_due_date')?.value,
        manufacture: this.purchaseForm.get('manufacture')?.value,
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
        type: this.purchaseForm.get('project_type')?.value,
        project_id: this.purchaseForm.get('project_id')?.value,
        payment_term: this.purchaseForm.get('payment_term')?.value,
        payment_due_date: this.purchaseForm.get('payment_due_date')?.value,
        manufacture: this.purchaseForm.get('manufacture')?.value,
        shipping_term: this.purchaseForm.get('shipping_term')?.value,
        remarks: this.purchaseForm.get('remarks')?.value,
        additional_items: additionalComplete
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

  calculateTotalCostAdditional(): number{
    let total = 0;
    this.orderAdditional.controls.forEach((group) => {
      const totalCost = group.get('total_cost')?.value;
      total += totalCost ? parseFloat(totalCost) : 0;
    });
    return total;
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

  updateTotalCostAdditional(orderRow: FormGroup): void{
    const qty = orderRow.get('qty')?.value || 0;
    const discount = orderRow.get('discount')?.value || 0;
    const discount_price = orderRow.get('discount_price')?.value || 0;
    const price_list = orderRow.get('price_list')?.value || 0;
    let totalCost = orderRow.get('total_cost')?.value || 0;

    totalCost = price_list * qty

    if(orderRow.get('discount_type')?.value === 'percent'){
      totalCost = totalCost - (totalCost * (parseFloat(discount)/100))
    }

    if(orderRow.get('discount_type')?.value === 'price'){
      totalCost = totalCost - parseInt(discount_price);
    }

    orderRow.get('total_cost')?.setValue(totalCost, { emitEvent: false });
  }

  updateTotalCost(orderRow: FormGroup): void {
    const qty = orderRow.get('qty')?.value || 0;
    const sellingPrice = orderRow.get('selling_price')?.value || 0;
    const discount = orderRow.get('discount')?.value || 0;
    let totalCost = qty * sellingPrice;

    if(orderRow.get('discount_type')?.value === 'percent'){
      totalCost = totalCost - (totalCost * (parseFloat(discount)/100))
    }

    if(orderRow.get('discount_type')?.value === 'price'){
      totalCost = totalCost - parseInt(discount);
    }

    orderRow.get('total_cost')?.setValue(totalCost, { emitEvent: false });
  }

  cpValueChangeSubscriptionsAdditional(control: FormGroup){
    control.get('unit_id')?.valueChanges.subscribe(res => {
      const selectedUnit = this.unitList.filter(u => u.id === res).map(u => ({
        measurement: u.measurement,
        unit: u.unit 
      }))

      control.patchValue({
        measurement: selectedUnit[0].measurement,
        unit: selectedUnit[0].unit
      })
    })

    control.get('discount_type')?.valueChanges.subscribe((res) => {
      if(res === 'percent'){
        control.get('discount_price')?.setValue(0);
      } 

      if(res === 'price'){
        control.get('discount')?.setValue(0);
      }
    })

    control.get('qty')?.valueChanges.subscribe(() => this.updateTotalCostAdditional(control));
    control.get('price_list')?.valueChanges.subscribe(() => this.updateTotalCostAdditional(control));
    control.get('discount_price')?.valueChanges.subscribe(() => this.updateTotalCostAdditional(control));
    control.get('discount')?.valueChanges.subscribe(() => this.updateTotalCostAdditional(control))
  }

  cpValueChangeSubscriptions(control: FormGroup){
    let isUpdating = false;

    control.get('inventory_id')?.valueChanges.subscribe(value => {
      if (!isUpdating) {
        isUpdating = true;
        const product = this.inventoryList.data.find((p: any) => p.id === value);
        control.get('product_code')?.setValue(product?.id, { emitEvent: false }); // Disable event trigger
        this.changeValueOrder(control, product);
        isUpdating = false;
      }
    });
    
    control.get('product_code')?.valueChanges.subscribe(value => {
      if (!isUpdating) {
        isUpdating = true;
        const product = this.inventoryList.data.find((p: any) => p.id === value);
        control.get('inventory_id')?.setValue(product?.id, { emitEvent: false }); // Disable event trigger
        this.changeValueOrder(control, product);
        isUpdating = false;
      }
    });

    // Disable the controls after setting values
    control.get('alias')?.disable();

    control.get('discount_type')?.valueChanges.subscribe((res) => {
      if(res === 'percent'){
        control.get('discount')?.setValue(0);
      } 

      if(res === 'price'){
        control.get('discount')?.setValue(0);
      }
    })

    control.get('qty')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('product_cost')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('discount')?.valueChanges.subscribe(() => this.updateTotalCost(control));

    control.get('supplier')?.valueChanges.subscribe(supplierId => {
      const selectedProduct = this.inventoryList.data.find((p: any) => p.id === control.get('inventory_id')?.value);
      const selectedSupplier = selectedProduct?.inventory_items.find((item: any) => item.id === supplierId);
      const sellingPrice = selectedSupplier?.selling_price ?? 0;
    
      // Update form control with selling price or handle it as needed
      control.get('selling_price')?.setValue(parseInt(sellingPrice) ?? 0);
    });

    
  }

  changeValueOrder(control: FormGroup, product: any){
    control.get('unit_measurement')?.setValue(product?.unit.measurement);
    control.get('unit_unit')?.setValue(product?.unit.unit);
    control.get('alias')?.setValue(product?.alias);

    // const suppliers = product?.inventory_items.map((item: any) => item.supplier) || [];
    control.get('supplier')?.setValue(null); // Reset supplier on product change
    control.get('suppliersList')?.setValue(product?.inventory_items); // Set suppliers for the select input
  }

  get order(): FormArray {
    return this.purchaseForm.get('order') as FormArray;
  }

  get orderAdditional(): FormArray{
    return this.purchaseForm.get('order_additional') as FormArray;
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  }; 
  
  
  addOrderAdditional(): void{
    const newOrderAdditional = this.fb.group({
      id: [''],
      product_description: ['',[Validators.required]],
      qty: [0, [Validators.required]],
      unit_id: ['',[Validators.required]],
      price_list: [0, [Validators.required]],
      discount: [0],
      discount_type: ['percent', [Validators.required]],
      discount_price: [0],
      total_cost: [0],
      measurement: [''],
      unit: ['']
    })

    this.orderAdditional.push(newOrderAdditional)
    
    this.cpValueChangeSubscriptionsAdditional(newOrderAdditional);
  }

  addOrder(): void {
    const newOrder = this.fb.group({
      inventory_id: ['', Validators.required],
      qty: [0, Validators.required],
      product_code: [''],
      unit_measurement: [''],
      unit_unit: [''],
      total_cost: [''],
      discount_type: ['percent'],
      discount: [0],
      alias: [''],
      supplier: [''],
      selling_price: [{value: 0, disabled: true}],
      suppliersList: [[]]
    });

    this.order.push(newOrder);

    this.cpValueChangeSubscriptions(newOrder);
  }

  removeOrderAdditional(index: number): void{
    this.deletedOrderAdditional.push(this.orderAdditional.at(index).get('id')?.value);
    this.orderAdditional.removeAt(index);
  }

  removeOrder(index: number): void {
    this.order.removeAt(index);
  }

}
