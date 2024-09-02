import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';


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
  
  accessRights = [
    {
      nav_name: 'users',
      nav_section: [
        {
          section_name: 'employee',
          section_action: [
            { name: 'Add New Employee' },
            { name: 'Detail Employee' },
            { name: 'Edit Employee' }
          ]
        },
        {
          section_name: 'customer',
          section_action: [
            { name: 'Add New Customer' },
            { name: 'Detail Customer' },
            { name: 'Edit Customer' }
          ]
        },
        {
          section_name: 'supplier',
          section_action: [
            { name: 'Add New Supplier' },
            { name: 'Detail Supplier' },
            { name: 'Edit Supplier' }
          ]
        }
      ]
    }
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
  
  constructor() {
    
    const data = this.transformToTreeData(this.accessRights)
    this.dataSource.setData(data);
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;


  ngOnInit(): void {

  }

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
