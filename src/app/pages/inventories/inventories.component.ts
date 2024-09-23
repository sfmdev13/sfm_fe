import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {

  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
  }

}
