import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataCategories, IDataInventory, IRootProject } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';
import * as XLSX from 'xlsx';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-add-quotation',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
    NzIconModule,
    CommonModule,
    NzButtonModule,
    NzTabsModule,
    NzUploadModule,
    NzMessageModule,
    NzAlertModule,
    NzDividerModule
  ],
  templateUrl: './add-quotation.component.html',
  styleUrl: './add-quotation.component.scss'
})
export class AddQuotationComponent implements OnInit {

  private nzData = inject(NZ_DRAWER_DATA);

  inventoryList: IDataInventory[] = this.nzData.inventoryList;
  productCategory: IDataCategories[] = this.nzData.productCategory;

  modal_type: string = 'add'

  quotationForm = this.fb.group({
    id: [null],
    project_type: ['manual', [Validators.required]],
    project_file: [''],
    project_id: ['', [Validators.required]],
    project_name: ['',[Validators.required]],
    location: [{value: '', disabled: true}],

    customer: [{value: '', disabled: true}],
    customer_location: [{value: '', disabled: true}],

    // consultant: [{value: '', disabled: true}],
    // consultant_location: [{value: '', disabled: true}],


    revision: [{value: 'R0', disabled: true}],
    date: [''],
    engineer_pic: [{value: [''], disabled: true}],
    engineer_pic_internal: [{value: '', disabled: true}],
    engineer_phone_number: [{value: '', disabled: true}],
    stack: [''],
    items: this.fb.array([]),
    contactPerson: this.fb.array([]),
    stacks: this.fb.array([])
  })

  pic$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  fileList: NzUploadFile[] = [];
  attachmentDeletedIds: string[] = [];

  uploadedData: any[] = [];
  headers: string[] = [];

  projects$!: Observable<IRootProject>;
  projectsData: IDataProject[] = [];

  provinceList: any[] = [];

  groupedItems: { [category: string]: any[] } = {};
  uncategorizedItems: any[] = [];

  constructor(
    private drawerRef: NzDrawerRef,
    private fb: UntypedFormBuilder,
    private nzMsgSvc: NzMessageService,
    private cd: ChangeDetectorRef,
    private apiSvc: ApiService
  ){}

