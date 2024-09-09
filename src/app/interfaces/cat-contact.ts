export interface IRootCatContact {
    data: IDataCatContact[]
    meta: Meta
}
  
export interface IDataCatContact {
    id: number
    name: string
    description: string
    created_at?: string
    updated_at?: string
}
  
export interface Meta {
    message: string
    status_code: number
}
  