import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootInventory, IRootSupplier } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchaseOrderComponent implements OnInit {

  pic$!: Observable<any>;
  supplier$!: Observable<any>;
  inventories$!: Observable<IRootInventory>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  purchaseForm = this.fb.group({
    id: [null],
    supplier_id: ['', Validators.required],
    date: ['', Validators.required],
    reference_no: ['', Validators.required],
    description: ['', Validators.required],
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    additional_cost: [''],
    order: this.fb.array([])
  })

  inventoryList: IRootInventory = {} as IRootInventory;

  totalOrder: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
  ) { }

  ngOnInit(): void {

    this.purchaseForm.get('date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.purchaseForm.patchValue({date: formattedDate})
    })

    this.purchaseForm.get('additional_cost')?.valueChanges.subscribe((res) => {
      this.totalOrder += parseInt(res)
    })

    this.order.valueChanges.subscribe(() => {
      const totalSum = this.calculateTotalCost();
      this.totalOrder = totalSum
    });

    this.purchaseForm.get('supplier_id')?.valueChanges.subscribe((res) => {      
      this.apiSvc.getInventoryBySupplier(res).subscribe(val => {
        this.inventoryList = val;
      })
    })

    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res.filter((p: any) => p.pic_id === this.pic_id);
      })
    )

    this.supplier$ = this.apiSvc.supplierList(); // need supplier short without page

    this.addOrder();
    
  }

  submitPurchase(): void{

    this.spinnerSvc.show()

    const picComplete = this.purchaseForm.get('pic')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id === this.purchaseForm.get('is_pic_internal')!.value ? 1 : 0
    }));

    const inventoryComplete = this.order.value.map((order: any) => ({
      inventory_id: order.inventory_id,
      qty: order.qty.toString()
    }))

    let body = {
      po_number: this.purchaseForm.get('reference_no')?.value,
      description: this.purchaseForm.get('description')?.value,
      supplier_id: this.purchaseForm.get('supplier_id')?.value,
      additional_cost: this.purchaseForm.get('additional_cost')?.value.toString(),
      date: this.purchaseForm.get('date')?.value,
      pic: picComplete,
      inventories: inventoryComplete
    }

    this.apiSvc.addPurchaseOrder(body).subscribe({
      next: () => {
        this.spinnerSvc.hide()

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
      control.get('product_cost')?.setValue(parseInt(product?.product_cost ?? '0', 10), { emit_event: false, onlySelf: true })
    })

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