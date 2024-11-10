import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-categories-modal',
  templateUrl: './edit-categories-modal.component.html',
  styleUrls: ['./edit-categories-modal.component.scss']
})
export class EditCategoriesModalComponent implements OnInit {

  @Input() type: string = ''
  @Input() form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    @Optional() @Inject(NZ_MODAL_DATA) public nzData: any
  ) { }

  ngOnInit(): void {
    if(this.nzData){
      this.type = this.nzData.type
      this.form = this.nzData.form
    }
  }
}
