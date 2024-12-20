import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IDataInventory } from 'src/app/interfaces';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detail-stack',
  standalone: true,
  imports: [
    CommonModule, 
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzAlertModule,
    NzInputModule,
    NzTabsModule,
    NzInputNumberModule,
    NzRadioModule
  ],
  templateUrl: './detail-stack.component.html',
  styleUrl: './detail-stack.component.scss'
})
export class DetailStackComponent implements OnInit {
  private nzData = inject(NZ_MODAL_DATA);

  inventoryList: IDataInventory[] = this.nzData.inventoryList;
  modalType: string = this.nzData.modal_type;
  stackForm: FormGroup = this.nzData.stackForm;
  
  groupedItems: { [category: string]: any[] } = {};
  uncategorizedItems: any[] = [];

  // stackForm = this.fb.group({
  //   stack_type: ['manual'],
  //   items: this.fb.array([])
  // })

  uploadedData: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {

    // console.log(this.stackForm.value);
    // this.items.push(this.stackForm.value.items);

    this.updateGroupedItems();
    
    // if(this.modalType === 'add'){
    //   if(!sessionStorage.getItem(this.stackDetail.id_detail)){
    //     return
    //   }

    //   const existingStack =  JSON.parse(sessionStorage.getItem(this.stackDetail.id_detail)!);

    //   //edit item
    //   existingStack.items.forEach((item: any) => {

    //     const selectedInventory = this.inventoryList.filter((invent) => invent.id === item.description)[0];

    //     const totalPrice = parseFloat(selectedInventory.default_selling_price) * parseFloat(item.qty)
        
    //     const editItems = this.fb.group({
    //       part_number: [selectedInventory.id, Validators.required],
    //       description: [selectedInventory.id, Validators.required],
    //       alias: [{value: selectedInventory.alias, disabled: true}, Validators.required],
    //       dn1: [item.dn1],
    //       dn2: [item.dn2],
    //       qty: [item.qty],
    //       unit:[{value: selectedInventory.unit.name, disabled: true}],
    //       exist: [item.exist],
    //       unit_price: [selectedInventory.alias],
    //       gross_margin: [selectedInventory.default_gross_margin],
    //       total_price: [totalPrice],
    //       category: [selectedInventory.product_category.name],
    //       i_part_number: [selectedInventory.code],
    //       i_description: [selectedInventory.description],
    //       installation_unit_inch_qty: [{value: parseFloat(selectedInventory.inventory_installation.unit_inch_qty) ,disabled: true}],
    //       installation_unit_price: [{value: parseFloat(selectedInventory.inventory_installation.price), disabled: true}],
    //       installation_unit_price_type: [{value: selectedInventory.inventory_installation.price_type, disabled: true}],
    //       installation_price_per_unit: [{value: parseFloat(selectedInventory.inventory_installation.price_per_unit), disabled: true}],
    //       installation_price_factor: [{value: parseFloat(selectedInventory.inventory_installation.price_factor), disabled: true}],
    //       installation_selling_price: [{value: parseFloat(selectedInventory.inventory_installation.selling_price), disabled: true}],
    //       installation_gross_margin: [{value: parseFloat(selectedInventory.inventory_installation.gross_margin), disabled: true}],
    //     })

    //     this.items.push(editItems);
    //     this.itemValueChangeSubscription(editItems);
    //   })

    //   this.updateGroupedItems();


    //   // Explicitly mark the form array as dirty or updated
    //   this.items.markAsDirty();
    //   this.items.updateValueAndValidity();

    //   // Trigger change detection
    //   this.cd.detectChanges();
    // }
  }



  submitStackTemp(){
    
    // sessionStorage.setItem(this.stackDetail.id_detail, JSON.stringify(this.stackForm.value));
    this.destroyModal();
  }

  get items(): UntypedFormArray {
    return this.stackForm.get('items') as UntypedFormArray
  }

  clearAllItem(){
    this.items.clear();
    this.updateGroupedItems();
  }

  onFileExcelChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Assuming the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      // Convert sheet to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Transform to array of objects
      const [headers, ...rows] = jsonData;
  
