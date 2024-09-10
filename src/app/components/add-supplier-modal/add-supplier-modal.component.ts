import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { filter, Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataSupplier, IRootCatContact } from 'src/app/interfaces';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  @Input() supplierDetail: IDataSupplier = {} as IDataSupplier
  @Input() listOfPic: any[] = [];

  pic_id = localStorage.getItem('pic_id')!;

  supplierForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['',[Validators.required]],
    nik: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    status: [1,[Validators.required]],
    type: ['company', [Validators.required]],
    contactPerson: this.fb.array([]),
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]]
  })

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company'

  picLists$!: Observable<any>;


  filteredListOfPic: any[] = [];

  picComplete: any;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    this.filteredListOfPic = this.listOfPic.filter((p) => p.pic_id === this.pic_id);

    this.supplierForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.supplierForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.supplierForm.get('pic')?.valueChanges.subscribe((value) => {

      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.supplierForm.get('is_pic_internal')?.value)){
        this.supplierForm.patchValue({is_pic_internal: ''})
      }

    })

    this.addContactPerson();

    if(this.modal_type === 'update'){
      console.log(this.supplierDetail.id)
      this.supplierForm.patchValue({
        id: this.supplierDetail.id,
        name: this.supplierDetail.name,
        email: this.supplierDetail.email,
        nik: this.supplierDetail.nik,
        type: this.supplierDetail.type,
        phone: this.supplierDetail.phone,
        address: this.supplierDetail.address,
        status: this.supplierDetail.status,
      })

      while(this.contactPerson.length !== 0){
        this.contactPerson.removeAt(0);
      }

      this.supplierDetail.contactPerson.forEach((contact) => {
        this.contactPerson.push(this.fb.group({
          cp_name: [contact.name, Validators.required],
          cp_email: [contact.email, Validators.required],
          cp_nik: [contact.nik, Validators.required],
          cp_phone: [contact.phone, Validators.required],
          cp_address: [contact.address, Validators.required],
          is_pic_company: [contact.is_pic_company === 1 ? true : false, Validators.required],
          cp_id: [contact.id]
        }));
      })

      //extract pic id
      const picIds = this.supplierDetail.pic.map(item => item.pic_id);

      //find pic internal id
      const isPicInternalId = this.supplierDetail.pic.filter(item => item.is_pic_internal === 1);

      this.supplierForm.patchValue({
        pic: picIds,
        is_pic_internal: isPicInternalId[0].pic_id
      });
    }

  }

  get contactPerson(): FormArray {
    return this.supplierForm.get('contactPerson') as FormArray;
  }

  addContactPerson(): void {
    this.contactPerson.push(this.fb.group({
      cp_name: ['', [Validators.required]],
      cp_email: ['', [Validators.required]],
      cp_nik: ['', [Validators.required]],
      cp_phone: ['', [Validators.required]],
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


  optionCustChange($event: number){
    const contactPersonArray = this.supplierForm.get('contactPerson') as FormArray;

    if($event === 0) {
      this.optionCustSelected = 'company';
      this.supplierForm.patchValue({
        type: 'company',
      });
      this.addContactPerson();
    }
    if($event === 1 && this.modal_type === 'add') {
      this.optionCustSelected = 'person'
      this.supplierForm.patchValue({
        type: 'person',
      });
      while (contactPersonArray.length !== 0) {
        contactPersonArray.removeAt(0);
      }
    };
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){

    console.log(this.supplierForm.value)

    // this.picComplete = this.supplierForm.get('pic')!.value.map((pic_id: any) => ({
    //   pic_id: pic_id,
    //   is_pic_internal: pic_id === this.supplierForm.get('is_pic_internal')!.value
    // }));

    // if(this.supplierForm.valid){
    //   if(this.modal_type === 'add'){
    //     const body = {
    //       name: this.supplierForm.get('name')?.value,
    //       email: this.supplierForm.get('email')?.value,
    //       nik: this.supplierForm.get('nik')?.value,
    //       phone: this.supplierForm.get('phone')?.value,
    //       address: this.supplierForm.get('address')?.value,
    //       status: this.supplierForm.get('status')?.value,
    //       type: this.supplierForm.get('type')?.value,
    //       contactPerson: this.supplierForm.get('contactPerson')?.value,
    //       pic: this.picComplete
    //     };

    //     this.apiSvc.createSupplier(body).subscribe({
    //       next:() => {
    //         this.apiSvc.triggerRefreshSuppliers();
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       },
    //       complete: () => {
    //         this.modal.destroy();
    //       }
    //     })
    //   }

    //   if(this.modal_type === 'update'){
    //     const body = {
    //       id: this.supplierForm.get('id')?.value,
    //       name: this.supplierForm.get('name')?.value,
    //       email: this.supplierForm.get('email')?.value,
    //       nik: this.supplierForm.get('nik')?.value,
    //       phone: this.supplierForm.get('phone')?.value,
    //       address: this.supplierForm.get('address')?.value,
    //       status: this.supplierForm.get('status')?.value,
    //       type: this.supplierForm.get('type')?.value,
    //       contactPerson: this.supplierForm.get('contactPerson')?.value,
    //       pic: this.supplierDetail.pic,
    //       pic_new: this.picComplete
    //     };

    //     this.apiSvc.updateSupplier(body).subscribe({
    //       next:() => {
    //         this.apiSvc.triggerRefreshSuppliers();
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       },
    //       complete: () => {
    //         this.modal.destroy();
    //       }
    //     })
    //   }
    // }
  }

}
