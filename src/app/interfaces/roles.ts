export interface IRootAllRoles {
    data: IDataRoles[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataRoles {
    id: number
    title: string
    slug: string
    status: number
    actions: Action[]
    employees: Employee[]
    division: {
      id: number
      name: string
    }
  }
  
  export interface Action {
    id: number
    title: string
    slug: string
  }
  
  export interface Employee {
    id: string
    name: string
  }
  
  export interface Pagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
  
  export interface Meta {
    message: string
    status_code: number
  }
  