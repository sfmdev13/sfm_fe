export interface IRootDivision {
    data: IDataDivision[];
    pagination: Pagination
    meta: Meta
}
  
export interface IDataDivision {
    id: number
    name: string
    description: string
    roles: Role[]
}
  
export interface Role {
    id: number
    title: string
    slug: string
    status: number
    laravel_through_key: number
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
  