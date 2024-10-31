import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { FilterAllInventoriesComponent } from 'src/app/components/filter-all-inventories/filter-all-inventories.component';
import { IRootAllInventories } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-all-inventories',
  templateUrl: './all-inventories.component.html',
  styleUrls: ['./all-inventories.component.scss']
})
export class AllInventoriesComponent implements OnInit {

  allInventories$!: Observable<IRootAllInventories>
  total: number = 0;
  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  filtered: boolean = false;
  
  filterParams: any;

  constructor(
    private apiSvc: ApiService,
    private modalSvc: NzModalService
  ) { }

  ngOnInit(): void {
    this.getAllInventories();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.allInventories$ = this.apiSvc.searchAllInventories(search, this.currentPage, this.pageSize).pipe(
        tap(res => {
          this.total = res.data.length;
          this.currentPage = res.pagination.current_page;
          this.totalAll = res.pagination.total;
        })
      );
    });
  }

  showFilter(): void{
    const filterModal = this.modalSvc.create({
      nzTitle: 'Filter Purchase Order',
      nzContent: FilterAllInventoriesComponent,
      nzCentered: true,
      nzComponentParams: {
        filtered: this.filtered
      }
    })

    filterModal.afterClose.subscribe(result => {
      if(result){
        this.filterParams = result
        this.getFiltered()
      }
    })
  }


  getFiltered(){
    this.allInventories$ = this.apiSvc.filterAllInventories(this.filterParams, this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total= res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
        this.filtered = true
      })
    )
  }

  getAllInventories(){
    this.allInventories$ = this.apiSvc.getAllInventories(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  searchHandler(search: string){
    this.searchSubject.next(search);
  }

  pageIndexChange(page: number){
    this.currentPage = page;

    if(this.filtered){
      this.getFiltered();
    } else {
      this.getAllInventories();
    }
  
  }

  refreshTable(){
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.getAllInventories();  
  }

}
