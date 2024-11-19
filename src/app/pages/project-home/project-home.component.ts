import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrl: './project-home.component.scss'
})
export class ProjectHomeComponent implements OnInit {

  projectCards = [
    {
      title: 'Project List',
      description: 'Add or Edit Project',
      cover: '/assets/images/project.png',
      link: '/projects/project-list'
    },
    {
      title: 'Quotation',
      description: 'Add or Edit Project',
      cover: '/assets/images/quotation.png',
      link: '/projects/quotation'
    }
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
