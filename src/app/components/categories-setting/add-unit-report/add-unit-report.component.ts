import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDataUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-add-unit-report',
  templateUrl: './add-unit-report.component.html',
  styleUrls: ['./add-unit-report.component.scss']
})
export class AddUnitReportComponent implements OnInit {

  @Input() type: string = ''
  @Input() form!: FormGroup;
  @Input() unitList: IDataUnit[] = []

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }
}
