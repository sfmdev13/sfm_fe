import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataCustomer, IRootCatContact } from 'src/app/interfaces';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  @Input() customerDetail: IDataCustomer = {} as IDataCustomer
  @Input() listOfPic: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;
  
  customerForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    email: ['',[Validators.required]],
    nik: ['',[Validators.required]],
    type: ['company',[Validators.required]],
    phone: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    website: ['', [Validators.required]],
    maps_url: ['', [Validators.required]],
    status: [1,[Validators.required]],
    contactPerson: this.fb.array([]),
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]]
  })

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company'

  catContact$!:Observable<IRootCatContact>;

  
  filteredListOfPic: any[] = [];

  picComplete: any;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {  
    this.catContact$ = this.apiSvc.getCategoryCP();

    this.filteredListOfPic = this.listOfPic.filter((p) => p.pic_id === this.pic_id);

    this.customerForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.customerForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.customerForm.get('pic')?.valueChanges.subscribe((value) => {

      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.customerForm.get('is_pic_internal')?.value)){
        this.customerForm.patchValue({is_pic_internal: ''})
      }

    })

    this.addContactPerson();

    if(this.modal_type === 'update'){

      this.optionCustSelected = this.customerDetail.type;

      this.customerForm.patchValue({
        id: this.customerDetail.id,
        name: this.customerDetail.name,
        email: this.customerDetail.email,
        nik: this.customerDetail.nik,
        type: this.customerDetail.type,
        phone: this.customerDetail.phone,
        address: this.customerDetail.address,
        status: this.customerDetail.status,
        website: this.customerDetail.website,
        maps_url: this.customerDetail.maps_url
      })

      const contactPerson = this.customerForm.get('contactPerson') as FormArray;

      //clear existing contact person
      while (contactPerson.length !== 0) {
        contactPerson.removeAt(0);
      }
    
      this.customerDetail.contactPerson.forEach((contact) => {
        contactPerson.push(this.fb.group({
          cp_name: [contact.name, Validators.required],
          cp_email: [contact.email, Validators.required],
          cp_phone: [contact.phone, Validators.required],
          cp_category_id: [contact.customer_category.id, Validators.required],
          cp_address: [contact.address, Validators.required],
          is_pic_company: [contact.is_pic_company === 1 ? true : false, Validators.required],
          cp_id: [contact.id]
        }));
      });

      //extract pic id
      const picIds = this.customerDetail.pic.map(item => item.pic_id);

      //find pic internal id
      const isPicInternalId = this.customerDetail.pic.filter(item => item.is_pic_internal === 1);

      this.customerForm.patchValue({
        pic: picIds,
        is_pic_internal: isPicInternalId[0].pic_id
      });
    }
  }

  get contactPerson(): FormArray {
    return this.customerForm.get('contactPerson') as FormArray;
  }

  addContactPerson(): void {
    this.contactPerson.push(this.fb.group({
      cp_name: ['', [Validators.required]],
      cp_email: ['', [Validators.required]],
      cp_phone: ['', [Validators.required]],
      cp_category_id: [0, [Validators.required]],
      cp_address: ['', [Validators.required]],
      is_pic_company: [false, [Validators.required]]
    }));
  }

  removeContactPerson(index: number): void {
    if(index === 0){
      return;
    }
    this.contactPerson.removeAt(index);
  }


  destroyModal(): void {
    this.modal.destroy();
  }
  

  submitForm(){

    this.picComplete = this.customerForm.get('pic')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id === this.customerForm.get('is_pic_internal')!.value
    }));

    if(this.modal_type === 'add'){
      if(this.customerForm.valid){

        const body = {
          name: this.customerForm.get('name')?.value,
          email: this.customerForm.get('email')?.value,
          nik: this.customerForm.get('nik')?.value,
          phone: this.customerForm.get('phone')?.value,
          address: this.customerForm.get('address')?.value,
          status: this.customerForm.get('status')?.value,
          type: this.customerForm.get('type')?.value,
          contactPerson: this.customerForm.get('contactPerson')?.value,
          website: this.customerForm.get('website')?.value,
          maps_url: this.customerForm.get('maps_url')?.value,
          pic: this.picComplete
        };

        this.apiSvc.createCustomer(body).subscribe({
          next: (response) => {
            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        });
      } else {
        Object.values(this.customerForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

    if(this.modal_type === 'update'){
      if(this.customerForm.valid){
        const body = {
          id: this.customerForm.get('id')?.value,
          name: this.customerForm.get('name')?.value,
          email: this.customerForm.get('email')?.value,
          nik: this.customerForm.get('nik')?.value,
          phone: this.customerForm.get('phone')?.value,
          address: this.customerForm.get('address')?.value,
          status: this.customerForm.get('status')?.value,
          type: this.customerForm.get('type')?.value,
          contactPerson: this.customerForm.get('contactPerson')?.value,
          website: this.customerForm.get('website')?.value,
          maps_url: this.customerForm.get('maps_url')?.value,
          pic: this.customerDetail.pic,
          pic_new: this.picComplete
        };

        this.apiSvc.updateCustomer(body).subscribe({
          next: (response) => {
            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        });
      } else {
        Object.values(this.customerForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }

  optionCustChange($event: number){
    const contactPersonArray = this.customerForm.get('contactPerson') as FormArray;

    if($event === 0) {
      this.optionCustSelected = 'company';
      this.customerForm.patchValue({
        type: 'company',
      });
      this.addContactPerson();
    }
    if($event === 1 && this.modal_type === 'add') {
      this.optionCustSelected = 'person'
      this.customerForm.patchValue({
        type: 'person',
      });
      while (contactPersonArray.length !== 0) {
        contactPersonArray.removeAt(0);
      }
    };
  }
}
