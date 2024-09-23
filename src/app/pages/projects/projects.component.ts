import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
  }

}
