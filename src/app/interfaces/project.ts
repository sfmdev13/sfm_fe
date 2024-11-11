export interface IRootProject {
  data: IDataProject[]
  pagination: Pagination
  meta: Meta
}

export interface IDataProject {
  id: string
  project_pid: string
  name: string
  issue_date: string
  customer: Customer
  project_category: string
  remarks: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  maps_url: string
  competitor: string
  year: string
  month: string
  status: number
  pic: Pic[]
  dce_pic: DcePic[]
  segmentation: Segmentation
  cluster: Cluster
  specification: Specification[]
  material: Material[]
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
  contactPerson: IContactPerson[]
}

interface IContactPerson{
  id: string
  name: string
  customer_id: string
  cp_pid: string
  customer_category: {
    id: number
    name: string
    description: string
  }
  email: string
  nik: string
  phone: string
  wa_phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  is_pic_company: number
  loyal_customer_program_id: number 
}

export interface Pic {
  pic_id: string
  is_pic_internal: number
  name: string
}

export interface DcePic {
  pic_id: string
  is_pic_internal: number
  name: string
}

export interface Segmentation {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Cluster {
  id: number
  name: string
  description: string
}

export interface Specification {
  id: string
  project_id: string
  specification: string
}

export interface Material {
  id: string
  project_id: string
  material_id: string
  material: {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
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
