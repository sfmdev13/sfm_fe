import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IDataRoles } from 'src/app/interfaces';

@Component({
  selector: 'app-table-roles',
  templateUrl: './table-roles.component.html',
  styleUrls: ['./table-roles.component.scss']
})
export class TableRolesComponent implements OnInit {

  @Input() listOfDataRoles: IDataRoles[] = []

  @Input() totalAll: number = 0;
  @Input() pageSize: number = 0;
  @Input() currentPage: number = 0;
  
  @Output() showUpdateModal: EventEmitter<IDataRoles> = new EventEmitter<IDataRoles>();
  @Output() showDetailModal: EventEmitter<IDataRoles> = new EventEmitter<IDataRoles>();
  @Output() showDeleteModal: EventEmitter<IDataRoles> = new EventEmitter<IDataRoles>();

  @Output() onPageIndexChange: EventEmitter<number> = new EventEmitter<number>();

  constructor( public authSvc: AuthService ) { }

  ngOnInit(): void {
  }

  updateHandler(data: IDataRoles){
    this.showUpdateModal.emit(data);
  }

  detailHandler(data: IDataRoles){
    this.showDetailModal.emit(data);
  }

  deleteHandler(data: IDataRoles){
    this.showDeleteModal.emit(data);
  }

  pageIndexChange(page: number){
    this.onPageIndexChange.emit(page)
  }
}
