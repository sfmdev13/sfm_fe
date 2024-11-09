import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
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
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
  }
}
