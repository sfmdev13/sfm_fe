import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { filter, Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataSupplier, IRootCatContact } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  

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
    type: ['company',[Validators.required]],
    website: ['', [Validators.required]],
    maps_url: ['', [Validators.required]],
    contactPerson: this.fb.array([]),
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    product_category: this.fb.array([])
  })

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company'

  picLists$!: Observable<any>;

  filteredListOfPic: any[] = [];

  picComplete: any;
  contactPersonComplete: any;
  productCategoryComplete: any;

  provinces$!: Observable<any>;

  suppProduct$!: Observable<IRootCatContact>;

  cpListOfPic: any[] = [];

  filteredCpListOfPic: any[] = [];

  city: any[] = [];

  provinceList: any [] = [];

  fileList: NzUploadFile[] = [];

  fileImageList: NzUploadFile[] = [];


  deletedCpIds: string[] = [];

  isSpinning: boolean = false;

  attachmentDeletedIds: string[] = [];

  isLoadingProvince: boolean = true;

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  titleCat: string = '';

  nestedModalRef?: NzModalRef;

  deletedProductCatIds: string[] = [];

  suppProductList: IRootCatContact = {} as IRootCatContact

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private nzMsgSvc: NzMessageService
  ) { }

  ngOnInit(): void {

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.suppProduct$ = this.apiSvc.getSupplierProduct() 
    })

    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap(p => {
        this.provinceList = p;
        this.isLoadingProvince = false
      })
    );

    this.suppProduct$ = this.apiSvc.getSupplierProduct().pipe(
      tap(res => {
        this.suppProductList = res
      })
    )

    this.filteredListOfPic = this.listOfPic.filter((p) => p.pic_id === this.pic_id);

    this.cpListOfPic = this.filteredListOfPic;
    this.filteredCpListOfPic = this.filteredListOfPic;

    this.supplierForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.supplierForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    this.supplierForm.get('pic')?.valueChanges.subscribe((value) => {

      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));
      this.cpListOfPic = this.filteredListOfPic;

      if(!value.includes(this.supplierForm.get('is_pic_internal')?.value)){
        this.supplierForm.patchValue({is_pic_internal: ''})
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

    this.supplierForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })


    this.addContactPerson();

    if(this.modal_type === 'update'){

      this.optionCustSelected = this.supplierDetail.type;

      const newUpdateFileList: NzUploadFile[] = this.supplierDetail.attachments.map(attachment => ({
        uid: attachment.id,
        name: attachment.file_name,
        status: 'done',
        url: attachment.file_url,
        response: {
          id: attachment.id,
          attachment_path: attachment.attachment_path
        } 
      }))

      
      this.fileList = newUpdateFileList;

      if(this.optionCustSelected === 'person'){
        //mapping image for person
        const updateContactPerson = this.supplierDetail.contact_person;
        const updateProfilePictue = updateContactPerson.map((cp) => cp.cp_profile_picture)[0];
        
        const newUpdateFileListImage: NzUploadFile[] = updateProfilePictue.map(attachment => ({
          uid: attachment.id,
          name: attachment.file_name,
          status: 'done',
          url: attachment.file_url,
          response: {
            id: attachment.id,
            attachment_path: attachment.attachment_path
          } 
        }))

        this.fileImageList = newUpdateFileListImage;
      }

      this.supplierForm.patchValue({
        id: this.supplierDetail.id,
        name: this.supplierDetail.name,
        email: this.supplierDetail.email,
        nib: this.supplierDetail.nib,
        type: this.supplierDetail.type,
        phone: this.supplierDetail.phone,
        address: this.supplierDetail.address,
        status: this.supplierDetail.status,
        website: this.supplierDetail.website,
        maps_url: this.supplierDetail.maps_url,
        province: parseInt(this.supplierDetail.province),
        city: parseInt(this.supplierDetail.city),
        country: this.supplierDetail.country,
        wa_phone: this.supplierDetail.wa_phone,
        postal_code: this.supplierDetail.postal_code
      })

      while(this.contactPerson.length !== 0){
        this.contactPerson.removeAt(0);
      }

      this.supplierDetail.contact_person.forEach((contact) => {

        //change cp attachments type
        const updatedCpAttachments: NzUploadFile[] = contact.cp_attachments.map((attachment) => ({
          uid: attachment.id,
          name: attachment.file_name,
          status: 'done',
          url: attachment.file_url,
          response: {
            id: attachment.id,
            attachment_path: attachment.attachment_path
          },
          isImageUrl: true
        }))

        const updatedCpProfileAttachments: NzUploadFile[] = contact.cp_profile_picture.map((attachment) => ({
          uid: attachment.id,
          name: attachment.file_name,
          status: 'done',
          url: attachment.file_url,
          response: {
            id: attachment.id,
            attachment_path: attachment.attachment_path
          },
          isImageUrl: true
        }))


        const updateCp = this.fb.group({
          cp_name: [contact.cp_name, Validators.required],
          cp_email: [contact.cp_email, Validators.required],
          cp_phone: [contact.cp_phone, Validators.required],
          cp_address: [contact.cp_address, Validators.required],
          is_pic_company: [contact.is_pic_company === 1 ? true : false, Validators.required],
          cp_id: [contact.cp_id],
          cp_wa_phone: [contact.cp_wa_phone, Validators.required],
          cp_province: [parseInt(contact.cp_province), Validators.required],
          cp_city: [parseInt(contact.cp_city), Validators.required],
          cp_postal_code: [contact.cp_postal_code, Validators.required],
          cp_country: [contact.cp_country, Validators.required],
          cp_pic: [contact.pic.map(item => item.pic_id), Validators.required],
          cp_is_pic_head: [contact.pic.filter(item => item.is_pic_head === 1)[0].pic_id, Validators.required],
          filteredCpListOfPic: [this.cpListOfPic],
          filteredCity: [],
          cp_attachments: [updatedCpAttachments],
          cp_profile_picture: [updatedCpProfileAttachments][0],
          cp_attachmentDeleteIds: [[]],
          cp_profile_pictureDeleteIds: [[]]
        });

        this.cpValueChangeSubscriptions(updateCp);

        
        const filteredList = this.cpListOfPic.filter(pic => {
          const selectedPicId  = updateCp.get('cp_pic')?.value
          return selectedPicId.includes(pic.pic_id);
        });

        updateCp.get('filteredCpListOfPic')?.setValue(filteredList);


        this.apiSvc.getRegenciesByProvince(parseInt(contact.cp_province)).subscribe((res) => {
          updateCp.get('filteredCity')?.setValue(res, { emitEvent: false });
        })
    
        this.contactPerson.push(updateCp);
      })

      this.supplierDetail.supplier_products.forEach((supp) => {
        const updateProduct = this.fb.group({
          supplier_product_id: parseInt(supp.product_id),
          sub_category: supp.sub_category,
          manufacture: supp.manufacture
        })

        this.productCategory.push(updateProduct)
      })

      //extract pic id
      const picIds = this.supplierDetail.pic.map(item => item.pic_id);

      //find pic internal id
      const isPicInternalId = this.supplierDetail.pic.filter(item => item.is_pic_internal === 1);

      this.supplierForm.patchValue({
        pic: picIds,
        is_pic_internal: isPicInternalId[0].pic_id
      });

      //extact supplier product id
      // const supplier_product_ids = this.supplierDetail.supplier_products.map(item => parseInt(item.product_id))
      // this.supplierForm.patchValue({
      //   supplier_product_id: supplier_product_ids
      // })
    }

  }

  get productCategory(): FormArray {
    return this.supplierForm.get('product_category') as FormArray;
  }

  removeProductCategory(index: number): void {
    if(index === 0){
      return;
    }
    
    this.productCategory.removeAt(index);
  }

  
  addProductCategory(): void {
    const productCategory = this.fb.group({
      supplier_product_id: ['', Validators.required],
      sub_category: ['', Validators.required],
      manufacture: ['', Validators.required]
    });

    this.productCategory.push(productCategory);
  }

  showModalCategoryAdd(titleCat: string): void {
    this.titleCat = titleCat;

    this.nestedModalRef = this.modalSvc.create({
      nzTitle: ' Add Category ' + titleCat,
      nzContent: EditCategoriesModalComponent,
      nzComponentParams: {
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
          onClick: () => this.handleCategorySubmitAdd(),
          type: 'primary'
        }
      ]
    });
  }

  handleCategorySubmitAdd(): void{

    this.spinnerSvc.show();

    if(this.categoryForm.valid){
      if(this.titleCat.toLowerCase() === 'supplier product'){
        this.apiSvc.createSupplierProduct(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
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

  
  handleCancelCategoryAdd(): void{
    this.nestedModalRef?.close();
    this.categoryForm.reset();
  }


  get contactPerson(): FormArray {
    return this.supplierForm.get('contactPerson') as FormArray;
  }

  addContactPerson(): void {
    const newCp = this.fb.group({
      cp_name: ['', [Validators.required]],
      cp_email: ['', [Validators.required]],
      cp_phone: ['', [Validators.required]],
      cp_wa_phone: ['', [Validators.required]],
      cp_address: ['', [Validators.required]],
      cp_province: ['', [Validators.required]],
      cp_city: ['', [Validators.required]],
      cp_postal_code: ['', [Validators.required]],
      cp_country: ['Indonesia'],
      is_pic_company: [false, [Validators.required]],
      cp_pic: [[this.pic_id], [Validators.required]],
      cp_is_pic_head: ['', [Validators.required]],
      filteredCpListOfPic: [this.cpListOfPic],
      filteredCity: [],
      cp_id: [''],
      cp_attachments: [[], [Validators.required]],
      cp_profile_picture: [[], [Validators.required]],
      cp_attachmentDeleteIds: [[]],
      cp_profile_pictureDeleteIds: [[]]

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

    this.deletedCpIds = [...this.contactPerson.at(index).get('cp_id')?.value]
    
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

    this.spinnerSvc.show();

    this.picComplete = this.supplierForm.get('pic')!.value.map((pic_id: any) => ({
      pic_id: pic_id,
      is_pic_internal: pic_id === this.supplierForm.get('is_pic_internal')!.value ? 1 : 0
    }));

    this.productCategoryComplete = this.productCategory.value.map((prod: any) => ({
      supplier_product_id: prod.supplier_product_id,
      sub_category: prod.sub_category,
      manufacture: prod.manufacture
    }));

    if(this.supplierForm.valid){
      if(this.modal_type === 'add'){

        this.productCategoryComplete = this.productCategory.value.map((prod: any) => ({
          supplier_product_id: prod.supplier_product_id,
          sub_category: prod.sub_category,
          manufacture: prod.manufacture
        }));
    
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
          is_pic_company: pic.is_pic_company ? 1 : 0,
          cp_pic: pic.cp_pic.map((p: any) => ({
            pic_id: p,
            is_pic_head: p === pic.cp_is_pic_head ? 1 : 0
          })),
          cp_attachments: pic.cp_attachments,
          cp_profile_picture: pic.cp_profile_picture
        }))

        const body = {
          name: this.supplierForm.get('name')?.value,
          email: this.supplierForm.get('email')?.value,
          nib: this.supplierForm.get('nib')?.value,
          phone: this.supplierForm.get('phone')?.value,
          wa_phone: this.supplierForm.get('wa_phone')?.value,
          address: this.supplierForm.get('address')?.value,
          status: this.supplierForm.get('status')?.value,
          type: this.supplierForm.get('type')?.value,
          website: this.supplierForm.get('website')?.value,
          maps_url: this.supplierForm.get('maps_url')?.value,
          pic: this.picComplete,
          supplier_product_id: this.supplierForm.get('supplier_product_id')?.value,
          supplier_source_id: this.supplierForm.get('supplier_source_id')?.value,
          postal_code: this.supplierForm.get('postal_code')?.value,
          province: this.supplierForm.get('province')?.value.toString(),
          city: this.supplierForm.get('city')?.value.toString(),
          country: this.supplierForm.get('country')?.value,
          supplier_product: this.productCategoryComplete
        };

        const formData = new FormData();

        //append basic information
        Object.keys(body).forEach(key => {
          if(typeof (body as any)[key] === 'object'){
            formData.append(key, JSON.stringify((body as any)[key]))
          } else {
            formData.append(key, ( body as any )[key]);
          }
        })

        //append cp
        this.contactPersonComplete.forEach((contactPerson: any, index: number) => {
          Object.keys(contactPerson).forEach(key => {
            if (key !== 'cp_attachments' && key !== 'cp_profile_picture' && key !== 'cp_pic') {
              formData.append(`contactPerson[${index}][${key}]`, contactPerson[key]);
            }
          })


          //append cp profile picture
          if (contactPerson.cp_profile_picture) {
            formData.append(`contactPerson[${index}][cp_profile_picture][0]`, contactPerson.cp_profile_picture);
          }

          //append cp attachment
          if (contactPerson.cp_attachments && contactPerson.cp_attachments.length > 0) {
            contactPerson.cp_attachments.forEach((file: any, fileIndex: number) => {
              formData.append(`contactPerson[${index}][cp_attachments][${fileIndex}]`, file);
            });
          }
          

          //append cp pic
          formData.append(`contactPerson[${index}][cp_pic]`, JSON.stringify(contactPerson.cp_pic))

        })
        
        //append attachment
        if (this.fileList.length > 0) {
          this.fileList.forEach((file: any) => {
            formData.append('attachments[]', file);
          });
        }

        //append profile picture person
        if(this.fileImageList.length > 0){
          this.fileImageList.forEach((file: any) => {
            formData.append('profile_picture[]', file);
          })
        }
        
        this.apiSvc.createSupplier(formData).subscribe({
          next:() => {

            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully add supplier',
              nzOkText: 'Ok',
              nzCentered: true
            });

            this.apiSvc.triggerRefreshSuppliers();
          },
          error: (error) => {

            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Add Supplier',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            });
          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

      if(this.modal_type === 'update'){

        this.productCategoryComplete = this.productCategory.value.map((prod: any) => ({
          product_id: prod.supplier_product_id,
          sub_category: prod.sub_category,
          manufacture: prod.manufacture
        }));
    

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
          cp_nik: '123',
          is_pic_company: pic.is_pic_company ? 1 : 0,     
          cp_pic: this.supplierDetail.contact_person.map(item => item.pic)[i],
          cp_pic_new: pic.cp_pic.map((p: any) => ({
            pic_id: p,
            is_pic_head: p === pic.cp_is_pic_head ? 1 : 0
          })),
          cp_attachments: pic.cp_attachments,
          cp_attachmentDeleteIds: pic.cp_attachmentDeleteIds,
          cp_profile_pictureDeleteIds: pic.cp_profile_pictureDeleteIds,
          cp_profile_picture: pic.cp_profile_picture
        }))   

        const body = {
          id: this.supplierForm.get('id')?.value,
          name: this.supplierForm.get('name')?.value,
          email: this.supplierForm.get('email')?.value,
          nib: this.supplierForm.get('nib')?.value,
          phone: this.supplierForm.get('phone')?.value,
          wa_phone: this.supplierForm.get('wa_phone')?.value,
          address: this.supplierForm.get('address')?.value,
          status: this.supplierForm.get('status')?.value,
          type: this.supplierForm.get('type')?.value,
          website: this.supplierForm.get('website')?.value,
          maps_url: this.supplierForm.get('maps_url')?.value,
          contactPerson: this.contactPersonComplete,
          pic: this.supplierDetail.pic,
          pic_new: this.picComplete,
          postal_code: this.supplierForm.get('postal_code')?.value,
          province: this.supplierForm.get('province')?.value.toString(),
          city: this.supplierForm.get('city')?.value.toString(),
          country: this.supplierForm.get('country')?.value,
          deletedCpIds: this.deletedCpIds,
          attachmentDeleteIds: this.attachmentDeletedIds,
          supplier_products_new: this.productCategoryComplete
        };

        const formData = new FormData();

        //append basic information
        Object.keys(body).forEach(key => {
          if(typeof (body as any)[key] === 'object'){
            formData.append(key, JSON.stringify((body as any)[key]))
          } else {
            formData.append(key, ( body as any )[key]);
          }
        })
        
        this.contactPersonComplete.forEach((contactPerson: any, index: number) => {
          Object.keys(contactPerson).forEach(key => {
            if (!['cp_attachments','cp_profile_picture', 'cp_attachmentDeleteIds', 'cp_attachmentDeleteIds' ].includes(key)) {
              formData.append(`contactPerson[${index}][${key}]`, contactPerson[key]);
            }
          })


          //append cp profile picture
          if (contactPerson.cp_profile_picture) {
            const profilePictures = {
              id: contactPerson.cp_profile_picture.hasOwnProperty('response') ? contactPerson.cp_profile_picture.uid : '',
              profile_picturefile: contactPerson.cp_profile_picture
            };
            formData.append(`contactPerson[${index}][cp_profile_picture][0][id]`, profilePictures.id);
            formData.append(`contactPerson[${index}][cp_profile_picture][0][profile_picturefile]`, profilePictures.profile_picturefile);
          }

          //append cp attachment
          const attachments: { id: string; attachment_file: any }[] = [];

          contactPerson.cp_attachments.forEach((file: any) => {
            attachments.push({
              id: file.hasOwnProperty('response') ? file.uid : '',
              attachment_file: file
            });
          });
          
          // Append the attachments array to formData
          attachments.forEach((attachment, fileIndex) => {
            formData.append(`contactPerson[${index}][cp_attachments][${fileIndex}][id]`, attachment.id);
            if (attachment.attachment_file) {
              formData.append(`contactPerson[${index}][cp_attachments][${fileIndex}][attachment_file]`, attachment.attachment_file);
            }
          });
        
          //append cp pic
          formData.append(`contactPerson[${index}][cp_pic]`, JSON.stringify(contactPerson.cp_pic))
          formData.append(`contactPerson[${index}][cp_pic_new]`, JSON.stringify(contactPerson.cp_pic_new))
          formData.append(`contactPerson[${index}][cp_attachmentDeleteIds]`, JSON.stringify(contactPerson.cp_attachmentDeleteIds))
          formData.append(`contactPerson[${index}][cp_profile_pictureDeleteIds]`, JSON.stringify(contactPerson.cp_profile_pictureDeleteIds))
        })        

        //append attachment for update
        const attachments: { id: string; attachment_file: any }[] = [];
        if (this.fileList.length > 0) {
          this.fileList.forEach((file: any, index: number) => {
            attachments.push({
              id: file.hasOwnProperty('response') ? file.uid : '', 
              attachment_file: file
            });
          });
        }

        // Append the attachments array to formData
        attachments.forEach((attachment, index) => {
          formData.append(`attachments[${index}][id]`, attachment.id);
          if (attachment.attachment_file) {
            formData.append(`attachments[${index}][attachment_file]`, attachment.attachment_file);
          }
        });

        //append profile picture person
        if(this.fileImageList.length > 0){
          this.fileImageList.forEach((file: any) => {
            formData.append('profile_picture[]', file);
          })
        }

        this.apiSvc.updateSupplier(formData).subscribe({
          next:() => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Update Supplier',
              nzOkText: 'Ok',
              nzCentered: true
            });

            this.apiSvc.triggerRefreshSuppliers();
          },
          error: (error) => {

            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Update Supplier',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            });

          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }
    }else {
      this.spinnerSvc.hide();

      this.modalSvc.error({
        nzTitle: 'Unable to Update Supplier',
        nzContent: 'Need to fill all the input',
        nzOkText: 'Ok',
        nzCentered: true
      })
    }
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

  beforeUploadProfile = (file: NzUploadFile): boolean => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      
      this.nzMsgSvc.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt5M = file.size! / 1024 / 1024 < 1;
    if (!isLt5M) {
      this.nzMsgSvc.error('Image must be smaller than 1MB!');
      return false;
    }

    if(this.modal_type === 'update'){
      const contactPersonForm = this.contactPerson.at(0);

      contactPersonForm.get('cp_profile_picture')?.setValue(file);
    }


    this.getBase64(file, (img: string) => {
      file.url = img; // Set the base64 string as the file's URL for preview
      this.fileImageList = [file]; // Replace the file list with the new file
    });
  
    return false; // Prevent automatic upload
  };

  beforeUploadCp(index: number) {
    return (file: NzUploadFile): boolean => {
      
      const isLt5M = file.size! / 1024 / 1024 < 1;
      if (!isLt5M) {
        this.nzMsgSvc.error('Image must be smaller than 1MB!');
        return false;
      }

      const contactPersonForm = this.contactPerson.at(index);
  
      const fileList = contactPersonForm.get('cp_attachments')?.value || [];
      contactPersonForm.get('cp_attachments')?.setValue([...fileList, file]);
  
      return false;
    };
  }

  beforeUploadCpProfile(index: number) {
    return (file: NzUploadFile): boolean => {

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        
        this.nzMsgSvc.error('You can only upload JPG/PNG file!');
        return false;
      }
      const isLt5M = file.size! / 1024 / 1024 < 1;
      if (!isLt5M) {
        this.nzMsgSvc.error('Image must be smaller than 1MB!');
        return false;
      }

      const contactPersonForm = this.contactPerson.at(index);

      const reader = new FileReader();
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        file.url = reader.result as string;
        contactPersonForm.get('cp_profile_picture')?.setValue(file);
      };
  
      return false;
    };
  }

  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  getValidProfilePicture(file: NzUploadFile | null): NzUploadFile[] {
    if (file && file.url) {
      return [file];
    }
    return [];
  }

  handleRemoveProfilePicture(index: number) {
    return (file: NzUploadFile): boolean => {
      const contactPersonForm = this.contactPerson.at(index);

      // For updating deleted attachment
      contactPersonForm.get('cp_profile_pictureDeleteIds')?.setValue([file.uid]);

      contactPersonForm.get('cp_profile_picture')?.setValue([]);
    
      return true;
    }

  }

  getBase64(file: NzUploadFile, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file as any); // Convert file to base64
    reader.onload = () => callback(reader.result as string);
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

  handleRemoveAttachmentCp(index: number) {
    return (file: NzUploadFile): boolean => {
      const contactPersonForm = this.contactPerson.at(index);

      // Get the current file list
      const fileList = contactPersonForm.get('cp_attachments')?.value || [];

      // For updating deleted attachment
      const matchingFile = fileList
        .filter((item: NzUploadFile) => item.uid === file.uid)
        .map((item: any) => item.uid);

      // Get or initialize 'cp_attachmentDeleteIds'
      const currentDeleteIds = contactPersonForm.get('cp_attachmentDeleteIds')?.value || [];
      const updatedDeleteIds = [...currentDeleteIds, ...matchingFile];
      contactPersonForm.get('cp_attachmentDeleteIds')?.setValue(updatedDeleteIds);

      // Filter out the file to be removed
      const updatedFileList = fileList.filter((item: NzUploadFile) => item.uid !== file.uid);
      
      // Update the form control value
      contactPersonForm.get('cp_attachments')?.setValue(updatedFileList);
  
      return true; // Return true to allow removal
    }

  }

  removeProfilePersonHandler = (file: NzUploadFile): boolean => {
    const contactPersonForm = this.contactPerson.at(0);
    contactPersonForm.get('cp_profile_pictureDeleteIds')?.setValue([file.uid]);
    return true; // Stop the auto upload
  };
}
