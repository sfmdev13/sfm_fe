import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, AbstractControl, FormArray } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataEmployee, IRootAllRoles, ICategories, IRootCustomer, IContactPerson, IDataCustomer, IRootCatContact } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';
import { SpinnerService } from 'src/app/spinner.service';
import { DetailCustomerModalComponent } from '../detail-customer-modal/detail-customer-modal.component';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.scss']
})
export class AddProjectsComponent implements OnInit {
  nzData = inject(NZ_MODAL_DATA);
  modal_type: string = this.nzData.modal_type;
  data: IDataProject = this.nzData.data;

  pic$!: Observable<any>;
  roles$!: Observable<IRootAllRoles>

  // customerList$!: Observable<IRootCustomer>;

  divisionList$!: Observable<any>;

  isLoadingCustomerList: boolean = true;
  isLoadingDivision: boolean = true;

  roleList: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  projectForm = this.fb.group({
    id: [''],

    project_id: [{value: '', disabled: true}],

    name: ['', Validators.required],
    issue_date: ['', Validators.required],
    project_category: ['', Validators.required],
    reason_failed: [''],
    sales_pic: [[this.pic_id], [Validators.required]],
    sales_pic_internal: ['', Validators.required],
    dce_pic: [[], Validators.required],
    dce_pic_internal: ['', Validators.required],

    province: ['', Validators.required],
    city: ['', Validators.required],
    postal_code: ['', Validators.required],
    address: ['', Validators.required],
    maps_url: ['', Validators.required],

    cluster: ['', Validators.required],
    remarks: ['', Validators.required],
    segmentation: ['', Validators.required],
    specification: [[], Validators.required],
    material: [[], Validators.required],
    competitor: ['', Validators.required],
    year_month: ['', Validators.required],

    // customer_id: ['', Validators.required],
    customers: this.fb.array([])
  })

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];
  filteredListOfPicDCE: any[] = [];

  picComplete: any;
  dcePicComplete: any;

  customerDetail: IDataCustomer = {} as IDataCustomer;
  isCustomerDetail: boolean = false;

  provinces$!: Observable<any>;
  provinceList: any[] = [];
  city: any[] = [];

  nestedModalRef?: NzModalRef;
  material$!: Observable<ICategories>;
  segmentation$!: Observable<ICategories>;
  cluster$!: Observable<IRootCatContact>;

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  year: string = '';
  month: string = '';

  customers: IDataCustomer[] = [];

  customerSector$!: Observable<ICategories>;

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

    this.customerSector$ = this.apiSvc.getCustomerSector();

    this.projectForm.get('year_month')?.valueChanges.subscribe((res) => {
      const date = new Date(res);
      this.year = date.getFullYear().toString();
      this.month = (date.getMonth() + 1).toString();
    })

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.material$ = this.apiSvc.getMaterial();
      this.segmentation$ = this.apiSvc.getSegmentation();
      this.cluster$ = this.apiSvc.getCustomerFirm();
    })

    this.material$ = this.apiSvc.getMaterial();
    this.segmentation$ = this.apiSvc.getSegmentation();
    this.cluster$ = this.apiSvc.getCustomerFirm();

    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap(p => {
        this.provinceList = p;
      })
    );

    this.projectForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })

    this.projectForm.get('customer_id')?.valueChanges.subscribe((value) => {
      this.isCustomerDetail = false
      this.apiSvc.getCustomerDetail(value).subscribe((res) => {
        this.customerDetail = res.data
        this.isCustomerDetail = true
      })
    })

    this.projectForm.get('sales_pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.projectForm.get('sales_pic_internal')?.value)){
        this.projectForm.patchValue({is_pic_internal: ''})
      }
    })

    this.projectForm.get('dce_pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPicDCE = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.projectForm.get('dce_pic_internal')?.value)){
        this.projectForm.patchValue({dce_pic_internal: ''})
      }
    })

    this.pic$ = this.apiSvc.getPic().pipe(
      tap((res) => {
        this.listOfPic = res;
        this.filteredListOfPic = this.listOfPic.filter(pic => this.pic_id.includes(pic.pic_id));
      })
    )

    this.projectForm.get('issue_date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.projectForm.patchValue({issue_date: formattedDate})
    })

    this.apiSvc.getCustomerList().subscribe((res) => {
      this.customers = res.data;
      this.isLoadingCustomerList = false
    })


    if(this.modal_type === 'update' || this.modal_type === 'duplicate'){


      //update year month
      this.year = this.data.year,
      this.month = this.data.month

      const year = parseInt(this.year, 10);
      const month = parseInt(this.month, 10) - 1;
      
      const date = new Date(year, month, 1); 
      this.projectForm.get('year_month')?.setValue(date);
      

      //update specification
      const specs = this.data.specification.map(item => item.specification);
      const materials = this.data.material.map(item => parseInt(item.material_id));

      this.projectForm.patchValue({
        id: this.data.id,
        project_id: this.modal_type === 'update' ? this.data.project_pid : '',
        name: this.data.name,
        issue_date: this.data.issue_date,
        project_category: this.data.project_category,


        province: parseInt(this.data.province),
        city: parseInt(this.data.city),
        postal_code: this.data.postal_code,
        address: this.data.address,
        maps_url: this.data.maps_url,
        
        cluster: this.data.cluster.id,
        remarks: this.data.remarks,
        segmentation: this.data.segmentation.id,
        specification: specs,
        material: materials,
        competitor: this.data.competitor,
        reason_failed: this.data.reason_failed,

        status: this.data.status
      })


      //update PIC
      this.pic$ = this.apiSvc.getPic().pipe(
        tap(res => {
          this.listOfPic = res;

          //extract pic id
          const picIds = this.data.pic.map(item => item.pic_id);
          const dcePic = this.data.dce_pic.map(item => item.pic_id);

          //find pic internal id
          const isPicInternalId = this.data.pic.filter(item => item.is_pic_internal === 1);
          const isDcePicInternalId = this.data.dce_pic.filter(item => item.is_pic_internal === 1);

          this.projectForm.patchValue({
            sales_pic: picIds,
            sales_pic_internal: isPicInternalId[0].pic_id,
            dce_pic: dcePic,
            dce_pic_internal: isDcePicInternalId[0].pic_id
          });
          
        })
      )

      //update customer
      this.data.project_customer.forEach((cust) => {
        const newCust = this.fb.group({
          customer_id: [cust.customer.id, Validators.required],
          type: [cust.customer_sector.id],
          contact_person: this.fb.array([]),
          selected_contact_person: [cust.selected_contact_persons.map(({id}) => id), Validators.required],
          isLoadingCp: [false]
        })

        const contactPersons = newCust.get('contact_person') as UntypedFormArray;

        contactPersons.clear();
        newCust.get('isLoadingCp')?.setValue(true);
        this.apiSvc.getCustomerDetail(cust.customer.id).subscribe((res) => {
          res.data.contactPerson.forEach((cp) => {
            const newCp = this.fb.group({
              id: [cp.id],
              name: [cp.name],
              role: [cp.customer_category.name],
              dm: [cp.is_pic_company]
            })
      
            contactPersons.push(newCp)
          }) 
  
          newCust.get('isLoadingCp')?.setValue(false);
        })

        this.customersArrForm.push(newCust)
        this.valueChangeCust(newCust)


      })

    } 

  }

  get customersArrForm(): UntypedFormArray {
    return this.projectForm.get('customers') as UntypedFormArray;
  }

  getContactPersons(owner: AbstractControl): FormArray {
    return owner.get('contact_person') as FormArray;
  }

  valueChangeCust(control: UntypedFormGroup){

    control.get('customer_id')?.valueChanges.subscribe((custId) => {
      const contactPersons = control.get('contact_person') as UntypedFormArray;

      contactPersons.clear();
      control.get('isLoadingCp')?.setValue(true);
      this.apiSvc.getCustomerDetail(custId).subscribe((res) => {
        res.data.contactPerson.forEach((cp) => {
          const newCp = this.fb.group({
            id: [cp.id],
            name: [cp.name],
            role: [cp.customer_category.name],
            dm: [cp.is_pic_company]
          })
    
          contactPersons.push(newCp)
        }) 

        control.get('isLoadingCp')?.setValue(false);
      })

    })

  }

  removeCust(i: number){
    this.customersArrForm.removeAt(i);
  }

  addCustomer(id: number){

    const newCust = this.fb.group({
      customer_id: ['', Validators.required],
      type: [id],
      contact_person: this.fb.array([]),
      selected_contact_person: [[], Validators.required],
      isLoadingCp: [false]
    })

    this.customersArrForm.push(newCust)
    this.valueChangeCust(newCust)

  }

  showModalCategoryAdd(titleCat: string): void {
    this.nestedModalRef = this.modalSvc.create({
      nzTitle: ' Add Category',
      nzContent: EditCategoriesModalComponent,
      nzData: {
        form: this.categoryForm
      },
      nzWidth: '500px',
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelCategoryAdd(),
          type: 'default'
        },
        {
          label: 'Confirm',
          onClick: () => this.handleCategorySubmitAdd(titleCat),
          type: 'primary'
        }
      ]
    });
  }

  handleCancelCategoryAdd(): void{
    this.nestedModalRef?.close();
    this.categoryForm.reset();
  }

  handleCategorySubmitAdd(title: string): void{

    this.spinnerSvc.show();

    if(this.categoryForm.valid){
      if(title.toLowerCase() === 'material'){
        this.apiSvc.createMaterial(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
          next: () => {
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Category',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories()
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Category',
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

      if(title.toLowerCase() === 'segmentation'){
        this.apiSvc.createSegmentation(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
          next: () => {
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Category',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories()
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Category',
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

      if(title.toLowerCase() === 'cluster'){
        this.apiSvc.createCustomerFirm(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
          next: () => {
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Category',
              nzOkText: 'Ok',
              nzCentered: true
            })
            this.apiSvc.triggerRefreshCategories()
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Category',
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

  showDetail(): void{
    this.modalSvc.create({
      nzTitle: 'Detail Customer',
      nzContent: DetailCustomerModalComponent,
      nzCentered: true,
      nzData: {
        data: this.customerDetail
      },
      nzWidth: '800px'
    });
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){

    this.spinnerSvc.show();

    if(this.projectForm.valid){

      const completeCustomer =  this.customersArrForm.value.map((item: any) => ({
        customer_id: item.customer_id,
        customer_sector_id: item.type.toString(),
        cp_ids: item.selected_contact_person
      }))  

      this.picComplete = this.projectForm.get('sales_pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.projectForm.get('sales_pic_internal')!.value ? 1 : 0
      }));

      this.dcePicComplete = this.projectForm.get('dce_pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.projectForm.get('dce_pic_internal')!.value ? 1: 0
      }))


      if(this.modal_type === 'add' || this.modal_type === 'duplicate'){

        let body = {
          id: this.projectForm.get('id')?.value,
          name: this.projectForm.get('name')?.value,
          issue_date: this.projectForm.get('issue_date')?.value,
          pic: this.picComplete,
          dce_pic: this.dcePicComplete,
          specification: this.projectForm.get('specification')?.value,
          material: this.projectForm.get('material')?.value,
          project_category: this.projectForm.get('project_category')?.value,
          remarks: this.projectForm.get('remarks')?.value,
          address: this.projectForm.get('address')?.value,
          city: this.projectForm.get('city')?.value.toString(),
          province: this.projectForm.get('province')?.value.toString(),
          country: 'Indonesia',
          postal_code: this.projectForm.get('postal_code')?.value,
          maps_url: this.projectForm.get('maps_url')?.value,
          segmentation_id: this.projectForm.get('segmentation')?.value,
          customer_firm_id: this.projectForm.get('cluster')?.value,
          competitor: this.projectForm.get('competitor')?.value,
          year: this.year,
          month: this.month,
          reason_failed: this.projectForm.get('reason_failed')?.value,
          status: 1,
          project_customer: completeCustomer
        }

        this.apiSvc.createProjects(body).subscribe({
          next: () => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Projects',
              nzOkText: 'Ok',
              nzCentered: true
            })


            this.apiSvc.triggerRefreshProject();
          },
          error: (error) => {
            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Add Projects',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            })
          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

      if(this.modal_type === 'update'){

        let body = {
          id: this.projectForm.get('id')?.value,
          name: this.projectForm.get('name')?.value,
          issue_date: this.projectForm.get('issue_date')?.value,
          pic_new: this.picComplete,
          dce_pic_new: this.dcePicComplete,
          specification_new: this.projectForm.get('specification')?.value,
          material_new: this.projectForm.get('material')?.value,
          project_category: this.projectForm.get('project_category')?.value,
          remarks: this.projectForm.get('remarks')?.value,
          address: this.projectForm.get('address')?.value,
          city: this.projectForm.get('city')?.value.toString(),
          province: this.projectForm.get('province')?.value.toString(),
          country: 'Indonesia',
          postal_code: this.projectForm.get('postal_code')?.value,
          maps_url: this.projectForm.get('maps_url')?.value,
          segmentation_id: this.projectForm.get('segmentation')?.value,
          customer_firm_id: this.projectForm.get('cluster')?.value,
          competitor: this.projectForm.get('competitor')?.value,
          year: this.year,
          month: this.month,
          reason_failed: this.projectForm.get('reason_failed')?.value,
          status: 1,
          project_customer_new: completeCustomer
        }
        
        this.apiSvc.updateProjects(body).subscribe({
          next: () => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Update Project',
              nzOkText: 'Ok',
              nzCentered: true
            })

            this.apiSvc.triggerRefreshProject();
          },
          error: (error) => {

            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Update Project',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            })

          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

    } else {
      this.spinnerSvc.hide();

      this.modalSvc.error({
        nzTitle: 'Unable to Submit',
        nzContent: 'Need to fill all the input',
        nzOkText: 'Ok',
        nzCentered: true
      })

    }
  }
}
