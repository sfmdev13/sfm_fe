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
import { iif, map, Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataCategories, IDataCustomer, IDataInventory, IDataQuotation, IRootProject } from 'src/app/interfaces';
import { ICustomerProject, IDataProject, IProjectCustomer } from 'src/app/interfaces/project';
import * as XLSX from 'xlsx';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SpinnerService } from 'src/app/spinner.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DetailStackComponent } from './detail-stack/detail-stack.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';

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
    NzModalModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzInputNumberModule,
    NzRadioModule
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
  projectsData: IDataProject[] = this.nzData.projectData;

  pic_id = localStorage.getItem('pic_id')!;

  quotationForm = this.fb.group({
    id: [null],
    quotation_no: [{value: '', disabled: true}],
    prepared_by: [{value: this.pic_id, disabled: true }],
    project_type: ['manual', [Validators.required]],
    // project_file: [''],
    project_id: ['', [Validators.required]],
    project_name: ['',[Validators.required]],
    location: [{value: '', disabled: true}],

    customer: [''],
    customer_location: [{value: '', disabled: true}],


    revision: [{value: '', disabled: true}],
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

  provinceList: any[] = [];

  groupedItems: { [category: string]: any[] } = {};
  uncategorizedItems: any[] = [];

  isLoadingPic = true;

  totalGrandCost: number = 0;

  isUpdateFile: boolean = false;

  deletedStackIds: string[] = [];

  selectedCustomer: IProjectCustomer[] = []

  isCreateQuotationTotal = false;

  selectedTabIndex = 0;

  selectedStack: string[] = [];

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

    this.quotationForm.get('customer')?.valueChanges.subscribe((value) => {

        this.apiSvc.getCustomerDetail(value).subscribe((res) => {
          this.getProvinceCity(res.data.province, res.data.city).subscribe((customerLocation) => {
            this.quotationForm.get('customer_location')?.setValue(customerLocation)
          })
  
          this.contactPersons.clear();
  
          res.data.contactPerson.forEach((cp) => {
            const existContactPerson = this.fb.group({
              id: [{value: cp.id, disabled: true}],
              name: [{value: cp.name, disabled: true}],
              role: [{value: cp.customer_category.name, disabled: true}],
              attention: [false]
            })
  
            this.contactPersons.push(existContactPerson);
          })
        })
      
    })

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
    })




    if(this.modal_type === 'edit' || this.modal_type === 'revision'){

      this.isCreateQuotationTotal = this.dataQuotation.is_create_quotation_total === 1 ? true : false;

      if(this.isCreateQuotationTotal && this.dataQuotation.latest_quotation_revision.quotation_items.length > 0) {
        this.items.clear();

        this.dataQuotation.latest_quotation_revision.quotation_items.forEach((item: any) => {
          const newItem = this.fb.group({
            inventory_id: [item.inventory.id],
            part_number: [item.inventory.id, [Validators.required]],
            description: [item.inventory.id, [Validators.required]],
            alias: [{value: item.inventory.alias, disabled: true}],
            dn1: [item.dn_1 === null || item.dn_1 === '' ? '': parseFloat(item.dn_1)],
            dn2: [item.dn_2 === null || item.dn_2 === '' ? '': parseFloat(item.dn_2)],
            qty: [parseFloat(item.qty)],
            unit: [{value: item.inventory.unit.name, disabled: true}],
            exist: [true],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.name],
      
            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: parseFloat(item.inventory.installation.price_type), disabled: true}],
            installation_price_per_unit: [{value: parseFloat(item.inventory.installation.price_per_unit), disabled: true}],
            installation_price_factor: [{value: parseFloat(item.inventory.installation.price_factor), disabled: true}],
            installation_selling_price: [{value: parseFloat(item.inventory.installation.selling_price), disabled: true}],
            installation_gross_margin: [{value: parseFloat(item.inventory.installation.gross_margin), disabled: true}],
          })

          this.items.push(newItem);
          this.itemValueChangeSubscription(newItem);
        })

        this.updateGroupedItems();
        this.cd.detectChanges();
      }

      const projectData: IDataProject = this.projectsData.filter((project) => project.id === this.dataQuotation.project.id)[0];

      this.selectedCustomer = [...projectData.project_customer]

      // const newUpdateFileList: NzUploadFile[] = [{
      //   uid: this.dataQuotation.quotation?.project_document.id,
      //   name: this.dataQuotation.quotation?.project_document.file_name,
      //   status: 'done',
      //   url: this.dataQuotation.quotation?.project_document.file_url,
      //   response: {
      //     id: this.dataQuotation.quotation?.project_document.id,
      //     attachment_path: this.dataQuotation.quotation?.project_document.attachment_path
      //   } 
      // }]

      // this.fileList = newUpdateFileList; 

      this.quotationForm.get('project_id')?.setValue(this.dataQuotation.project.id, { emitEvent: false })
      this.quotationForm.get('project_name')?.setValue(this.dataQuotation.project.id, { emitEvent: false })
      this.quotationForm.get('customer')?.setValue(this.dataQuotation.customer.id, { emitEvent: false});

      this.quotationForm.patchValue({
        id: this.dataQuotation.id,
        prepared_by: this.dataQuotation.project.pic[0].pic_id,
        date: this.dataQuotation.issued_date,
        revision: this.dataQuotation.latest_quotation_revision?.revision,
        quotation_no: this.dataQuotation?.quotation_no,
      })

      if(this.modal_type === 'revision'){
        this.quotationForm.get('project_id')?.disable();
        this.quotationForm.get('project_name')?.disable();
      }

      //edit location
      this.getProvinceCity(this.dataQuotation.project.province, this.dataQuotation.project.city).subscribe((projectLocation) => {
        this.quotationForm.get('location')?.setValue(projectLocation);
      });

      this.getProvinceCity(this.dataQuotation.customer.province, this.dataQuotation.customer.city).subscribe((customerLocation) => {
        this.quotationForm.get('customer_location')?.setValue(customerLocation)
      })

      //edit contact person
      this.dataQuotation.customer.contactPerson.forEach((cp) => {
        const existCp = this.fb.group({
            id: [{value: cp.id, disabled: true}],
            name: [{value: cp.name, disabled: true}],
            role: [{value: cp.customer_category.name, disabled: true}],
            attention: [cp.is_attention]
        })

        this.contactPersons.push(existCp);
      })

      //edit pic

      const dcePicIds = this.dataQuotation.project.dce_pic.map((item) => item.pic_id);

      const isHeadPicId = this.dataQuotation.project.dce_pic.filter((item) => item.is_pic_internal === 1);


      this.quotationForm.patchValue({
        engineer_pic: dcePicIds,
        engineer_pic_internal: isHeadPicId[0].pic_id,
        engineer_phone_number: isHeadPicId[0].phone
      })


      //edit stack
      this.dataQuotation.quotation_stack.forEach((stack, index) => {

        let updateStackFile: NzUploadFile[] = [];

        if(stack.latest_quotation_bom.bom_quotation_file){
          updateStackFile = [{
            uid: 'aselole',
            name: stack.latest_quotation_bom.bom_quotation_file.file_name,
            status: 'done',
            url: stack.latest_quotation_bom.bom_quotation_file.file_url,
            response: {
              id: stack.latest_quotation_bom.bom_quotation_file.id,
              attachment_path: stack.latest_quotation_bom.bom_quotation_file.attachment_path
            },
            isImageUrl: true
          }]
        }

        let updateStackFileContract: NzUploadFile[] = []

        if(stack.latest_quotation_bom.bom_contract_rev_file){
          updateStackFileContract = [{
            uid: 'aselole',
            name: stack.latest_quotation_bom.bom_contract_rev_file.file_name,
            status: 'done',
            url: stack.latest_quotation_bom.bom_contract_rev_file.file_url,
            response: {
              id: stack.latest_quotation_bom.bom_contract_rev_file.id,
              attachment_path: stack.latest_quotation_bom.bom_contract_rev_file.attachment_path
            },
            isImageUrl: true
          }]
        }

        const updateStack = this.fb.group({
          id: [stack.id],
          stack_revision_bom_id: [stack.latest_quotation_bom.id],
          name: [stack.name, Validators.required],
          new: [false],
          stack_file: [updateStackFile],
          stack_new: [false],
          stack_updated: [false],
          stack_attachmentDeleteIds: [[]],
          stack_file_contract: [updateStackFileContract],
          stack_new_contract: [false],
          stack_updated_contract:[false],
          stack_attachmentDeleteIds_contract: [[]],
          revision_stack: [{value: stack.latest_quotation_bom.stack_revision_quotation, disabled: true}],
          revision_bom_contract: [{value: stack.latest_quotation_bom.stack_bom_contract, disabled: true}],
          revision_contract: [{value: stack.latest_quotation_bom.revision_contract, disabled: true}],
          is_total_quotation: [stack.is_used_for_quotation === 1 ? true : false],
          active: [stack.is_active === 1 ? true : false],
          stack_type: ['manual'],
          items: this.fb.array([])
        })

        this.stacks.push(updateStack);


        const stackGroup = this.stacks.at(index) as FormGroup;

        const itemsArray = stackGroup.get('items') as UntypedFormArray;


        stack.latest_quotation_bom.quotation_stack_items.forEach((item) => {
          const newItem = this.fb.group({
            inventory_id: [item.inventory.id],
            part_number: [item.inventory.id, [Validators.required]],
            description: [item.inventory.id, [Validators.required]],
            alias: [{value: item.inventory.alias, disabled: true}],
            dn1: [item.dn_1 === null || item.dn_1 === '' ? '': parseFloat(item.dn_1)],
            dn2: [item.dn_2 === null || item.dn_2 === '' ? '': parseFloat(item.dn_2)],
            qty: [parseFloat(item.qty)],
            unit: [{value: item.inventory.unit.name, disabled: true}],
            exist: [true],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.name],
      
            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: parseFloat(item.inventory.installation.price_type), disabled: true}],
            installation_price_per_unit: [{value: parseFloat(item.inventory.installation.price_per_unit), disabled: true}],
            installation_price_factor: [{value: parseFloat(item.inventory.installation.price_factor), disabled: true}],
            installation_selling_price: [{value: parseFloat(item.inventory.installation.selling_price), disabled: true}],
            installation_gross_margin: [{value: parseFloat(item.inventory.installation.gross_margin), disabled: true}],
          })
          itemsArray.push(newItem);
          this.updateGroupedItems();
          this.itemValueChangeSubscription(newItem);
        })
      })

    }

  

    this.quotationForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.quotationForm.get('is_pic_internal')?.value)){
        this.quotationForm.patchValue({is_pic_internal: ''})
      }
    })


  }

  createQuotationTotal(){

    this.spinnerSvc.show();

    const stackTotal = this.stacks.value
    .filter((s: any) => s.is_total_quotation === true)
    .map((s: any) => s.id);

    let body = {
      quotation_revision_id: this.dataQuotation.latest_quotation_revision.id,
      selected_stack_ids: stackTotal
    }

    this.stacks.getRawValue().forEach((s) => {
      let stack = `${s.name}`;

      if(s.revision_stack){
        stack = `${s.name} - ${s.revision_stack}`;
      }

      if(s.revision_bom_contract){
        stack = `${s.name} - ${s.revision_contract}`;
      }

      this.selectedStack.push(stack)
    })

    this.apiSvc.createQuotationTotal(body).subscribe({
      next: (response) => {

        this.items.clear();

        response.data.forEach((item: any) => {
          const newItem = this.fb.group({
            inventory_id: [item.inventory.id],
            part_number: [item.inventory.id, [Validators.required]],
            description: [item.inventory.id, [Validators.required]],
            alias: [{value: item.inventory.alias, disabled: true}],
            dn1: [item.dn_1 === null || item.dn_1 === '' ? '': parseFloat(item.dn_1)],
            dn2: [item.dn_2 === null || item.dn_2 === '' ? '': parseFloat(item.dn_2)],
            qty: [parseFloat(item.qty)],
            unit: [{value: item.inventory.unit.name, disabled: true}],
            exist: [true],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.name],
      
            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: parseFloat(item.inventory.installation.price_type), disabled: true}],
            installation_price_per_unit: [{value: parseFloat(item.inventory.installation.price_per_unit), disabled: true}],
            installation_price_factor: [{value: parseFloat(item.inventory.installation.price_factor), disabled: true}],
            installation_selling_price: [{value: parseFloat(item.inventory.installation.selling_price), disabled: true}],
            installation_gross_margin: [{value: parseFloat(item.inventory.installation.gross_margin), disabled: true}],
          })

          this.items.push(newItem);
          this.itemValueChangeSubscription(newItem);
        })
        this.selectedTabIndex = 2;
        this.updateGroupedItems();

        this.isCreateQuotationTotal = true;
        this.cd.detectChanges();
        this.spinnerSvc.hide();

        this.apiSvc.triggerRefreshQuotation();

      },
      error: (error) => {
        this.spinnerSvc.hide();

        this.modalSvc.error({
          nzTitle: `Unable to create quotation total`,
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        });
      }
    })


  }

  openStackDetail(i: number){
    const stackForm = this.stacks.at(i) as FormGroup;
    this.modalSvc.create({
      nzTitle: 'Detail Stacks',
      nzContent: DetailStackComponent,
      nzCentered: true,
      nzData: {
        stackForm,
        inventoryList: this.inventoryList,
        modal_type: this.modal_type
      },
      nzWidth: '100vw'
    })
  }

  calculateGrandTotalPrice() {
    this.totalGrandCost = this.items.controls.reduce((sum, group) => {
      const totalPrice = group.get('total_price')?.value || 0;
      return sum + Number(totalPrice);
    }, 0);
  }
  

  private handleProjectChange(res: any): void {
    const projectData: IDataProject = this.projectsData.filter((project) => project.id === res)[0];
    
    this.selectedCustomer = [...projectData.project_customer]

    // Update location and consultant location
    this.getProvinceCity(projectData.province, projectData.city).subscribe((projectLocation) => {
      this.quotationForm.get('location')?.setValue(projectLocation);
    });
  

    // this.getProvinceCity(projectData.customer.province, projectData.customer.city).subscribe((customerLocation) => {
    //   this.quotationForm.get('customer_location')?.setValue(customerLocation)
    // })

    // projectData.customer.contactPerson.forEach((cp) => {
    //   const existContactPerson = this.fb.group({
    //     name: [{value: cp.name, disabled: true}],
    //     role: [{value: cp.customer_category.name, disabled: true}]
    //   })

    //   this.contactPersons.push(existContactPerson);
    // })

    // Update form with project and consultant details
    // this.quotationForm.patchValue({
    //   customer: projectData.customer.name
    // });
  
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
    control.get('inventory_id')?.setValue(product?.id);
    control.get('alias')?.setValue(product?.alias);
    control.get('unit')?.setValue(product?.unit.name);
    control.get('category')?.setValue(product?.product_category.name);
    control.get('gross_margin')?.setValue(parseFloat(product?.default_gross_margin));
    control.get('unit_price')?.setValue(parseFloat(product?.default_selling_price));

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

    this.fileList = [file];
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
      stack_revision_bom_id: [''],
      name: [''],
      new: [true],
      stack_file: [[]],
      stack_new: [true],
      stack_updated: [false],
      stack_attachmentDeleteIds: [[]],

      revision_stack: [{value: '', disabled: true}],
      stack_file_contract: [''],
      stack_new_contract: [true],
      stack_updated_contract: [false],
      stack_attachmentDeleteIds_contract: [[]],

      revision_bom_contract: [{value: '', disabled: true}],
      revision_contract: [{value: '', disabled: true}],

      is_total_quotation: [false],
      active: [true],
      
      stack_type: ['manual'],
      items: this.fb.array([])
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
      alias: [{value: '', disabled: true}],
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

  editStack(type: 'edit' | 'revision', i: number){

    this.spinnerSvc.show();

    const stackUpdate = this.stacks.at(i).getRawValue();

    const inventoryComplete = stackUpdate.items.map((item: any) => ({
      inventory_id: item.part_number,
      qty: item.qty,
      dn_1: item.dn1,
      dn_2: item.dn2
    }))

    const body = {
      name: stackUpdate.name,
      is_active: stackUpdate ? 1 : 0,
      stack_id: stackUpdate.id,
      stack_revision_bom_id: stackUpdate.stack_revision_bom_id,
      quotation_revision_id: this.dataQuotation.latest_quotation_revision.id,
      edit_type: type,
      quotation_stack_items: inventoryComplete
    }

    const formData = new FormData();

    Object.keys(body).forEach(key => {
      if(typeof (body as any)[key] === 'object'){
        formData.append(key, JSON.stringify((body as any)[key]))
      } else {
        formData.append(key, ( body as any )[key]);
      }
    })

    if (stackUpdate.stack_file.length > 0) {
      stackUpdate.stack_file.forEach((file: any, fileIndex: number) => {
        if(stackUpdate.stack_updated || stackUpdate.stack_new){
          formData.append(`bom_quotation_file`, file);
        } else {
          formData.append(`bom_quotation_file`, '');
        }
      });
    }

    if (stackUpdate.stack_file_contract.length > 0) {
      stackUpdate.stack_file_contract.forEach((file: any, fileIndex: number) => {
        if(stackUpdate.stack_updated_contract || stackUpdate.stack_new_contract){
          formData.append(`bom_contract_rev_file`, file);
        } else {
          formData.append(`bom_contract_rev_file`, '');
        }
      });
    }

    this.apiSvc.updateStackItem(formData).subscribe({
      next: (response) => {
        this.spinnerSvc.hide();

        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: `Successfully ${type === 'edit' ? 'Edit' : 'Revise'} Stack`,
          nzOkText: 'Ok',
          nzCentered: true
        });

        this.apiSvc.triggerRefreshQuotation();
      },
      error: (error) => {
        this.spinnerSvc.hide();

        this.modalSvc.error({
          nzTitle: `Unable ${type === 'edit' ? 'Edit' : 'Revise'} Stack`,
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

  submit(){

    this.spinnerSvc.show();

    if(this.quotationForm.valid){

      this.stacks.value.forEach((s: any) => {
        const hasFalseExist = s.items.some((item: any) => item.exist === false);
        if(hasFalseExist){
          this.modalSvc.error({
            nzTitle: 'Error',
            nzContent: `Project Item need to be registered`,
            nzOkText: 'Ok',
            nzCentered: true
          });
  
          this.spinnerSvc.hide();
  
          return;
        }
      })

      const customer_cp_ids = this.contactPersons.getRawValue().map((cp: any) => cp.id);
      
      const inventoryComplete = this.items.value.map((item: any) => ({
        inventory_id: item.part_number,
        qty: item.qty,
        dn_1: item.dn1,
        dn_2: item.dn2
      }))

      // if(inventoryComplete.length === 0) {
      //   this.modalSvc.error({
      //     nzTitle: 'Error',
      //     nzContent: `Project Item need to be fill`,
      //     nzOkText: 'Ok',
      //     nzCentered: true
      //   });
      
      //   this.spinnerSvc.hide();

      //   return;
      // }

      if(this.modal_type === 'add'){
        const stackComplete = this.stacks.value.map((stack: any) => ({
          quotation_stack_name: stack.name,
          quotation_stack_is_active: stack.active ? 1 : 0,
          quotation_stack_bom_quotation_file: stack.stack_file,
          quotation_stack_bom_contract_rev_file: stack.stack_file_contract,
          quotation_stack_items: stack.items.map((item: any) => ({
            inventory_id: item.part_number,
            qty: item.qty,
            dn_1: item.dn1,
            dn_2: item.dn2
          }))
        }))


        const body = {
          project_id: this.quotationForm.get('project_id')?.value,
          customer_id: this.quotationForm.get('customer')?.value,
          customer_cp_ids,
          quotation_type: this.quotationForm.get('project_type')?.value,
          issued_date: this.quotationForm.get('date')?.value,

          // inventories: inventoryComplete
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
  
        // //append project document
        // if (this.fileList.length > 0) {
        //   this.fileList.forEach((file: any) => {
        //     formData.append('project_document', file);
        //   });
        // }
  
        //append stack
        stackComplete.forEach((stack: any, index: number) => {
          Object.keys(stack).forEach(key => {
            if(![
              'quotation_stack_bom_quotation_file', 
              'quotation_stack_bom_contract_rev_file',
              'quotation_stack_items'
              ].includes(key)
            ){
              formData.append(`quotation_stack[${index}][${key}]`, stack[key]);
            }
          })

          //append stack file
          if (stack.quotation_stack_bom_quotation_file.length > 0) {
            stack.quotation_stack_bom_quotation_file.forEach((file: any, fileIndex: number) => {
              formData.append(`quotation_stack[${index}][quotation_stack_bom_quotation_file]`, file);
            });
          }

          if (stack.quotation_stack_bom_contract_rev_file.length > 0) {
            stack.quotation_stack_bom_contract_rev_file.forEach((file: any, fileIndex: number) => {
              formData.append(`quotation_stack[${index}][quotation_stack_bom_contract_rev_file]`, file);
            });
          }

          //append stack item
          if(stack.quotation_stack_items.length > 0){
            stack.quotation_stack_items.forEach((item: any,iItems: number) => {
              formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][inventory_id]`, item.inventory_id);
              formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][qty]`, item.qty);
              formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][dn_1]`, item.dn_1);
              formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][dn_2]`, item.dn_2);
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
          quotation_stack_name: stack.name,
          quotation_stack_is_active: stack.active ? 1 : 0,
          quotation_stack_bom_quotation_file: stack.stack_file,
          quotation_stack_bom_contract_rev_file: stack.stack_file_contract,
          quotation_stack_items: stack.items.map((item: any) => ({
            inventory_id: item.part_number,
            qty: item.qty,
            dn_1: item.dn1,
            dn_2: item.dn2
          })),
          stack_new: stack.stack_new,
          stack_updated: stack.stack_updated,
          stack_new_contract: stack.stack_new_contract,
          stack_updated_contract: stack.stack_updated_contract,
          new: stack.new
        }))


        const body = {
          id: this.quotationForm.get('id')?.value,
          edit_type: this.modal_type,
          project_id: this.quotationForm.get('project_id')?.value,
          customer_id: this.quotationForm.get('customer')?.value,
          customer_cp_ids_new: customer_cp_ids,
          issued_date: this.quotationForm.get('date')?.value,
          quotation_stack_deleted_ids: this.deletedStackIds,
          // inventories: inventoryComplete,
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
        
        // if(this.isUpdateFile){
        //   //append project document
        //   if (this.fileList.length > 0) {
        //     this.fileList.forEach((file: any) => {
        //       formData.append('project_document', file);
        //     });
        //   }
        // }

        //append stack
        stackComplete.forEach((stack: any, index: number) => {
          if(stack.new){
            Object.keys(stack).forEach(key => {
              if(![
                'quotation_stack_bom_quotation_file', 
                'quotation_stack_bom_contract_rev_file',
                'quotation_stack_items'
                ].includes(key)
              ){
                formData.append(`quotation_stack[${index}][${key}]`, stack[key]);
              }
            })
    
            //append stack file
            if (stack.quotation_stack_bom_quotation_file.length > 0) {
              stack.quotation_stack_bom_quotation_file.forEach((file: any, fileIndex: number) => {
                if(stack.stack_updated || stack.stack_new){
                  formData.append(`quotation_stack[${index}][quotation_stack_bom_quotation_file]`, file);
                } else {
                  formData.append(`quotation_stack[${index}][quotation_stack_bom_quotation_file]`, '');
                }
              });
            }
  
            if (stack.quotation_stack_bom_contract_rev_file.length > 0) {
              stack.quotation_stack_bom_contract_rev_file.forEach((file: any, fileIndex: number) => {
                if(stack.stack_updated_contract || stack.stack_new_contract){
                  formData.append(`quotation_stack[${index}][quotation_stack_bom_contract_rev_file]`, file);
                } else {
                  formData.append(`quotation_stack[${index}][quotation_stack_bom_contract_rev_file]`, '');
                }
              });
            }
  
            //append stack item
            if(stack.quotation_stack_items.length > 0){
              stack.quotation_stack_items.forEach((item: any,iItems: number) => {
                formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][inventory_id]`, item.inventory_id);
                formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][qty]`, item.qty);
                formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][dn_1]`, item.dn_1);
                formData.append(`quotation_stack[${index}][quotation_stack_items][${iItems}][dn_2]`, item.dn_2);
              });
            }
          }
        })
  
        this.apiSvc.editQuotation(formData).subscribe({
          next: (response) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: `Successfully ${this.modal_type === 'edit' ? 'Edit' : 'Revised'} Quotation`,
              nzOkText: 'Ok',
              nzCentered: true
            });

            this.apiSvc.triggerRefreshQuotation();
          },
          error: (error) => {
            this.spinnerSvc.hide();
  
            this.modalSvc.error({
              nzTitle: `Unable to ${this.modal_type === 'edit' ? 'Edit' : 'Revised'} Quotation`,
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
      stacksForm.get('stack_file')?.setValue([file]);
      stacksForm.get('stack_updated')?.setValue(true);
  
      return false;
    };
  }

  beforeUploadStacksContract(index: number) {
    return (file: NzUploadFile): boolean => {

      const isLt5M = file.size! / 1024 / 1024 < 1
      if (!isLt5M) {
        this.nzMsgSvc.error('Image must be smaller than 1MB!');
        return false;
      }
      
      const stacksForm = this.stacks.at(index);

      const fileList = stacksForm.get('stack_file_contract')?.value || [];
      stacksForm.get('stack_file_contract')?.setValue([file]);
      stacksForm.get('stack_updated_contract')?.setValue(true);  

      return false;
    }
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

  handleRemoveAttachmentStacksContract(index: number) {
    return (file: NzUploadFile): boolean => {
      const stacksForm = this.stacks.at(index);

      // Get the current file list
      const fileList = stacksForm.get('stack_file_contract')?.value || [];

      // For updating deleted attachment
      const matchingFile = fileList
        .filter((item: NzUploadFile) => item.uid === file.uid)
        .map((item: any) => item.uid);

      // Get or initialize 'cp_attachmentDeleteIds'
      const currentDeleteIds = stacksForm.get('stack_attachmentDeleteIds_contract')?.value || [];
      const updatedDeleteIds = [...currentDeleteIds, ...matchingFile];
      stacksForm.get('stack_attachmentDeleteIds_contract')?.setValue(updatedDeleteIds);

      // Filter out the file to be removed
      const updatedFileList = fileList.filter((item: NzUploadFile) => item.uid !== file.uid);
      
      // Update the form control value
      stacksForm.get('stack_file_contract')?.setValue(updatedFileList);
  
      return true; // Return true to allow removal
    }
  }

  get objectKeys() {
    return Object.keys;
  }

  get generateUniqueId(): string {
    const timestamp = Date.now();
    const randomNumber = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomNumber}`;
  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };
}
