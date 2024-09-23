import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {

  @Input() form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }
}