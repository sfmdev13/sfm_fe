import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataEmployee, IRootAllRoles, ICategories, IRootCustomer, IContactPerson, IDataCustomer } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';
import { SpinnerService } from 'src/app/spinner.service';
import { DetailCustomerModalComponent } from '../detail-customer-modal/detail-customer-modal.component';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.scss']
})
export class AddProjectsComponent implements OnInit {
  @Input() modal_type: string = 'add';
  @Input() data: IDataProject = {} as IDataProject

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
    reason_failed: ['', Validators.required],
    sales_pic: [[this.pic_id], [Validators.required]],
    dce_pic: [[], Validators.required],

    province: ['', Validators.required],
    city: ['', Validators.required],
    postal_code: ['', Validators.required],
    address: ['', Validators.required],
    cluster: ['', Validators.required],
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

  picComplete: any;

  customerDetail: IDataCustomer = {} as IDataCustomer;
  isCustomerDetail: boolean = false;

  provinces$!: Observable<any>;
  provinceList: any[] = [];
  city: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

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

    this.projectForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.projectForm.get('is_pic_internal')?.value)){
        this.projectForm.patchValue({is_pic_internal: ''})
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
      this.projectForm.patchValue({
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        order_date: this.data.order_date,
        delivery_date: this.data.delivery_date,
        customer_id: this.data.customer.id,
        status: this.data.status,
        progress: this.data.progress
      })


      //update PIC
      this.pic$ = this.apiSvc.getPic().pipe(
        tap(res => {
          this.listOfPic = res;

          //extract pic id
          const picIds = this.data.pic.map(item => item.pic_id);

          //find pic internal id
          const isPicInternalId = this.data.pic.filter(item => item.is_pic_internal === 1);

          this.projectForm.patchValue({
            pic: picIds,
            is_pic_internal: isPicInternalId[0].pic_id,
          });
        })
      )

    } 

  }

  showDetail(): void{
    this.modalSvc.create({
      nzTitle: 'Detail Customer',
      nzContent: DetailCustomerModalComponent,
      nzCentered: true,
      nzComponentParams: {
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

      this.picComplete = this.projectForm.get('pic')!.value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal: pic_id === this.projectForm.get('is_pic_internal')!.value ? 1 : 0
      }));


      if(this.modal_type === 'add'){

        let body = {
          id: this.projectForm.get('id')?.value,
          name: this.projectForm.get('name')?.value,
          description: this.projectForm.get('description')?.value,
          customer_id: this.projectForm.get('customer_id')?.value,
          status: this.projectForm.get('status')?.value,
          pic: this.picComplete
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
