import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-categories-modal',
  templateUrl: './edit-categories-modal.component.html',
  styleUrls: ['./edit-categories-modal.component.scss']
})
export class EditCategoriesModalComponent implements OnInit {

  @Input() type: string = ''
  @Input() form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }
}
