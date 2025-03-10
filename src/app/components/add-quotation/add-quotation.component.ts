import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { IDataCategories, IDataCustomer, IDataInventory, IDataQuotation, IRootProject, IRootQuotation } from 'src/app/interfaces';
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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

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
    NzRadioModule,
    NzSpinModule,
    NzCollapseModule
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
    stacks: this.fb.array([]),

    tax: [0],


    preliminaries_cost: [0],
    preliminaries_price_factor: [0],
    preliminaries_selling: [{value: 0, disabled: true}],
    preliminaries_gross_margin: [{value: 0, disabled: true}],
    discount_preliminaries: [0],

    supervision_cost: [0],
    supervision_price_factor: [0],
    supervision_selling: [{value: 0, disabled: true}],
    supervision_gross_margin: [{value: 0, disabled: true}],
    discount_supervision: [0],

    test_commisioning_cost: [0],
    test_commisioning_price_factor: [0],
    test_commisioning_selling: [{value: 0, disabled: true}],
    test_commisioning_gross_margin: [{value: 0, disabled: true}],
    discount_test_commisioning: [0],

    delivery_duration: [''],
    offer_applies: [''],
    type_of_work: [''],
    termin_payment: [''],

    select_all: [false]
    
  })

  pic$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  fileList: NzUploadFile[] = [];
  attachmentDeletedIds: string[] = [];

  uploadedData: any[] = [];
  headers: string[] = [];

  provinceList: any[] = [];

  groupedItems: { 
    [category: string]: 
    { 
      items: UntypedFormGroup[]; 
      discount: UntypedFormControl; 
      totalPrice: UntypedFormControl;
      id: string;
      grossMargin: number;
      discount_installation: UntypedFormControl;
      iGrossMargin: number;
      iTotalPrice: UntypedFormControl;
      totalPriceList: UntypedFormControl;
      iTotalCost: UntypedFormControl;
    } 
  } = {};
  uncategorizedItems: any[] = [];

  isLoadingPic = true;

  totalGrandCost: number = 0;

  totalGrandGrossMargin: number = 0;

  iTotalGrandCost: number = 0;

  iTotalGrandGrossMargin: number = 0;

  totalGrandPriceList: number = 0;

  totalGrandICost: number = 0;

  isUpdateFile: boolean = false;

  deletedStackIds: string[] = [];

  selectedCustomer: IProjectCustomer[] = []

  isCreateQuotationTotal = false;

  selectedTabIndex = 0;

  selectedStack: string[] = [];

  previousValue: any;

  isStackLoading: boolean = true;

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

    this.quotationForm.get('select_all')?.valueChanges.subscribe((value)=> {

      this.stacks.controls.forEach(control => {
        control.patchValue({ is_total_quotation: value });
      });

    });

    ['preliminaries_cost', 'discount_preliminaries', 'preliminaries_price_factor'].forEach(field => {
      this.quotationForm.get(field)?.valueChanges.subscribe(() => {
        this.updatePreliminariesValues();
      });
    });

    ['supervision_cost', 'discount_supervision', 'supervision_price_factor'].forEach(field => {
      this.quotationForm.get(field)?.valueChanges.subscribe(() => {
        this.updateSupervisionValues();
      });
    });

    ['test_commisioning_cost', 'discount_test_commisioning', 'test_commisioning_price_factor'].forEach(field => {
      this.quotationForm.get(field)?.valueChanges.subscribe(() => {
        this.updateTestCommisioningValues();
      });
    });



    this.apiSvc.refreshGetQuotation$.subscribe(() => {

      this.apiSvc.getQuotation().pipe(
        map(response => {
          const filteredData = response.data.filter(item => item.id === this.dataQuotation.id);
          
          return {
            ...response,
            data: filteredData
          };
        }),
        tap( result => {
          this.dataQuotation = result.data[0]
          this.stacks.clear();
          this.cd.detectChanges();

          this.isCreateQuotationTotal = this.dataQuotation.is_create_quotation_total === 1 ? true : false;

          if(this.isCreateQuotationTotal && this.dataQuotation.latest_quotation_revision.quotation_items.length > 0) {
            this.items.clear();
    
            this.dataQuotation.latest_quotation_revision.quotation_items.forEach((item) => {
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
                price_list: [parseFloat(item.inventory.price_list)],
                unit_price: [parseFloat(item.inventory.default_selling_price)],
                total_price: [parseFloat(item.total_price_per_product)],
                gross_margin: [parseFloat(item.inventory.default_gross_margin)],
                category: [item.inventory.supplier_product.id],
                sub_category:[item.inventory.sub_category.name],
                discount: [parseFloat(item.discount)],
                discount_installation: [parseFloat(item.discount_installation)],
    
                i_part_number: [item.inventory.code],
                i_description: [item.inventory.description],
                installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
                installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
                installation_unit_price_type: [{value: item.inventory.installation.price_type, disabled: true}],
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

          
          this.dataQuotation.quotation_stack.forEach((stack, index) => {

            let updateStackFile: NzUploadFile[] = [];
    
            if(stack.is_used_for_quotation === 1){
              let selectStack: string = '';
    
              if(stack.latest_quotation_bom.revision_contract){
                selectStack = `${stack.name} - ${stack.latest_quotation_bom.revision_contract}`;
              }
        
              if(stack.latest_quotation_bom.stack_revision_quotation){
                selectStack = `${stack.name} - ${stack.latest_quotation_bom.stack_revision_quotation}`;
              }
        
              this.selectedStack.push(selectStack)
            }
    
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
                price_list: [parseFloat(item.inventory.price_list)],
                unit_price: [parseFloat(item.inventory.default_selling_price)],
                total_price: [parseFloat(item.total_price_per_product)],
                gross_margin: [parseFloat(item.inventory.default_gross_margin)],
                category: [item.inventory.supplier_product.id],
          
                i_part_number: [item.inventory.code],
                i_description: [item.inventory.description],
                installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
                installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
                installation_unit_price_type: [{value: item.inventory.installation.price_type, disabled: true}],
                installation_price_per_unit: [{value: parseFloat(item.inventory.installation.price_per_unit), disabled: true}],
                installation_price_factor: [{value: parseFloat(item.inventory.installation.price_factor), disabled: true}],
                installation_selling_price: [{value: parseFloat(item.inventory.installation.selling_price), disabled: true}],
                installation_gross_margin: [{value: parseFloat(item.inventory.installation.gross_margin), disabled: true}],
              })
              itemsArray.push(newItem);
              this.itemValueChangeSubscription(newItem);
            })

            this.cd.detectChanges();
          })

        })
      ).subscribe();

    })

    this.items.valueChanges.subscribe(() => {
      this.calculateGrandTotalPrice();
      this.calculateGrandGrossMargin();
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

        this.quotationForm.patchValue({
          tax: parseFloat(this.dataQuotation.latest_quotation_revision.tax ?? 0),
          preliminaries_cost: parseFloat(this.dataQuotation.latest_quotation_revision.preliminaries_cost ?? 0),
          preliminaries_price_factor: parseFloat(this.dataQuotation.latest_quotation_revision.preliminaries_price_factor ?? 0),
          preliminaries_selling: parseFloat(this.dataQuotation.latest_quotation_revision.preliminaries ?? 0),
          preliminaries_gross_margin: parseFloat(this.dataQuotation.latest_quotation_revision.preliminaries_gross_margin ?? 0),
          discount_preliminaries: parseFloat(this.dataQuotation.latest_quotation_revision.discount_preliminaries ?? 0),
      
          supervision_cost: parseFloat(this.dataQuotation.latest_quotation_revision.supervision_cost ?? 0),
          supervision_price_factor: parseFloat(this.dataQuotation.latest_quotation_revision.supervision_price_factor ?? 0),
          supervision_selling: parseFloat(this.dataQuotation.latest_quotation_revision.supervision ?? 0),
          supervision_gross_margin: parseFloat(this.dataQuotation.latest_quotation_revision.supervision_gross_margin ?? 0),
          discount_supervision: parseFloat(this.dataQuotation.latest_quotation_revision.discount_supervision ?? 0),
      
          test_commisioning_cost: parseFloat(this.dataQuotation.latest_quotation_revision.test_commisioning_cost ?? 0),
          test_commisioning_price_factor: parseFloat(this.dataQuotation.latest_quotation_revision.test_commisioning_price_factor ?? 0),
          test_commisioning_selling: parseFloat(this.dataQuotation.latest_quotation_revision.test_commisioning ?? 0),
          test_commisioning_gross_margin: parseFloat(this.dataQuotation.latest_quotation_revision.test_commisioning_gross_margin ?? 0),
          discount_test_commisioning: parseFloat(this.dataQuotation.latest_quotation_revision.discount_test_commisioning ?? 0),

          delivery_duration: this.dataQuotation.latest_quotation_revision.delivery_duration,
          offer_applies: this.dataQuotation.latest_quotation_revision.offer_applies,
          type_of_work: this.dataQuotation.latest_quotation_revision.type_of_work,
          termin_payment: this.dataQuotation.latest_quotation_revision.termin_payment
        })

        this.dataQuotation.latest_quotation_revision.quotation_items.forEach((item) => {
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
            price_list: [parseFloat(item.inventory.price_list)],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.id],
            sub_category:[item.inventory.sub_category.name],
            discount: [parseFloat(item.discount)],
            discount_installation: [parseFloat(item.discount_installation)],

            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: item.inventory.installation.price_type, disabled: true}],
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

      //remove duplicate customer
      const seen = new Set();
      const filteredArray = projectData.project_customer.filter(item => {
        if (seen.has(item.customer.id)) {
          return false;
        }
        seen.add(item.customer.id);
        return true;
      });
      this.selectedCustomer = [...filteredArray]

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

        if(stack.is_used_for_quotation === 1){
          let selectStack: string = '';

          if(stack.latest_quotation_bom.revision_contract){
            selectStack = `${stack.name} - ${stack.latest_quotation_bom.revision_contract}`;
          }
    
          if(stack.latest_quotation_bom.stack_revision_quotation){
            selectStack = `${stack.name} - ${stack.latest_quotation_bom.stack_revision_quotation}`;
          }
    
          this.selectedStack.push(selectStack)
        }

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
            price_list: [parseFloat(item.inventory.price_list)],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.id],
      
            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: item.inventory.installation.price_type, disabled: true}],
            installation_price_per_unit: [{value: parseFloat(item.inventory.installation.price_per_unit), disabled: true}],
            installation_price_factor: [{value: parseFloat(item.inventory.installation.price_factor), disabled: true}],
            installation_selling_price: [{value: parseFloat(item.inventory.installation.selling_price), disabled: true}],
            installation_gross_margin: [{value: parseFloat(item.inventory.installation.gross_margin), disabled: true}],
          })
          itemsArray.push(newItem);
          // this.updateGroupedItems();
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


  updatePreliminariesValues() {
    const cost = this.quotationForm.get('preliminaries_cost')?.value || 0;
    const discount = this.quotationForm.get('discount_preliminaries')?.value || 0;
    const priceFactor = this.quotationForm.get('preliminaries_price_factor')?.value || 1;

    const sellingPrice = priceFactor * cost;
    let discountedSelling = sellingPrice;
    if(discount > 0){
      discountedSelling = sellingPrice - (sellingPrice * discount/100 );
    }

    const grossMargin = discountedSelling ? ((discountedSelling - cost) / discountedSelling) * 100 : 0;
  
    this.quotationForm.patchValue({
      preliminaries_selling: discountedSelling,
      preliminaries_gross_margin: grossMargin.toFixed(2)
    }, { emitEvent: false });
  }

  updateSupervisionValues() {
    const cost = this.quotationForm.get('supervision_cost')?.value || 0;
    const discount = this.quotationForm.get('discount_supervision')?.value || 0;
    const priceFactor = this.quotationForm.get('supervision_price_factor')?.value || 1;
  
    const sellingPrice = priceFactor * cost;
    let discountedSelling = sellingPrice;
    if(discount > 0){
      discountedSelling = sellingPrice - (sellingPrice * discount/100 );
    }

    const grossMargin = discountedSelling ? ((discountedSelling - cost) / discountedSelling) * 100 : 0;
  
    this.quotationForm.patchValue({
      supervision_selling: discountedSelling,
      supervision_gross_margin: grossMargin.toFixed(2)
    }, { emitEvent: false });
  }

  updateTestCommisioningValues() {
    const cost = this.quotationForm.get('test_commisioning_cost')?.value || 0;
    const discount = this.quotationForm.get('discount_test_commisioning')?.value || 0;
    const priceFactor = this.quotationForm.get('test_commisioning_price_factor')?.value || 1;
  
    const sellingPrice = priceFactor * cost;
    let discountedSelling = sellingPrice;
    if(discount > 0){
      discountedSelling = sellingPrice - (sellingPrice * discount/100 );
    }

    const grossMargin = discountedSelling ? ((discountedSelling - cost) / discountedSelling) * 100 : 0;
  
    this.quotationForm.patchValue({
      test_commisioning_selling: discountedSelling,
      test_commisioning_gross_margin: grossMargin.toFixed(2)
    }, { emitEvent: false });
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
            price_list: [parseFloat(item.inventory.price_list)],
            unit_price: [parseFloat(item.inventory.default_selling_price)],
            total_price: [parseFloat(item.total_price_per_product)],
            gross_margin: [parseFloat(item.inventory.default_gross_margin)],
            category: [item.inventory.supplier_product.id],
            sub_category:[item.inventory.sub_category.name],
            discount: [parseFloat(item.discount)],
            discount_installation: [parseFloat(item.discount_installation)],
            
            i_part_number: [item.inventory.code],
            i_description: [item.inventory.description],
            installation_unit_inch_qty: [{value: parseFloat(item.inventory.installation.unit_inch_qty), disabled: true}],
            installation_unit_price: [{value: parseFloat(item.inventory.installation.price), disabled: true}],
            installation_unit_price_type: [{value: item.inventory.installation.price_type, disabled: true}],
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
        modal_type: this.modal_type,
        productCategory: this.productCategory
      },
      nzWidth: '100vw'
    })
  }

  calculateGrandTotalPrice() {
    this.totalGrandCost = this.items.controls.reduce((sum, group) => {
      const totalPrice = group.get('unit_price')?.value || 0;
      const qty =  group.get('qty')?.value || 0;
      return sum + Number(totalPrice) * Number(qty);
    }, 0);

    this.iTotalGrandCost = this.items.controls.reduce((sum, group) => {
      const totalPrice  =  group.get('installation_selling_price')?.value || 0;
      const qty =  group.get('qty')?.value || 0;
      return sum + Number(totalPrice) * Number(qty);
    }, 0)

    this.totalGrandPriceList = this.items.controls.reduce((sum, group) => {
      const totalPrice  =  group.get('price_list')?.value || 0;
      const qty =  group.get('qty')?.value || 0;
      return sum + Number(totalPrice) * Number(qty);
    }, 0)

    this.totalGrandICost = this.items.controls.reduce((sum, group) => {
      const totalPrice = group.get('installation_price_per_unit')?.value || 0;
      const qty =  group.get('qty')?.value || 0;
      return sum + Number(totalPrice) * Number(qty);
    }, 0)
  }

  calculateGrandGrossMargin() {


    const grossMargin = ((this.totalGrandCost - this.totalGrandPriceList)/this.totalGrandCost) * 100;

    const iGrossMargin = ((this.iTotalGrandCost - this.totalGrandICost)/this.iTotalGrandCost) * 100;

    this.iTotalGrandGrossMargin = parseFloat(iGrossMargin.toFixed(2));

    this.totalGrandGrossMargin = parseFloat(grossMargin.toFixed(2));
  }
  

  private handleProjectChange(res: any): void {
    const projectData: IDataProject = this.projectsData.filter((project) => project.id === res)[0];
    
    //remove duplicate customer
    const seen = new Set();
    const filteredArray = projectData.project_customer.filter(item => {
      if (seen.has(item.customer.id)) {
        return false;
      }
      seen.add(item.customer.id);
      return true;
    });
    this.selectedCustomer = [...filteredArray]

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
          category: [filteredInventory[0].product_category.id],
          discount: [0]
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
          discount: [0]
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
          totalPrice: new UntypedFormControl(0), // Form control for total price
          grossMargin: 0,
          id: categoryId.toString(),
          discount_installation: new UntypedFormControl(0),
          iTotalPrice: new UntypedFormControl(0),
          iGrossMargin: 0,
          totalPriceList: new UntypedFormControl(0),
          iTotalCost: new UntypedFormControl(0)
        };
      }
      acc[groupKey].items.push(control);
      return acc;
    }, {} as { 
      [categoryName: string]: 
        { 
          items: UntypedFormGroup[];
          discount: UntypedFormControl; 
          totalPrice: UntypedFormControl;
          totalPriceList: UntypedFormControl;
          id: string;
          grossMargin: number;
          discount_installation: UntypedFormControl;
          iTotalPrice: UntypedFormControl;
          iGrossMargin: number;
          iTotalCost: UntypedFormControl;
        }
     });

  
    this.productCategory.forEach((category) => {
      if (!grouped[category.name]) {
        grouped[category.name] = {
          items: [],
          discount: new UntypedFormControl(0),
          totalPrice: new UntypedFormControl(0),
          grossMargin: 0,
          id: category.id.toString(),
          discount_installation: new UntypedFormControl(0),
          iTotalPrice: new UntypedFormControl(0),
          iGrossMargin: 0,
          totalPriceList: new UntypedFormControl(0),
          iTotalCost: new UntypedFormControl(0)
        };
      }
    });
  
    if (!grouped['Uncategorized']) {
      grouped['Uncategorized'] = {
        items: [],
        discount: new UntypedFormControl(0),
        totalPrice: new UntypedFormControl(0),
        grossMargin: 0,
        id: '',
        discount_installation: new UntypedFormControl(0),
        iTotalPrice: new UntypedFormControl(0),
        iGrossMargin: 0,
        totalPriceList: new UntypedFormControl(0),
        iTotalCost: new UntypedFormControl(0)
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
      }, {} as { 
        [categoryName: string]: 
        { 
          items: UntypedFormGroup[];
          discount: UntypedFormControl; 
          totalPrice: UntypedFormControl; 
          id: string;
          grossMargin: number;
          discount_installation: UntypedFormControl;
          iTotalPrice: UntypedFormControl;
          iGrossMargin: number;
          totalPriceList: UntypedFormControl;
          iTotalCost: UntypedFormControl;
        } });
    

    if(this.groupedItems['Fitting'].items.length > 0){
      const sortOrder = ['Elbow', 'Reducer', 'Branch'];

      this.groupedItems['Fitting'].items.sort((a, b) => {
        return sortOrder.indexOf(a.value.sub_category) - sortOrder.indexOf(b.value.sub_category);
      });
    }
  
    // Update unit prices and total price based on discount
    Object.keys(this.groupedItems).forEach((categoryName) => {
      const group = this.groupedItems[categoryName];
      
      const updateTotalPriceList = () => {
        const total = group.items.reduce((sum, item) => {
          const priceList = item.get('price_list')?.value || 0;
          const qty = item.get('qty')?.value || 0;
          return sum + ( priceList * qty )
        }, 0);

        group.totalPriceList.setValue(total, { emitEvent: false });

        const iTotal = group.items.reduce((sum, item) => {
          const cost = item.get('installation_price_per_unit')?.value || 0;
          const qty = item.get('qty')?.value || 0;
          return sum + ( cost * qty )
        }, 0)

        group.iTotalCost.setValue(iTotal, { emitEvent: false });
      }

      const updateTotalPrice = () => {
        const total = group.items.reduce((sum, item) => {
          const quantity = item.get('qty')?.value || 0;
          const unitPrice = item.get('unit_price')?.value || 0;
          return sum + parseFloat(quantity) * parseFloat(unitPrice);
        }, 0);

        const totalUnitPrice = group.items.reduce((sum, item) => {
          const unitPrice = item.get('unit_price')?.value || 0;
          return sum +  parseFloat(unitPrice);
        }, 0)

        const totalPriceList = group.items.reduce((sum, item) => {
          const priceList = item.get('price_list')?.value || 0;
          return sum + parseFloat(priceList);
        },0)

        const grossMargin = ((totalUnitPrice-totalPriceList)/totalUnitPrice) * 100
        
        group.totalPrice.setValue(total, { emitEvent: false });

        group.grossMargin = parseFloat(grossMargin.toFixed(2));
      };

      const updateITotalPrice  = () => {
        const total = group.items.reduce((sum, item) => {
          const sellingPrice = item.get('installation_selling_price')?.value || 0;
          const qty = item.get('qty')?.value || 0;
          return sum + parseFloat(sellingPrice) * qty;
        }, 0);

        const totalUnitPrice = group.items.reduce((sum, item) => {
          const unitPrice = item.get('installation_price_per_unit')?.value || 0;
          const qty = item.get('qty')?.value || 0;
          return sum +  parseFloat(unitPrice) * qty;
        }, 0)

        const grossMargin = ((total-totalUnitPrice)/total) * 100

        group.iTotalPrice.setValue(total, { emitEvent: false });

        group.iGrossMargin = parseFloat(grossMargin.toFixed(2));
      }
  
      // Subscribe to discount changes
      group.discount.valueChanges.subscribe((discount) => {
        group.items.forEach((item) => {

          const priceList = item.get('price_list')?.value;

          const unitPriceControl = item.get('unit_price');
          const originalPrice = item.get('original_unit_price')?.value;
          
          const grossMarginControl = item.get('gross_margin');
          const originalMargin = item.get('original_gross_margin')?.value;

          let validOriginalPrice = originalPrice;
          let validOriginalMargin = originalMargin;
        
          // Ensure originalPrice is a valid number, defaulting to the current unit price if invalid.
          if (isNaN(originalPrice) || originalPrice === null || originalPrice === undefined) {
            validOriginalPrice = unitPriceControl?.value || 0;
            item.addControl('original_unit_price', new UntypedFormControl(validOriginalPrice));
          }
          
          if(isNaN(originalMargin) || originalMargin === null || originalMargin === undefined) {
            validOriginalMargin = grossMarginControl?.value || 0;
            item.addControl('original_gross_margin', new UntypedFormControl(validOriginalMargin));
          }

          const discountedPrice = validOriginalPrice * (1 - (discount === '' ? 0 : discount) / 100);
          unitPriceControl?.setValue(discountedPrice);

          if(discount > 0){
            const newGrossMargin = ((discountedPrice - priceList)/discountedPrice) * 100;
            grossMarginControl?.setValue(newGrossMargin.toFixed(2))
          } else {
            grossMarginControl?.setValue(validOriginalMargin);
          }

          this.calculateTotalPrice(item);
        });
  
        // Recalculate total price
        updateTotalPrice();
      });

      group.discount_installation.valueChanges.subscribe((discount) => {
        group.items.forEach((item) => {

          const unitPrice = item.get('installation_price_per_unit')?.value;

          const sellingPriceControl = item.get('installation_selling_price');
          const originalSellingPricie = item.get('original_i_selling_price')?.value;

          const grossMarginControl = item.get('installation_gross_margin');
          const originalMargin = item.get('original_i_gross_margin')?.value;

          let validOriginalSellingPrice = originalSellingPricie;
          let validOriginalMargin = originalMargin;

          if (isNaN(originalSellingPricie) || originalSellingPricie === null || originalSellingPricie === undefined) {
            validOriginalSellingPrice = sellingPriceControl?.value || 0;
            item.addControl('original_i_selling_price', new UntypedFormControl(validOriginalSellingPrice));
          }

          if(isNaN(originalMargin) || originalMargin === null || originalMargin === undefined) {
            validOriginalMargin = grossMarginControl?.value || 0;
            item.addControl('original_i_gross_margin', new UntypedFormControl(validOriginalMargin));
          }

          const discountedPrice = validOriginalSellingPrice * (1 - (discount === '' ? 0 : discount) / 100);
          sellingPriceControl?.setValue(discountedPrice);

          if(discount > 0){
            const newGrossMargin = ((discountedPrice - unitPrice)/discountedPrice) * 100;
            grossMarginControl?.setValue(newGrossMargin.toFixed(2))
          } else {
            grossMarginControl?.setValue(validOriginalMargin);
          }


          // this.calculateITotalPrice(item);
        })
        updateITotalPrice();
      })
  
      // Subscribe to item changes to recalculate total price
      group.items.forEach((item) => {
        item.valueChanges.subscribe(() => updateTotalPrice());
        item.valueChanges.subscribe(() => updateITotalPrice());
      });

      //set discount from existing data
      group.items.forEach((item) => {        
        if(item.get('category')?.value.toString() === group.id ){
          group.discount.setValue(parseFloat(item.get('discount')?.value));
          group.discount_installation.setValue(parseFloat(item.get('discount_installation')?.value));
        }
      })
  
      // Initial total price calculation
      updateTotalPrice();
      updateITotalPrice();
      updateTotalPriceList();
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

  calculateITotalPrice(control: UntypedFormGroup){
    const unitPrice = parseFloat(control.get('installation_price_per_unit')?.value);
    const priceFactor = parseFloat(control.get('installation_price_factor')?.value);
    control.get('installation_selling_price')?.setValue(priceFactor * unitPrice);
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
      price_list: [''],
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
        this.isStackLoading = true
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
        // this.drawerRef.close();
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
          quotation_items_discount: null,
          tax: this.quotationForm.get('tax')?.value,
          preliminaries_cost: this.quotationForm.get('preliminaries_cost')?.value,
          preliminaries_price_factor: this.quotationForm.get('preliminaries_price_factor')?.value,
          supervision_cost: this.quotationForm.get('supervision_cost')?.value,
          supervision_price_factor: this.quotationForm.get('supervision_price_factor')?.value,
          test_commisioning_cost: this.quotationForm.get('test_commisioning_cost')?.value,
          test_commisioning_price_factor: this.quotationForm.get('test_commisioning_price_factor')?.value,
          delivery_duration: this.quotationForm.get('delivery_duration')?.value,
          offer_applies: this.quotationForm.get('offer_applies')?.value,
          type_of_work: this.quotationForm.get('type_of_work')?.value,
          termin_payment: this.quotationForm.get('termin_payment')?.value,
          discount_preliminaries: this.quotationForm.get('discount_preliminaries')?.value,
          discount_supervision: this.quotationForm.get('discount_supervision')?.value,
          discount_test_commisioning: this.quotationForm.get('discount_test_commisioning')?.value
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

        const quotationItemsDiscount: {supplier_product_id: string; discount: string, discount_installation: string}[] = [];

        Object.keys(this.groupedItems).forEach((categoryName) => {
          const group = this.groupedItems[categoryName];
          const discount =  group.discount.value.toString() === '' ? 0 : group.discount.value.toString();
          const supplier_product_id = group.id;
          const discount_installation = 
            group.discount_installation.value.toString() === '' 
            ? 0 
            : group.discount_installation.value.toString();

          quotationItemsDiscount.push({supplier_product_id, discount, discount_installation })
        })

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
          quotation_items_discount: quotationItemsDiscount,
          tax: this.quotationForm.get('tax')?.value,
          preliminaries_cost: this.quotationForm.get('preliminaries_cost')?.value,
          preliminaries_price_factor: this.quotationForm.get('preliminaries_price_factor')?.value,
          supervision_cost: this.quotationForm.get('supervision_cost')?.value,
          supervision_price_factor: this.quotationForm.get('supervision_price_factor')?.value,
          test_commisioning_cost: this.quotationForm.get('test_commisioning_cost')?.value,
          test_commisioning_price_factor: this.quotationForm.get('test_commisioning_price_factor')?.value,
          delivery_duration: this.quotationForm.get('delivery_duration')?.value,
          offer_applies: this.quotationForm.get('offer_applies')?.value,
          type_of_work: this.quotationForm.get('type_of_work')?.value,
          termin_payment: this.quotationForm.get('termin_payment')?.value,
          discount_preliminaries: this.quotationForm.get('discount_preliminaries')?.value,
          discount_supervision: this.quotationForm.get('discount_supervision')?.value,
          discount_test_commisioning: this.quotationForm.get('discount_test_commisioning')?.value
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

  getCodeById(partId: string): string {
    const part = this.inventoryList.find(p => p.id === partId);
    return part ? part.code : 'Unknown Part';
  }

  getDescById(partId: string): string {
    const part = this.inventoryList.find(p => p.id === partId);
    return part ? part.description : 'Unknown Part';
  }

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
