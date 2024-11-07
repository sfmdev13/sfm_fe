import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSegmentedOptions } from 'ng-zorro-antd/segmented';
import { Observable, Subject, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { AddProjectsComponent } from 'src/app/components/add-projects/add-projects.component';
import { FilterPurchaseOrderComponent } from 'src/app/components/filter-purchase-order/filter-purchase-order.component';
import { IRootPurchaseOrder, IRootUnit, ICategories, IDataInventory, IDataPurchaseOrder, IRootProject } from 'src/app/interfaces';
import { IDataProject } from 'src/app/interfaces/project';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  project$!: Observable<IRootProject>

  isVisibleDelete = false;
  isVisibleFilter = false;

  modal_type = 'Add';

  total: number = 0;

  selectedIdDelete: number = 0;

  searchEmp: string = '';

  status: number = 1;

  pic_id = localStorage.getItem('pic_id')!;

  pic$!: Observable<any>;

  listOfPic: any;
  filteredListOfPic: any;

  formattedLabel: string = '';

  formattedValueCost: number | null = 0;

  formattedValueSelling: number | null = 0;

  supplier$!: Observable<any>;
  customerList$!: Observable<any>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  search: string = '';
  private searchSubject = new Subject<string>();

  dataDetail: IDataInventory = {} as IDataInventory;

  filtered: boolean = false;

  filterParams: any;

  awarded = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  CatAPlus = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatA = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatB = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatC = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatC1 = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatC2 = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatC3 = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatD = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  CatE = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  failed = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];


  listBoard = [
    {
      id: 'awarded',
      title: 'Awarded',
      project_list: [
        {
          id: 1,
          title: 'Project Test 1',
          description: 'pemasangan pipa SFM di bagian atap stadion',
          date: new Date()
        },
        {
          id: 2,
          title: 'Project Test 2',
          description: 'pemasangan pipa SFM bandara internasional',
          date: new Date()
        },
        {
          id: 3,
          title: 'Project Test 3',
          description: 'pemasangan pipa SFM 3',
          date: new Date()
        },
        {
          id: 4,
          title: 'Project Test 4',
          description: 'pemasangan pipa SFM 4',
          date: new Date()
        }
      ]
    },
    {
      id: 'cataplus',
      title: 'Category A+',
      project_list: []
    },
    {
      id: 'cata',
      title: 'Category A',
      project_list: [],
    },
    {
      id: 'catb',
      title: 'Category B',
      project_list: [],
    },
    {
      id: 'catc',
      title: 'Category C',
      project_list: []
    },
    {
      id: 'catd',
      title: 'Category D',
      project_list: []
    },
    {
      id: 'cate',
      title: 'Category E',
      project_list: []
    }
    
  ]

  gridStyle = {
    width: '100%'
  }

  options: NzSegmentedOptions = [
    { value: 'List', icon: 'bars', label: 'Table' },
    { value: 'Kanban', icon: 'appstore', label: 'Board' }
  ];

  selectedOptIndex: number = 0;

  constructor(
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService
  ) { }

  ngOnInit(): void {
    

    this.customerList$ = this.apiSvc.getCustomerList().pipe();

    
    this.pic$ = this.apiSvc.getPic().pipe(
      tap(res => {
        this.listOfPic = res;
        this.filteredListOfPic = res.filter((p: any) => p.pic_id === this.pic_id);
      })
    )

    this.getProject();

    this.apiSvc.refreshGetProjects$.subscribe(() => {
      this.getProject();
    })

    // this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged()
    // ).subscribe(search => {
    //   this.purchaseOrder$ = this.apiSvc.searchPurchaseOrder(search, this.currentPage, this.pageSize).pipe(
    //     tap(res => {
    //       this.total = res.data.length;
    //       this.currentPage = res.pagination.current_page;
    //       this.totalAll = res.pagination.total;
    //     })
    //   );
    // });
  }

  boardConnectArray(id: string): string[]{
    return this.listBoard.filter(board => board.id !== id)
    .map(board => board.id);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  changeStatus(status: string, id: any): void{
    this.spinnerSvc.show();

    let body = { status, id }

    this.apiSvc.changePOStatus(body).subscribe({
      next: () => {
        this.modalSvc.closeAll();
        this.spinnerSvc.hide();
        this.apiSvc.triggerRefreshPurchaseOrder();
      },
      error: () => {
        this.spinnerSvc.hide()
        this.modalSvc.closeAll()
      }
    })
  }

  handleChangeStatus(status: string, id: any): void{
    this.modalSvc.warning({
      nzTitle: 'Action Cannot Be Undone',
      nzContent: 'You are about to permanently change purchase order status. This action cannot be undone. Do you want to proceed?',
      nzCentered: true,
      nzOkText: 'Confirm',
      nzOkType: 'primary',
      nzOnOk: () => this.changeStatus(status, id),
      nzCancelText: 'Cancel',
      nzOnCancel: () => this.modalSvc.closeAll()
    });
  }

  getColorStatus(status: string): string{

    if(status.toLowerCase() === 'open') return 'blue';

    if(status.toLowerCase() === 'hold') return 'orange';

    if(status.toLowerCase() === 'revised') return 'geekblue';

    if(status.toLowerCase() === 'approved') return 'lime';

    if(status.toLowerCase() === 'rejected') return 'magenta';

    if(status.toLowerCase() === 'finished') return 'green'

    return 'blue';
  }

  refreshTable(): void{
    this.filtered = false;
    this.pageSize = 5;
    this.currentPage = 1;
    this.getProject();
  }

  submitFilter(): void{
    // this.getFilteredInventory();
    this.isVisibleFilter=false;
  }

  getFilteredPO(){
    // this.purchaseOrder$ = this.apiSvc.filterPurchaseOrder(this.filterParams, this.currentPage, this.pageSize).pipe(
    //   tap(res => {
    //     this.total= res.data.length;
    //     this.currentPage = res.pagination.current_page;
    //     this.totalAll = res.pagination.total
    //     this.filtered = true
    //   })
    // )
  }

  showFilter(): void{
    const poModal = this.modalSvc.create({
      nzTitle: 'Filter Purchase Order',
      nzContent: FilterPurchaseOrderComponent,
      nzCentered: true,
      nzComponentParams: {
        filteredPO: this.filtered
      }
    })

    poModal.afterClose.subscribe(result => {
      if(result){
        this.filterParams = result
        this.getFilteredPO()
      }
    })
  }

  handleCancelFilter(): void {
    this.isVisibleFilter = false;
  }

  searchHandler(search: string){
    this.searchSubject.next(search);
  }


  pageIndexChange(page: number){
    this.currentPage = page;

    // if(this.filtered){
    //   this.getFilteredPO();
    // } else {
    //   this.getProject();
    // }
    this.getProject();

  }

  formatter = (value: number | null): string => {
    return value !== null ? `${value.toLocaleString('en-US')}` : '';
  };

  updateFormattedValueSelling(value: number | null): void{
    this.formattedValueSelling = value;
  }

  updateFormattedValue(value: number | null): void {
    this.formattedValueCost = value;
  }

  getFormattedLabel(measurement: string, unit: string): void {

    if(unit){
      this.formattedLabel = `${measurement}<sup>${unit}</sup>`;
      return;
    }

    this.formattedLabel =  `${measurement}`;
  }

  getProject(): void{
    this.project$ = this.apiSvc.getProjects(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total = res.data.length;
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  showModalEdit(data: IDataProject): void {
    this.modal_type = 'update'
    this.modalSvc.create({
      nzTitle: 'Update Project',
      nzContent: AddProjectsComponent,
      nzComponentParams: {
        modal_type: this.modal_type,
        data: data
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzCentered: true,
      nzWidth: '800px'
    });
  }

  // showModalDuplicate(data:IDataPurchaseOrder): void{
  //   this.modal_type = 'duplicate'
  //   this.drawerService.create({
  //     nzTitle: 'Add Purchase',
  //     nzContent: AddProjectsComponent,
  //     nzPlacement: 'bottom',
  //     nzHeight: '100vh',
  //     nzContentParams: {
  //       modal_type: this.modal_type,
  //       dataDetail: data
  //     }
  //   });
  // }

  showModalAdd(): void {
    this.modal_type = 'add'
    this.modalSvc.create({
      nzTitle: 'Add Project',
      nzContent: AddProjectsComponent,
      nzCentered: true,
      nzComponentParams: {
        modal_type: this.modal_type
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '800px'
    });
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = parseInt(id);
    this.isVisibleDelete = true;
  }

}
