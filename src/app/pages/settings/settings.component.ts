import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
  }

}
