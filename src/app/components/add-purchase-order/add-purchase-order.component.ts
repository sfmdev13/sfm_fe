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
    payment_term: ['', Validators.required],
    shipping_term: ['', Validators.required],
    remarks: ['', Validators.required],
    order: this.fb.array([]),
    order_additional: this.fb.array([])
  })

  inventoryList: IRootInvenSupplier = {} as IRootInvenSupplier;

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
    address: ['', Validators.required]
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
        tax: this.dataDetail.tax,
        telephone_billing: this.dataDetail.telephone_billing,
        telephone_shipping: this.dataDetail.telephone_shipping,
        payment_term: this.dataDetail.payment_term,
        shipping_term: this.dataDetail.shipping_term,
        project_type: this.dataDetail.type,
        remarks: this.dataDetail.remarks,
        warehouse_id: this.dataDetail.shipping.id,
        billing_id: this.dataDetail.billing.id,
        province: parseInt(this.dataDetail.shipping.province),
        city: parseInt(this.dataDetail.shipping.city),
        postal_code: this.dataDetail.shipping.postal_code,
        address: this.dataDetail.shipping.address,
        maps_url: this.dataDetail.shipping.maps_url,
        province_billing: parseInt(this.dataDetail.billing.province),
        city_billing: parseInt(this.dataDetail.billing.city),
        postal_code_billing: this.dataDetail.billing.postal_code,
        maps_url_billing: this.dataDetail.billing.maps_url,
        address_billing: this.dataDetail.billing.address
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
      qty: order.qty.toString(),
      discount_type: order.discount_type_item,
      discount: order.discount_item.toString(),
      discount_price: order.discount_price_item.toString()
    }))

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
        type: this.purchaseForm.get('project_type')?.value,
        payment_term: this.purchaseForm.get('payment_term')?.value,
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
    const productCost = orderRow.get('product_cost')?.value || 0;
    const discount = orderRow.get('discount_item')?.value || 0;
    const discount_price = orderRow.get('discount_price_item')?.value || 0;
    let totalCost = qty * productCost;

    if(orderRow.get('discount_type_item')?.value === 'percent'){
      totalCost = totalCost - (totalCost * (parseFloat(discount)/100))
    }

    if(orderRow.get('discount_type_item')?.value === 'price'){
      totalCost = totalCost - parseInt(discount_price);
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
    control.get('inventory_id')?.valueChanges.subscribe(value => {
      const product = this.inventoryList.data.find(p => p.id === value);

      console.log(product?.discount_type)

      control.get('product_cost')?.setValue(parseInt(product?.product_cost ?? '0', 10));
      control.get('product_code')?.setValue(product?.code);

      control.get('discount')?.setValue(parseInt(product?.discount ?? '0',10 ));
      control.get('discount_price')?.setValue(parseInt(product?.discount_price ?? '0', 10))
      control.get('discount_type')?.setValue(product?.discount_type)
      control.get('price_list')?.setValue(parseInt(product?.price_list ?? '0',10));

      control.get('unit_measurement')?.setValue(product?.unit.measurement);
      control.get('unit_unit')?.setValue(product?.unit.unit);
    })

    // Disable the controls after setting values
    control.get('product_cost')?.disable({ emitEvent: false, onlySelf: true });
    control.get('product_code')?.disable({ emitEvent: false, onlySelf: true });

    control.get('discount')?.disable({emitEvent: false, onlySelf: true });
    control.get('discount_price')?.disable({emitEvent: false, onlySelf: true});
    control.get('discount_type')?.disable({emitEvent: false, onlySelf: true});
    control.get('price_list')?.disable({emitEvent: false, onlySelf: true});

    control.get('discount_type_item')?.valueChanges.subscribe((res) => {
      if(res === 'percent'){
        control.get('discount_price_item')?.setValue(0);
      } 

      if(res === 'price'){
        control.get('discount_item')?.setValue(0);
      }
    })

    control.get('qty')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('product_cost')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('discount_price_item')?.valueChanges.subscribe(() => this.updateTotalCost(control));
    control.get('discount_item')?.valueChanges.subscribe(() => this.updateTotalCost(control))

    
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
      qty: ['', Validators.required],
      product_cost: [{value: '', disabled: true}],
      product_code: [{value: '', disabled: true}],
      discount: [{value: '', disabled: true}],
      price_list: [{value: '', disabled: true}],
      unit_measurement: [''],
      unit_unit: [''],
      total_cost: [''],
      discount_type: ['percent'],
      discount_price: [0],
      discount_item: [0],
      discount_type_item: ['percent'],
      discount_price_item: [0]
    });

    this.order.push(newOrder);

    this.cpValueChangeSubscriptions(newOrder);
  }

  removeOrderAdditional(index: number): void{
    this.orderAdditional.removeAt(index);
  }

  removeOrder(index: number): void {
    if(index === 0){
      return;
    } 

    this.order.removeAt(index);
  }

}
