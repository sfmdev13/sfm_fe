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
    type: string
    address: string
    status: number
    created_at: string
    updated_at: string
    pic: IPicSupplier[]
    contact_person: ContactPerson[]
    website: string
    maps_url: string
    city: string
    province: string
    postal_code: string
    country: string
    wa_phone: string;
    attachments: IAttachments[];
    supplier_products: {
        supplier_product_mapping_id: string;
        product_id: string;
        product_name: string;
        product_description: string;
    }[];
    supplier_source: IDataCategories;
}

export interface IPicSupplier {
    id: string;
    pic_id: string;
    is_pic_internal: number;
    name: string
}

export interface ContactPerson {
    cp_id: string
    cp_name: string
    cp_email: string
    cp_nik: string
    cp_phone: string
    cp_address: string
    is_pic_company: number
    cp_wa_phone: string
    cp_province: string
    cp_city: string
    cp_country: string
    cp_postal_code: string
    pic: IPicCp[]
    cp_attachments: IAttachments[]
    cp_profile_picture: IAttachments[]
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

interface IAttachments{
    id: string;
    attachment_path: string;
    type: string;
    file_name: string;
    file_url: string;
}

interface IPicCp{
    pic_id: string;
    is_pic_head: number;
    name: string
}

  