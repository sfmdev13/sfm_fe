import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
  }

}
