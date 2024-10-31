export interface IRootAllInventories {
    data: IDataAllInventories[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataAllInventories {
    code: string
    description: string
    qty: any
    price_list: string
    selling_price?: string
    type: string;
  }
  
  export interface Pagination {
    current_page: number
    per_page: number
    total: number
  }
  
  export interface Meta {
    message: string
    status_code: number
  }
  