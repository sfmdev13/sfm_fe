export interface IRootInventory {
    data: IDataInventory[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataInventory {
    id: string
    name: string
    code: string
    description: string
    unit_id: number
    supplier_product_id: number
    supplier_id: string
    product_cost: string
    selling_price: string
    status: number
    qty: string
    pic: Pic[]
    unit: Unit
    supplier_product: SupplierProduct
    supplier: Supplier
    discount: string
    price_factor: string
    price_list: string
  }
  
  export interface Pic {
    pic_id: string
    is_pic_internal: number
    name: string
  }
  
  export interface Unit {
    id: number
    name: string
    measurement: string
    unit: string
    description: string
    created_at: any
    updated_at: any
  }
  
  export interface SupplierProduct {
    id: number
    name: string
    description: string
  }
  
  export interface Supplier {
    id: string
    supplier_pid: string
    name: string
    email: string
    nib: string
    phone: string
    wa_phone: string
    type: string
    address: string
    city: string
    province: string
    country: string
    postal_code: string
    website: string
    maps_url: string
    status: number
    supplier_source_id: number
    created_at: string
    updated_at: string
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
  