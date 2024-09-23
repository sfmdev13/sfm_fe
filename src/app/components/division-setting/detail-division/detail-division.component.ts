import { Component, Input, OnInit } from '@angular/core';
import { IDataDivision } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-division',
  templateUrl: './detail-division.component.html',
  styleUrls: ['./detail-division.component.scss']
})
export class DetailDivisionComponent implements OnInit {

  @Input() data: IDataDivision =  {} as IDataDivision

  constructor() { }

  ngOnInit(): void {
  }

}
