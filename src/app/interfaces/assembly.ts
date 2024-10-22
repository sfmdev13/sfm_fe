export interface IRootAssembly {
    data: IDataAssembly[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataAssembly {
    id: string
    no_ref: string
    date: string
    description: string
    total_price: string
    total_inventory_price: string
    total_additional_items_price: string
    status: number
    pic: Pic[]
    assembly_inventory_items: AssemblyInventoryItem[]
    assembly_additional_items: AssemblyAdditionalItem[]
  }
  
  export interface Pic {
    pic_id: string
    is_pic_internal: number
    name: string
  }
  
  export interface AssemblyInventoryItem {
    inventory: Inventory
    qty: string
    total_product_cost: string
  }
  
  export interface Inventory {
    id: string
    name: string
    code: string
    description: string
    unit_id: number
    supplier_product_id: number
    supplier_id: string
    price_list: string
    discount: string
    discount_price: string
    tax: string
    discount_type: string
    product_cost: string
    price_factor: string
    selling_price: string
    status: number
    qty: string
    unit: Unit
  }
  
  export interface Unit {
    id: number
    name: string
    measurement: string
    unit: string
    description: string
  }
  
  export interface AssemblyAdditionalItem {
    id: string
    product_description: string
    qty: string
    unit: Unit2
    price_list: string
    discount_type: string
    discount: string
    discount_price: string
    total_product_cost: string
  }
  
  export interface Unit2 {
    id: number
    name: string
    measurement: string
    unit: string
    description: string
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
  