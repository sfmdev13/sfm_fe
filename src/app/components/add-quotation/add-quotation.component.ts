import { CommonModule, DatePipe } from '@angular/common';
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
import { IDataCategories, IDataInventory, IDataQuotation, IRootProject } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';
import * as XLSX from 'xlsx';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SpinnerService } from 'src/app/spinner.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

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
    NzDividerModule,
    NzModalModule
  ],
  providers: [DatePipe],
  templateUrl: './add-quotation.component.html',
  styleUrl: './add-quotation.component.scss'
})
export class AddQuotationComponent implements OnInit {

  private nzData = inject(NZ_DRAWER_DATA);

  inventoryList: IDataInventory[] = this.nzData.inventoryList;
  productCategory: IDataCategories[] = this.nzData.productCategory;
  modal_type: string = this.nzData.modal_type;
  dataQuotation: IDataQuotation = this.nzData.dataQuotation;

  pic_id = localStorage.getItem('pic_id')!;

  quotationForm = this.fb.group({
    id: [null],
    quotation_no: [{value: '', disabled: true}],
    prepared_by: [{value: this.pic_id, disabled: true }],
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
    quotation_stack_deleted_ids: [[]],
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

  isLoadingPic = true;

  totalGrandCost: number = 0;

  isUpdateFile: boolean = false;

  deletedStackIds: string[] = [];

  constructor(
    private drawerRef: NzDrawerRef,
    private fb: UntypedFormBuilder,
    private nzMsgSvc: NzMessageService,
    private cd: ChangeDetectorRef,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private datePipe: DatePipe,
  ){}

  ngOnInit(): void {

    this.items.valueChanges.subscribe(() => {
      this.calculateGrandTotalPrice();
    });

    this.quotationForm.get('date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.quotationForm.patchValue({date: formattedDate})
    })

    this.pic$ = this.apiSvc.getPic().pipe(
      tap((res) => {
        this.listOfPic = res;
        this.filteredListOfPic = this.listOfPic;
        this.isLoadingPic = false;
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

    if(this.modal_type === 'edit' || this.modal_type === 'revision'){

      const newUpdateFileList: NzUploadFile[] = [{
        uid: this.dataQuotation.quotation?.project_document.id,
        name: this.dataQuotation.quotation?.project_document.file_name,
        status: 'done',
        url: this.dataQuotation.quotation?.project_document.file_url,
        response: {
          id: this.dataQuotation.quotation?.project_document.id,
          attachment_path: this.dataQuotation.quotation?.project_document.attachment_path
        } 
      }]

      this.fileList = newUpdateFileList;


      this.quotationForm.patchValue({
        id: this.dataQuotation.quotation.id,
        prepared_by: this.dataQuotation.pic[0].pic_id,
        project_id: this.dataQuotation.id,
        project_name: this.dataQuotation.id,
        customer: this.dataQuotation.customer.name,
        date: this.dataQuotation.issue_date,
        revision: this.dataQuotation.quotation?.revision,
        quotation_no: this.dataQuotation.quotation?.quotation_no
      })

      this.quotationForm.get('project_id')?.disable();
      this.quotationForm.get('project_name')?.disable();

      //edit location
      this.getProvinceCity(this.dataQuotation.province, this.dataQuotation.city).subscribe((projectLocation) => {
        this.quotationForm.get('location')?.setValue(projectLocation);
      });

      this.getProvinceCity(this.dataQuotation.customer.province, this.dataQuotation.customer.city).subscribe((customerLocation) => {
        this.quotationForm.get('customer_location')?.setValue(customerLocation)
      })

      //edit contact person
      this.dataQuotation.customer.contactPerson.forEach((cp) => {
        const existCp = this.fb.group({
          name: [{value: cp.name, disabled: true}],
          role: [{value: cp.customer_category.name, disabled: true}]
        })

        this.contactPersons.push(existCp);
      })

      //edit pic

      const dcePicIds = this.dataQuotation.dce_pic.map((item) => item.pic_id);

      const isHeadPicId = this.dataQuotation.dce_pic.filter((item) => item.is_pic_internal === 1);


      this.quotationForm.patchValue({
        engineer_pic: dcePicIds,
        engineer_pic_internal: isHeadPicId[0].pic_id,
        engineer_phone_number: isHeadPicId[0].phone
      })


      //edit stack
      this.dataQuotation.quotation.quotation_stack.forEach((stack) => {

        const updateStackFile: NzUploadFile[] = [{
          uid: stack.stack_file.id,
          name: stack.stack_file.file_name,
          status: 'done',
          url: stack.stack_file.file_url,
          response: {
            id: stack.stack_file.id,
            attachment_path: stack.stack_file.attachment_path
          },
          isImageUrl: true
        }]

        const updateStack = this.fb.group({
          id: [stack.id],
          name: [stack.name, Validators.required],
          stack_file: [updateStackFile, Validators.required],
          stack_new: [false],
          stack_updated: [false],
          stack_attachmentDeleteIds: [[]]
        })

        this.stacks.push(updateStack);
      })

      //edit item
      this.dataQuotation.quotation?.quotation_items.forEach((item) => {
        const totalPrice = parseFloat(item.inventory.default_selling_price) * parseFloat(item.qty)

        const editItems = this.fb.group({
          part_number: [item.inventory.id, Validators.required],
          description: [item.inventory.id, Validators.required],
          alias: [item.inventory.alias, Validators.required],
          dn1: [item.dn_1],
          dn2: [item.dn_2],
          qty: [item.qty],
          unit:[{value: item.inventory.unit.name, disabled: true}],
          exist: [true],
          unit_price: [item.inventory.default_selling_price],
          gross_margin: [item.inventory.default_gross_margin],
          total_price: [totalPrice],
          category: [item.inventory.supplier_product.name]
        })

        this.items.push(editItems);
        this.itemValueChangeSubscription(editItems);
      })

      this.updateGroupedItems();


      // Explicitly mark the form array as dirty or updated
      this.items.markAsDirty();
      this.items.updateValueAndValidity();

      // Trigger change detection
      this.cd.detectChanges();
    }
  }

  calculateGrandTotalPrice() {
    this.totalGrandCost = this.items.controls.reduce((sum, group) => {
      const totalPrice = group.get('total_price')?.value || 0;
      return sum + Number(totalPrice);
    }, 0);
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
    control.get('inventory_id')?.setValue(product?.id)
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
    
    this.isUpdateFile = true;

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
      id: [''],
      name: ['', Validators.required],
      stack_file: [[], Validators.required],
      stack_new: [true],
      stack_updated: [false],
      stack_attachmentDeleteIds: [[]]
    })

    this.stacks.push(newStacks);
  }

  removeStacks(index: number): void{

    this.deletedStackIds.push(this.stacks.at(index).get('id')?.value);

    this.stacks.removeAt(index);
  }

  addItems(){
    const newItems = this.fb.group({
      inventory_id: [''],
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

    this.spinnerSvc.show();

    if(this.quotationForm.valid){

      if(this.modal_type === 'add'){
        const stackComplete = this.stacks.value.map((stack: any) => ({
          name: stack.name,
          stack_document: stack.stack_file
        }))
        
        const inventoryComplete = this.items.value.map((item: any) => ({
          inventory_id: item.part_number,
          qty: item.qty,
          dn_1: item.dn1,
          dn_2: item.dn2
        }))

        const body = {
          project_id: this.quotationForm.get('project_id')?.value,
          quotation_type: this.quotationForm.get('project_type')?.value,
          issued_date: this.quotationForm.get('date')?.value,
          inventories: inventoryComplete
        }
  
        const formData = new FormData();
  
        //append basic body
        Object.keys(body).forEach(key => {
          if(typeof (body as any)[key] === 'object'){
            formData.append(key, JSON.stringify((body as any)[key]))
          } else {
            formData.append(key, ( body as any )[key]);
          }
        })
  
        //append project document
        if (this.fileList.length > 0) {
          this.fileList.forEach((file: any) => {
            formData.append('project_document', file);
          });
        }
  
        //append stack
        stackComplete.forEach((stack: any, index: number) => {
          Object.keys(stack).forEach(key => {
            if (key !== 'stack_document') {
              formData.append(`quotation_stack[${index}][${key}]`, stack[key]);
            }
          })
  
          //append stack file
          if (stack.stack_document.length > 0) {
            stack.stack_document.forEach((file: any, fileIndex: number) => {
              formData.append(`quotation_stack[${index}][stack_document]`, file);
            });
          }
        })
  
        this.apiSvc.createQuotation(formData).subscribe({
          next: (response) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Create Quotation',
              nzOkText: 'Ok',
              nzCentered: true
            });

            this.apiSvc.triggerRefreshQuotation();
          },
          error: (error) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.error({
              nzTitle: 'Unable to Create Quotation',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            });
          },
          complete: () => {
            this.drawerRef.close();
          }
        });
      }


      if(this.modal_type === 'edit' || this.modal_type === 'revision'){
        const stackComplete = this.stacks.value.map((stack: any) => ({
          id: stack.id,
          name: stack.name,
          stack_document: stack.stack_file,
          stack_new: stack.stack_new,
          stack_updated: stack.stack_updated
        }))
        
        const inventoryComplete = this.items.value.map((item: any) => ({
          inventory_id: item.part_number,
          qty: item.qty,
          dn_1: item.dn1,
          dn_2: item.dn2
        }))

        const body = {
          id: this.quotationForm.get('id')?.value,
          edit_type: this.modal_type,
          project_id: this.quotationForm.get('project_id')?.value,
          quotation_type: this.quotationForm.get('project_type')?.value,
          issued_date: this.quotationForm.get('date')?.value,
          quotation_stack_deleted_ids: this.deletedStackIds,
          inventories: inventoryComplete,
        }
  
        const formData = new FormData();
  
        //append basic body
        Object.keys(body).forEach(key => {
          if(typeof (body as any)[key] === 'object'){
            formData.append(key, JSON.stringify((body as any)[key]))
          } else {
            formData.append(key, ( body as any )[key]);
          }
        })
        
        if(this.isUpdateFile){
          //append project document
          if (this.fileList.length > 0) {
            this.fileList.forEach((file: any) => {
              formData.append('project_document', file);
            });
          }
        }

        //append stack
        stackComplete.forEach((stack: any, index: number) => {
          if(stack.stack_updated){
            formData.append(`quotation_stack[${index}][id]`, stack.id);
          }
          formData.append(`quotation_stack[${index}][name]`, stack.name);
  
          //append stack file
          if (stack.stack_document.length > 0) {
            stack.stack_document.forEach((file: any, fileIndex: number) => {
              if(stack.stack_updated || stack.stack_new){
                formData.append(`quotation_stack[${index}][stack_document]`, file);
              } else {
                formData.append(`quotation_stack[${index}][stack_document]`, '');
              }
            });
          }
        })
  
        this.apiSvc.editQuotation(formData).subscribe({
          next: (response) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Customer',
              nzOkText: 'Ok',
              nzCentered: true
            });

            this.apiSvc.triggerRefreshQuotation();
          },
          error: (error) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.error({
              nzTitle: 'Unable to Add Customer',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            });
          },
          complete: () => {
            this.drawerRef.close();
          }
        });
      }



    } else {
      Object.values(this.quotationForm.controls).forEach(control => {
        if (control.invalid) {
          console.log('Invalid Control:', control);
          console.log('Errors:', control.errors);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      this.spinnerSvc.hide();

      this.modalSvc.error({
        nzTitle: 'Unable to add customer',
        nzContent: 'Need to fill all the input',
        nzOkText: 'Ok',
        nzCentered: true
      });
    }

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
      stacksForm.get('stack_updated')?.setValue(true);
  
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