      this.uploadedData = rows.map((row: any) => {
        return {
          description: row[0],
          partNo: row[1],
          dn1: row[2],
          dn2: row[3],
          qty: row[4],
          unit: row[5],
          unit_price: row[6],
          total_price: row[7]
        };
      });
      
      this.mappingToFormItem(this.uploadedData)
    };

    reader.readAsArrayBuffer(file);

  }

  mappingToFormItem(file: any[]): void{

    file.forEach((value) => {
      const filteredInventory = this.inventoryList.filter((invent) => invent.alias === value.partNo);
  
      let updatedItemAdd;
  
      if (filteredInventory.length > 0) {
        const totalPrice = parseFloat(filteredInventory[0].default_selling_price) * parseFloat(value.qty)
        updatedItemAdd = this.fb.group({
          part_number: [filteredInventory[0].id || '', [Validators.required]], // Match JSON keys
          description: [filteredInventory[0].id || '', [Validators.required]],
          alias: [{value: value.partNo, disabled: true}],
          dn1: [value.dn1 || ''],
          dn2: [value.dn2 || ''],
          qty: [value.qty || ''],
          unit: [{value: filteredInventory[0].unit.name || '', disabled: true} ],
          exist: [true],
          unit_price: [filteredInventory[0].default_selling_price],
          gross_margin: [filteredInventory[0].default_gross_margin],
          total_price: [totalPrice],
          category: [filteredInventory[0].product_category.name],
          i_part_number: [filteredInventory[0].code],
          i_description: [filteredInventory[0].description],
          installation_unit_inch_qty: [{value: parseFloat(filteredInventory[0].inventory_installation.unit_inch_qty) ,disabled: true}],
          installation_unit_price: [{value: parseFloat(filteredInventory[0].inventory_installation.price), disabled: true}],
          installation_unit_price_type: [{value: filteredInventory[0].inventory_installation.price_type, disabled: true}],
          installation_price_per_unit: [{value: parseFloat(filteredInventory[0].inventory_installation.price_per_unit), disbaled: true}],
          installation_price_factor: [{value: parseFloat(filteredInventory[0].inventory_installation.price_factor), disabled: true}],
          installation_selling_price: [{value: parseFloat(filteredInventory[0].inventory_installation.selling_price), disabled: true}],
          installation_gross_margin: [{value: parseFloat(filteredInventory[0].inventory_installation.gross_margin), disabled: true}],
        });
      } else {
        updatedItemAdd = this.fb.group({
          part_number: [value.partNo || '', [Validators.required]], // Match JSON keys
          description: [value.description || '', [Validators.required]],
          alias: [value.partNo],
          dn1: [value.dn1 || ''],
          dn2: [value.dn2 || ''],
          qty: [value.qty || ''],
          unit: [value.unit || ''],
          exist: [false],
          unit_price: [value.unit_price],
          gross_margin: [0],
          total_price: [value.total_price],
          category: [''],
          i_part_number: [''],
          i_description: [''],
          installation_unit_inch_qty: [0],
          installation_unit_price: [0],
          installation_unit_price_type: ['price'],
          installation_price_per_unit: [0],
          installation_price_factor: [0],
          installation_selling_price: [0],
          installation_gross_margin: [0],
        });
      }
  
      this.items.push(updatedItemAdd);
      this.itemValueChangeSubscription(updatedItemAdd);

    });

      this.updateGroupedItems();


      // Explicitly mark the form array as dirty or updated
      this.items.markAsDirty();
      this.items.updateValueAndValidity();

      // Trigger change detection
      this.cd.detectChanges();
  }


  addItems(){
    const newItems = this.fb.group({
      inventory_id: [''],
      part_number: ['', [Validators.required]],
      description: ['', [Validators.required]],
      alias: [{value: '', disabled: true}],
      dn1: [''],
      dn2: [''],
      qty: [0],
      unit: [{value: '', disabled: true}],
      exist: [true],
      unit_price: [''],
      total_price: [''],
      gross_margin: [''],
      category: [''],

      i_part_number: [''],
      i_description: [''],
      installation_unit_inch_qty: [{value: 0, disabled: true}],
      installation_unit_price: [{value: 0, disabled: true}],
      installation_unit_price_type: [{value: 'price', disabled: true}],
      installation_price_per_unit: [{value: 0, disabled: true}],
      installation_price_factor: [{value: 0, disabled: true}],
      installation_selling_price: [{value: 0, disabled: true}],
      installation_gross_margin: [{value: 0, disabled: true}],
  
    })

    this.items.push(newItems);

    this.updateGroupedItems();

    this.itemValueChangeSubscription(newItems);
  }
  

  removeItem(itemToRemove: UntypedFormGroup): void {
    const index = this.items.controls.indexOf(itemToRemove);
    if (index !== -1) {
      this.items.removeAt(index);
      this.updateGroupedItems();
    }
  }

  itemValueChangeSubscription(control: UntypedFormGroup){
    let isUpdating = false;

    control.get('description')?.valueChanges.subscribe(value => {
      if (!isUpdating) {
        isUpdating = true;
        const product = this.inventoryList.find((p: any) => p.id === value);
        control.get('part_number')?.setValue(product?.id, { emitEvent: false }); // Disable event trigger
        this.changeValueOrder(control, product);
        this.updateGroupedItems();
        isUpdating = false;
      }
    });

    control.get('part_number')?.valueChanges.subscribe(value => {
      if (!isUpdating) {
        isUpdating = true;
        const product = this.inventoryList.find((p: any) => p.id === value);
        control.get('description')?.setValue(product?.id, { emitEvent: false }); // Disable event trigger
        this.changeValueOrder(control, product);
        this.updateGroupedItems();
        isUpdating = false;
      }
    });

    control.get('qty')?.valueChanges.subscribe(value => {
      this.calculateTotalPrice(control);
    })
  }

  changeValueOrder(control: UntypedFormGroup, product: any){
    control.get('inventory_id')?.setValue(product?.id);
    control.get('alias')?.setValue(product?.alias);
    control.get('unit')?.setValue(product?.unit.name);
    control.get('category')?.setValue(product?.product_category.name);
    control.get('gross_margin')?.setValue(product?.default_gross_margin);
    control.get('unit_price')?.setValue(product?.default_selling_price);

    control.get('i_part_number')?.setValue(product?.code);
    control.get('i_description')?.setValue(product?.description);
    control.get('installation_unit_inch_qty')?.setValue(parseFloat(product?.inventory_installation.unit_inch_qty));
    control.get('installation_unit_price')?.setValue(parseFloat(product?.inventory_installation.price));
    control.get('installation_unit_price_type')?.setValue(product?.inventory_installation.price_type);
    control.get('installation_price_per_unit')?.setValue(parseFloat(product?.inventory_installation.price_per_unit));
    control.get('installation_price_factor')?.setValue(parseFloat(product?.inventory_installation.price_factor));
    control.get('installation_selling_price')?.setValue(parseFloat(product?.inventory_installation.selling_price));
    control.get('installation_gross_margin')?.setValue(parseFloat(product?.inventory_installation.gross_margin));

    this.calculateTotalPrice(control);
  
  }

  
  calculateTotalPrice(control: UntypedFormGroup){
    const unitPrice = parseFloat(control.get('unit_price')?.value);
    const qty = parseFloat(control.get('qty')?.value);
    control.get('total_price')?.setValue(qty * unitPrice);
  }


  updateGroupedItems(): void {
    const itemsArray = this.items.controls as UntypedFormGroup[];

    const categoryOrder = [
      'SRO',
      'Pipe',
      'Fitting',
      'Bracketing',
      'Solvent Cement',
      'Accessories',
    ];


    const grouped = itemsArray.reduce((acc, control) => {
      const category = control.get('category')?.value || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(control);
      return acc;
    }, {} as { [category: string]: UntypedFormGroup[] });

    this.groupedItems = Object.keys(grouped)
    .sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      // Categories not in the predefined order will appear at the end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as { [category: string]: UntypedFormGroup[] });

    // Remove empty categories
    Object.keys(this.groupedItems).forEach((key) => {
      if (this.groupedItems[key].length === 0) {
        delete this.groupedItems[key];
      }
    });
  }

  destroyModal(): void{
    this.modal.destroy();
  }

  get objectKeys() {
    return Object.keys;
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };
}
