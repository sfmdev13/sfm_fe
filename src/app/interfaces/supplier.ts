import { IDataCategories } from "./categories"
import { IMetaResponse } from "./customer"

export interface IRootSupplier {
    data: IDataSupplier[]
    pagination: Pagination
    meta: Meta
}
  
export interface IDataSupplier {
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
    pic: Pic[]
    supplier_products: SupplierProduct[]
    attachments: Attachment[]
    contact_person: ContactPerson[]
}

export interface Pic {
    pic_id: string
    is_pic_internal: number
    name: string
  }
  
  export interface SupplierProduct {
    supplier_product_mapping_id: string
    product: IProduct
    product_id: string
    product_name: string
    product_description: string
    sub_category: ISubCategory
    manufacture: IManufacture
  }

  interface IProduct{
    id: number
    name: string
    description: string
  }

  interface ISubCategory{
    id: number
    name: string
    description: string
  }

  interface IManufacture{
    id: number
    name: string
    description: string
  }
  
  export interface Attachment {
    id: string
    attachment_path: string
    type: string
    file_name: string
    file_url: string
  }

  export interface ContactPerson {
    cp_id: string
    cp_name: string
    cp_email: string
    cp_nik: string
    cp_phone: string
    cp_wa_phone: string
    cp_address: string
    cp_city: string
    cp_province: string
    cp_country: string
    cp_postal_code: string
    pic: Pic2[]
    is_pic_company: number
    cp_attachments: CpAttachment[]
    cp_profile_picture: CpProfilePicture[]
  }

  export interface Pic2 {
    pic_id: string
    name: string
    is_pic_head: number
  }
  
  export interface CpAttachment {
    id: string
    attachment_path: string
    type: string
    file_name: string
    file_url: string
  }
  
  export interface CpProfilePicture {
    id: string
    attachment_path: string
    type: string
    file_name: string
    file_url: string
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

  