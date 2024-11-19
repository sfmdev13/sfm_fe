import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

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
    NzMessageModule
  ],
  templateUrl: './add-quotation.component.html',
  styleUrl: './add-quotation.component.scss'
})
export class AddQuotationComponent implements OnInit {

  modal_type: string = 'add'

  quotationForm = this.fb.group({
    id: [null],
    project_type: ['manual', [Validators.required]],
    project_file: [''],
    project_id: ['', [Validators.required]],
    description: [''],
    location: [''],
    consultant: [''],
    consultant_location: [''],
    revision: [{value: 'R0', disabled: true}],
    date: [''],
    engineer_pic: [['']],
    engineer_pic_internal: [''],
    engineer_phone_number: [''],
    items: this.fb.array([])
  })

  pic$!: Observable<any>;

  listOfPic: any[] = [];
  filteredListOfPic: any[] = [];

  fileList: NzUploadFile[] = [];
  attachmentDeletedIds: string[] = [];

  uploadedData: any[] = [];
  headers: string[] = [];
  
  constructor(
    private drawerRef: NzDrawerRef,
    private fb: UntypedFormBuilder,
    private nzMsgSvc: NzMessageService,
    private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.quotationForm.get('pic')?.valueChanges.subscribe((value) => {
      this.filteredListOfPic = this.listOfPic.filter(pic => value.includes(pic.pic_id));

      if(!value.includes(this.quotationForm.get('is_pic_internal')?.value)){
        this.quotationForm.patchValue({is_pic_internal: ''})
      }
    })
  }

  get items(): UntypedFormArray {
    return this.quotationForm.get('items') as UntypedFormArray;
  }


  mappingToFormItem(file: any[]): void{

    file.forEach((value) => {
      const updatedItemAdd = this.fb.group({
        part_number: [value.partNo || '', [Validators.required]], // Match JSON keys
        description: [value.description || '', [Validators.required]],
        alias: [value.partNo],
        dn1: [value.dn1 || ''],
        dn2: [value.dn2 || ''],
        qty: [value.qty || ''],
        unit: [value.unit || '']
      })

      this.items.push(updatedItemAdd);
      this.itemValueChangeSubscription(updatedItemAdd);
    })

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
          unit: row[5]
        };
      });
      
      this.mappingToFormItem(this.uploadedData)
    };

    reader.readAsArrayBuffer(file);



  }

  itemValueChangeSubscription(control: UntypedFormGroup){

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


  removeDocument = (file: NzUploadFile): boolean => {

    //for update deleted attachment
    const matchingFile = this.fileList.find(item => item.uid === file.uid);
    if (matchingFile) {
      this.attachmentDeletedIds.push(matchingFile.uid);
    }

    this.fileList = this.fileList.filter(item => item.uid !== file.uid);
    return true; // Return true to confirm the file removal
  };

  addItems(){
    const newItems = this.fb.group({
      part_number: ['', [Validators.required]],
      description: ['', [Validators.required]],
      alias: [''],
      dn1: [''],
      dn2: [''],
      qty: [''],
      unit: ['']
    })

    this.items.push(newItems);

    this.itemValueChangeSubscription(newItems);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }
  
  closeDrawer(){
    this.drawerRef.close();
  }

  submit(){

  }
}
