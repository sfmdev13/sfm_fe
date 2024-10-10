import { StringMap } from "@angular/compiler/src/compiler_facade_interface"

export interface IRootPurchaseOrder {
    data: IDataPurchaseOrder[]
    pagination: Pagination
    meta: Meta
  }
  
  export interface IDataPurchaseOrder {
    id: string
    tax: string;
    po_number: string
    description: string
    additional_cost: string
    total_price: string
    date: string
    supplier_id: string
    status: string
    pic: Pic[]
    supplier: Supplier
    po_items: PoItem[]
    logs: any[]
    telephone_billing: string;
    telephone_shipping: string;
    type: string;
    billing_pic: {
      pic_id: string
      is_pic_internal: number
      name: string
    }[]
    shipping_pic: {
      pic_id: string
      is_pic_internal: number
      name: string
    }[]
    payment_term: string
    shipping_term: string
    remarks: string
    shipping: IAddress
    billing: IAddress
  }
  
  interface IAddress{
    id: number
    name: string
    description: string
    address: string
    city: string
    province: string
    country: string
    postal_code: string
    maps_url: string
  }

  export interface Pic {
    pic_id: string
    is_pic_internal: number
    name: string
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
  
  export interface PoItem {
    inventory: Inventory
    qty: string
    product_cost: string
    total_cost_per_product: string
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
    product_cost: string
    price_factor: string
    selling_price: string
    status: number
    qty: string
    unit: {
      id: number
      name: string
      measurement: string
      unit: string
      description: StringMap
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
  