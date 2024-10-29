export interface IRootPurchaseOrder {
  data: IDataPurchaseOrder[]
  pagination: Pagination
  meta: Meta
}

export interface IDataPurchaseOrder {
  id: string
  po_number: string
  description: string
  tax: string
  total_price: string
  total_inventory_price: string
  total_additional_price: string
  date: string
  status: string
  pic: Pic[]
  po_items: PoItem[]
  po_additonal_items: any[]
  logs: Log[]
  telephone_billing: string
  telephone_shipping: string
  type: string
  billing_pic: BillingPic[]
  shipping_pic: ShippingPic[]
  shipping: Shipping
  billing: Billing
  payment_term: string
  payment_due_date: string
  manufacture: string
  project_id: any
  shipping_term: string
  remarks: string
}

export interface Pic {
  pic_id: string
  is_pic_internal: number
  name: string
}

export interface PoItem {
  inventory_items: InventoryItems
  qty: string
  discount_type: string
  discount: string
  total_cost_per_product: string
}

export interface InventoryItems {
  id: string
  inventory: Inventory
  supplier: Supplier
  discount_1: string
  discount_type_1: string
  product_cost_1: string
  discount_2: string
  discount_type_2: string
  product_cost_2: string
  price_factor: string
  qty: string
  selling_price: string
}

export interface Inventory {
  id: string
  code: string
  alias: string
  description: string
  unit: Unit
  unit_report: UnitReport
  supplier_product: SupplierProduct
  sub_category: string
  manufacturer: string
  price_list: string
  tax: string
  inventory_source: string
  hs_code: string
  attachment_path: string
  status: number
}

export interface Unit {
  id: number
  name: string
  measurement: string
  unit: string
  description: string
}

export interface UnitReport {
  id: number
  code: string
  name: string
  description: string
  value: string
  unit_of_measurement_id: string
  dimension: string
}

export interface SupplierProduct {
  id: number
  name: string
  description: string
}

export interface Supplier {
  supplier_id: string
  name: string
}

export interface Log {
  id: number
  po_id: string
  message: string
  created_at: string
  updated_at: string
}

export interface BillingPic {
  pic_id: string
  is_pic_internal: number
  name: string
}

export interface ShippingPic {
  pic_id: string
  is_pic_internal: number
  name: string
}

export interface Shipping {
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

export interface Billing {
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
