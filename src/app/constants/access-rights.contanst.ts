import { IRootAccessRights } from "../interfaces";

export const accessRights: IRootAccessRights[] = [
    {
      nav_name: 'users',
      slug: 'view_users',
      nav_section: [
        {
          section_name: 'employee',
          slug: 'view_employee',
          section_action: [
            { name: 'Add New Employee', slug: 'add_new_employee' },
            { name: 'Detail Employee', slug: 'detail_employee' },
            { name: 'Edit Employee', slug: 'edit_employee' }
          ]
        },
        {
          section_name: 'customer',
          slug: 'view_customer',
          section_action: [
            { name: 'Add New Customer', slug: 'add_new_customer' },
            { name: 'Detail Customer', slug: 'detail_customer' },
            { name: 'Edit Customer', slug: 'edit_customer' }
          ]
        },
        {
          section_name: 'supplier',
          slug: 'view_supplier',
          section_action: [
            { name: 'Add New Supplier', slug: 'add_new_supplier' },
            { name: 'Detail Supplier', slug: 'detail_supplier' },
            { name: 'Edit Supplier', slug: 'edit_supplier' }
          ]
        }
      ]
    },
    {
      nav_name: 'projects',
      slug: 'view_projects',
      nav_section: []
    },
    {
      nav_name: 'inventory',
      slug: 'view_inventories',
      nav_section: []
    },
    {
      nav_name: 'reports',
      slug: 'view_reports',
      nav_section: []
    },
    {
      nav_name: 'roles',
      slug: 'view_roles',
      nav_section: [
        {
          section_name: 'Add New Role',
          slug: 'add_new_role',
          section_action: []
        },
        {
          section_name: 'Edit Role',
          slug: 'edit_role',
          section_action: []
        },
        {
          section_name: 'Delete Role',
          slug: 'delete_role',
          section_action: []
        }
      ]
    }
  ];
  