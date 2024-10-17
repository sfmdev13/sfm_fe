import { IDataCategories } from "./categories"

export interface IRootCustomer {
    data: IDataCustomer[]
    pagination: IPagination
    meta: IMetaResponse
}

export interface ICustomerDetail{
    data: IDataCustomer;
}
  
export interface IDataCustomer {
    id: string
    customer_pid: string
    customer_category_id: string
    name: string
    email: string
    nib: string
    phone: string
    pic: IPicCustomer[];
    type: string
    address: string
    status: number
    created_at: string
    updated_at: string
    billing_addresses: any[]
    contactPerson: IContactPerson[]
    website: string
    maps_url: string
    city: string
    province: string
    postal_code: string
    country: string
    loyal_customer: IDataCategories
    customer_sector: IDataCategories
    customer_firm: IDataCategories
    wa_phone: string;
    attachments: IAttachments[];

}

export interface ICustomerCategory {
    id: number
    name: string
    description: string
    created_at: string | Date
    updated_at: string | Date
}

export interface IContactPerson {
    id: string
    name: string
    customer_id: string
    customer_category_id: string
    email: string
    nik: string
    phone: string
    address: string
    is_pic_company: number
    customer_category: ICustomerCategory
    wa_phone: string
    province: string
    city: string
    country: string
    postal_code: string
    loyal_customer_program_id: number
    cp_loyal_customer: IDataCategories
    pic: IPicCp[]
    cp_attachments: IAttachments[]
    cp_profile_picture: IAttachments[]
}

export interface IMetaResponse {
    message: string
    status_code: number
}


export interface IPicCustomer{
    id: string
    user_id: string
    pic_id: string
    employee_pid: string
    name: string
    email: string
    nik: string
    phone: string
    address: string
    status: number
    is_pic_internal: number;
}

interface IPicCp{
    pic_id: string;
    is_pic_head: number;
    name: string
}

export interface IPagination{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number
}


interface IAttachments{
    id: string;
    attachment_path: string;
    type: string;
    file_name: string;
    file_url: string;
}