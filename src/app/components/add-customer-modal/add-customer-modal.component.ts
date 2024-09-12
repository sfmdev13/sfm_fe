import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
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

  provinces$!: Observable<any>;

  pic_id = localStorage.getItem('pic_id')!;
  
  customerForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    email: ['',[Validators.required]],
    nib: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    wa_phone: ['', [Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    city: ['', [Validators.required]],
    province: ['', [Validators.required]],
    country: ['Indonesia'],
    postal_code: ['', [Validators.required]],
    status: [1,[Validators.required]],
    customer_firm_id: ['', [Validators.required]],
    loyal_customer_program_id: ['', [Validators.required]],
    customer_sector_id: ['', [Validators.required]],
    type: ['company',[Validators.required]],
    website: ['', [Validators.required]],
    maps_url: ['', [Validators.required]],
    contactPerson: this.fb.array([]),
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]]
  })

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company'

  catContact$!:Observable<IRootCatContact>;
  
  loyalCustCat$!: Observable<IRootCatContact>;
  customerFirm$!: Observable<IRootCatContact>;
  customerSector$!: Observable<IRootCatContact>;

  filteredListOfPic: any[] = [];

  cpListOfPic: any[] = [];

  filteredCpListOfPic: any[] = [];
 
  picComplete: any;
  contactPersonComplete: any;

  city: any[] = [];

  provinceList: any [] = [];

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void { 

    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap(p => {
        this.provinceList = p;
      })
    );
    
    this.catContact$ = this.apiSvc.getCategoryCP();
    this.loyalCustCat$ = this.apiSvc.getLoyalCustomer();
    this.customerSector$ = this.apiSvc.getCustomerSector();
    this.customerFirm$ = this.apiSvc.getCustomerFirm();

    this.filteredListOfPic = this.listOfPic.filter((p) => p.pic_id === this.pic_id);

    this.cpListOfPic = this.filteredListOfPic;
    this.filteredCpListOfPic = this.filteredListOfPic;

    this.customerForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.customerForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.customerForm.get('pic')?.valueChanges.subscribe((value) => {

      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));
      this.cpListOfPic = this.filteredListOfPic;

      if(!value.includes(this.customerForm.get('is_pic_internal')?.value)){
        this.customerForm.patchValue({is_pic_internal: ''})
      }

      this.contactPerson.controls.forEach((control: AbstractControl) => {
        if(control instanceof FormGroup){
          const cpPic = control.get('cp_pic');
          const cpPicInternal = control.get('cp_is_pic_internal')

          const filteredCpPic = cpPic?.value.filter((pic:any) => value.includes(pic))
          cpPic?.patchValue(filteredCpPic)

          if(!value.includes(cpPicInternal?.value)){
            cpPicInternal?.patchValue('');
          }
        }
      })
    })

    this.customerForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })

    this.addContactPerson();


    if(this.modal_type === 'update'){

      this.optionCustSelected = this.customerDetail.type;

      this.customerForm.patchValue({
        id: this.customerDetail.id,
        name: this.customerDetail.name,
        email: this.customerDetail.email,
        nib: this.customerDetail.nib,
        type: this.customerDetail.type,
        phone: this.customerDetail.phone,
        address: this.customerDetail.address,
        status: this.customerDetail.status,
        website: this.customerDetail.website,
        maps_url: this.customerDetail.maps_url,
        province: parseInt(this.customerDetail.province),
        city: parseInt(this.customerDetail.city),
        country: this.customerDetail.country,
        customer_firm_id: this.customerDetail.customer_firm.id,
        loyal_customer_program_id: this.customerDetail.loyal_customer.id,
        customer_sector_id: this.customerDetail.customer_sector.id,
        wa_phone: this.customerDetail.wa_phone,
        postal_code: this.customerDetail.postal_code
      })


      //clear existing contact person
      while (this.contactPerson.length !== 0) {
        this.contactPerson.removeAt(0);
      }
    
      this.customerDetail.contactPerson.forEach((contact) => {
        const updateCp = this.fb.group({
          cp_name: [contact.name, Validators.required],
          cp_email: [contact.email, Validators.required],
          cp_phone: [contact.phone, Validators.required],
          cp_category_id: [contact.customer_category.id, Validators.required],
          cp_address: [contact.address, Validators.required],
          is_pic_company: [contact.is_pic_company === 1 ? true : false, Validators.required],
          cp_id: [contact.id],
          cp_wa_phone: [contact.wa_phone, Validators.required],
          cp_province: [parseInt(contact.province), Validators.required],
          cp_city: [parseInt(contact.city), Validators.required],
          cp_postal_code: [contact.postal_code, Validators.required],
          cp_country: [contact.country, Validators.required],
          cp_loyal_customer_program_id: [contact.loyal_customer_program_id, Validators.required],
          cp_pic: [contact.pic.map(item => item.pic_id), Validators.required],
          cp_is_pic_head: [contact.pic.filter(item => item.is_pic_head === 1)[0].pic_id, Validators.required],
          filteredCpListOfPic: [this.cpListOfPic],
          filteredCity: []
        });

        this.cpValueChangeSubscriptions(updateCp);

        const filteredList = this.cpListOfPic.filter(pic => {
          const selectedPicId  = updateCp.get('cp_pic')?.value
          return selectedPicId.includes(pic.pic_id);
        });
    
        updateCp.get('filteredCpListOfPic')?.setValue(filteredList);


        this.apiSvc.getRegenciesByProvince(parseInt(contact.province)).subscribe((res) => {
          updateCp.get('filteredCity')?.setValue(res, { emitEvent: false });
        })
    
        this.contactPerson.push(updateCp);
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
    const newCp = this.fb.group({
      cp_name: ['', [Validators.required]],
      cp_email: ['', [Validators.required]],
      cp_phone: ['', [Validators.required]],
      cp_wa_phone: ['', [Validators.required]],
      cp_category_id: [0, [Validators.required]],
      cp_address: ['', [Validators.required]],
      cp_province: ['', [Validators.required]],
      cp_city: ['', [Validators.required]],
      cp_postal_code: ['', [Validators.required]],
      cp_country: ['Indonesia'],
      is_pic_company: [false, [Validators.required]],
      cp_pic: [[this.pic_id], [Validators.required]],
      cp_is_pic_head: ['', [Validators.required]],
      cp_loyal_customer_program_id: ['', [Validators.required]],
      filteredCpListOfPic: [this.cpListOfPic],
      filteredCity: [],
      cp_id: ['']

    });

    this.cpValueChangeSubscriptions(newCp);

    const filteredList = this.cpListOfPic.filter(pic => {
      const selectedPicId  = newCp.get('cp_pic')?.value
      return selectedPicId.includes(pic.pic_id);
    });

    newCp.get('filteredCpListOfPic')?.setValue(filteredList);

    this.contactPerson.push(newCp);
  }

  cpValueChangeSubscriptions(control: FormGroup): void {
    control.get('cp_pic')?.valueChanges.subscribe(value => {
      this.updateFilteredCpListOfPic(control, value);
    });

    control.get('cp_province')?.valueChanges.subscribe(value => {
      this.updateFilteredCity(control, value)
    })
  }

  updateFilteredCpListOfPic(formGroup: FormGroup, selectedPicId: any): void {
    // Filter your cpListOfPic based on the selectedPicId
    const filteredList = this.cpListOfPic.filter(pic => {
      // Adjust filtering logic as needed
      return selectedPicId.includes(pic.pic_id);
    });

    if(!selectedPicId.includes(formGroup.get('cp_is_pic_head')?.value)){
      formGroup.patchValue({cp_is_pic_head: ''})
    }

    // Update the filtered list specific to this form group
    formGroup.get('filteredCpListOfPic')?.setValue(filteredList, { emitEvent: false });
  }

  updateFilteredCity(formGroup: FormGroup, selectedId: any): void {
    this.apiSvc.getRegenciesByProvince(selectedId).subscribe((res) => {
      formGroup.get('filteredCity')?.setValue(res, { emitEvent: false });
    })
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



    const selectedProv = this.provinceList.find(item => item.id === this.customerForm.get('province')?.value);
    const selectedCity = this.city.find(item => item.id === this.customerForm.get('city')?.value);

    if(this.modal_type === 'add'){
      this.contactPersonComplete = this.contactPerson.value.map((pic:any) => ({
        cp_name: pic.cp_name,
        cp_email: pic.cp_email,
        cp_phone: pic.cp_phone,
        cp_wa_phone: pic.cp_wa_phone,
        cp_address: pic.cp_address,
        cp_postal_code: pic.cp_postal_code,
        cp_country: pic.cp_country,
        cp_province: pic.cp_province.toString(),
        cp_city: pic.cp_city.toString(),
        cp_category_id: pic.cp_category_id,
        cp_nik: '123',
        is_pic_company: pic.is_pic_company,
        cp_pic: pic.cp_pic.map((p: any) => ({
          pic_id: p,
          is_pic_head: p === pic.cp_is_pic_head
        })),
        cp_loyal_customer_program_id: pic.cp_loyal_customer_program_id
      }))

      if(this.customerForm.valid){

        const body = {
          name: this.customerForm.get('name')?.value,
          email: this.customerForm.get('email')?.value,
          nib: this.customerForm.get('nib')?.value,
          phone: this.customerForm.get('phone')?.value,
          wa_phone: this.customerForm.get('wa_phone')?.value,
          address: this.customerForm.get('address')?.value,
          status: this.customerForm.get('status')?.value,
          type: this.customerForm.get('type')?.value,
          contactPerson: this.contactPersonComplete,
          website: this.customerForm.get('website')?.value,
          maps_url: this.customerForm.get('maps_url')?.value,
          pic: this.picComplete,
          customer_firm_id: this.customerForm.get('customer_firm_id')?.value,
          loyal_customer_program_id: this.customerForm.get('loyal_customer_program_id')?.value,
          customer_sector_id: this.customerForm.get('customer_sector_id')?.value,
          postal_code: this.customerForm.get('postal_code')?.value,
          province: this.customerForm.get('province')?.value.toString(),
          city: this.customerForm.get('city')?.value.toString(),
          country: this.customerForm.get('country')?.value
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
      this.contactPersonComplete = this.contactPerson.value.map((pic:any, i: number) => ({
        cp_id: pic.cp_id,
        cp_name: pic.cp_name,
        cp_email: pic.cp_email,
        cp_phone: pic.cp_phone,
        cp_wa_phone: pic.cp_wa_phone,
        cp_address: pic.cp_address,
        cp_postal_code: pic.cp_postal_code,
        cp_country: pic.cp_country,
        cp_province: pic.cp_province.toString(),
        cp_city: pic.cp_city.toString(),
        cp_category_id: pic.cp_category_id,
        cp_nik: '123',
        is_pic_company: pic.is_pic_company,
        cp_pic: this.customerDetail.contactPerson.map(item => item.pic)[i],
        cp_pic_new: pic.cp_pic.map((p: any) => ({
          pic_id: p,
          is_pic_head: p === pic.cp_is_pic_head
        })),
        cp_loyal_customer_program_id: pic.cp_loyal_customer_program_id
      }))

      if(this.customerForm.valid){
        const body = {
          id: this.customerForm.get('id')?.value,
          name: this.customerForm.get('name')?.value,
          email: this.customerForm.get('email')?.value,
          nib: this.customerForm.get('nib')?.value,
          phone: this.customerForm.get('phone')?.value,
          wa_phone: this.customerForm.get('wa_phone')?.value,
          address: this.customerForm.get('address')?.value,
          status: this.customerForm.get('status')?.value,
          type: this.customerForm.get('type')?.value,
          contactPerson: this.contactPersonComplete,
          website: this.customerForm.get('website')?.value,
          maps_url: this.customerForm.get('maps_url')?.value,
          pic: this.customerDetail.pic,
          pic_new: this.picComplete,
          customer_firm_id: this.customerForm.get('customer_firm_id')?.value,
          loyal_customer_program_id: this.customerForm.get('loyal_customer_program_id')?.value,
          customer_sector_id: this.customerForm.get('customer_sector_id')?.value,
          postal_code: this.customerForm.get('postal_code')?.value,
          province: this.customerForm.get('province')?.value.toString(),
          city: this.customerForm.get('city')?.value.toString(),
          country: this.customerForm.get('country')?.value
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
