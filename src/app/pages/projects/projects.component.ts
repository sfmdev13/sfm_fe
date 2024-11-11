import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSegmentedOptions } from 'ng-zorro-antd/segmented';
import { Observable, Subject, tap, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
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

  isVisibleColumn: boolean = false;
  
  data: IDataProject[] = [];
  filteredData: IDataProject[] = [];
  displayedData: IDataProject[] = [];


  clusterData: any[] = [];
  segmentationData: any[] = [];
  materialData: any[] = [];

  columns: any;

  columnUnfilter: string[] = [
    'ID', 
    'Project Name', 
    'Project Location', 
    'Issue Date', 
    'Owner',
    'Architect',
    'Contractor',
    'MEP Consultant',
    'Competitor',
    'Sales',
    'DCE',
    'Year',
    'Month',
    'Value'
  ]

  constructor(
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    public authSvc: AuthService
  ) {

  }

  ngOnInit(): void {

    forkJoin({
      cluster: this.apiSvc.getCustomerFirm(),
      segmentation: this.apiSvc.getSegmentation(),
      material: this.apiSvc.getMaterial()
    }).pipe(
      tap(({ cluster, segmentation, material }) => {
        this.clusterData = cluster.data.map(v => ({
          text: v.name,
          value: v.id
        }));
    
        this.segmentationData = segmentation.data.map(v => ({
          text: v.name,
          value: v.id
        }));

        this.materialData = material.data.map(v => ({
          text: v.name,
          value: v.id
        }))
    
        // Call addColumnTable() after both API calls are complete
        this.addColumnTable();
      })
    ).subscribe();

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

  }

  addColumnTable(){
    this.columns = [
      { 
        name: 'ID', 
        visible: true,
        sortOrder: null,
        sortFn: (a: IDataProject, b: IDataProject) => a.project_pid.localeCompare(b.project_pid),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''
      },
      { 
        name: 'Project Name', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.name.localeCompare(b.name),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''
      },
      { 
        name: 'Project Location', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.address.localeCompare(b.address),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''
      },
      { 
        name: 'Issue Date', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.issue_date.localeCompare(b.issue_date),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''
      },
      { 
        name: 'Cluster', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.cluster.name.localeCompare(b.cluster.name),
        filterMultiple: true,
        listOfFilter: this.clusterData,
        filterFn: (list: string[], item: IDataProject) => list.some(v => item.cluster.id.toString().indexOf(v.toString()) !== -1),
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Segmentation', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.segmentation.name.localeCompare(b.segmentation.name),
        filterMultiple: true,
        listOfFilter: this.segmentationData,
        filterFn: (list: number[], item: IDataProject) => list.some(v => item.cluster.id === v),
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Remarks', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.remarks.localeCompare(b.remarks),
        filterMultiple: true,
        listOfFilter: [
          {
            text: 'Siphonic System',
            value: 'siphonic_system'
          },
          {
            text: 'Fastflow',
            value: 'fastflow'
          }
        ],
        filterFn: (list: string[], item: IDataProject) => list.some(v => item.remarks.indexOf(v) !== -1),
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Owner', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''       
      },
      { 
        name: 'Architect', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Contractor', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'MEP Consultant', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Specification', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.specification[0].specification.localeCompare(b.specification[0].specification),
        filterMultiple: true,
        listOfFilter: [
          {
            text: 'Siphonic System',
            value: 'siphonic_system'
          },
          {
            text: 'Gravity System',
            value: 'gravity_system'
          }
        ],
        filterFn: (list: string[], item: IDataProject) => {
          const specifications = item.specification.map(spec => spec.specification);

          if (list.length === 1) {
            return specifications.length === 1 && specifications.includes(list[0]);
          }

          if(list.length === 2){
            return specifications.length === 2 && specifications.includes(list[1]);
          }
          
          return list.some(value => specifications.includes(value));
        },
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Material', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.material[0].material.name.localeCompare(b.material[0].material.name),
        filterMultiple: true,
        listOfFilter: this.materialData,
        filterFn: (list: number[], item: IDataProject) => {
          const materials = item.material.map(mat => mat.material.id);

          if (list.length === 1) {
            return materials.length === 1 && materials.includes(list[0]);
          }
        
          return list.length > 1 && list.every(value => materials.includes(value));
        },
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Competitor',
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.competitor.localeCompare(b.competitor),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''       
      },
      { 
        name: 'Sales', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''
      },
      { 
        name: 'DCE', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Year', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.year.localeCompare(b.year),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''        
      },
      { 
        name: 'Month', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.month.localeCompare(b.month),
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''       
      },
      { 
        name: 'Value', 
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: ''       
      }
    ];
  }

  searchColumn(col: any): void {
    const value = col.searchValue;

    if(col.name === 'ID'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.project_pid.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Project Name'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Project Location'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.address.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Issue Date'){
      const originalDate = new Date(value);

      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0');
      const day = String(originalDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      this.filteredData = this.data.filter((item: IDataProject) =>
        item.issue_date.includes(formattedDate)
      );

    }

    if(col.name === 'Owner'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.customer.contactPerson.some(cp => 
          cp.customer_category.name.toLowerCase() === 'owner' &&
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Architect'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.customer.contactPerson.some(cp => 
          cp.customer_category.name.toLowerCase() === 'architect' &&
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Contractor'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.customer.contactPerson.some(cp => 
          cp.customer_category.name.toLowerCase() === 'contractor' &&
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'MEP Consultant'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.customer.contactPerson.some(cp => 
          cp.customer_category.name.toLowerCase() === 'mep consultant' &&
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Competitor'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.competitor.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Sales'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.pic.some(cp => 
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'DCE'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.dce_pic.some(cp => 
          cp.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Year'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.year.toLowerCase().includes(value.toLowerCase())
      );
    }

    if(col.name === 'Month'){
      this.filteredData = this.data.filter((item: IDataProject) =>
        item.month.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
  
  resetColumn(col: any): void {
    col.searchValue = '';
    this.searchColumn(col)
  }

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedData = this.filteredData.slice(start, end);
  }

  findRoleContactPerson(type: string, contactPerson: any): string{
    const role = contactPerson.find((item: any) => item.customer_category.name.toLowerCase() === type)

    return role?.name || '-';
  }

  showColumn(): void{
    this.isVisibleColumn = true;
  }

  handleCancelColumn(): void {
    this.isVisibleColumn = false;
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


  handleCancelFilter(): void {
    this.isVisibleFilter = false;
  }

  searchHandler(search: string){
    this.searchSubject.next(search);
  }


  pageIndexChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedData();
  }

  pageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.updateDisplayedData();
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
    // this.project$ = this.apiSvc.getProjects(this.currentPage, this.pageSize).pipe(
    //   tap((res: any) => {
    //     this.total = res.data.length;
    //     this.currentPage = res.pagination.current_page;
    //     this.totalAll = res.pagination.total
    //   })
    // );

    this.project$ = this.apiSvc.getAllProject().pipe(
      tap((res: any) => {
        this.total = res.data.length;
        this.data = res.data;
        this.filteredData = res.data;
      })
    );
  }

  showModalEdit(data: IDataProject): void {
    this.modal_type = 'update'
    this.modalSvc.create({
      nzTitle: 'Update Project',
      nzContent: AddProjectsComponent,
      nzData: {
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
      nzData: {
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
