import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataCustomer, IRootCatContact } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';
import { EditCategoriesModalComponent } from '../categories-setting/edit-categories-modal/edit-categories-modal.component';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss'],
})
export class AddCustomerModalComponent implements OnInit {
  nzData = inject(NZ_MODAL_DATA);

  modal_type: string = this.nzData.modal_type;
  customerDetail: IDataCustomer = this.nzData.customerDetail;
  listOfPic: any[] = this.nzData.listOfPic;

  provinces$!: Observable<any>;

  pic_id = localStorage.getItem('pic_id')!;

  customerForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    nib: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    wa_phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    province: ['', [Validators.required]],
    country: ['Indonesia'],
    postal_code: ['', [Validators.required]],
    status: [1, [Validators.required]],
    customer_firm_id: ['', [Validators.required]],
    loyal_customer_program_id: ['', [Validators.required]],
    customer_sector_id: ['', [Validators.required]],
    type: ['company', [Validators.required]],
    website: ['', [Validators.required]],
    maps_url: ['', [Validators.required]],
    contactPerson: this.fb.array([]),
    pic: [[this.pic_id], [Validators.required]],
    is_pic_internal: ['', [Validators.required]],
    address_line_2: [''],
    address_line_3: [''],
  });

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company';

  catContact$!: Observable<IRootCatContact>;

  loyalCustCat$!: Observable<IRootCatContact>;
  customerFirm$!: Observable<IRootCatContact>;
  customerSector$!: Observable<IRootCatContact>;

  filteredListOfPic: any[] = [];

  cpListOfPic: any[] = [];

  filteredCpListOfPic: any[] = [];

  picComplete: any;
  contactPersonComplete: any;

  city: any[] = [];

  provinceList: any[] = [];

  fileList: NzUploadFile[] = [];

  fileImageList: NzUploadFile[] = [];

  deletedCpIds: string[] = [];

  isSpinning: boolean = false;

  attachmentDeletedIds: string[] = [];

  isLoadingProvince: boolean = true;
  isLoadingCatContact: boolean = true;
  isLoadingLoyal: boolean = true;
  isLoadingCustSector: boolean = true;
  isLoadingCustFirm: boolean = true;

  isVisibleAdd = false;

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  titleCat: string = '';

  nestedModalRef?: NzModalRef;

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private nzMsgSvc: NzMessageService
  ) {}

  ngOnInit(): void {
    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.customerFirm$ = this.apiSvc.getCustomerFirm().pipe(
        tap((res) => {
          this.isLoadingCustFirm = false;
        })
      );

      this.catContact$ = this.apiSvc.getCategoryCP().pipe(
        tap((res) => {
          this.isLoadingCatContact = false;
        })
      );

      this.loyalCustCat$ = this.apiSvc.getLoyalCustomer().pipe(
        tap((res) => {
          this.isLoadingLoyal = false;
        })
      );

      this.customerSector$ = this.apiSvc.getCustomerSector().pipe(
        tap((res) => {
          this.isLoadingCustSector = false;
        })
      );

      this.customerFirm$ = this.apiSvc.getCustomerFirm().pipe(
        tap((res) => {
          this.isLoadingCustFirm = false;
        })
      );
    });

    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap((p) => {
        this.provinceList = p;

        this.isLoadingProvince = false;
      })
    );

    this.catContact$ = this.apiSvc.getCategoryCP().pipe(
      tap((res) => {
        this.isLoadingCatContact = false;
      })
    );

    this.loyalCustCat$ = this.apiSvc.getLoyalCustomer().pipe(
      tap((res) => {
        this.isLoadingLoyal = false;
      })
    );
    this.customerSector$ = this.apiSvc.getCustomerSector().pipe(
      tap((res) => {
        this.isLoadingCustSector = false;
      })
    );
    this.customerFirm$ = this.apiSvc.getCustomerFirm().pipe(
      tap((res) => {
        this.isLoadingCustFirm = false;
      })
    );

    this.filteredListOfPic = this.listOfPic.filter(
      (p) => p.pic_id === this.pic_id
    );

    this.cpListOfPic = this.filteredListOfPic;
    this.filteredCpListOfPic = this.filteredListOfPic;

    this.customerForm
      .get('status')
      ?.valueChanges.subscribe((value: boolean) => {
        this.customerForm
          .get('status')
          ?.setValue(value ? 1 : 0, { emitEvent: false });
      });

    this.customerForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter((pic) =>
        value.includes(pic.pic_id)
      );
      this.cpListOfPic = this.filteredListOfPic;

      if (!value.includes(this.customerForm.get('is_pic_internal')?.value)) {
        this.customerForm.patchValue({ is_pic_internal: '' });
      }

      this.contactPerson.controls.forEach((control: AbstractControl) => {
        if (control instanceof UntypedFormGroup) {
          const cpPic = control.get('cp_pic');
          const cpPicInternal = control.get('cp_is_pic_internal');

          const filteredCpPic = cpPic?.value.filter((pic: any) =>
            value.includes(pic)
          );
          cpPic?.patchValue(filteredCpPic);

          if (!value.includes(cpPicInternal?.value)) {
            cpPicInternal?.patchValue('');
          }
        }
      });
    });

    this.customerForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      });
    });

    this.addContactPerson();

    if (this.modal_type === 'update') {
      this.isLoadingCatContact = false;

      this.optionCustSelected = this.customerDetail.type;

      const newUpdateFileList: NzUploadFile[] =
        this.customerDetail.attachments.map((attachment) => ({
          uid: attachment.id,
          name: attachment.file_name,
          status: 'done',
          url: attachment.file_url,
          response: {
            id: attachment.id,
            attachment_path: attachment.attachment_path,
          },
        }));

      this.fileList = newUpdateFileList;

      if (this.optionCustSelected === 'person') {
        //mapping image for person
        const updateContactPerson = this.customerDetail.contactPerson;
        const updateProfilePictue = updateContactPerson.map(
          (cp) => cp.cp_profile_picture
        )[0];

        const newUpdateFileListImage: NzUploadFile[] = updateProfilePictue.map(
          (attachment) => ({
            uid: attachment.id,
            name: attachment.file_name,
            status: 'done',
            url: attachment.file_url,
            response: {
              id: attachment.id,
              attachment_path: attachment.attachment_path,
            },
          })
        );

        this.fileImageList = newUpdateFileListImage;
      }

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
        postal_code: this.customerDetail.postal_code,
      });

      //clear existing contact person
      while (this.contactPerson.length !== 0) {
        this.contactPerson.removeAt(0);
      }

      this.customerDetail.contactPerson.forEach((contact) => {
        //change cp attachments type
        const updatedCpAttachments: NzUploadFile[] = contact.cp_attachments.map(
          (attachment) => ({
            uid: attachment.id,
            name: attachment.file_name,
            status: 'done',
            url: attachment.file_url,
            response: {
              id: attachment.id,
              attachment_path: attachment.attachment_path,
            },
            isImageUrl: true,
          })
        );

        const updatedCpProfileAttachments: NzUploadFile[] =
          contact.cp_profile_picture.map((attachment) => ({
            uid: attachment.id,
            name: attachment.file_name,
            status: 'done',
            url: attachment.file_url,
            response: {
              id: attachment.id,
              attachment_path: attachment.attachment_path,
            },
            isImageUrl: true,
          }));

        const updateCp = this.fb.group({
          cp_name: [contact.name, Validators.required],
          cp_email: [contact.email, Validators.required],
          cp_phone: [contact.phone, Validators.required],
          cp_category_id: [contact.customer_category.id, Validators.required],
          cp_address: [contact.address, Validators.required],
          is_pic_company: [
            contact.is_pic_company === 1 ? true : false,
            Validators.required,
          ],
          cp_id: [contact.id],
          cp_wa_phone: [contact.wa_phone, Validators.required],
          cp_province: [parseInt(contact.province), Validators.required],
          cp_city: [parseInt(contact.city), Validators.required],
          cp_postal_code: [contact.postal_code, Validators.required],
          cp_country: [contact.country, Validators.required],
          cp_loyal_customer_program_id: [
            contact.loyal_customer_program_id,
            Validators.required,
          ],
          cp_pic: [contact.pic.map((item) => item.pic_id), Validators.required],
          cp_is_pic_head: [
            contact.pic.filter((item) => item.is_pic_head === 1)[0].pic_id,
            Validators.required,
          ],
          filteredCpListOfPic: [this.cpListOfPic],
          filteredCity: [],
          cp_attachments: [updatedCpAttachments],
          cp_profile_picture: [updatedCpProfileAttachments][0],
          cp_attachmentDeleteIds: [[]],
          cp_profile_pictureDeleteIds: [[]],
        });

        this.cpValueChangeSubscriptions(updateCp);

        const filteredList = this.cpListOfPic.filter((pic) => {
          const selectedPicId = updateCp.get('cp_pic')?.value;
          return selectedPicId.includes(pic.pic_id);
        });

        updateCp.get('filteredCpListOfPic')?.setValue(filteredList);

        this.apiSvc
          .getRegenciesByProvince(parseInt(contact.province))
          .subscribe((res) => {
            updateCp.get('filteredCity')?.setValue(res, { emitEvent: false });
          });

        this.contactPerson.push(updateCp);
      });

      //extract pic id
      const picIds = this.customerDetail.pic.map((item) => item.pic_id);

      //find pic internal id
      const isPicInternalId = this.customerDetail.pic.filter(
        (item) => item.is_pic_internal === 1
      );

      this.customerForm.patchValue({
        pic: picIds,
        is_pic_internal: isPicInternalId[0].pic_id,
      });
    }
  }

  addressChangeHandler(form_name: string) {
    const commentControl = this.customerForm.get(form_name);
    if (commentControl?.value) {
      if (commentControl.value.length >= 80) {
        commentControl.setValue(commentControl.value.substring(0, 80), {
          emitEvent: false,
        });
      }
    }
  }

  showModalCategoryAdd(titleCat: string): void {
    this.titleCat = titleCat;
    this.isVisibleAdd = true;

    this.nestedModalRef = this.modalSvc.create({
      nzTitle: ' Add Category ' + titleCat,
      nzContent: EditCategoriesModalComponent,
      nzData: {
        form: this.categoryForm,
      },
      nzWidth: '500px',
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => this.handleCancelCategoryAdd(),
          type: 'default',
        },
        {
          label: 'Confirm',
          onClick: () => this.handleCategorySubmitAdd(),
          type: 'primary',
        },
      ],
    });
  }

  handleCategorySubmitAdd(): void {
    this.spinnerSvc.show();

    if (this.categoryForm.valid) {
      if (this.titleCat.toLowerCase() === 'firm') {
        this.apiSvc
          .createCustomerFirm(
            this.categoryForm.value.name,
            this.categoryForm.value.description
          )
          .subscribe({
            next: () => {
              this.spinnerSvc.hide();
              this.modalSvc.success({
                nzTitle: 'Success',
                nzContent: 'Successfully Add Category',
                nzOkText: 'Ok',
                nzCentered: true,
              });
              this.apiSvc.triggerRefreshCategories();
              this.isVisibleAdd = false;
              this.nestedModalRef?.close();
            },
            error: (error) => {
              this.spinnerSvc.hide();
              this.modalSvc.error({
                nzTitle: 'Unable to Add Category',
                nzContent: error.error.meta.message,
                nzOkText: 'Ok',
                nzCentered: true,
              });
            },
            complete: () => {
              this.categoryForm.reset();
            },
          });
      }

      if (this.titleCat.toLowerCase() === 'loyal') {
        this.apiSvc
          .createLoyalCustomer(
            this.categoryForm.value.name,
            this.categoryForm.value.description
          )
          .subscribe({
            next: () => {
              this.spinnerSvc.hide();
              this.modalSvc.success({
                nzTitle: 'Success',
                nzContent: 'Successfully Add Category',
                nzOkText: 'Ok',
                nzCentered: true,
              });
              this.apiSvc.triggerRefreshCategories();
              this.isVisibleAdd = false;
              this.nestedModalRef?.close();
            },
            error: (error) => {
              this.spinnerSvc.hide();
              this.modalSvc.error({
                nzTitle: 'Unable to Add Category',
                nzContent: error.error.meta.message,
                nzOkText: 'Ok',
                nzCentered: true,
              });
            },
            complete: () => {
              this.categoryForm.reset();
            },
          });
      }

      if (this.titleCat.toLowerCase() === 'sector') {
        this.apiSvc.createCustomerSector(this.categoryForm.value).subscribe({
          next: () => {
            this.spinnerSvc.hide();
            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Category',
              nzOkText: 'Ok',
              nzCentered: true,
            });
            this.apiSvc.triggerRefreshCategories();
            this.isVisibleAdd = false;
            this.nestedModalRef?.close();
          },
          error: (error) => {
            this.spinnerSvc.hide();
            this.modalSvc.error({
              nzTitle: 'Unable to Add Category',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true,
            });
          },
          complete: () => {
            this.categoryForm.reset();
          },
        });
      }

      if (this.titleCat.toLowerCase() === 'contact type') {
        this.apiSvc
          .createContactType(
            this.categoryForm.value.name,
            this.categoryForm.value.description
          )
          .subscribe({
            next: () => {
              this.spinnerSvc.hide();
              this.modalSvc.success({
                nzTitle: 'Success',
                nzContent: 'Successfully Add Category',
                nzOkText: 'Ok',
                nzCentered: true,
              });
              this.apiSvc.triggerRefreshCategories();
              this.isVisibleAdd = false;
              this.nestedModalRef?.close();
            },
            error: (error) => {
              this.spinnerSvc.hide();
              this.modalSvc.error({
                nzTitle: 'Unable to Add Category',
                nzContent: error.error.meta.message,
                nzOkText: 'Ok',
                nzCentered: true,
              });
            },
            complete: () => {
              this.categoryForm.reset();
            },
          });
      }
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Add',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true,
      });
    }
  }

  handleCancelCategoryAdd(): void {
    this.isVisibleAdd = false;
    this.nestedModalRef?.close();
    this.categoryForm.reset();
  }

  get contactPerson(): UntypedFormArray {
    return this.customerForm.get('contactPerson') as UntypedFormArray;
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
      cp_id: [''],
      cp_attachments: [[], [Validators.required]],
      cp_profile_picture: [[], [Validators.required]],
      cp_attachmentDeleteIds: [[]],
      cp_profile_pictureDeleteIds: [[]],
    });

    this.cpValueChangeSubscriptions(newCp);

    const filteredList = this.cpListOfPic.filter((pic) => {
      const selectedPicId = newCp.get('cp_pic')?.value;
      return selectedPicId.includes(pic.pic_id);
    });

    newCp.get('filteredCpListOfPic')?.setValue(filteredList);

    this.contactPerson.push(newCp);
  }

  cpValueChangeSubscriptions(control: UntypedFormGroup): void {
    control.get('cp_pic')?.valueChanges.subscribe((value) => {
      this.updateFilteredCpListOfPic(control, value);
    });

    control.get('cp_province')?.valueChanges.subscribe((value) => {
      this.updateFilteredCity(control, value);
    });
  }

  updateFilteredCpListOfPic(
    formGroup: UntypedFormGroup,
    selectedPicId: any
  ): void {
    // Filter your cpListOfPic based on the selectedPicId
    const filteredList = this.cpListOfPic.filter((pic) => {
      // Adjust filtering logic as needed
      return selectedPicId.includes(pic.pic_id);
    });

    if (!selectedPicId.includes(formGroup.get('cp_is_pic_head')?.value)) {
      formGroup.patchValue({ cp_is_pic_head: '' });
    }

    // Update the filtered list specific to this form group
    formGroup
      .get('filteredCpListOfPic')
      ?.setValue(filteredList, { emitEvent: false });
  }

  updateFilteredCity(formGroup: UntypedFormGroup, selectedId: any): void {
    this.apiSvc.getRegenciesByProvince(selectedId).subscribe((res) => {
      formGroup.get('filteredCity')?.setValue(res, { emitEvent: false });
    });
  }

  removeContactPerson(index: number): void {
    if (index === 0) {
      return;
    }

    this.deletedCpIds = [...this.contactPerson.at(index).get('cp_id')?.value];

    this.contactPerson.removeAt(index);
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm() {
    this.spinnerSvc.show();

    this.picComplete = this.customerForm
      .get('pic')!
      .value.map((pic_id: any) => ({
        pic_id: pic_id,
        is_pic_internal:
          pic_id === this.customerForm.get('is_pic_internal')!.value ? 1 : 0,
      }));

    if (this.modal_type === 'add') {
      this.contactPersonComplete = this.contactPerson.value.map((pic: any) => ({
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
          is_pic_head: p === pic.cp_is_pic_head ? 1 : 0,
        })),
        cp_loyal_customer_program_id: pic.cp_loyal_customer_program_id,
        cp_attachments: pic.cp_attachments,
        cp_profile_picture: pic.cp_profile_picture,
      }));

      if (this.customerForm.valid) {
        const body = {
          name: this.customerForm.get('name')?.value,
          email: this.customerForm.get('email')?.value,
          nib: this.customerForm.get('nib')?.value,
          phone: this.customerForm.get('phone')?.value,
          wa_phone: this.customerForm.get('wa_phone')?.value,
          address: this.customerForm.get('address')?.value,
          status: this.customerForm.get('status')?.value,
          type: this.customerForm.get('type')?.value,
          website: this.customerForm.get('website')?.value,
          maps_url: this.customerForm.get('maps_url')?.value,
          pic: this.picComplete,
          customer_firm_id: this.customerForm.get('customer_firm_id')?.value,
          loyal_customer_program_id: this.customerForm.get(
            'loyal_customer_program_id'
          )?.value,
          customer_sector_id:
            this.customerForm.get('customer_sector_id')?.value,
          postal_code: this.customerForm.get('postal_code')?.value,
          province: this.customerForm.get('province')?.value.toString(),
          city: this.customerForm.get('city')?.value.toString(),
          country: this.customerForm.get('country')?.value,
          address_line_2: this.customerForm.get('address_line_2')?.value,
          address_line_3: this.customerForm.get('address_line_3')?.value,
        };

        const formData = new FormData();

        //append basic information
        Object.keys(body).forEach((key) => {
          if (typeof (body as any)[key] === 'object') {
            formData.append(key, JSON.stringify((body as any)[key]));
          } else {
            formData.append(key, (body as any)[key]);
          }
        });

        //append cp
        this.contactPersonComplete.forEach(
          (contactPerson: any, index: number) => {
            Object.keys(contactPerson).forEach((key) => {
              if (
                key !== 'cp_attachments' &&
                key !== 'cp_profile_picture' &&
                key !== 'cp_pic'
              ) {
                formData.append(
                  `contactPerson[${index}][${key}]`,
                  contactPerson[key]
                );
              }
            });

            //append cp profile picture
            if (contactPerson.cp_profile_picture) {
              formData.append(
                `contactPerson[${index}][cp_profile_picture][0]`,
                contactPerson.cp_profile_picture
              );
            }

            //append cp attachment
            if (
              contactPerson.cp_attachments &&
              contactPerson.cp_attachments.length > 0
            ) {
              contactPerson.cp_attachments.forEach(
                (file: any, fileIndex: number) => {
                  formData.append(
                    `contactPerson[${index}][cp_attachments][${fileIndex}]`,
                    file
                  );
                }
              );
            }

            //append cp pic
            formData.append(
              `contactPerson[${index}][cp_pic]`,
              JSON.stringify(contactPerson.cp_pic)
            );
          }
        );

        //append attachment
        if (this.fileList.length > 0) {
          this.fileList.forEach((file: any) => {
            formData.append('attachments[]', file);
          });
        }

        //append profile picture person
        if (this.fileImageList.length > 0) {
          this.fileImageList.forEach((file: any) => {
            formData.append('profile_picture[]', file);
          });
        }

        this.apiSvc.createCustomer(formData).subscribe({
          next: (response) => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Customer',
              nzOkText: 'Ok',
              nzCentered: true,
            });

            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Add Customer',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true,
            });

            this.apiSvc.triggerRefreshCustomers();
          },
          complete: () => {
            this.modal.destroy();
          },
        });
      } else {
        Object.values(this.customerForm.controls).forEach((control) => {
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
          nzCentered: true,
        });
      }
    }

    if (this.modal_type === 'update') {
      this.contactPersonComplete = this.contactPerson.value.map(
        (pic: any, i: number) => ({
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
          is_pic_company: pic.is_pic_company ? 1 : 0,
          cp_pic: this.customerDetail.contactPerson.map((item) => item.pic)[i],
          cp_pic_new: pic.cp_pic.map((p: any) => ({
            pic_id: p,
            is_pic_head: p === pic.cp_is_pic_head ? 1 : 0,
          })),
          cp_loyal_customer_program_id: pic.cp_loyal_customer_program_id,
          cp_attachments: pic.cp_attachments,
          cp_attachmentDeleteIds: pic.cp_attachmentDeleteIds,
          cp_profile_pictureDeleteIds: pic.cp_profile_pictureDeleteIds,
          cp_profile_picture: pic.cp_profile_picture,
        })
      );

      if (this.customerForm.valid) {
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
          loyal_customer_program_id: this.customerForm.get(
            'loyal_customer_program_id'
          )?.value,
          customer_sector_id:
            this.customerForm.get('customer_sector_id')?.value,
          postal_code: this.customerForm.get('postal_code')?.value,
          province: this.customerForm.get('province')?.value.toString(),
          city: this.customerForm.get('city')?.value.toString(),
          country: this.customerForm.get('country')?.value,
          deletedCpIds: this.deletedCpIds,
          attachmentDeleteIds: this.attachmentDeletedIds,
          address_line_2: this.customerForm.get('address_line_2')?.value,
          address_line_3: this.customerForm.get('address_line_3')?.value,
        };

        const formData = new FormData();

        //append basic information
        Object.keys(body).forEach((key) => {
          if (typeof (body as any)[key] === 'object') {
            formData.append(key, JSON.stringify((body as any)[key]));
          } else {
            formData.append(key, (body as any)[key]);
          }
        });

        const promises: any[] = [];

        //append cp
        this.contactPersonComplete.forEach(
          (contactPerson: any, index: number) => {
            Object.keys(contactPerson).forEach((key) => {
              if (
                ![
                  'cp_attachments',
                  'cp_profile_picture',
                  'cp_attachmentDeleteIds',
                  'cp_attachmentDeleteIds',
                ].includes(key)
              ) {
                formData.append(
                  `contactPerson[${index}][${key}]`,
                  contactPerson[key]
                );
              }
            });

            //append cp profile picture
            if (contactPerson.cp_profile_picture) {
              const profilePictures = {
                id: contactPerson.cp_profile_picture.hasOwnProperty('response')
                  ? contactPerson.cp_profile_picture.uid
                  : '',
                profile_picturefile: contactPerson.cp_profile_picture,
              };

              formData.append(
                `contactPerson[${index}][cp_profile_picture][0][id]`,
                profilePictures.id
              );
              formData.append(
                `contactPerson[${index}][cp_profile_picture][0][profile_picturefile]`,
                profilePictures.profile_picturefile
              );
            }

            //append cp attachment
            const cp_attachments: { id: string; attachment_file: any }[] = [];

            contactPerson.cp_attachments.forEach((file: any) => {
              cp_attachments.push({
                id: file.hasOwnProperty('response') ? file.uid : '',
                attachment_file: file,
              });
            });

            // Append the attachments array to formData
            cp_attachments.forEach((attachment, fileIndex) => {
              formData.append(
                `contactPerson[${index}][cp_attachments][${fileIndex}][id]`,
                attachment.id
              );
              formData.append(
                `contactPerson[${index}][cp_attachments][${fileIndex}][attachment_file]`,
                attachment.attachment_file
              );
            });

            //append cp pic
            formData.append(
              `contactPerson[${index}][cp_pic]`,
              JSON.stringify(contactPerson.cp_pic)
            );
            formData.append(
              `contactPerson[${index}][cp_pic_new]`,
              JSON.stringify(contactPerson.cp_pic_new)
            );
            formData.append(
              `contactPerson[${index}][cp_attachmentDeleteIds]`,
              JSON.stringify(contactPerson.cp_attachmentDeleteIds)
            );
            formData.append(
              `contactPerson[${index}][cp_profile_pictureDeleteIds]`,
              JSON.stringify(contactPerson.cp_profile_pictureDeleteIds)
            );
          }
        );

        //append attachment for update
        const attachments: { id: string; attachment_file: any }[] = [];
        if (this.fileList.length > 0) {
          this.fileList.forEach((file: any, index: number) => {
            attachments.push({
              id: file.hasOwnProperty('response') ? file.uid : '',
              attachment_file: file,
            });
          });
        }

        // Append profile picture
        if (this.fileImageList.length > 0) {
          this.fileImageList.forEach((file: any) => {
            formData.append('profile_picture[]', file);
          });
        }

        attachments.map((attachment, index) => {
          formData.append(`attachments[${index}][id]`, attachment.id);
          if (attachment.attachment_file) {
            formData.append(
              `attachments[${index}][attachment_file]`,
              attachment.attachment_file
            );
          }
        });

        this.apiSvc.updateCustomer(formData).subscribe({
          next: (response) => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully update customer',
              nzOkText: 'Ok',
              nzCentered: true,
            });

            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to update customer',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true,
            });
          },
          complete: () => {
            this.modal.destroy();
          },
        });
      } else {
        Object.values(this.customerForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });

        this.spinnerSvc.hide();

        this.modalSvc.error({
          nzTitle: 'Unable to Update Customer',
          nzContent: 'Need to fill all the input',
          nzOkText: 'Ok',
          nzCentered: true,
        });
      }
    }
  }

  optionCustChange($event: number) {
    const contactPersonArray = this.customerForm.get(
      'contactPerson'
    ) as UntypedFormArray;

    if ($event === 0) {
      this.optionCustSelected = 'company';
      this.customerForm.patchValue({
        type: 'company',
      });
      this.addContactPerson();
    }
    if ($event === 1 && this.modal_type === 'add') {
      this.optionCustSelected = 'person';
      this.customerForm.patchValue({
        type: 'person',
      });
      while (contactPersonArray.length !== 0) {
        contactPersonArray.removeAt(0);
      }
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
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      this.nzMsgSvc.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt5M = file.size! / 1024 / 1024 < 1;
    if (!isLt5M) {
      this.nzMsgSvc.error('Image must be smaller than 1MB!');
      return false;
    }

    if (this.modal_type === 'update') {
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
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg';
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
      contactPersonForm
        .get('cp_profile_pictureDeleteIds')
        ?.setValue([file.uid]);

      contactPersonForm.get('cp_profile_picture')?.setValue([]);

      return true;
    };
  }

  getBase64(file: NzUploadFile, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file as any); // Convert file to base64
    reader.onload = () => callback(reader.result as string);
  }

  removeDocument = (file: NzUploadFile): boolean => {
    //for update deleted attachment
    const matchingFile = this.fileList.find((item) => item.uid === file.uid);
    if (matchingFile) {
      this.attachmentDeletedIds.push(matchingFile.uid);
    }

    this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
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
      const currentDeleteIds =
        contactPersonForm.get('cp_attachmentDeleteIds')?.value || [];
      const updatedDeleteIds = [...currentDeleteIds, ...matchingFile];
      contactPersonForm
        .get('cp_attachmentDeleteIds')
        ?.setValue(updatedDeleteIds);

      // Filter out the file to be removed
      const updatedFileList = fileList.filter(
        (item: NzUploadFile) => item.uid !== file.uid
      );

      // Update the form control value
      contactPersonForm.get('cp_attachments')?.setValue(updatedFileList);

      return true; // Return true to allow removal
    };
  }

  removeProfilePersonHandler = (file: NzUploadFile): boolean => {
    if (this.modal_type === 'update') {
      const contactPersonForm = this.contactPerson.at(0);
      contactPersonForm
        .get('cp_profile_pictureDeleteIds')
        ?.setValue([file.uid]);
    }

    this.fileImageList = [];
    return true; // Stop the auto upload
  };
}
