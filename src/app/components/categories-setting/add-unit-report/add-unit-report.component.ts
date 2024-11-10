import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { IDataUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-add-unit-report',
  templateUrl: './add-unit-report.component.html',
  styleUrls: ['./add-unit-report.component.scss']
})
export class AddUnitReportComponent implements OnInit {

  @Input() type: string = ''
  @Input() form!: UntypedFormGroup;
  @Input() unitList: IDataUnit[] = []

  constructor(
    private fb: UntypedFormBuilder,
    @Optional() @Inject(NZ_MODAL_DATA) public nzData: any
  ) { }

  ngOnInit(): void {
    if(this.nzData){
      this.form = this.nzData.form,
      this.type = this.nzData.type,
      this.unitList = this.nzData.unitList
    }
  }
}
