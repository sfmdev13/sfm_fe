import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-roles',
  templateUrl: './table-roles.component.html',
  styleUrls: ['./table-roles.component.scss']
})
export class TableRolesComponent implements OnInit {

  @Input() listOfDataRoles: any[] = []
  
  @Output() showUpdateModal = new EventEmitter<void>();
  @Output() showDetailModal = new EventEmitter<void>();
  @Output() showDeleteModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  updateHandler(){
    this.showUpdateModal.emit();
  }

  detailHandler(){
    this.showDetailModal.emit();
  }

  deleteHandler(){
    this.showDeleteModal.emit();
  }
}
