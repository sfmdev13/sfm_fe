import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { IDataRoles, IRootAccessRights, IRootUserByRole } from 'src/app/interfaces';
import { accessRights } from '../../constants/access-rights.contanst';
import { ApiService } from 'src/app/api.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-detail-roles-modal',
  templateUrl: './detail-roles-modal.component.html',
  styleUrls: ['./detail-roles-modal.component.scss']
})
export class DetailRolesModalComponent implements OnInit, AfterViewInit {
  nzData = inject(NZ_MODAL_DATA)
  @Input() roleDetail: IDataRoles = this.nzData.roleDetail

  employee$!: Observable<IRootUserByRole>

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;

  searchEmp: string = '';
  private searchEmpSubject = new Subject<string>();

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
  });

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  TREE_DATA: TreeNode[] = [
    {
      name: 'Users',
      children: [
        {
          name: 'parent 1-0',
          children: [{ name: 'leaf' }, { name: 'leaf' }],
        },
        {
          name: 'parent 1-1',
          children: [
            { name: 'leaf' },
            {
              name: 'parent 1-1-0',
              children: [{ name: 'leaf' }, { name: 'leaf' }],
            },
            { name: 'leaf' },
          ],
        },
      ],
    },
    {
      name: 'parent 2',
      children: [{ name: 'leaf' }, { name: 'leaf' }],
    },
  ];
  

  listOfDataEmp= [
    {
      name: 'Gifino Thoriq',
      assigned: true,
    },
    {
      name: 'Ramadian',
      assigned: true
    }
  ]
  
  constructor(private apiSvc: ApiService) {}

  ngOnInit(): void {
    const filteredAccessRights = this.filterAccessRights(accessRights);
    const data = this.transformToTreeData(filteredAccessRights)
    this.dataSource.setData(data);

    this.searchEmpSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.employee$ = this.apiSvc.searchUserByRole(search, this.roleDetail.id.toString() ,this.currentPage, this.pageSize).pipe(
        tap(res => {
          this.currentPage = res.pagination.current_page;
          this.totalAll = res.pagination.total;
        })
      )
    })

    this.getEmployee();
  }

  pageIndexChange(page: number){
    this.currentPage = page;

    this.getEmployee();
  }

  searchEmpHandler(search: string): void{
    this.searchEmpSubject.next(search);
  }

  getEmployee(){
    this.employee$ = this.apiSvc.getUserByRole(this.roleDetail.id.toString(),this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    )
  }

  filterAccessRights(accessRights: IRootAccessRights[]) {
    const actionSlugs = new Set(this.roleDetail.actions.map(action => action.slug));

    return accessRights.map(nav => ({
      ...nav,
      nav_section: nav.nav_section
        .map((section: any) => ({
          ...section,
          section_action: section.section_action.filter((action: any) => actionSlugs.has(action.slug))
        }))
        .filter((section: any) => section.section_action.length > 0 || actionSlugs.has(section.slug))
    })).filter(nav => nav.nav_section.length > 0 || actionSlugs.has(nav.slug));
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  getNode(name: string): FlatNode | null {
    return this.treeControl.dataNodes.find((n) => n.name === name) || null;
  }

  transformToTreeData(data: any[]): TreeNode[]{
    return data.map(item => ({
      name: item.nav_name,
      children: item.nav_section.map((section: { section_name: string;section_action: any[] }) => ({
        name: section.section_name,
        children: section.section_action.map(action => ({
          name: action.name
        }))
      }))
    }))
  }
}
