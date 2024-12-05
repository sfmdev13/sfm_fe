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
import { ProjectCategory } from 'src/app/constants/project-enum';
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
  sectorData: any[] = [];
  sectorDataLength = 0;

  columns: any[] = [];

  listBoard: any[] = [];

  categoryList: {text: string, value: string}[] = [
    {
      text: 'Awarded',
      value: 'cat_awarded'
    },
    {
      text: 'Category A+',
      value: 'cat_a_plus'
    },
    {
      text: 'Category A',
      value: 'cat_a'
    },
    {
      text: 'Category B',
      value: 'cat_b'
    },
    {
      text: 'Category C',
      value: 'cat_c'
    },
    {
      text: 'Category D',
      value: 'cat_d'
    },
    {
      text: 'Category F',
      value: 'cat_f'
    }
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
      material: this.apiSvc.getMaterial(),
      sector: this.apiSvc.getCustomerSector()
    }).pipe(
      tap(({ cluster, segmentation, material, sector }) => {
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

        this.sectorData = sector.data.map(v => ({
          text: v.name,
          value: v.id
        }))

        this.sectorDataLength = this.sectorData.length;
    
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

  getTextCatByValue(value: string): string{
    const category = this.categoryList.find(item => item.value === value);
    return category ? category.text : '-';
  }

  addListBoard(){
    this.listBoard = [
      {
        id: 'cat_awarded',
        title: 'Awarded',
        project_list: this.data.filter(res => res.project_category === 'cat_awarded')
      },
      {
        id: 'cat_a_plus',
        title: 'Category A+',
        project_list: this.data.filter(res => res.project_category === 'cat_a_plus')
      },
      {
        id: 'cat_a',
        title: 'Category A',
        project_list: this.data.filter(res => res.project_category === 'cat_a')
      },
      {
        id: 'cat_b',
        title: 'Category B',
        project_list: this.data.filter(res => res.project_category === 'cat_b')
      },
      {
        id: 'cat_c',
        title: 'Category C',
        project_list: this.data.filter(res => res.project_category === 'cat_c')
      },
      {
        id: 'cat_d',
        title: 'Category D',
        project_list: this.data.filter(res => res.project_category === 'cat_d')
      },
      {
        id: 'cat_f',
        title: 'Category E',
        project_list: this.data.filter(res => res.project_category === 'cat_f')
      }
      
    ]
  }

  addColumnTable(){

    const projectCategoryOrder = [
      ProjectCategory.CAT_AWARDED,
      ProjectCategory.CAT_A_PLUS,
      ProjectCategory.CAT_A,
      ProjectCategory.CAT_B,
      ProjectCategory.CAT_C,
      ProjectCategory.CAT_D,
      ProjectCategory.CAT_F
    ];
    
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''
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
        searchValue: '',
        showFilter: false,
        showSort: true,
        showSearch: true,
        unique: ''
      },
      {
        name: 'Project Category', 
        visible: true,
        sortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
        sortFn: (a: IDataProject, b: IDataProject) => {
          return (
            projectCategoryOrder.indexOf(a.project_category as ProjectCategory) -
            projectCategoryOrder.indexOf(b.project_category as ProjectCategory)
          );
        },
        filterMultiple: true,
        listOfFilter: this.categoryList,
        filterFn: (list: string[], item: IDataProject) => list.some(v => item.project_category.indexOf(v) !== -1),
        searchVisible: false,
        searchValue: '',
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''
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
        searchValue: '' ,
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''    
      },
      { 
        name: 'Segmentation', 
        visible: true,
        sortOrder: null,
        sortDirections: ['ascend', 'descend', null],
        sortFn: (a: IDataProject, b: IDataProject) => a.segmentation.name.localeCompare(b.segmentation.name),
        filterMultiple: true,
        listOfFilter: this.segmentationData,
        filterFn: (list: number[], item: IDataProject) => list.some(v => item.segmentation.id === v),
        searchVisible: false,
        searchValue: '',
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''      
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
        searchValue: '',
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''     
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
        searchValue: '',
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''  
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
        searchValue: '',
        showSort: true,
        showFilter: true,
        showSearch: false,
        unique: ''     
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''        
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
        searchValue: '',
        showSort: false,
        showFilter: false,
        showSearch: true,
        unique: '' 
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
        searchValue: '',
        showSort: false,
        showFilter: false,
        showSearch: true,
        unique: ''        
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''        
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
        searchValue: '',
        showSort: true,
        showFilter: false,
        showSearch: true,
        unique: ''          
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
        searchValue: '',
        showSort: false,
        showFilter: false,
        showSearch: true,
        unique: ''          
      }
    ];

    this.sectorData.forEach((sec, i) => {
      const newSec = {
        id: sec.value,
        name: sec.text,
        visible: true,
        sortOrder: null,
        sortDirections: [null],
        sortFn: (a: IDataProject, b: IDataProject) => 0,
        filterMultiple: true,
        listOfFilter: [],
        filterFn: null,
        searchVisible: false,
        searchValue: '',
        showSort: false,
        showFilter: false,
        showSearch: true,
        unique: 'sector'
      }

      this.columns.splice(8+i, 0, newSec);
    })
  }

  resetSector(col: any): void {
    col.searchValue = '';
    this.searchCust(col)
  }


  searchCust(col: any): void{
    console.log('masuk')
    const value = col.searchValue;

    this.sectorData.forEach((sec:any) => {

        this.filteredData = this.data.filter((item: IDataProject) => 
          item.project_customer.some((cust) => 
            cust.customer_sector.id === col.id &&
            cust.customer.name.toLowerCase().includes(value.toLowerCase())
          )
        )
    })
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
        item.project_customer.some((cust) => 
          cust.customer_sector.name.toLowerCase() === 'owner' &&
          cust.customer.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Architect'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.project_customer.some((cust) => 
          cust.customer_sector.name.toLowerCase() === 'arsitek' &&
          cust.customer.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Contractor'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.project_customer.some((cust) => 
          cust.customer_sector.name.toLowerCase() === 'kontraktor' &&
          cust.customer.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if(col.name === 'Consultant'){
      this.filteredData = this.data.filter((item: IDataProject) => 
        item.project_customer.some((cust) => 
          cust.customer_sector.name.toLowerCase() === 'konsultan' &&
          cust.customer.name.toLowerCase().includes(value.toLowerCase())
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
      // Item is moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Item is transferred to a different list
      const previousList = event.previousContainer.data;
      const currentList = event.container.data;
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      const movedItem = event.item.data;
      const previousListId = event.previousContainer.id;
      const currentListId = event.container.id;
  
      // Optimistic update: move the item to the new list
      transferArrayItem(previousList, currentList, previousIndex, currentIndex);
  
      const body = {
        id: movedItem.id,
        project_category: currentListId
      };
  
      // Show spinner while the API call is in progress
      this.spinnerSvc.show();
  
      this.apiSvc.editProjectCategory(body).subscribe({
        next: () => {
          // Success response
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully updated project category.',
            nzOkText: 'Ok',
            nzCentered: true
          });
          // Trigger refresh and hide the spinner
          this.apiSvc.triggerRefreshProject();
          this.spinnerSvc.hide();
        },
        error: (error) => {
          // Error handling: revert the item to the previous list
          console.error(error);
          this.spinnerSvc.hide();
  
          // Move the item back to the original list
          transferArrayItem(currentList, previousList, currentIndex, previousIndex);
  
          // Show error message to user
          this.modalSvc.error({
            nzTitle: 'Error',
            nzContent: 'Failed to update project category. Item has been moved back.',
            nzOkText: 'Ok',
            nzCentered: true
          });
        }
      });
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
    this.currentPage = 1;
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

        this.addListBoard();
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
      nzWidth: '900px'
    });
  }

  showModalDuplicate(data:IDataProject): void{
    this.modal_type = 'duplicate'
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
      nzWidth: '900px'
    });
  }

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
      nzWidth: '900px'
    });
  }

  showModalDelete(id: string): void{
    this.selectedIdDelete = parseInt(id);
    this.isVisibleDelete = true;
  }

}
