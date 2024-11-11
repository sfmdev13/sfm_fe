import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
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

  customerList$!: Observable<IRootCustomer>;

  divisionList$!: Observable<any>;

  isLoadingCustomerList: boolean = true;
  isLoadingDivision: boolean = true;

  roleList: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  projectForm = this.fb.group({
    id: [''],
    project_id: ['', Validators.required],
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

    customer_id: ['', Validators.required],
    owner: [''],
    architect: [''],
    contractor: ['']
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

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

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

    this.customerList$ = this.apiSvc.getCustomerList().pipe(
      tap(res => {
        this.isLoadingCustomerList = false
      })
    )


    if(this.modal_type === 'update'){
      // this.projectForm.patchValue({
      //   id: this.data.id,
      //   name: this.data.name,
      //   description: this.data.description,
      //   order_date: this.data.order_date,
      //   delivery_date: this.data.delivery_date,
      //   customer_id: this.data.customer.id,
      //   status: this.data.status,
      //   progress: this.data.progress
      // })


      // //update PIC
      // this.pic$ = this.apiSvc.getPic().pipe(
      //   tap(res => {
      //     this.listOfPic = res;

      //     //extract pic id
      //     const picIds = this.data.pic.map(item => item.pic_id);

      //     //find pic internal id
      //     const isPicInternalId = this.data.pic.filter(item => item.is_pic_internal === 1);

      //     this.projectForm.patchValue({
      //       pic: picIds,
      //       is_pic_internal: isPicInternalId[0].pic_id,
      //     });
      //   })
      // )

    } 

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

      this.picComplete = this.projectForm.get('sales_pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.projectForm.get('sales_pic_internal')!.value ? 1 : 0
      }));

      this.dcePicComplete = this.projectForm.get('dce_pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.projectForm.get('dce_pic_internal')!.value ? 1: 0
      }))


      if(this.modal_type === 'add'){

        let body = {
          id: this.projectForm.get('id')?.value,
          project_pid: this.projectForm.get('project_id')?.value,
          name: this.projectForm.get('name')?.value,
          issue_date: this.projectForm.get('issue_date')?.value,
          customer_id: this.projectForm.get('customer_id')?.value,
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
          description: this.projectForm.get('description')?.value,
          customer_id: this.projectForm.get('customer_id')?.value,
          status: this.projectForm.get('status')?.value,
          pic_new: this.picComplete
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
