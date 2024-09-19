export interface IRootUserByRole{
    data: IDataUserByRole[];
    pagination: IPagination;
    meta: IMeta
}


interface IDataUserByRole{
    user_id: string;
    name: string;
    status: number;
}

 interface IPagination {
    current_page: number
    per_page: number
    total: number
    last_page: number
}
  
interface IMeta {
    message: string
    status_code: number
}
  