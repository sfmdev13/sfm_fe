import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AddQuotationComponent } from 'src/app/components/add-quotation/add-quotation.component';
import { DetailQuotationComponent } from 'src/app/components/detail-quotation/detail-quotation.component';
import { IDataCategories, IDataInventory, IDataQuotation, IDetailDataQuotation, IQuotation, IRootQuotation } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent implements OnInit {

  total: number = 0;
  
  inventoryList: IDataInventory[] = []
  productCategory: IDataCategories[] = []

  quotation$!: Observable<IRootQuotation>

  isVisibleDetail: boolean = false;

  revisionList: string[] = [];
  isLoadingRevList = true;
  revision: string = 'RA';
  detailQuotation: IDetailDataQuotation = {} as IDetailDataQuotation;
  selectedDataBasic: IDataQuotation = {} as IDataQuotation;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  listOfData: IDataQuotation[] = [];
  listOfDisplayData: IDataQuotation[] = [];

  listOfColumns = [
    {
      name: 'Project ID',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Project Name',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'No Quotation',
      sortOrder: 'ascend',
      sortFn: (a: IDataQuotation, b: IDataQuotation) => a.quotation_no.localeCompare(b.quotation_no),
      sortDirections: ['ascend', 'descend', null],
      showSort: true,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Issue Date',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Customer',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: true,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Year',
      sortOrder: null,
      sortFn: (a: IDataQuotation, b: IDataQuotation) => a.issued_date.localeCompare(b.issued_date),
      sortDirections: ['ascend', 'descend', null],
      showSort: true,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Month',
      sortOrder: null,
      sortFn: (a: IDataQuotation, b: IDataQuotation) => a.issued_date.localeCompare(b.issued_date),
      sortDirections: ['ascend', 'descend', null],
      showSort: true,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Value',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Last Revision',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Project Category',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Published Quotation',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
    {
      name: 'Action',
      sortOrder: null,
      sortFn: null,
      sortDirections: [null],
      showSort: false,
      showFilter: false,
      listOfFilter: [],
      filterFn: null,
      showSearch: false,
      searchVisible: false,
      searchValue: ''
    },
  ]

  projectsData: IDataProject[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private apiSvc: ApiService
  ){}

  ngOnInit(): void {

    this.getQuotation();

    this.apiSvc.refreshGetQuotation$.subscribe(() => {
      this.getQuotation();
    })

    this.apiSvc.getInventoryList().subscribe((res) => {
      this.inventoryList = res.data;
    })
  }

  publish(id: string){
    this.apiSvc.publishQuotation(id).subscribe((res) => {
      this.apiSvc.triggerRefreshQuotation();
    })
  }

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.listOfDisplayData = this.listOfData.slice(start, end);
  }

  pageIndexChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedData();
  }

  pageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateDisplayedData();
  }

  resetColumn(col: any): void {
    col.searchValue = '';
    this.searchColumn(col)
  }


  searchColumn(col: any): void{
    const value = col.searchValue;

    if(col.name === 'Project Name'){
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.project.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Year'){
      if(value !== ''){
        const originalDate = new Date(value);

        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
  
        this.listOfDisplayData = this.listOfData.filter((item: IDataQuotation) =>
          item.issued_date.includes(formattedDate)
        );
      } else {
        this.listOfDisplayData = [...this.listOfData];
      }

    }

    if(col.name === 'Month'){
      if(value !== ''){
        const originalDate = new Date(value);

        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
  
        this.listOfDisplayData = this.listOfData.filter((item: IDataQuotation) =>
          item.issued_date.includes(formattedDate)
        );
      } else {
        this.listOfDisplayData = [...this.listOfData];
      }

    }

    //need to improve after BE updated
    // if(col.name === 'Customer'){
    //   this.listOfDisplayData = this.listOfData.filter((item) =>
    //     item.quotation.quotation_no.toLowerCase().includes(value.toLowerCase())
    //   );
    // }
  }

  formatProjectCategory(cat: string): string{
    return cat
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  getQuotation(){
    this.quotation$ = this.apiSvc.getQuotation().pipe(
      tap(res => {
        this.total = res.data.length;
        this.listOfData = res.data
        this.listOfDisplayData = [...this.listOfData]
        
        this.apiSvc.getAllProject().subscribe((res) => {
          this.projectsData = res.data
        })
      })
    );
  }

  showAddModal(){
    this.drawerService.create({
      nzTitle: 'Add Quotation',
      nzContent: AddQuotationComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        inventoryList: this.inventoryList,
        productCategory: this.productCategory,
        modal_type: 'add',
        projectData: this.projectsData
      }
    });
  }

  showOptionDetailModal(data: IDataQuotation, id: string){
    this.isVisibleDetail = true;
    this.isLoadingRevList = true;
    this.selectedDataBasic = data;

    this.apiSvc.getDetailQuotation(id).subscribe((res) => {
      this.detailQuotation = res
      this.revisionList = res.quotation_revision.map((res) => res.revision);
      this.isLoadingRevList = false;
    })
  }

  showDetailModal(){

    this.isVisibleDetail = false;

    this.modalService.create({
      nzTitle: 'Detail Quotation',
      nzContent: DetailQuotationComponent,
      nzCentered: true,
      nzData: {
        revisionSelected: this.revision,
        dataDetail: this.detailQuotation,
        dataBasic: this.selectedDataBasic
      },
      nzWidth: '100vw',
    });
  }


  showEdit(data: IDataQuotation, modal_type: string){
    this.drawerService.create({
      nzTitle: modal_type === 'edit' ? 'Edit Quotation' : 'Revise Quotation',
      nzContent: AddQuotationComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        inventoryList: this.inventoryList,
        productCategory: this.productCategory,
        dataQuotation: data,
        modal_type,
        projectData: this.projectsData
      }
    });
  }
}
