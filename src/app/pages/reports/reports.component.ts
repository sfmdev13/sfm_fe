import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  projectCards = [
    {
      title: 'Quotation Comparison',
      description: 'Compare quotation for each revision',
      cover: '/assets/images/quotation-comparison.png',
      link: ''
    },
  ];
  
  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
    
  }

  cardCoverTemplate(cover: string) {
    return cover;
  }

}
