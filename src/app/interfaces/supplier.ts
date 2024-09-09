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
    nik: string
    phone: string
    type: string
    address: string
    status: number
    created_at: string
    updated_at: string
    pic: IPicSupplier[]
    contactPerson: ContactPerson[]
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

interface IEmployee{
    id: string;
    user_id: string;
    employee_pid: string;
    name: string
    nik: string
    phone: string;
    address: string;
    status: number;
}
  