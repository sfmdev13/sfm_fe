import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-employee-modal',
  templateUrl: './delete-employee-modal.component.html',
  styleUrls: ['./delete-employee-modal.component.scss']
})
export class DeleteEmployeeModalComponent implements OnInit {

  @Input() id: string  = ''

  constructor(private modal: NzModalRef, private apiSvc: ApiService) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  deleteEmp(){
    this.apiSvc.deleteEmployee(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshEmployee();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.modal.destroy();
      }
    })
  }
}
