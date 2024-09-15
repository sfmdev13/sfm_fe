import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-form-modal',
  templateUrl: './error-form-modal.component.html',
  styleUrls: ['./error-form-modal.component.scss']
})
export class ErrorFormModalComponent implements OnInit {

  @Input() errorText: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
