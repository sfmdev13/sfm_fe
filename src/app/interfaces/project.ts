export interface IRootProject {
    data: IDataProject[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataProject {
    id: string
    project_pid: string
    name: string
    description: string
    order_date: string
    delivery_date: string
    customer: Customer
    status: number
    progress: string
    pic: Pic[]
  }
  
  export interface Customer {
    id: string
    customer_pid: string
    name: string
    email: string
    nib: string
    phone: string
    wa_phone: string
    website: string
    type: string
    address: string
    city: string
    province: string
    country: string
    postal_code: string
    maps_url: string
    status: number
    customer_firm_id: number
    loyal_customer_program_id: number
    customer_sector_id: number
    created_at: string
    updated_at: string
  }
  
  export interface Pic {
    pic_id: string
    is_pic_internal: number
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