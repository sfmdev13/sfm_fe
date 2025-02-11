import { IDataAssembly } from "./assembly"

export interface IRootInventory {
  data: IDataInventory[]
  pagination: Pagination
  meta: Meta
}

export interface IDataInventory {
  id: string
  code: string
  alias: string
  description: string
  unit: Unit
  unit_report: UnitReport
  supplier_product: SupplierProduct
  sub_category: ISubCategory
  manufacturer: IManufacturer
  price_list: string
  tax: string
  inventory_source: string
  hs_code: string
  attachment: Attachment
  status: number
  total_qty: number
  highest_selling_price: string;
  default_selling_price: string;
  default_product_cost_2: string;
  default_gross_margin: string;
  inventory_installation: InventoryInstallation;
  inventory_items: InventoryItem[];
  product_category: {
    id: number;
    name: string;
    description: string;
  }
  is_assembly: number;
  assembly: IDataAssembly | null;
}


interface InventoryInstallation{
  id: string
  inventory_id: string
  unit_inch_qty: string
  price: string
  price_type: string
  price_per_unit: string
  price_factor: string
  selling_price: string
  gross_margin: string
}

interface ISubCategory{
  id: number
  name: string
  description: string
}

interface IManufacturer{
  id: number
  name: string
  description: string
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

export interface Attachment {
  id: any
  attachment_path: string
  type: any
  file_name: string
  file_url: string
}

export interface InventoryItem {
  id: string;
  inventory_id: string
  supplier: ISupplier
  discount_1: string
  discount_type_1: string
  product_cost_1: string
  discount_2: string
  discount_type_2: string
  product_cost_2: string
  price_factor: string
  qty: string
  selling_price: string
  gross_margin: string
  is_default: number
}

interface ISupplier{
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

export interface IRootInvenSupplier{
  data: IInventSupplier[];
  meta: Meta
}

interface IInventSupplier{
  id: string;
  name: string;
  code: string;
  product_cost: string;
  price_list: string;
  discount: string;
  discount_price: string;
  discount_type: string;
  description: string;
  unit: {
    id: number;
    name: string;
    measurement: string;
    unit: string;
  }
}