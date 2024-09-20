import { IRootAccessRights } from "../interfaces";

export const accessRights: IRootAccessRights[] = [
    {
      nav_name: 'users',
      slug: 'view_users',
      selected: false,
      nav_section: [
        {
          section_name: 'employee',
          slug: 'view_employee',
          selected: false,
          section_action: [
            { name: 'Add New Employee', slug: 'add_new_employee', selected: false },
            { name: 'Detail Employee', slug: 'detail_employee', selected: false },
            { name: 'Edit Employee', slug: 'edit_employee', selected: false },
            { name: 'Delete Employee', slug: 'delete_employee', selected: false }
          ]
        },
        {
          section_name: 'customer',
          slug: 'view_customer',
          selected: false,
          section_action: [
            { name: 'Add New Customer', slug: 'add_new_customer',selected: false },
            { name: 'Detail Customer', slug: 'detail_customer',selected: false },
            { name: 'Edit Customer', slug: 'edit_customer',selected: false },
            { name: 'Delete Customer', slug: 'delete_customer', selected: false}
          ]
        },
        {
          section_name: 'supplier',
          slug: 'view_supplier',
          selected: false,
          section_action: [
            { name: 'Add New Supplier', slug: 'add_new_supplier', selected: false },
            { name: 'Detail Supplier', slug: 'detail_supplier', selected: false },
            { name: 'Edit Supplier', slug: 'edit_supplier', selected: false },
            { name: 'Delete Supplier', slug: 'delete_supplier', selected: false }
          ]
        }
      ]
    },
    {
      nav_name: 'projects',
      slug: 'view_projects',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'inventory',
      slug: 'view_inventory',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'reports',
      slug: 'view_reports',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'roles',
      slug: 'view_roles',
      selected: false,
      nav_section: [
        {
          section_name: 'Add New Role',
          slug: 'add_new_role',
          selected: false,
          section_action: []
        },
        {
          section_name: 'Edit Role',
          slug: 'edit_role',
          selected: false,
          section_action: []
        },
        {
          section_name: 'Delete Role',
          slug: 'delete_role',
          selected: false,
          section_action: []
        },
        {
          section_name: 'Detail Role',
          slug: 'detail_role',
          selected: false,
          section_action: []
        }
      ]
    },
    {
      nav_name: 'settings',
      slug: 'view_settings',
      selected: false,
      nav_section: []
    }
  ];
  