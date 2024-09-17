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
    contactPerson: ContactPerson[]
    website: string
    maps_url: string
    city: string
    province: string
    postal_code: string
    country: string
    wa_phone: string;
    attachments: IAttachments[];
    supplier_product: IDataCategories[];
    supplier_source: IDataCategories;
}

export interface IPicSupplier {
    id: string;
    pic_id: string;
    is_pic_internal: number;
    name: string
}

export interface ContactPerson {
    id: string
    name: string
    supplier_id: string
    email: string
    nik: string
    phone: string
    address: string
    is_pic_company: number
    wa_phone: string
    province: string
    city: string
    country: string
    postal_code: string
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

  