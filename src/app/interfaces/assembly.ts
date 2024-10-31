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
  qty: string
  total_price: string
  total_price_per_assembly: string
  total_inventory_price_per_assembly: string
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
  raw_material_inventory?: RawMaterialInventory
  raw_material_assembly?: RawMaterialAssembly
  qty: string
  total_qty: string
  type: string
  each_product_cost: string
  total_product_cost: string
}

export interface RawMaterialInventory {
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
  hs_code: any
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
  created_at: string
  updated_at: string
}

export interface RawMaterialAssembly {
  id: string
  no_ref: string
  date: string
  description: string
  qty: string
  total_price_per_assembly: string
  total_price: string
  total_inventory_price: string
  total_inventory_price_per_assembly: string
  total_additional_items_price: string
  status: number
}

export interface AssemblyAdditionalItem {
  id: string
  product_description: string
  qty: string
  unit: Unit2
  price_list: string
  discount_type: string
  discount: string
  discount_price: any
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
