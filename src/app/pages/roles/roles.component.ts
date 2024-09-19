import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { AddRolesModalComponent } from 'src/app/components/add-roles-modal/add-roles-modal.component';
import { DeleteRolesModalComponent } from 'src/app/components/delete-roles-modal/delete-roles-modal.component';
import { DetailRolesModalComponent } from 'src/app/components/detail-roles-modal/detail-roles-modal.component';
import { IDataRoles, IRootAllRoles } from 'src/app/interfaces';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  roles$!: Observable<IRootAllRoles>;

  totalRole: number = 0;
  currentPage: number = 0;
  totalAll: number = 0;
  pageSize: number = 5;

  searchRole: string = '';
  private searchRoleSubject = new Subject<string>();

  constructor(
    private modalService: NzModalService,
    private apiSvc: ApiService,
    public authSvc: AuthService
  ) { }

  ngOnInit(): void {

    this.getRole()

    
    this.searchRoleSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.roles$ = this.apiSvc.searchRole(search ,this.currentPage, this.pageSize).pipe(
        tap(res => {
          this.totalRole = res.data.length;
          this.currentPage = res.pagination.current_page;
          this.totalAll = res.pagination.total;
        })
      )
    })

    this.apiSvc.refreshGetRoles$.subscribe(() => {
      this.getRole()
    })
  }

  searchHandler(search: string): void{
    this.searchRoleSubject.next(search);
  }

  getRole(){
    this.roles$ = this.apiSvc.getAllRole().pipe(
      tap(res => {
        this.totalRole = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total;
      })
    );
  }

  showAddModal():void{
    this.modalService.create({
      nzTitle: 'Add Roles',
      nzContent: AddRolesModalComponent,
      nzComponentParams: {
        modal_type: 'add'
      },
      nzCentered: true,
      nzWidth: '600px'
    })
  }

  showUpdateModal(data: IDataRoles): void{
    this.modalService.create({
      nzTitle: 'Edit Roles',
      nzContent: AddRolesModalComponent,
      nzComponentParams: {
        modal_type: 'edit',
        roleDetail: data
      },
      nzCentered: true,
      nzWidth: '600px'
    })
  }

  showDetailModal(data: IDataRoles): void{
    this.modalService.create({
      nzTitle: 'Detail Roles',
      nzContent: DetailRolesModalComponent,
      nzCentered: true,
      nzComponentParams: {
        roleDetail: data
      }
    })
  }

  showDeleteModal(data: IDataRoles): void{
    this.modalService.create({
      nzTitle: 'Delete Role',
      nzContent: DeleteRolesModalComponent,
      nzCentered: true,
      nzComponentParams: {
        id: data.id
      }
    })
  }

  onPageIndexChange(page: number): void{
    this.currentPage = page;
    
    this.getRole()
  }

}
