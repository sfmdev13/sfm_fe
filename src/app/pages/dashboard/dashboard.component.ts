import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
  }

}
