import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap, startWith, combineLatest } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataAssembly, IDataPurchaseOrder, IRootInvenSupplier } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';

@Component({
  selector: 'app-add-assembly',
  templateUrl: './add-assembly.component.html',
  styleUrls: ['./add-assembly.component.scss']
})
export class AddAssemblyComponent implements OnInit {

  @Input() modal_type: string = '';
  @Input() dataDetail: IDataAssembly = {} as IDataAssembly;

  pic$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  assemblyForm = this.fb.group({
    id: [null],
    date: ['', Validators.required],
    description: ['', Validators.required],
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    status: [1, [Validators.required]],
    order: this.fb.array([]),
    order_additional: this.fb.array([])
  })

  inventoryList: IRootInvenSupplier = {} as IRootInvenSupplier;

  totalOrder: number = 0;
  totalGrandOrder: number = 0;

  totalInventoryOrder: number = 0;
  totalAdditionalOrder: number = 0;

  formDisable: boolean = false;

  provinces$!: Observable<any>;
  unit$!: Observable<any>;


  unitList: any[] = [];

  categoryFormUnit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    measurement: ['', Validators.required],
    unit: [''],
    description: ['', Validators.required]
  })

  ModalRefUnit?: NzModalRef;

  deletedOrderAdditional: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
  ) { }

  ngOnInit(): void {

    this.apiSvc.getInventoryList().subscribe((res) => {
      this.inventoryList = res
    })

    this.assemblyForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.assemblyForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.apiSvc.refreshGetCategories$.subscribe(() => {

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
    

    //used for calculate total order and total grand order
    const orderChanges$ = this.order.valueChanges.pipe(startWith(this.order.value));
    const orderAdditionalChanges$ = this.orderAdditional.valueChanges.pipe(startWith(this.orderAdditional.value));
  
    combineLatest([orderChanges$,orderAdditionalChanges$]).subscribe(() => {
      // Recalculate the total order cost
      const totalSumOrder = this.calculateTotalCost();
      const totalSumAdditional = this.calculateTotalCostAdditional();

      this.totalInventoryOrder = totalSumOrder;
      this.totalAdditionalOrder = totalSumAdditional;

      this.totalOrder = totalSumOrder + totalSumAdditional;
  
      this.totalGrandOrder = this.totalOrder;
    });


    this.assemblyForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.assemblyForm.get('is_pic_internal')?.value)){
        this.assemblyForm.patchValue({is_pic_internal: ''})
      }
    })



    this.assemblyForm.get('date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.assemblyForm.patchValue({date: formattedDate})
    })


    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = this.listOfPic.filter(pic => this.pic_id.includes(pic.pic_id));
      })
    )

    this.addOrder();

    if(this.modal_type === 'edit' || this.modal_type === 'duplicate'){

      this.assemblyForm.patchValue({
        id: this.dataDetail.id,
        date: this.dataDetail.date,
        description: this.dataDetail.description
      })

      //update PIC
      this.pic$ = this.apiSvc.getPic().pipe(
        tap(res => {
          this.listOfPic = res;

          //extract pic id
          const picIds = this.dataDetail.pic.map(item => item.pic_id);

          //find pic internal id
          const isPicInternalId = this.dataDetail.pic.filter(item => item.is_pic_internal === 1);

          this.assemblyForm.patchValue({
            pic: picIds,
            is_pic_internal: isPicInternalId[0].pic_id,
          });
        })
      )
      
  
      //clear existing order
      while (this.order.length !== 0) {
        this.order.removeAt(0);
      }

      //update orders
      this.dataDetail.assembly_inventory_items.forEach((order) => {
        const updateOrder = this.fb.group({
          inventory_id: order.inventory.id,
          product_code: order.inventory.code,
          qty: parseInt(order.qty),
          unit_measurement: order.inventory.unit.measurement,
          unit_unit: order.inventory.unit.unit,
          product_cost: parseInt(order.inventory.product_cost),
          total_cost: parseInt(order.total_product_cost),
          price_list: parseInt(order.inventory.price_list),
          discount: parseInt(order.inventory.discount),
          discount_type: order.inventory.discount_type,
          discount_price: parseInt(order.inventory.discount_price)
        })

        this.order.push(updateOrder);
        this.cpValueChangeSubscriptions(updateOrder)
      })
      
      this.dataDetail.assembly_additional_items.forEach((order) => {
        const updateOrderAdd = this.fb.group({
          id: order.id,
          product_description: order.product_description,
          qty: parseInt(order.qty),
          unit_id: order.unit.id,
          price_list: parseInt(order.price_list),
          discount: parseInt(order.discount),
          discount_type: order.discount_type,
          discount_price: parseInt(order.discount_price),
          total_cost: parseInt(order.total_product_cost),
          measurement: order.unit.measurement,
          unit: order.unit.unit          
        })

        this.orderAdditional.push(updateOrderAdd),
        this.cpValueChangeSubscriptionsAdditional(updateOrderAdd)
      })
    }

    
  }

  getInventoryDescription(order: any): string {
    return this.inventoryList?.data?.find(invent => invent.id === order.get('inventory_id')?.value)?.description ?? '';
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

  submitPurchase(): void{

    this.spinnerSvc.show()


    const picComplete = this.assemblyForm.get('pic')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id === this.assemblyForm.get('is_pic_internal')!.value ? 1 : 0
    }));

    const inventoryComplete = this.order.value.map((order: any) => ({
      inventory_id: order.inventory_id,
      qty: order.qty.toString()
    }))

    let additionalComplete = null;

    if(this.orderAdditional.length > 0){
      additionalComplete = this.orderAdditional.value.map((order: any) => ({
        id: order.id,
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
        id: this.assemblyForm.get('id')?.value,
        description: this.assemblyForm.get('description')?.value,
        date: this.assemblyForm.get('date')?.value,
        pic_new: picComplete,
        inventories_new: inventoryComplete,
        additional_items_new: additionalComplete,
        deleted_additional_item_ids: this.deletedOrderAdditional,
        status: this.assemblyForm.get('status')?.value
      }

      this.apiSvc.updateAssembly(body).subscribe({
        next: () => {
          this.spinnerSvc.hide()
          this.apiSvc.triggerRefreshAssembly();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Edit Assembly Inventory',
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
        id: this.assemblyForm.get('id')?.value,
        description: this.assemblyForm.get('description')?.value,
        date: this.assemblyForm.get('date')?.value,
        pic: picComplete,
        inventories: inventoryComplete,
        additional_items: additionalComplete,
        status: this.assemblyForm.get('status')?.value
      }
      
      
      this.apiSvc.createAssembly(body).subscribe({
        next: () => {
          this.spinnerSvc.hide()
          this.apiSvc.triggerRefreshAssembly();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Created',
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
    let totalCost = qty * productCost;

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
    return this.assemblyForm.get('order') as FormArray;
  }

  get orderAdditional(): FormArray{
    return this.assemblyForm.get('order_additional') as FormArray;
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
    this.deletedOrderAdditional.push(this.orderAdditional.at(index).get('id')?.value);
    this.orderAdditional.removeAt(index);
  }

  removeOrder(index: number): void {
    if(index === 0){
      return;
    } 

    this.order.removeAt(index);
  }

}
