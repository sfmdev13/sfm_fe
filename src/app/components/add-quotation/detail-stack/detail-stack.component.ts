import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { IDataCategories, IDataInventory } from 'src/app/interfaces';
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
  productCategory: IDataCategories[] = this.nzData.productCategory;
  
  groupedItems: { [category: string]: { items: UntypedFormGroup[]; discount: UntypedFormControl } } = {};
  uncategorizedItems: any[] = [];

  uploadedData: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2
  ) {

  }

  ngOnInit(): void {
    this.updateGroupedItems();
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
          category: [filteredInventory[0].product_category.id],
          i_part_number: [filteredInventory[0].code],
          i_description: [filteredInventory[0].description],
          installation_unit_inch_qty: [{value: parseFloat(filteredInventory[0].inventory_installation.unit_inch_qty) ,disabled: true}],
          installation_unit_price: [{value: parseFloat(filteredInventory[0].inventory_installation.price), disabled: true}],
          installation_unit_price_type: [{value: filteredInventory[0].inventory_installation.price_type, disabled: true}],
          installation_price_per_unit: [{value: parseFloat(filteredInventory[0].inventory_installation.price_per_unit), disabled: true}],
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

        // Delay to allow DOM changes to render
        setTimeout(() => {
          // Find the item's new DOM element using its part number
          const itemElement = document.querySelector(`[data-id="${value}"]`);
          if (itemElement) {
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.renderer.setStyle(itemElement, 'background-color', 'yellow'); // Highlight the item for visibility
            setTimeout(() => this.renderer.removeStyle(itemElement, 'background-color'), 2000); // Remove highlight after 2 seconds
          }
        }, 0);
        
        isUpdating = false;
      }
    });

    control.get('part_number')?.valueChanges.subscribe(value => {
      if (!isUpdating) {
        isUpdating = true;
    
        // Find the product and update the category
        const product = this.inventoryList.find((p: any) => p.id === value);
        control.get('description')?.setValue(product?.id, { emitEvent: false }); // Disable event trigger
        this.changeValueOrder(control, product);
        this.updateGroupedItems();
    
        // Delay to allow DOM changes to render
        setTimeout(() => {
          // Find the item's new DOM element using its part number
          const itemElement = document.querySelector(`[data-id="${value}"]`);
          if (itemElement) {
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.renderer.setStyle(itemElement, 'background-color', 'yellow'); // Highlight the item for visibility
            setTimeout(() => this.renderer.removeStyle(itemElement, 'background-color'), 2000); // Remove highlight after 2 seconds
          }
        }, 0);
    
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
    control.get('category')?.setValue(product?.product_category.id);
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
  
    const categoryMap = this.productCategory.reduce((map, category) => {
      map[category.id] = { ...category, discount: 0 }; // Initialize discount as 0
      return map;
    }, {} as { [id: number]: IDataCategories & { discount: number } });
  
    const grouped = itemsArray.reduce((acc, control) => {
      const categoryId = control.get('category')?.value || null;
  
      const groupKey = categoryId
        ? categoryMap[categoryId]?.name || 'Uncategorized'
        : 'Uncategorized';
  
      if (!acc[groupKey]) {
        acc[groupKey] = {
          items: [],
          discount: new UntypedFormControl(0), // Form control for discount
        };
      }
      acc[groupKey].items.push(control);
      return acc;
    }, {} as { [categoryName: string]: { items: UntypedFormGroup[]; discount: UntypedFormControl } });
  
    this.productCategory.forEach((category) => {
      if (!grouped[category.name]) {
        grouped[category.name] = {
          items: [],
          discount: new UntypedFormControl(0),
        };
      }
    });
  
    if (!grouped['Uncategorized']) {
      grouped['Uncategorized'] = {
        items: [],
        discount: new UntypedFormControl(0),
      };
    }
  
    // Sort categories by level
    this.groupedItems = Object.keys(grouped)
      .sort((a, b) => {
        const levelA = this.productCategory.find((category) => category.name === a)?.level || '9999';
        const levelB = this.productCategory.find((category) => category.name === b)?.level || '9999';
        return parseInt(levelA, 10) - parseInt(levelB, 10);
      })
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {} as { [categoryName: string]: { items: UntypedFormGroup[]; discount: UntypedFormControl } });
  
    // Update unit prices based on discount
    Object.keys(this.groupedItems).forEach((categoryName) => {
      const group = this.groupedItems[categoryName];
  
      group.discount.valueChanges.subscribe((discount) => {
        group.items.forEach((item) => {
          const unitPriceControl = item.get('unit_price');
          const originalPrice = item.get('original_unit_price')?.value;

          const totalPriceControl = item.get('total_price');
          const originalTotalPrice = item.get('original_total_price')?.value;
  
          if (!originalPrice) {
            item.addControl('original_unit_price', new UntypedFormControl(unitPriceControl?.value));
          }

          if(!originalTotalPrice){
            item.addControl('original_total_price', new UntypedFormControl(totalPriceControl?.value));
          }
  
          const discountedPrice = originalPrice * (1 - discount / 100);
          unitPriceControl?.setValue(discountedPrice, { emitEvent: false });

          totalPriceControl?.setValue(unitPriceControl?.value *  item.get('qty')?.value, { emitEvet: false})
        });
      });
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

  calculateGlobalIndex(categoryIndex: number, itemIndex: number): number {
    let count = 0;
    const keys = Object.keys(this.groupedItems);
    
    // Count all items in previous categories
    for (let i = 0; i < categoryIndex; i++) {
      count += this.groupedItems[keys[i]].items.length;
    }
    
    // Add the current item index
    return count + itemIndex + 1; // 1-based index
  }
  
}