  ngOnInit(): void {

    this.pic$ = this.apiSvc.getPic().pipe(
      tap((res) => {
        this.listOfPic = res;
      })
    )

    // Subscribe to project_id changes
    this.quotationForm.get('project_id')?.valueChanges.subscribe((res) => {
      this.quotationForm.get('project_name')?.setValue(res, { emitEvent: false} );
      this.handleProjectChange(res);
    });

    // Subscribe to project_name changes
    this.quotationForm.get('project_name')?.valueChanges.subscribe((res) => {
      this.quotationForm.get('project_id')?.setValue(res, { emitEvent: false} );
      this.handleProjectChange(res);
    });

    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res

      this.projects$ = this.apiSvc.getAllProject().pipe(
        tap(res => {
          this.projectsData = res.data
        })
      );
  
    })


    this.quotationForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.quotationForm.get('is_pic_internal')?.value)){
        this.quotationForm.patchValue({is_pic_internal: ''})
      }
    })
  }

  private handleProjectChange(res: any): void {
    const projectData: IDataProject = this.projectsData.filter((project) => project.id === res)[0];
  
    // const consultant = projectData.customer.contactPerson
    //   .filter(res => res.customer_category.name.toLowerCase().includes('consultant'))
    //   .map(res => ({
    //     name: res.name,
    //     province: res.province,
    //     city: res.city
    //   }));
  
    // Update location and consultant location
    this.getProvinceCity(projectData.province, projectData.city).subscribe((projectLocation) => {
      this.quotationForm.get('location')?.setValue(projectLocation);
    });
  
    // if (consultant.length > 0) {
    //   this.getProvinceCity(consultant[0].province, consultant[0].city).subscribe((consultantLocation) => {
    //     this.quotationForm.get('consultant_location')?.setValue(consultantLocation);
    //   });
    // }

    this.getProvinceCity(projectData.customer.province, projectData.customer.city).subscribe((customerLocation) => {
      this.quotationForm.get('customer_location')?.setValue(customerLocation)
    })

    projectData.customer.contactPerson.forEach((cp) => {
      const existContactPerson = this.fb.group({
        name: [{value: cp.name, disabled: true}],
        role: [{value: cp.customer_category.name, disabled: true}]
      })

      this.contactPersons.push(existContactPerson);
    })

    // Update form with project and consultant details
    this.quotationForm.patchValue({
      // consultant: consultant[0]?.name || null,
      customer: projectData.customer.name
    });
  
    // Handle PIC-related operations
    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res;
  
        // Extract pic id
        const dcePic = projectData.dce_pic.map(item => item.pic_id);
  
        // Find pic internal id
        const isDcePicInternalId = projectData.dce_pic.filter(item => item.is_pic_internal === 1);
  
        this.quotationForm.patchValue({
          engineer_pic: dcePic,
          engineer_pic_internal: isDcePicInternalId[0]?.pic_id || null,
          engineer_phone_number: isDcePicInternalId[0]?.phone || null,
        });
      })
    );
  }

  getProvinceCity(province_id: string, city_id: string): Observable<string>{
    return this.apiSvc.getRegenciesByProvince(parseInt(province_id)).pipe(
      map((res) => {
        const provinceName = this.provinceList.find((item) => item.id === parseInt(province_id))?.province;
        const cityName = res.find((item: any) => item.id === parseInt(city_id))?.regency;
  
        return `${provinceName}-${cityName}`;
      })
    );
  }

  get stacks(): UntypedFormArray {
    return this.quotationForm.get('stacks') as UntypedFormArray;
  }

  get contactPersons(): UntypedFormArray {
    return this.quotationForm.get('contactPerson') as UntypedFormArray
  }

  get items(): UntypedFormArray {
    return this.quotationForm.get('items') as UntypedFormArray;
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
          alias: [value.partNo],
          dn1: [value.dn1 || ''],
          dn2: [value.dn2 || ''],
          qty: [value.qty || ''],
          unit: [{value: filteredInventory[0].unit.name || '', disabled: true} ],
          exist: [true],
          unit_price: [filteredInventory[0].default_selling_price],
          gross_margin: [filteredInventory[0].default_gross_margin],
          total_price: [totalPrice],
          category: [filteredInventory[0].product_category.name],
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

  changeValueOrder(control: UntypedFormGroup, product: any){
    control.get('unit')?.setValue(product?.unit.name);
    control.get('category')?.setValue(product?.product_category.name);
    control.get('gross_margin')?.setValue(product?.default_gross_margin);
    control.get('unit_price')?.setValue(product?.default_selling_price);

    this.calculateTotalPrice(control);
  
  }

  calculateTotalPrice(control: UntypedFormGroup){
    const unitPrice = parseFloat(control.get('unit_price')?.value);
    const qty = parseFloat(control.get('qty')?.value);
    control.get('total_price')?.setValue(qty * unitPrice);
  }

  // Prevent the default automatic upload behavior
  beforeUpload = (file: NzUploadFile): boolean => {

    const isLt5M = file.size! / 1024 / 1024 < 1;
    if (!isLt5M) {
      this.nzMsgSvc.error('Image must be smaller than 1MB!');
      return false;
    }

    this.fileList = this.fileList.concat(file);
    return false; // Stop the auto upload
  };


  removeDocument = (file: NzUploadFile): boolean => {

    //for update deleted attachment
    const matchingFile = this.fileList.find(item => item.uid === file.uid);
    if (matchingFile) {
      this.attachmentDeletedIds.push(matchingFile.uid);
    }

    this.fileList = this.fileList.filter(item => item.uid !== file.uid);
    return true; // Return true to confirm the file removal
  };

  addStacks(){
    const newStacks = this.fb.group({
      name: ['', Validators.required],
      stack_file: [[]],
      stack_attachmentDeleteIds: [[]]
    })

    this.stacks.push(newStacks);
  }

  removeStacks(index: number): void{
    this.stacks.removeAt(index);
  }

  addItems(){
    const newItems = this.fb.group({
      part_number: ['', [Validators.required]],
      description: ['', [Validators.required]],
      alias: [''],
      dn1: [''],
      dn2: [''],
      qty: [0],
      unit: [{value: '', disabled: true}],
      exist: [true],
      unit_price: [''],
      total_price: [''],
      gross_margin: [''],
      category: ['']
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
  
  closeDrawer(){
    this.drawerRef.close();
  }

  submit(){

  }

  beforeUploadStacks(index: number) {
    return (file: NzUploadFile): boolean => {

      const isLt5M = file.size! / 1024 / 1024 < 1
      if (!isLt5M) {
        this.nzMsgSvc.error('Image must be smaller than 1MB!');
        return false;
      }

      const stacksForm = this.stacks.at(index);
  
      const fileList = stacksForm.get('stack_file')?.value || [];
      stacksForm.get('stack_file')?.setValue([...fileList, file]);
  
      return false;
    };
  }

  handleRemoveAttachmentStacks(index: number) {
    return (file: NzUploadFile): boolean => {
      const stacksForm = this.stacks.at(index);

      // Get the current file list
      const fileList = stacksForm.get('stack_file')?.value || [];

      // For updating deleted attachment
      const matchingFile = fileList
        .filter((item: NzUploadFile) => item.uid === file.uid)
        .map((item: any) => item.uid);

      // Get or initialize 'cp_attachmentDeleteIds'
      const currentDeleteIds = stacksForm.get('stack_attachmentDeleteIds')?.value || [];
      const updatedDeleteIds = [...currentDeleteIds, ...matchingFile];
      stacksForm.get('stack_attachmentDeleteIds')?.setValue(updatedDeleteIds);

      // Filter out the file to be removed
      const updatedFileList = fileList.filter((item: NzUploadFile) => item.uid !== file.uid);
      
      // Update the form control value
      stacksForm.get('stack_file')?.setValue(updatedFileList);
  
      return true; // Return true to allow removal
    }

  }

  get objectKeys() {
    return Object.keys;
  }
}
