import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {

  @Input() form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
  }
}