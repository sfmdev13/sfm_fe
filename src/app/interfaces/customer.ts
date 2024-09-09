export interface IRootCustomer {
    data: IDataCustomer[],
    pagination: IPagination,
    meta: IMetaResponse
}
  
export interface IDataCustomer {
    id: string
    customer_pid: string
    customer_category_id: string
    name: string
    email: string
    nik: string
    phone: string
    pic: IPicCustomer;
    type: string
    address: string
    status: number
    created_at: string
    updated_at: string
    billing_addresses: any[]
    contact_person: IContactPerson[]
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
}

export interface IMetaResponse {
    message: string
    status_code: number
}


export interface IPicCustomer{
    id: string
    user_id: string
    employee_pid: string
    name: string
    email: string
    nik: string
    phone: string
    address: string
    status: number
}

export interface IPagination{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number
}