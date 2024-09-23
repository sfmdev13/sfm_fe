export interface IRootEmployee {
    data: IDataEmployee[];
    pagination: Pagination;
    meta: Meta;
}
  
export interface IDataEmployee {
    id: string
    user_id: string
    employee_pid: string
    name: string
    email: string
    nik: string
    phone: string
    address: string
    status: number
    user: User
    contact: Contract
    employee_contract_id: number
    join_date: string | number
}

interface Contract{
  id: number;
  name: string;
  description: string;
}
  
  export interface User {
    id: string
    name: string
    email: string
    email_verified_at: any
    role_id: number
    role: Role
  }
  
  export interface Role {
    id: number
    title: string
    slug: string
    division: {
      id: number 
      name: string
      description: string
    }
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
  