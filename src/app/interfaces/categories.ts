export interface ICategories{
    data: IDataCategories[];
    meta: IMeta
}

export interface IDataCategories{
    id: number;
    name: string;
    description: string;
    level?: string;
}

interface IMeta{
    message: string;
    status_code: number;
}